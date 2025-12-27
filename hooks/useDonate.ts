'use client';

import { useCallback, useState } from 'react';
import { useContractWrite, useAccount } from 'wagmi';
import { DonationABI, DONATION_CONTRACT_ADDRESS, type DonationParams } from '@/lib/donate';
import { toast } from '@/components/ui/use-toast';

interface UseDonateOptions {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export const useDonate = (options?: UseDonateOptions) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const { write, isPending } = useContractWrite({
    address: DONATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: DonationABI,
    functionName: 'donate',
    onSuccess: (hash) => {
      toast({
        title: 'Success',
        description: `Donation submitted! Hash: ${hash}`,
      });
      options?.onSuccess?.(hash);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process donation',
        variant: 'destructive',
      });
      options?.onError?.(error);
    },
  });

  const donate = useCallback(
    async (params: DonationParams) => {
      if (!address) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);
      try {
        write({
          args: [params.campaignId as `0x${string}`, params.amount],
        });
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [address, write]
  );

  return {
    donate,
    isLoading: isLoading || isPending,
  };
};
