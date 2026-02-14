"use client";

import { useAccount, usePublicClient } from "wagmi";
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from "@/lib/zkt-campaign-pool";
import { useState, useEffect, useRef } from "react";

export interface DonationEvent {
  blockNumber: bigint;
  transactionHash: string;
  args: {
    campaignId: string; // bytes32
    donor: string;
    amount: bigint;
    tokenId: bigint;
  };
}

/**
 * Hook to fetch all Donated events for the connected wallet from ZKTCampaignPool contract.
 * Uses incremental polling to avoid large block range queries that cause 503 errors.
 * Only fetches new blocks since the last poll, following the pattern from useCampaignEventListener.
 */
export function useDonationHistory() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [donations, setDonations] = useState<DonationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track last processed block and accumulated donations across polls
  const lastBlockRef = useRef<bigint>(BigInt(0));
  const allDonationsRef = useRef<DonationEvent[]>([]);

  useEffect(() => {
    if (!address || !isConnected || !publicClient) {
      setDonations([]);
      setError(null);
      lastBlockRef.current = BigInt(0);
      allDonationsRef.current = [];
      return;
    }

    const fetchDonations = async () => {
      // Only show loading on first fetch
      if (allDonationsRef.current.length === 0) {
        setIsLoading(true);
      }

      try {
        const currentBlock = await publicClient.getBlockNumber();
        let fromBlock: bigint;

        // Determine starting block
        if (lastBlockRef.current === BigInt(0)) {
          // First load: only get recent blocks (last 10,000) to avoid 503 error
          const RECENT_BLOCK_RANGE = BigInt(10000);
          const DEPLOYMENT_BLOCK = BigInt(5000000);
          fromBlock = currentBlock > RECENT_BLOCK_RANGE ? currentBlock - RECENT_BLOCK_RANGE : DEPLOYMENT_BLOCK;
        } else {
          // Subsequent polls: only get new blocks since last check
          fromBlock = lastBlockRef.current + BigInt(1);
        }

        // Skip if no new blocks
        if (fromBlock > currentBlock) {
          return;
        }

        // Fetch logs for the determined range
        const logs = await publicClient.getLogs({
          address: ZKT_CAMPAIGN_POOL_ADDRESS,
          event: {
            name: "Donated",
            type: "event",
            inputs: [
              { indexed: true, name: "campaignId", type: "bytes32" },
              { indexed: true, name: "donor", type: "address" },
              { indexed: false, name: "amount", type: "uint256" },
              { indexed: true, name: "tokenId", type: "uint256" },
            ],
          },
          args: {
            donor: address as `0x${string}`, // Filter by connected wallet
          },
          fromBlock,
          toBlock: currentBlock,
        });

        // Transform logs into DonationEvent objects
        const newDonations: DonationEvent[] = logs.map((log) => ({
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          args: {
            campaignId: log.args.campaignId as string,
            donor: log.args.donor as string,
            amount: log.args.amount as bigint,
            tokenId: log.args.tokenId as bigint,
          },
        }));

        // Append new donations to accumulated list
        allDonationsRef.current = [...newDonations, ...allDonationsRef.current];

        // Sort by block number (newest first)
        allDonationsRef.current.sort((a, b) => Number(b.blockNumber - a.blockNumber));

        setDonations(allDonationsRef.current);

        // Update last processed block
        lastBlockRef.current = currentBlock;
        setError(null); // Clear error on success
      } catch (err) {
        console.error("Error fetching donation history:", err);
        // Don't clear existing data on error - keep showing what we have
        if (allDonationsRef.current.length === 0) {
          setError(err instanceof Error ? err : new Error("Failed to fetch donation history"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();

    // Poll for new donations every 15 seconds
    const intervalId = setInterval(fetchDonations, 15000);

    return () => {
      clearInterval(intervalId);
      // Don't reset refs on unmount - preserve data for when user returns
    };
  }, [address, isConnected, publicClient]);

  const refetch = () => {
    // Reset tracking to force a fresh fetch from recent blocks
    lastBlockRef.current = BigInt(0);
    allDonationsRef.current = [];
  };

  return {
    donations,
    isLoading,
    error,
    refetch,
  };
}
