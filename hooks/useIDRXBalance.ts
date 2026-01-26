"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, MockIDRXABI } from "@/lib/abi";
import { formatIDRX } from "@/lib/abi";

export function useIDRXBalance() {
  const { address } = useAccount();

  // Use new IDRX token (TestUSDC)
  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.IDRX,
    abi: MockIDRXABI, // Same ERC20 ABI
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 30_000, // 30 seconds
      gcTime: 300_000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  });

  return {
    balance: balance as bigint | undefined,
    formattedBalance: balance ? formatIDRX(balance as bigint) : "0",
    isLoading,
    error,
    refetch,
  };
}
