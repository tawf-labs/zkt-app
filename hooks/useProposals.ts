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
}

export function useProposals(proposalIds: number[] = [0, 1, 2, 3]) {
  const result = useReadContracts({
    contracts: proposalIds.map((id) => ({
      address: CONTRACT_ADDRESSES.ZKTCore,
      abi: ZKTCoreABI,
      functionName: "getProposal",
      args: [BigInt(id)],
    })),
    query: {
      staleTime: 30_000, // 30 seconds
      gcTime: 300_000, // 5 minutes
    },
  });

  const isLoading = result.isLoading;
  const error = result.error;

  const data: Proposal[] = (result.data || [])
    .map((proposalData, index) => {
      if (
        !proposalData ||
        typeof proposalData !== "object" ||
        !("result" in proposalData)
      ) {
        return null;
      }

      const prop = proposalData.result as {
        title?: string;
        description?: string;
        proposer?: string;
        votesFor?: bigint;
        votesAgainst?: bigint;
        endTime?: bigint;
        executed?: boolean;
      } | null;

      return {
        id: BigInt(proposalIds[index]),
        title: prop?.title || `Proposal ${proposalIds[index]}`,
        description: prop?.description || "",
        proposer: prop?.proposer || "",
        votesFor: prop?.votesFor || BigInt(0),
        votesAgainst: prop?.votesAgainst || BigInt(0),
        votesAbstain: BigInt(0),
        startTime: BigInt(0),
        endTime: prop?.endTime || BigInt(0),
        executed: prop?.executed || false,
        cancelled: false,
        proposalType: "general",
      };
    })
    .filter((p): p is Proposal => p !== null);

  const refetch = () => {
    result.refetch();
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
