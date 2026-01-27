import { NextRequest, NextResponse } from 'next/server';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { supabase } from '@/lib/supabase-client';

// Helper function to calculate days left
function calculateDaysLeft(endDate: number): number {
  const now = Math.floor(Date.now() / 1000);
  const daysLeft = Math.ceil((endDate - now) / 86400);
  return Math.max(daysLeft, 0);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let campaign: any = null;

  try {
    const { id } = await params;

    // Fetch all campaigns from Supabase
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch campaign' },
        { status: 500 }
      );
    }

    // Find campaign by campaign_id (support both bytes32 hash and numeric ID)

    if (id.startsWith('0x')) {
      // It's a bytes32 hash - exact match
      campaign = campaigns?.find((c: any) => c.campaign_id === id);
    } else {
      // Try numeric ID - parse both as numbers for comparison
      const campaignId = parseInt(id, 10);
      campaign = campaigns?.find((c: any) => {
        const cId = parseInt(c.campaign_id, 10);
        return !isNaN(cId) && cId === campaignId;
      });
    }

    // Validate required fields
    if (!campaign || !campaign.campaign_id) {
      console.error('[API] Campaign not found or missing campaign_id:', {
        id,
        idType: id.startsWith('0x') ? 'bytes32' : 'numeric',
        campaign: campaign ? 'found but invalid' : 'not found',
      });
      return NextResponse.json(
        { success: false, error: 'Campaign not found or invalid' },
        { status: 404 }
      );
    }

    // Warn about missing optional fields
    if (!campaign.title) {
      console.warn('[API] Campaign missing title:', {
        campaign_id: campaign.campaign_id,
      });
    }

    // If campaign status is 'active', verify it exists on-chain
    if (campaign.status === 'active') {
      try {
        const { verifyCampaignExists } = await import('@/lib/verify-campaign');
        const existsOnChain = await verifyCampaignExists(campaign.campaign_id);

        if (!existsOnChain) {
          console.warn('[API] Campaign marked as active in DB but not found on-chain:', {
            campaign_id: campaign.campaign_id,
          });
          // Return pending status instead of failing
          campaign.status = 'pending_execution';
        }
      } catch (error) {
        console.error('[API] Error verifying campaign on-chain:', error);
        // Continue anyway - use Supabase data as source of truth
      }
    }

    const now = Math.floor(Date.now() / 1000);
    const endTime = Number(campaign.end_time ?? (Math.floor(Date.now() / 1000) + 86400 * 90));

    // Format image URLs
    const images: string[] = [];
    try {
      if (campaign.image_urls && Array.isArray(campaign.image_urls) && campaign.image_urls.length > 0) {
        for (const url of campaign.image_urls) {
          if (typeof url === 'string' && url.length > 0) {
            images.push(formatPinataImageUrl(url));
          }
        }
      }
    } catch (error) {
      console.warn('[API] Error formatting image URLs:', error);
    }

    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500');
    }

    // Use campaign_id as is (could be hash or numeric)
    const campaignIdValue = campaign.campaign_id;

    // Safe number conversions with explicit checks
    const raisedAmount = Number(campaign.total_raised ?? 0);
    const goalAmount = Number(campaign.goal ?? 0);
    const donorsCount = Number(campaign.donors_count ?? 0);
    const startTime = Number(campaign.start_time ?? Math.floor(Date.now() / 1000));

    // Validate conversions
    if (isNaN(raisedAmount) || isNaN(goalAmount) || isNaN(donorsCount)) {
      throw new Error('Invalid numeric data in campaign');
    }

    const campaignDetail = {
      id: id.startsWith('0x') ? id : parseInt(id, 10),
      campaignIdHash: campaignIdValue || '', // blockchain campaign ID (hash for Safe campaigns, numeric for others)
      title: campaign.title || '',
      description: campaign.description || '',
      status: campaign.status || 'active',
      safeTxHash: campaign.safe_tx_hash || undefined,
      organization: {
        name: campaign.organization_name || 'Unknown Organization',
        verified: campaign.organization_verified || false,
        logo: '/org-logo.jpg',
      },
      category: campaign.category || 'General',
      location: campaign.location || 'Global',
      raised: raisedAmount,
      goal: goalAmount,
      donors: donorsCount,
      daysLeft: calculateDaysLeft(endTime),
      createdDate: campaign.created_at ? new Date(campaign.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) : 'Unknown',
      image: images[0],
      images: images,
      // Mock data untuk fields yang tidak ada di database
      updates: [
        {
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          title: 'Campaign Started',
          content: `This campaign was created on ${campaign.created_at ? new Date(campaign.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'recently'} to help with ${campaign.title}.`,
        },
      ],
      milestones: [
        {
          amount: goalAmount * 0.33,
          label: '33% of Goal - Initial Support',
          achieved: raisedAmount >= goalAmount * 0.33,
        },
        {
          amount: goalAmount * 0.66,
          label: '66% of Goal - Strong Progress',
          achieved: raisedAmount >= goalAmount * 0.66,
        },
        {
          amount: goalAmount,
          label: '100% of Goal - Campaign Complete',
          achieved: raisedAmount >= goalAmount,
        },
      ],
    };

    return NextResponse.json(
      {
        success: true,
        campaign: campaignDetail,
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
    console.error('[API] Error fetching campaign detail:', {
      id,
      idType: id.startsWith('0x') ? 'bytes32' : 'numeric',
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      campaignFound: !!campaign,
      campaignId: campaign?.campaign_id,
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? {
          id,
          idType: id.startsWith('0x') ? 'bytes32' : 'numeric',
        } : undefined,
      },
      { status: 500 }
    );
  }
}
