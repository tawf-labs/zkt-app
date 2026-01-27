/**
 * Campaign Verification Utility
 *
 * Checks if campaigns exist on-chain by reading contract state directly.
 * This bypasses any database sync issues and provides ground truth.
 */

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';

// Create a public client for reading contract data
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ?? 'https://sepolia.base.org'
  ),
});

export interface CampaignOnChainStatus {
  exists: boolean;
  allocationLocked: boolean;
  disbursed: boolean;
  closed: boolean;
  totalRaised: bigint;
  startTime: bigint;
  endTime: bigint;
}

/**
 * Check if a campaign exists on-chain
 * @param campaignId - The campaign ID to check (bytes32 as hex string)
 * @returns true if campaign exists, false otherwise
 */
export async function verifyCampaignExists(campaignId: string): Promise<boolean> {
  try {
    if (!campaignId || !campaignId.startsWith('0x') || campaignId.length !== 66) {
      console.warn('[verifyCampaignExists] Invalid campaign ID format:', campaignId);
      return false;
    }

    const campaignData = await publicClient.readContract({
      address: ZKT_CAMPAIGN_POOL_ADDRESS,
      abi: ZKTCampaignPoolABI,
      functionName: 'campaigns',
      args: [campaignId as `0x${string}`],
    }) as [boolean, boolean, boolean, boolean, bigint, bigint, bigint];

    // campaignData returns:
    // [0] exists (bool)
    // [1] allocationLocked (bool)
    // [2] disbursed (bool)
    // [3] closed (bool)
    // [4] totalRaised (uint256)
    // [5] startTime (uint256)
    // [6] endTime (uint256)

    const exists = campaignData[0];
    console.log(`[verifyCampaignExists] Campaign ${campaignId.slice(0, 10)}... exists: ${exists}`);

    return exists;
  } catch (error) {
    console.error('[verifyCampaignExists] Error checking campaign:', error);
    return false;
  }
}

/**
 * Get full campaign status from contract
 * @param campaignId - The campaign ID to check (bytes32 as hex string)
 * @returns Campaign status object or null if error
 */
export async function getCampaignOnChainStatus(
  campaignId: string
): Promise<CampaignOnChainStatus | null> {
  try {
    if (!campaignId || !campaignId.startsWith('0x') || campaignId.length !== 66) {
      console.warn('[getCampaignOnChainStatus] Invalid campaign ID format:', campaignId);
      return null;
    }

    const campaignData = await publicClient.readContract({
      address: ZKT_CAMPAIGN_POOL_ADDRESS,
      abi: ZKTCampaignPoolABI,
      functionName: 'campaigns',
      args: [campaignId as `0x${string}`],
    }) as [boolean, boolean, boolean, boolean, bigint, bigint, bigint];

    return {
      exists: campaignData[0],
      allocationLocked: campaignData[1],
      disbursed: campaignData[2],
      closed: campaignData[3],
      totalRaised: campaignData[4],
      startTime: campaignData[5],
      endTime: campaignData[6],
    };
  } catch (error) {
    console.error('[getCampaignOnChainStatus] Error reading campaign:', error);
    return null;
  }
}

/**
 * Check if a campaign is ready to accept donations
 * Campaign must:
 * - Exist on-chain
 * - Have allocations locked
 * - Not be disbursed
 * - Not be closed
 * - Be within start/end time window
 */
export async function isCampaignReadyForDonations(campaignId: string): Promise<boolean> {
  try {
    const status = await getCampaignOnChainStatus(campaignId);
    if (!status || !status.exists) {
      return false;
    }

    // Check basic requirements
    if (!status.allocationLocked || status.disbursed || status.closed) {
      return false;
    }

    // Check time window
    const now = Math.floor(Date.now() / 1000);
    if (Number(status.startTime) > now || Number(status.endTime) < now) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[isCampaignReadyForDonations] Error:', error);
    return false;
  }
}

/**
 * Batch verify multiple campaigns
 * Useful for syncing database state with on-chain reality
 */
export async function batchVerifyCampaigns(
  campaignIds: string[]
): Promise<Map<string, CampaignOnChainStatus>> {
  const results = new Map<string, CampaignOnChainStatus>();

  console.log(`[batchVerifyCampaigns] Checking ${campaignIds.length} campaigns...`);

  for (const campaignId of campaignIds) {
    const status = await getCampaignOnChainStatus(campaignId);
    if (status) {
      results.set(campaignId, status);
    }
  }

  console.log(`[batchVerifyCampaigns] Found ${results.size} valid campaigns`);
  return results;
}
