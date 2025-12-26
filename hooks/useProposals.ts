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
  // New pool-based fields
  fundingGoal?: bigint;
  kycStatus?: number;
  isEmergency?: boolean;
  kycNotes?: string;
  createdAt?: bigint;
  status?: number;
  campaignType?: number;
  poolId?: bigint;
  zakatChecklistItems?: string[];
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

      const mappedProposal: Proposal = {
        id: BigInt(proposalIds[index]),
        title: prop.title || `Proposal ${proposalIds[index]}`,
        description: prop.description || "",
        proposer: prop.organizer || prop.proposer || "",
        votesFor: prop.votesFor || BigInt(0),
        votesAgainst: prop.votesAgainst || BigInt(0),
        votesAbstain: prop.votesAbstain || BigInt(0),
        startTime: prop.communityVoteStart || BigInt(0),
        endTime: prop.communityVoteEnd || prop.endTime || BigInt(0),
        executed: prop.executed || false,
        cancelled: false,
        proposalType: prop.isEmergency ? "emergency" : prop.campaignType === 1 ? "zakat" : "general",
        // New pool-based fields
        fundingGoal: prop.fundingGoal || BigInt(0),
        kycStatus: prop.kycStatus || 0,
        isEmergency: prop.isEmergency || false,
        kycNotes: prop.kycNotes || "",
        createdAt: prop.createdAt || BigInt(0),
        status: prop.status || 0,
        campaignType: prop.campaignType || 0,
        poolId: prop.poolId || BigInt(0),
        zakatChecklistItems: prop.zakatChecklistItems || [],
      };

      return mappedProposal;
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
