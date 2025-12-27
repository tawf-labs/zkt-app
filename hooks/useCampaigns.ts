"use client";

import { useEffect, useState, useMemo } from "react";
import { useReadContracts } from "wagmi";
import { keccak256, toBytes } from "viem";
import { CONTRACT_ADDRESSES, ZKTCoreABI } from "@/lib/abi";
import { formatIDRX } from "@/lib/abi";
import { listCampaigns, type CampaignData } from "@/lib/supabase-client";

// Campaign structure combining database and blockchain data
export interface Campaign {
  campaignId: `0x${string}`; // keccak256 hash
  campaignIdString: string; // original string (e.g., "RAMADAN-2025")
  title: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
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
  tags: string[];
}

// Helper function to generate campaignID from campaign name (matches Solidity keccak256)
export function generateCampaignId(campaignName: string): `0x${string}` {
  return keccak256(toBytes(campaignName));
}

export function useCampaigns() {
  const [dbCampaigns, setDbCampaigns] = useState<CampaignData[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  // Fetch campaigns from database
  useEffect(() => {
    async function fetchDbCampaigns() {
      try {
        setIsLoadingDb(true);
        const campaigns = await listCampaigns(100);
        setDbCampaigns(campaigns);
      } catch (error) {
        console.error('Error fetching campaigns from database:', error);
      } finally {
        setIsLoadingDb(false);
      }
    }
    fetchDbCampaigns();
  }, []);

  // Build contracts array for all campaigns using their campaignIDs
  const contracts = useMemo(() => {
    return dbCampaigns.map((dbCampaign) => {
      // Generate campaignID from the campaign's unique identifier
      const campaignId = generateCampaignId(dbCampaign.campaignId);
      
      return {
        address: CONTRACT_ADDRESSES.ZKTCore,
        abi: ZKTCoreABI,
        functionName: "getCampaign" as const,
        args: [campaignId],
      };
    });
  }, [dbCampaigns]);

  // Fetch all campaigns from blockchain
  const { data: campaignsData, isLoading: isLoadingBlockchain, error, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
      staleTime: 30_000,
      gcTime: 300_000,
    },
  });

  const isLoading = isLoadingBlockchain || isLoadingDb;

  // Merge database and blockchain data
  const campaigns: Campaign[] = useMemo(() => {
    if (!campaignsData || dbCampaigns.length === 0) return [];

    return dbCampaigns
      .map((dbCampaign, index) => {
        const campaignData = campaignsData[index];
        const campaignId = generateCampaignId(dbCampaign.campaignId);

        // If blockchain data is not available or failed, use DB data only
        if (!campaignData || campaignData.status !== 'success') {
          return {
            campaignId,
            campaignIdString: dbCampaign.campaignId,
            title: dbCampaign.title,
            description: dbCampaign.description,
            imageUrl: dbCampaign.imageUrls?.[0] || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6",
            imageUrls: dbCampaign.imageUrls || [],
            organizationName: dbCampaign.organizationName,
            organizationAddress: "",
            category: dbCampaign.category,
            location: dbCampaign.location,
            targetAmount: BigInt(dbCampaign.goal || 0) * BigInt(10 ** 18),
            currentAmount: BigInt(0),
            startDate: BigInt(dbCampaign.startTime || 0),
            endDate: BigInt(dbCampaign.endTime || 0),
            isActive: dbCampaign.status === 'active',
            isVerified: dbCampaign.organizationVerified,
            donorCount: BigInt(0),
            tags: dbCampaign.tags || [],
          };
        }

        const camp = campaignData.result as any;

        return {
          campaignId,
          campaignIdString: dbCampaign.campaignId,
          title: dbCampaign.title || camp.name || dbCampaign.campaignId,
          description: dbCampaign.description || camp.description || "",
          imageUrl: dbCampaign.imageUrls?.[0] || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6",
          imageUrls: dbCampaign.imageUrls || [],
          organizationName: dbCampaign.organizationName || "Unknown Organization",
          organizationAddress: camp.organization || "",
          category: dbCampaign.category || "General",
          location: dbCampaign.location || "Unknown",
          targetAmount: camp.targetAmount || BigInt(dbCampaign.goal || 0) * BigInt(10 ** 18),
          currentAmount: camp.raisedAmount || BigInt(0),
          startDate: camp.startTime || BigInt(dbCampaign.startTime || 0),
          endDate: camp.endTime || BigInt(dbCampaign.endTime || 0),
          isActive: camp.isActive ?? (dbCampaign.status === 'active'),
          isVerified: dbCampaign.organizationVerified,
          donorCount: BigInt(0),
          tags: dbCampaign.tags || [],
        };
      })
      .filter((c): c is Campaign => c !== null);
  }, [campaignsData, dbCampaigns]);

  return {
    campaigns,
    isLoading,
    error,
    refetch,
  };
}
