import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';
import { Campaign } from '@/hooks/useCampaigns';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { supabase } from '@/lib/supabase-client';
import { verifyCampaignExists, getCampaignOnChainStatus } from '@/lib/verify-campaign';

// Create a public client for reading contract data
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
});

// Helper function to calculate days left
function calculateDaysLeft(endDate: number): number {
  const now = Math.floor(Date.now() / 1000);
  const daysLeft = Math.ceil((endDate - now) / 86400);
  return Math.max(daysLeft, 0);
}

export async function GET(request: NextRequest) {
  try {
    const campaigns: Campaign[] = [];

    // Fetch campaigns from Supabase (for metadata only: title, description, images)
    // Select specific columns to avoid 406 errors
    // Include both active and pending_execution campaigns
    const { data: supabaseCampaigns, error } = await supabase
      .from('campaigns')
      .select('id,campaign_id,title,description,category,location,goal,organization_name,organization_verified,image_urls,tags,start_time,end_time,status,total_raised,created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          campaigns: [],
        },
        { status: 500 }
      );
    }

    if (!supabaseCampaigns || supabaseCampaigns.length === 0) {
      return NextResponse.json(
        {
          success: true,
          campaigns: [],
          total: 0,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    // Check each campaign: must exist on-chain AND be still active (not expired)
    for (const camp of supabaseCampaigns) {
      // Skip if no campaign_id or not bytes32 format
      if (!camp.campaign_id || !camp.campaign_id.startsWith('0x')) {
        continue;
      }

      // For pending campaigns, check if they now exist on-chain
      if (camp.status === 'pending_execution') {
        // Check if campaign was created on-chain
        let existsOnChain = false;
        try {
          existsOnChain = await verifyCampaignExists(camp.campaign_id);
        } catch (error) {
          console.error('[API] Error checking campaign status:', error);
          // If check fails, assume still pending
          existsOnChain = false;
        }

        if (existsOnChain) {
          // Campaign exists on-chain! Update database and show as active
          const campaignIdShort = camp.campaign_id ? `${camp.campaign_id.slice(0, 10)}...` : 'unknown';
          console.log(`[API] Campaign ${campaignIdShort} now exists on-chain, updating status...`);

          // Update status in database (async, don't await)
          supabase
            .from('campaigns')
            .update({ status: 'active' })
            .eq('campaign_id', camp.campaign_id)
            .then(({ error }) => {
              if (error) {
                console.error('[API] Failed to update campaign status:', error);
              } else {
                const shortId = camp.campaign_id ? `${camp.campaign_id.slice(0, 10)}...` : 'unknown';
                console.log(`[API] ✅ Updated campaign ${shortId} to active`);
              }
            });

          // Continue to contract read below - campaign exists on-chain so should be readable
          // If contract read fails, the error handler will catch it
        } else {
          // Campaign still pending, show as pending
          const endTime = camp.end_time || Math.floor(Date.now() / 1000) + 86400 * 90;

          let imageUrl = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500';
          if (camp.image_urls && Array.isArray(camp.image_urls) && camp.image_urls.length > 0) {
            imageUrl = formatPinataImageUrl(camp.image_urls[0]);
          }

          const campaign: Campaign = {
            id: camp.campaign_id,
            title: camp.title || '',
            description: camp.description || '',
            imageUrl: imageUrl,
            image: imageUrl,
            organizationName: camp.organization_name || 'Unknown',
            organizationAddress: '',
            category: camp.category || 'General',
            location: camp.location || 'Global',
            raised: camp.total_raised || 0,
            goal: camp.goal || 0,
            donors: 0,
            daysLeft: camp.end_time ? calculateDaysLeft(camp.end_time) : 90,
            isActive: false, // Not active until Safe executes
            isVerified: camp.organization_verified || false,
            startDate: camp.start_time || Math.floor(Date.now() / 1000),
            endDate: endTime,
            status: 'pending_execution',
            safeTxHash: camp.safe_tx_hash || undefined,
          };
          campaigns.push(campaign);
          continue;
        }
      }

      try {
        // Read campaign data from contract
        const campaignData = await publicClient.readContract({
          address: ZKT_CAMPAIGN_POOL_ADDRESS,
          abi: ZKTCampaignPoolABI,
          functionName: 'campaigns',
          args: [camp.campaign_id as `0x${string}`],
        }) as any;

        // campaignData returns:
        // [0] exists (bool)
        // [1] allocationLocked (bool)
        // [2] disbursed (bool)
        // [3] closed (bool)
        // [4] totalRaised (uint256)
        // [5] startTime (uint256)
        // [6] endTime (uint256)

        const exists = campaignData && campaignData[0];
        if (!exists) {
          // Campaign doesn't exist on contract - skip it
          continue;
        }

        // Safely extract campaign data with null checks
        const closed = campaignData[3] ?? false;
        const disbursed = campaignData[2] ?? false;
        const totalRaised = campaignData[4] ?? 0n;
        const startTime = campaignData[5] ?? 0n;
        const endTime = Number(campaignData[6] ?? 0n);

        // Check if campaign is still active (not expired)
        if (endTime <= now) {
          // Campaign has expired - skip it
          continue;
        }

        // Skip if campaign is closed or disbursed
        if (closed || disbursed) {
          continue;
        }

        // Campaign exists AND is still active - show it!
        const isActive = true;

        // Get image URL
        let imageUrl = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500';
        if (camp.image_urls && Array.isArray(camp.image_urls) && camp.image_urls.length > 0) {
          imageUrl = formatPinataImageUrl(camp.image_urls[0]);
        }

        const campaign: Campaign = {
          id: camp.campaign_id,
          title: camp.title || '',
          description: camp.description || '',
          imageUrl: imageUrl,
          image: imageUrl,
          organizationName: camp.organization_name || 'Unknown',
          organizationAddress: '', // No longer using this field from Supabase
          category: camp.category || 'General',
          location: camp.location || 'Global',
          raised: totalRaised !== undefined ? Number(totalRaised) : (camp.total_raised || 0),
          goal: camp.goal || 0,
          donors: 0, // No donors_count column in Supabase
          daysLeft: calculateDaysLeft(endTime),
          isActive: isActive,
          isVerified: camp.organization_verified || false,
          startDate: Number(startTime) || camp.start_time || now,
          endDate: endTime || camp.end_time || now + 86400 * 90,
          status: 'active',
        };
        campaigns.push(campaign);

      } catch (error) {
        // Log the specific error for debugging
        const campaignIdShort = camp.campaign_id ? `${camp.campaign_id.slice(0, 10)}...` : 'unknown';
        console.error(`[API] Error reading contract for campaign ${campaignIdShort}:`, error);

        // Error reading contract - log but don't skip if campaign was recently created
        const campaignAge = now - (Math.floor(new Date(camp.created_at).getTime() / 1000));
        // If campaign was created in the last 5 minutes, show it anyway (might still be indexing)
        if (campaignAge < 300) {
          let imageUrl = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500';
          if (camp.image_urls && Array.isArray(camp.image_urls) && camp.image_urls.length > 0) {
            imageUrl = formatPinataImageUrl(camp.image_urls[0]);
          }

          const campaign: Campaign = {
            id: camp.campaign_id,
            title: camp.title || '',
            description: camp.description || '',
            imageUrl: imageUrl,
            image: imageUrl,
            organizationName: camp.organization_name || 'Unknown',
            organizationAddress: '',
            category: camp.category || 'General',
            location: camp.location || 'Global',
            raised: camp.total_raised || 0,
            goal: camp.goal || 0,
            donors: 0, // No donors_count column in Supabase
            daysLeft: camp.end_time ? calculateDaysLeft(camp.end_time) : 90,
            isActive: true,
            isVerified: camp.organization_verified || false,
            startDate: camp.start_time || now,
            endDate: camp.end_time || now + 86400 * 90,
            status: 'active',
          };
          campaigns.push(campaign);
        } else {
          const campaignIdShort = camp.campaign_id ? `${camp.campaign_id.slice(0, 10)}...` : 'unknown';
          console.warn(`[API] Skipping old campaign ${campaignIdShort} due to contract read error`);
        }
        continue;
      }
    }

    return NextResponse.json(
      {
        success: true,
        campaigns: campaigns,
        total: campaigns.length,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    // Log the full error for debugging
    console.error('[API] Fatal error fetching campaigns:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch campaigns',
        campaigns: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
