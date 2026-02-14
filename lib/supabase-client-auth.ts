/**
 * Client-side Supabase auth utilities using @supabase/ssr
 * This ensures proper cookie sync between client and server
 */

import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

/**
 * Get or create the singleton Supabase browser client
 * Uses @supabase/ssr for proper cookie management with Next.js
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Sign out the current user (client-side)
 * Use this in client components
 */
export async function signOutClient() {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// ============================================================================
// CAMPAIGN DATA TYPES AND FUNCTIONS
// ============================================================================

// Campaign data type
export interface CampaignData {
  id?: string;
  campaignId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  goal: number;
  organizationName: string;
  organizationVerified: boolean;
  imageUrls: string[];
  tags: string[];
  createdAt?: string;
  createdBy?: string;
  startTime?: number;
  endTime?: number;
  totalRaised?: number;
  status?: string;
  safeTxHash?: string;  // Safe transaction hash for pending campaigns
}

// Save campaign off-chain data to Supabase (with upsert to handle duplicates)
export const saveCampaignData = async (data: CampaignData) => {
  try {
    console.log('[saveCampaignData] Attempting to save campaign:', {
      campaignId: data.campaignId,
      title: data.title,
      status: data.status,
    });

    // Check if campaign already exists
    const { data: existingCampaign, error: checkError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('campaign_id', data.campaignId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[saveCampaignData] Error checking existing campaign:', checkError);
      throw checkError;
    }

    if (existingCampaign) {
      console.log('[saveCampaignData] Campaign already exists, skipping insert:', {
        id: existingCampaign.id,
        campaignId: data.campaignId,
      });
      return existingCampaign;
    }

    // Prepare insert data with proper type conversions
    const insertData: any = {
      campaign_id: data.campaignId,
      title: data.title,
      description: data.description,
      category: data.category || 'General',
      location: data.location,
      goal: Number(data.goal),
      organization_name: data.organizationName,
      organization_verified: Boolean(data.organizationVerified),
      image_urls: data.imageUrls || [],
      tags: data.tags || [],
      start_time: Number(data.startTime),
      end_time: Number(data.endTime),
      status: data.status || 'active',
    };

    console.log('[saveCampaignData] Inserting campaign data:', insertData);

    // Only add safe_tx_hash if it exists (it's optional)
    // Note: Column might not exist in DB yet, so we skip it if not provided
    // if (data.safeTxHash) {
    //   insertData.safe_tx_hash = data.safeTxHash;
    // }

    const { data: result, error } = await supabase
      .from('campaigns')
      .insert([insertData])
      .select();

    if (error) {
      console.error('[saveCampaignData] Supabase insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`Supabase insert failed: ${error.message} (Code: ${error.code})`);
    }

    if (!result || result.length === 0) {
      console.error('[saveCampaignData] No result returned from Supabase');
      throw new Error('No result returned from Supabase');
    }

    console.log('[saveCampaignData] ✅ Campaign saved successfully:', {
      id: result[0].id,
      campaignId: result[0].campaign_id,
      title: result[0].title,
    });

    return result[0];
  } catch (error) {
    console.error('[saveCampaignData] Fatal error:', error);
    throw error;
  }
};

// Get campaign data from Supabase
export const getCampaignData = async (campaignId: string) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('campaign_id', campaignId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// Update campaign data
export const updateCampaignData = async (campaignId: string, updates: Partial<CampaignData>) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .update({
        ...(updates.title && { title: updates.title }),
        ...(updates.description && { description: updates.description }),
        ...(updates.totalRaised !== undefined && { total_raised: updates.totalRaised }),
        ...(updates.status && { status: updates.status }),
      })
      .eq('campaign_id', campaignId)
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    throw error;
  }
};

// List all campaigns
export const listCampaigns = async (limit = 10, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
};
