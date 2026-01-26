'use client';

import { useCallback, useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';
import { toast } from '@/components/ui/use-toast';

interface UseLockAllocationsOptions {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to lock allocations for a campaign
 *
 * PREREQUISITES:
 * 1. Campaign must exist on-chain (created via createCampaign)
 * 2. Allocations must be set (via setAllocation)
 * 3. Total allocations must equal 100%
 *
 * After locking:
 * - Allocations cannot be changed
 * - Campaign can accept donations
 */
export const useLockAllocations = (options?: UseLockAllocationsOptions) => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  const lockAllocations = useCallback(
    async (campaignIdHash: string) => {
      // Validation: Wallet connected
      if (!isConnected || !address) {
        const errorMsg = 'Please connect your wallet first';
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw new Error(errorMsg);
      }

      // Validation: Campaign ID
      if (!campaignIdHash || !campaignIdHash.startsWith('0x')) {
        const errorMsg = 'Campaign ID is required';
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        throw new Error(errorMsg);
      }

      setIsLoading(true);

      try {

        // Execute transaction
        const hash = await writeContractAsync({
          address: ZKT_CAMPAIGN_POOL_ADDRESS,
          abi: ZKTCampaignPoolABI,
          functionName: 'lockAllocation',
          args: [campaignIdHash as `0x${string}`],
        });

        setTxHash(hash);

        toast({
          title: '🔒 Success!',
          description: 'Campaign allocations locked. Ready for donations!',
        });


        options?.onSuccess?.(hash);
        return { txHash: hash };

      } catch (error: any) {
        console.error('❌ Error locking allocations:', error);

        let errorMsg = 'Failed to lock allocations';

        if (error?.message?.includes('user rejected')) {
          errorMsg = 'Transaction rejected by user';
        } else if (error?.message?.includes('Campaign does not exist')) {
          errorMsg = 'Campaign does not exist. Create campaign first!';
        } else if (error?.message?.includes('Allocation not complete')) {
          errorMsg = 'Total allocation must be 100% before locking';
        } else if (error?.message?.includes('Already locked')) {
          errorMsg = 'Allocation is already locked';
        } else if (error?.reason) {
          errorMsg = error.reason;
        } else if (error?.message) {
          errorMsg = error.message;
        }

        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });

        options?.onError?.(error as Error);
        throw error;

      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, address, writeContractAsync, options]
  );

  return {
    lockAllocations,
    isLoading,
    txHash,
  };
};
