"use client";

import { usePublicClient, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESSES, ZKTCoreABI } from "@/lib/abi";
import type { Proposal } from "./useProposals";

export function useUserProposals(blockRange: number = 10000) {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserProposals() {
      if (!publicClient || !address) {
        setProposals([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock - BigInt(blockRange);

        // Query ProposalCreated events filtered by proposer
        const proposalLogs = await publicClient.getLogs({
          address: CONTRACT_ADDRESSES.ZKTCore,
          event: {
            type: 'event',
            name: 'ProposalCreated',
            inputs: [
              { name: 'proposalId', type: 'uint256', indexed: true },
              { name: 'proposer', type: 'address', indexed: true },
              { name: 'title', type: 'string', indexed: false },
              { name: 'description', type: 'string', indexed: false },
            ],
          },
          args: {
            proposer: address,
          },
          fromBlock,
          toBlock: currentBlock,
        });

        const userProposals = await Promise.all(
          proposalLogs.map(async (log) => {
            const { proposalId, title, description } = log.args as any;
            
            // Fetch full proposal details from contract
            try {
              const proposalData = await publicClient.readContract({
                address: CONTRACT_ADDRESSES.ZKTCore,
                abi: ZKTCoreABI,
                functionName: 'getProposal',
                args: [proposalId],
              }) as any;

              // Determine status
              let status: Proposal['status'] = 'Pending';
              if (proposalData.executed) {
                status = 'Executed';
              } else if (proposalData.cancelled) {
                status = 'Rejected';
              } else {
                const currentTime = BigInt(Math.floor(Date.now() / 1000));
                const endTime = proposalData.endTime || BigInt(0);
                if (endTime > BigInt(0) && currentTime > endTime) {
                  const totalVotes = proposalData.votesFor + proposalData.votesAgainst;
                  status = totalVotes > BigInt(0) && proposalData.votesFor > proposalData.votesAgainst ? 'Approved' : 'Rejected';
                } else {
                  status = 'Active';
                }
              }

              return {
                id: proposalId,
                title: title || proposalData.title || `Proposal #${proposalId}`,
                description: description || proposalData.description || "",
                proposer: address,
                votesFor: proposalData.votesFor || BigInt(0),
                votesAgainst: proposalData.votesAgainst || BigInt(0),
                votesAbstain: BigInt(0),
                startTime: proposalData.startTime || BigInt(0),
                endTime: proposalData.endTime || BigInt(0),
                executed: proposalData.executed || false,
                cancelled: proposalData.cancelled || false,
                proposalType: proposalData.proposalType || "general",
                status,
              };
            } catch (err) {
              console.error(`Error fetching proposal ${proposalId}:`, err);
              return null;
            }
          })
        );

        setProposals(userProposals.filter(p => p !== null) as Proposal[]);
        setError(null);
      } catch (err) {
        console.error("Error fetching user proposals:", err);
        setError(err as Error);
        setProposals([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProposals();
  }, [publicClient, address, blockRange]);

  return {
    proposals,
    isLoading,
    error,
  };
}
