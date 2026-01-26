"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, MockIDRXABI } from "@/lib/abi";
import { formatIDRX } from "@/lib/abi";
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from "@/lib/zkt-campaign-pool";

export function useIDRXBalance() {
  const { address } = useAccount();

  // First, get the token address from the campaign pool contract
  // This ensures we check the balance of the correct token
  const {
    data: tokenAddress,
    isLoading: isTokenLoading,
  } = useReadContract({
    address: ZKT_CAMPAIGN_POOL_ADDRESS,
    abi: ZKTCampaignPoolABI,
    functionName: "token",
    query: {
      staleTime: Infinity, // Token address never changes
      refetchOnWindowFocus: false,
    },
  });

  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: (tokenAddress as `0x${string}`) || CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI, // Both tokens use standard ERC20
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress,
      staleTime: 30_000, // 30 seconds
      gcTime: 300_000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  });

  return {
    balance: balance as bigint | undefined,
    formattedBalance: balance ? formatIDRX(balance as bigint) : "0",
    isLoading: isLoading || isTokenLoading,
    error,
    refetch,
  };
}
