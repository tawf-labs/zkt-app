'use client';

import { useCallback, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, ZKTCoreABI } from '@/lib/abi';
import { generateCampaignId } from './useCampaigns';
import { canProposeAdminAction, isMultisigSigner } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';
import { useSafeProposal } from './useSafeProposal';

interface UseCreateCampaignOnChainParams {
  campaignId: string; // String identifier that will be hashed
  startTime: number;
  endTime: number;
}

interface UseCreateCampaignOnChainOptions {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export function useCreateCampaignOnChain(options?: UseCreateCampaignOnChainOptions) {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { proposeCreateCampaign, isProposing, proposalHash } = useSafeProposal();
  const [safeProposalHash, setSafeProposalHash] = useState<string | null>(null);

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const createCampaignOnChain = useCallback(
    async (params: UseCreateCampaignOnChainParams) => {
      if (!isConnected) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          variant: 'destructive',
        });
        return null;
      }

      // Check if user can propose admin actions (multisig admin or signer)
      if (!canProposeAdminAction(address)) {
        toast({
          title: 'Unauthorized',
          description: 'Only multisig admin or signers can create campaigns',
          variant: 'destructive',
        });
        return null;
      }

      // Validate times
      const now = Math.floor(Date.now() / 1000);
      if (params.endTime <= params.startTime) {
        toast({
          title: 'Error',
          description: 'End time must be after start time',
          variant: 'destructive',
        });
        return null;
      }

      if (params.endTime <= now) {
        toast({
          title: 'Error',
          description: 'End time must be in the future',
          variant: 'destructive',
        });
        return null;
      }

      try {
        // Generate campaignID from string (keccak256 hash)
        const campaignIdHash = generateCampaignId(params.campaignId);
        
        // Check if connected with a signer (not the multisig itself)
        const isSigner = isMultisigSigner(address);
        
        console.log('Creating campaign on-chain:', {
          contract: CONTRACT_ADDRESSES.ZKTCore,
          campaignIdString: params.campaignId,
          campaignIdHash,
          startTime: params.startTime,
          endTime: params.endTime,
          isSigner,
        });

        // If signer, create Safe proposal instead of direct transaction
        if (isSigner) {
          toast({
            title: 'Creating Safe Proposal',
            description: 'Proposing transaction to Safe multisig. Other signers need to approve.',
            duration: 5000,
          });

          const safeTxHash = await proposeCreateCampaign(
            CONTRACT_ADDRESSES.ZKTCore,
            campaignIdHash,
            BigInt(params.startTime),
            BigInt(params.endTime)
          );

          setSafeProposalHash(safeTxHash);

          toast({
            title: 'Proposal Created!',
            description: 'Transaction proposed to Safe. Check Safe dashboard for approval.',
          });

          return {
            campaignId: params.campaignId,
            campaignIdHash,
            startTime: params.startTime,
            endTime: params.endTime,
            txHash: safeTxHash,
            isSafeProposal: true,
          };
        }

        // Direct execution for multisig admin
        writeContract({
          address: CONTRACT_ADDRESSES.ZKTCore,
          abi: ZKTCoreABI,
          functionName: 'createCampaign',
          args: [
            campaignIdHash,
            BigInt(params.startTime),
            BigInt(params.endTime),
          ],
        });

        toast({
          title: 'Creating Campaign',
          description: 'Please confirm the transaction in your wallet...',
        });

        return {
          campaignId: params.campaignId,
          campaignIdHash,
          startTime: params.startTime,
          endTime: params.endTime,
          txHash: hash || 'pending',
          isSafeProposal: false,
        };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        console.error('Error creating campaign on-chain:', err);
        
        toast({
          title: 'Error',
          description: err.message || 'Failed to create campaign on-chain',
          variant: 'destructive',
        });
        
        options?.onError?.(err);
        return null;
      }
    },
    [isConnected, address, writeContract, hash, proposeCreateCampaign, options]
  );

  // Handle success
  if (isConfirmed && hash) {
    toast({
      title: 'Success!',
      description: 'Campaign created on blockchain',
    });
    options?.onSuccess?.(hash);
  }

  return {
    createCampaignOnChain,
    isLoading: isPending || isConfirming || isProposing,
    isConfirmed,
    txHash: hash,
    safeProposalHash,
  };
}

