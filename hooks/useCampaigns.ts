"use client";

import { useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES, ZKTCoreABI } from "@/lib/abi";
import { formatIDRX } from "@/lib/abi";

// Campaign structure based on ZKTCore smart contract
export interface Campaign {
  id: bigint;
  title: string;
  description: string;
  imageUrl: string;
  organizationName: string;
  organizationAddress: string;
  category: string;
  location: string;
  targetAmount: bigint;
  currentAmount: bigint;
  startDate: bigint;
  endDate: bigint;
  isActive: boolean;
  isVerified: boolean;
  donorCount: bigint;
}

// Helper to fetch single campaign pool data
function useCampaignData(poolId: number) {
  const result = useReadContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.ZKTCore,
        abi: ZKTCoreABI,
        functionName: "getPool",
        args: [BigInt(poolId)],
      },
    ],
    query: {
      staleTime: 30_000, // 30 seconds
      gcTime: 300_000, // 5 minutes
    },
  });

  return result;
}

export function useCampaigns(poolIds: number[] = [0, 1, 2, 3, 4, 5]) {
  // Fetch all campaigns in parallel
  const campaigns = poolIds.map((id) => useCampaignData(id));

  const isLoading = campaigns.some((c) => c.isLoading);
  const error = campaigns.find((c) => c.error)?.error;

  const data: Campaign[] = campaigns
    .map((campaign, index) => {
      if (!campaign.data) return null;

      const [campaignData] = campaign.data;

      // Type guard to check if campaignData has the expected structure
      if (
        !campaignData ||
        typeof campaignData !== "object" ||
        !("result" in campaignData)
      ) {
        return null;
      }

      const pool = campaignData.result as any;

      return {
        id: BigInt(poolIds[index]),
        title: pool.campaignTitle || `Campaign ${poolIds[index]}`,
        description: pool.campaignTitle || "",
        imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6",
        organizationName: "Unknown Organization",
        organizationAddress: pool.organizer || "",
        category: pool.campaignType === 0 ? "General" : pool.campaignType === 1 ? "Zakat" : "Emergency",
        location: "Unknown",
        targetAmount: pool.fundingGoal || BigInt(0),
        currentAmount: pool.raisedAmount || BigInt(0),
        startDate: pool.createdAt || BigInt(0),
        endDate: BigInt(0),
        isActive: pool.isActive || false,
        isVerified: false,
        donorCount: pool.donors ? BigInt(pool.donors.length) : BigInt(0),
      };
    })
    .filter((c): c is Campaign => c !== null);

  const refetch = () => {
    campaigns.forEach((c) => c.refetch());
  };

  return {
    campaigns: data,
    isLoading,
    error,
    refetch,
  };
}

// Hook for single campaign
export function useCampaign(poolId: number) {
  const { campaigns, isLoading, error, refetch } = useCampaigns([poolId]);

  return {
    campaign: campaigns[0],
    isLoading,
    error,
    refetch,
  };
}
