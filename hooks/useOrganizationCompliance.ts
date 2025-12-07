"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, ZKTCoreABI } from "@/lib/abi";

export interface OrganizationCompliance {
  isVerified: boolean;
  totalDonations: bigint;
  totalDistributed: bigint;
  complianceScore: bigint;
}

export function useOrganizationCompliance(organizationAddress?: string) {
  const {
    data: complianceData,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.ZKTCore,
    abi: ZKTCoreABI,
    functionName: "organizationCompliance",
    args: organizationAddress ? [organizationAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!organizationAddress,
      staleTime: 30_000,
      gcTime: 300_000,
    },
  });

  const compliance: OrganizationCompliance = complianceData
    ? {
        isVerified: (complianceData as any).isVerified || false,
        totalDonations: (complianceData as any).totalDonations || BigInt(0),
        totalDistributed: (complianceData as any).totalDistributed || BigInt(0),
        complianceScore: (complianceData as any).complianceScore || BigInt(0),
      }
    : {
        isVerified: false,
        totalDonations: BigInt(0),
        totalDistributed: BigInt(0),
        complianceScore: BigInt(0),
      };

  return {
    compliance,
    isLoading,
    error,
    refetch,
  };
}
