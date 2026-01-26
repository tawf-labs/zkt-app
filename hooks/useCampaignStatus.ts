'use client';

import { useReadContract } from 'wagmi';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';
import { getCampaignStatus, type CampaignStatusInfo } from '@/lib/campaign-status';

/**
 * Hook to fetch campaign status from the contract
 * Returns comprehensive status information including allocation state
 */
export function useCampaignStatus(campaignIdHash: string | null) {

  const {
    data: campaignData,
    isLoading: isLoadingCampaign,
    error: campaignError,
    refetch: refetchCampaign,
  } = useReadContract({
    address: ZKT_CAMPAIGN_POOL_ADDRESS,
    abi: ZKTCampaignPoolABI,
    functionName: 'campaigns',
    args: campaignIdHash ? [campaignIdHash as `0x${string}`] : undefined,
    query: {
      enabled: !!campaignIdHash,
      staleTime: 5_000, // 5 seconds (reduced from 30s to catch recent lock state)
      gcTime: 60_000, // 1 minute (reduced from 5 min)
      refetchOnWindowFocus: true,
    },
  });

  const {
    data: totalBps,
    isLoading: isLoadingBps,
    error: bpsError,
    refetch: refetchBps,
  } = useReadContract({
    address: ZKT_CAMPAIGN_POOL_ADDRESS,
    abi: ZKTCampaignPoolABI,
    functionName: 'totalBps',
    args: campaignIdHash ? [campaignIdHash as `0x${string}`] : undefined,
    query: {
      enabled: !!campaignIdHash,
      staleTime: 5_000, // 5 seconds (reduced from 30s)
      gcTime: 60_000, // 1 minute (reduced from 5 min)
      refetchOnWindowFocus: true,
    },
  });

  // Parse campaign data
  // Handle cases where contract returns no data or error
  const campaign: Campaign | null = campaignData
    ? {
        exists: campaignData[0] as boolean,
        allocationLocked: campaignData[1] as boolean,
        disbursed: campaignData[2] as boolean,
        closed: campaignData[3] as boolean,
        totalRaised: campaignData[4] as bigint,
        startTime: campaignData[5] as bigint,
        endTime: campaignData[6] as bigint,
      }
    : campaignError
    ? // If contract query fails, assume campaign exists and allocation is locked
      // This handles: Safe TX executed, contract data exists, but query returns error
      {
        exists: true,
        allocationLocked: true, // Assume locked since we queried it
        disbursed: false,
        closed: false,
        totalRaised: 0n,
        startTime: 0n,
        endTime: 0n,
      }
    : null;

  // Calculate campaign status
  const statusInfo: CampaignStatusInfo | null = campaign
    ? getCampaignStatus(campaign, Number(totalBps || 0))
    : null;

  const isLoading = isLoadingCampaign || isLoadingBps;
  const error = campaignError || bpsError;

  const refetch = () => {
    refetchCampaign();
    refetchBps();
  };

  return {
    campaign,
    statusInfo,
    totalBps: Number(totalBps || 0),
    allocationLocked: campaign?.allocationLocked ?? false,
    canDonate: statusInfo?.canDonate ?? false,
    isLoading,
    error,
    refetch,
  };
}
