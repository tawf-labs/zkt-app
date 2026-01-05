import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, getAddress } from 'viem';
import { baseSepolia } from 'viem/chains';
import { DONATION_CONTRACT_ADDRESS, DonationABI } from '@/lib/donate';
import { Campaign } from '@/hooks/useCampaigns';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { supabase } from '@/lib/supabase-client';

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

    // Fetch campaigns from Supabase first
    try {
      const { data: supabaseCampaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
      } else if (supabaseCampaigns && supabaseCampaigns.length > 0) {
        // Convert Supabase campaigns to Campaign type
        const now = Math.floor(Date.now() / 1000);
        supabaseCampaigns.forEach((camp: any, index: number) => {
          // Skip expired campaigns
          const endTime = camp.end_time || Math.floor(Date.now() / 1000) + 86400 * 90;
          if (endTime < now) {
            return;
          }

          // Get image URL and ensure it's properly formatted for Pinata
          let imageUrl = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500';
          if (camp.image_urls && Array.isArray(camp.image_urls) && camp.image_urls.length > 0) {
            imageUrl = formatPinataImageUrl(camp.image_urls[0]);
          }

          const campaign: Campaign = {
            id: camp.campaign_id || index,
            title: camp.title || '',
            description: camp.description || '',
            imageUrl: imageUrl,
            image: imageUrl,
            organizationName: camp.organization_name || 'Unknown',
            organizationAddress: camp.organization_address || '',
            category: camp.category || 'General',
            location: camp.location || 'Global',
            raised: camp.total_raised || 0,
            goal: camp.goal || 0,
            donors: camp.donors_count || 0,
            daysLeft: calculateDaysLeft(endTime),
            isActive: camp.status === 'active' && endTime > now,
            isVerified: camp.organization_verified || false,
            startDate: camp.start_time || now,
            endDate: endTime,
          };
          campaigns.push(campaign);
        });
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    }

    // Try to fetch from contract as secondary source (only if Supabase is empty)
    if (campaigns.length === 0) {
      try {
        const campaignCount = 3;

        for (let i = 0; i < campaignCount; i++) {
          try {
            const campaignData = await publicClient.readContract({
              address: getAddress(DONATION_CONTRACT_ADDRESS),
              abi: DonationABI,
              functionName: 'campaigns',
              args: [BigInt(i)],
            }) as any;

            if (!campaignData || !campaignData.name) continue;

          const targetAmountBigInt = BigInt(campaignData.targetAmount || 0);
          const raisedAmountBigInt = BigInt(campaignData.raisedAmount || 0);

          const targetAmount = Number(targetAmountBigInt) / 1e18;
          const raisedAmount = Number(raisedAmountBigInt) / 1e18;

          if (targetAmount === 0) continue;

          // Use contract endTime if available, otherwise add 90 days
          const contractEndTime = campaignData.endTime ? Number(campaignData.endTime) : null;
          const endDate = contractEndTime || Math.floor(Date.now() / 1000) + (90 * 86400);
          const now = Math.floor(Date.now() / 1000);

          // Skip expired campaigns
          if (endDate < now) {
            console.log(`⏰ Skipping expired contract campaign: ${campaignData.name}`);
            continue;
          }

          const daysLeft = calculateDaysLeft(endDate);

          // Only add if not already in Supabase campaigns
          const alreadyExists = campaigns.some(c => c.title === campaignData.name);
          if (!alreadyExists) {
            const campaign: Campaign = {
              id: campaigns.length,
              title: campaignData.name,
              description: campaignData.description || '',
              imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500',
              image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500',
              organizationName: 'Unknown Organization',
              organizationAddress: campaignData.organization || '',
              category: 'General',
              location: 'Global',
              raised: Math.floor(raisedAmount),
              goal: Math.floor(targetAmount),
              donors: 0,
              daysLeft,
              isActive: (campaignData.isActive || false) && endDate > now,
              isVerified: false,
              startDate: Math.floor(Date.now() / 1000),
              endDate,
            };
            campaigns.push(campaign);
          }
        } catch (error) {
          // Silently skip contract errors - use Supabase data instead
          continue;
        }
      }
    } catch (error) {
      // Silently skip contract access errors
      console.log('ℹ️ Contract data skipped - using Supabase data only');
    }
    }

    return NextResponse.json(
      {
        success: true,
        campaigns: campaigns,
        total: campaigns.length,
        source: campaigns.length > 0 ? 'supabase' : 'empty',
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
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch campaigns',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
