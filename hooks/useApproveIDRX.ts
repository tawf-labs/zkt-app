'use client';

import { useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, MockIDRXABI } from '@/lib/abi';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to approve IDRX token spending for the ZKTCore contract
 * This must be called before donating
 */
export function useApproveIDRX() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check current allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.ZKTCore] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Approve IDRX spending
  const approve = useCallback(
    async (amountInIDRX: number) => {
      if (!address) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          variant: 'destructive',
        });
        return;
      }

      if (amountInIDRX <= 0) {
        toast({
          title: 'Invalid Amount',
          description: 'Amount must be greater than 0',
          variant: 'destructive',
        });
        return;
      }

      try {
        const amountInWei = parseUnits(amountInIDRX.toString(), 18);

        writeContract({
          address: CONTRACT_ADDRESSES.MockIDRX,
          abi: MockIDRXABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESSES.ZKTCore, amountInWei],
        });

        toast({
          title: 'Approving IDRX',
          description: 'Please confirm the transaction in your wallet...',
        });
      } catch (error: any) {
        console.error('Error approving IDRX:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to approve IDRX',
          variant: 'destructive',
        });
      }
    },
    [address, writeContract]
  );

  // Check if amount is already approved
  const isApproved = useCallback(
    (amountInIDRX: number): boolean => {
      if (!currentAllowance) return false;
      const amountInWei = parseUnits(amountInIDRX.toString(), 18);
      return currentAllowance >= amountInWei;
    },
    [currentAllowance]
  );

  // Handle success
  if (isConfirmed) {
    toast({
      title: 'Success!',
      description: 'IDRX spending approved',
    });
    refetchAllowance();
  }

  return {
    approve,
    isApproved,
    currentAllowance,
    isLoading: isPending || isConfirming,
    isConfirmed,
    hash,
    refetchAllowance,
  };
}
