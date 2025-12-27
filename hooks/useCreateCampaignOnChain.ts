'use client';

import { useCallback, useState } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { DonationABI, DONATION_CONTRACT_ADDRESS } from '@/lib/donate';
import { toast } from '@/components/ui/use-toast';

interface UseCreateCampaignOnChainParams {
  campaignId: string;
  startTime: number;
  endTime: number;
}

interface UseCreateCampaignOnChainOptions {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export const useCreateCampaignOnChain = (options?: UseCreateCampaignOnChainOptions) => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContract, isPending, data: hash } = useWriteContract();

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

      setIsLoading(true);
      try {
        console.log('Creating campaign on-chain:', {
          contract: DONATION_CONTRACT_ADDRESS,
          campaignId: params.campaignId,
          startTime: params.startTime,
          endTime: params.endTime,
        });

        await writeContract({
          address: DONATION_CONTRACT_ADDRESS as `0x${string}`,
          abi: DonationABI,
          functionName: 'createCampaign',
          args: [
            params.campaignId as `0x${string}`,
            BigInt(params.startTime),
            BigInt(params.endTime),
          ],
        });

        // Wait for transaction to be included
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const finalHash = hash || 'pending';
        setTxHash(finalHash);

        toast({
          title: 'Success',
          description: `Campaign created on-chain! Tx: ${finalHash?.slice(0, 10)}...`,
        });

        options?.onSuccess?.(finalHash);

        return {
          campaignId: params.campaignId,
          startTime: params.startTime,
          endTime: params.endTime,
          txHash: finalHash,
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
        setIsLoading(false);
        return null;
      }
    },
    [isConnected, writeContract, hash, options]
  );

  return {
    createCampaignOnChain,
    isLoading: isLoading || isPending,
    txHash: txHash || hash,
  };
};
