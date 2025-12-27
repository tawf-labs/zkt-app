'use client';

import { useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, ZKTCoreABI } from '@/lib/abi';
import { generateCampaignId } from './useCampaigns';
import { canProposeAdminAction, isMultisigSigner } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';

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
        
        if (isSigner) {
          toast({
            title: 'Multisig Transaction',
            description: 'This will create a proposal that requires approval from other signers',
            duration: 5000,
          });
        }

        console.log('Creating campaign on-chain:', {
          contract: CONTRACT_ADDRESSES.ZKTCore,
          campaignIdString: params.campaignId,
          campaignIdHash,
          startTime: params.startTime,
          endTime: params.endTime,
          isSigner,
        });

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
          title: isSigner ? 'Proposing Campaign' : 'Creating Campaign',
          description: isSigner 
            ? 'Creating multisig proposal. Other signers need to approve.'
            : 'Please confirm the transaction in your wallet...',
        });

        return {
          campaignId: params.campaignId,
          campaignIdHash,
          startTime: params.startTime,
          endTime: params.endTime,
          txHash: hash || 'pending',
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
    [isConnected, address, writeContract, hash, options]
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
    isLoading: isPending || isConfirming,
    isConfirmed,
    txHash: hash,
  };
}

