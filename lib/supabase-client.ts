import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
    // Check if campaign already exists
    const { data: existingCampaign, error: checkError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('campaign_id', data.campaignId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingCampaign) {
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

    // Only add safe_tx_hash if it exists (it's optional)
    if (data.safeTxHash) {
      insertData.safe_tx_hash = data.safeTxHash;
    }

    const { data: result, error } = await supabase
      .from('campaigns')
      .insert([insertData])
      .select();

    if (error) {
      throw new Error(`Supabase insert failed: ${error.message} (Code: ${error.code})`);
    }

    if (!result || result.length === 0) {
      throw new Error('No result returned from Supabase');
    }

    return result[0];
  } catch (error) {
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
