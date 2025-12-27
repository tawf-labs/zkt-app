'use client';

import { useCallback, useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, ZKTCoreABI } from '@/lib/abi';
import { generateCampaignId } from './useCampaigns';
import { useApproveIDRX } from './useApproveIDRX';
import { toast } from '@/components/ui/use-toast';

interface UseDonateOptions {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export function useDonate(options?: UseDonateOptions) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { approve, isApproved, isLoading: isApproving, isConfirmed: isApproveConfirmed } = useApproveIDRX();
  
  const [pendingDonation, setPendingDonation] = useState<{
    campaignIdString: string;
    amount: number;
  } | null>(null);

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Auto-donate after approval is confirmed
  useEffect(() => {
    if (isApproveConfirmed && pendingDonation) {
      executeDonation(pendingDonation.campaignIdString, pendingDonation.amount);
      setPendingDonation(null);
    }
  }, [isApproveConfirmed, pendingDonation]);

  const executeDonation = useCallback(
    async (campaignIdString: string, amountInIDRX: number) => {
      try {
        // Generate campaignID from string (keccak256 hash)
        const campaignId = generateCampaignId(campaignIdString);
        
        // Convert amount to wei (IDRX has 18 decimals)
        const amountInWei = parseUnits(amountInIDRX.toString(), 18);

        writeContract({
          address: CONTRACT_ADDRESSES.ZKTCore,
          abi: ZKTCoreABI,
          functionName: 'donate',
          args: [campaignId, amountInWei],
        });

        toast({
          title: 'Processing Donation',
          description: 'Please confirm the transaction...',
        });
      } catch (error: any) {
        console.error('Error donating:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to process donation',
          variant: 'destructive',
        });
        options?.onError?.(error);
      }
    },
    [writeContract, options]
  );

  const donate = useCallback(
    async (campaignIdString: string, amountInIDRX: number) => {
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
          description: 'Donation amount must be greater than 0',
          variant: 'destructive',
        });
        return;
      }

      try {
        // Check if already approved
        if (isApproved(amountInIDRX)) {
          // Already approved, proceed with donation
          await executeDonation(campaignIdString, amountInIDRX);
        } else {
          // Need approval first
          toast({
            title: 'Step 1/2: Approve',
            description: 'Approving IDRX spending...',
          });
          
          // Store pending donation
          setPendingDonation({ campaignIdString, amount: amountInIDRX });
          
          // Request approval
          await approve(amountInIDRX);
        }
      } catch (error: any) {
        console.error('Error in donation flow:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to process donation',
          variant: 'destructive',
        });
        options?.onError?.(error);
      }
    },
    [address, isApproved, approve, executeDonation, options]
  );

  // Handle success
  if (isConfirmed && hash) {
    toast({
      title: 'Success!',
      description: 'Donation completed successfully',
    });
    options?.onSuccess?.(hash);
  }

  return {
    donate,
    isLoading: isPending || isConfirming || isApproving,
    isConfirmed,
    hash,
  };
}

