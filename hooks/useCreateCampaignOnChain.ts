'use client';

import { useCallback, useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { DONATION_CONTRACT_ADDRESS, DonationABI } from '@/lib/donate';
import { toast } from '@/components/ui/use-toast';
import { pad, toHex } from 'viem';

interface UseCreateCampaignOnChainParams {
  campaignId: number;
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

  const { writeContractAsync } = useWriteContract();

  const createCampaignOnChain = useCallback(
    async (params: UseCreateCampaignOnChainParams) => {
      if (!isConnected || !address) {
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
        // Convert numeric campaignId to bytes32
        const campaignIdBytes32 = pad(toHex(BigInt(params.campaignId)), { size: 32 });

        const txHash = await writeContractAsync({
          address: DONATION_CONTRACT_ADDRESS as `0x${string}`,
          abi: DonationABI,
          functionName: 'createCampaign',
          args: [
            campaignIdBytes32,
            BigInt(params.startTime),
            BigInt(params.endTime),
          ],
        });

        setTxHash(txHash);

        toast({
          title: 'Success',
          description: `Campaign created on-chain! Campaign ID: ${params.campaignId}`,
        });

        options?.onSuccess?.(txHash);

        return {
          campaignId: params.campaignId,
          txHash: txHash,
        };
      } catch (error: any) {
        const errorMsg = error?.reason || error?.message || 'Unknown error';
        console.error('❌ Error creating campaign on-chain:', {
          message: errorMsg,
          code: error?.code,
          cause: error?.cause,
        });

        toast({
          title: 'Error',
          description: `Failed to create campaign: ${errorMsg}`,
          variant: 'destructive',
        });

        options?.onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, address, writeContractAsync, options]
  );

  return {
    createCampaignOnChain,
    isLoading,
    txHash,
  };
};
