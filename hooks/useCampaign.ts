'use client';

import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, ZKTCoreABI } from '@/lib/abi';
import { generateCampaignId } from './useCampaigns';

/**
 * Hook to fetch a single campaign by its campaign ID (string)
 * Converts the string to keccak256 hash and queries the blockchain
 */
export function useCampaign(campaignIdString: string | undefined) {
  const campaignId = campaignIdString ? generateCampaignId(campaignIdString) : undefined;

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.ZKTCore,
    abi: ZKTCoreABI,
    functionName: 'getCampaign',
    args: campaignId ? [campaignId] : undefined,
    query: {
      enabled: !!campaignId,
      staleTime: 30_000,
      gcTime: 300_000,
    },
  });

  return {
    campaign: data,
    campaignId,
    isLoading,
    error,
    refetch,
  };
}

