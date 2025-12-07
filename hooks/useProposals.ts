"use client";

import { useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES, ZKTCoreABI } from "@/lib/abi";

export interface Proposal {
  id: bigint;
  title: string;
  description: string;
  proposer: string;
  votesFor: bigint;
  votesAgainst: bigint;
  votesAbstain: bigint;
  startTime: bigint;
  endTime: bigint;
  executed: boolean;
  cancelled: boolean;
  proposalType: string;
  status: 'Pending' | 'Active' | 'Approved' | 'Rejected' | 'Executed';
}

function useProposalData(proposalId: number) {
  const result = useReadContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.ZKTCore,
        abi: ZKTCoreABI,
        functionName: "getProposal",
        args: [BigInt(proposalId)],
      },
    ],
    query: {
      staleTime: 30_000, // 30 seconds
      gcTime: 300_000, // 5 minutes
    },
  });

  return result;
}

export function useProposals(proposalIds: number[] = [0, 1, 2, 3]) {
  const proposals = proposalIds.map((id) => useProposalData(id));

  const isLoading = proposals.some((p) => p.isLoading);
  const error = proposals.find((p) => p.error)?.error;

  const data: Proposal[] = proposals
    .map((proposal, index) => {
      if (!proposal.data) return null;

      const [proposalData] = proposal.data;

      if (
        !proposalData ||
        typeof proposalData !== "object" ||
        !("result" in proposalData)
      ) {
        return null;
      }

      const prop = proposalData.result as any;

      // Additional check to ensure prop exists and has expected properties
      if (!prop || typeof prop !== 'object') {
        return null;
      }

      // Determine status based on proposal state
      let status: Proposal['status'] = 'Pending';
      if (prop.executed) {
        status = 'Executed';
      } else if (prop.cancelled) {
        status = 'Rejected';
      } else {
        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        const endTime = prop.endTime || BigInt(0);
        if (endTime > BigInt(0) && currentTime > endTime) {
          const totalVotes = (prop.votesFor || BigInt(0)) + (prop.votesAgainst || BigInt(0));
          status = totalVotes > BigInt(0) && prop.votesFor > prop.votesAgainst ? 'Approved' : 'Rejected';
        } else {
          status = 'Active';
        }
      }

      return {
        id: BigInt(proposalIds[index]),
        title: prop.title || `Proposal ${proposalIds[index]}`,
        description: prop.description || "",
        proposer: prop.proposer || "",
        votesFor: prop.votesFor || BigInt(0),
        votesAgainst: prop.votesAgainst || BigInt(0),
        votesAbstain: BigInt(0),
        startTime: BigInt(0),
        endTime: prop.endTime || BigInt(0),
        executed: prop.executed || false,
        cancelled: false,
        proposalType: "general",
        status,
      } as Proposal;
    })
    .filter((p): p is Proposal => p !== null);

  const refetch = () => {
    proposals.forEach((p) => p.refetch());
  };

  return {
    proposals: data,
    isLoading,
    error,
    refetch,
  };
}

export function useProposal(proposalId: number) {
  const { proposals, isLoading, error, refetch } = useProposals([proposalId]);

  return {
    proposal: proposals[0],
    isLoading,
    error,
    refetch,
  };
}
