'use client';

import { useReadContract } from 'wagmi';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';
import { keccak256, stringToBytes } from 'viem';

// NGO list - these are the NGOs that can receive allocations
// Their IDs are deterministic based on their names
export const AVAILABLE_NGOS = [
  {
    id: keccak256(stringToBytes('NGO-1')),
    name: 'Red Crescent Indonesia',
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f42e0e',
  },
  {
    id: keccak256(stringToBytes('NGO-2')),
    name: 'UNICEF Indonesia',
    wallet: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
  },
  {
    id: keccak256(stringToBytes('NGO-3')),
    name: 'World Vision Indonesia',
    wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  },
];

export interface NGOAllocation {
  ngoId: string;
  ngoName: string;
  bps: number;
  percentage: number;
}

/**
 * Hook to fetch allocation data for a campaign from the contract
 * Returns an array of NGOs with their allocated basis points
 */
export function useCampaignAllocations(campaignIdHash: string | null) {
  // Query allocationBps for each NGO
  const allocationQueries = AVAILABLE_NGOS.map((ngo) => {
    return useReadContract({
      address: ZKT_CAMPAIGN_POOL_ADDRESS,
      abi: ZKTCampaignPoolABI,
      functionName: 'allocationBps',
      args: campaignIdHash ? [campaignIdHash as `0x${string}`, ngo.id as `0x${string}`] : undefined,
      query: {
        enabled: !!campaignIdHash,
        staleTime: 10_000, // 10 seconds
        gcTime: 60_000,
        refetchOnWindowFocus: true,
      },
    });
  });

  // Combine results
  const allocations: NGOAllocation[] = AVAILABLE_NGOS
    .map((ngo, idx) => {
      const bps = allocationQueries[idx].data as bigint | undefined;
      if (bps && Number(bps) > 0) {
        return {
          ngoId: ngo.id,
          ngoName: ngo.name,
          bps: Number(bps),
          percentage: Number(bps) / 100, // Convert bps to percentage
        };
      }
      return null;
    })
    .filter((alloc): alloc is NGOAllocation => alloc !== null);

  // Calculate total allocation
  const totalBps = allocations.reduce((sum, alloc) => sum + alloc.bps, 0);
  const totalPercentage = totalBps / 100;

  const isLoading = allocationQueries.some((query) => query.isLoading);
  const isRefetching = allocationQueries.some((query) => query.isRefetching);

  const refetch = () => {
    allocationQueries.forEach((query) => query.refetch());
  };

  return {
    allocations,
    totalBps,
    totalPercentage,
    isLoading,
    isRefetching,
    hasAllocations: allocations.length > 0,
    refetch,
  };
}
