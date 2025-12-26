"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, ZKTCoreABI } from "@/lib/abi";

/**
 * Hook to fetch the list of donors for a specific campaign pool
 * @param poolId - The ID of the campaign pool
 * @returns Array of donor addresses and loading/error states
 */
export function usePoolDonors(poolId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.ZKTCore,
    abi: ZKTCoreABI,
    functionName: "getPoolDonors",
    args: [BigInt(poolId)],
    query: {
      staleTime: 30_000, // 30 seconds
      gcTime: 300_000, // 5 minutes
      enabled: poolId >= 0,
    },
  });

  return {
    donors: (data as string[]) || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch a specific donor's contribution to a pool
 * @param poolId - The ID of the campaign pool
 * @param donorAddress - The address of the donor
 * @returns Contribution amount and loading/error states
 */
export function useDonorContribution(poolId: number, donorAddress?: string) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.ZKTCore,
    abi: ZKTCoreABI,
    functionName: "getDonorContribution",
    args: donorAddress ? [BigInt(poolId), donorAddress as `0x${string}`] : undefined,
    query: {
      staleTime: 30_000, // 30 seconds
      gcTime: 300_000, // 5 minutes
      enabled: poolId >= 0 && !!donorAddress,
    },
  });

  return {
    contribution: (data as bigint) || BigInt(0),
    isLoading,
    error,
    refetch,
  };
}
