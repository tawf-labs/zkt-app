'use client';

import { useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, MockIDRXABI } from '@/lib/abi';
import { toast } from '@/components/ui/use-toast';

export function useFaucet() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Check if user can claim from faucet
  const { data: canClaim, refetch: refetchCanClaim } = useReadContract({
    address: CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI,
    functionName: 'canClaimFaucet',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  // Get time until next claim
  const { data: timeUntilNextClaim, refetch: refetchTimeUntilNextClaim } = useReadContract({
    address: CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI,
    functionName: 'timeUntilNextClaim',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Get last claim time
  const { data: lastClaimTime } = useReadContract({
    address: CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI,
    functionName: 'lastFaucetClaim',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get faucet amount
  const { data: faucetAmount } = useReadContract({
    address: CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI,
    functionName: 'FAUCET_AMOUNT',
  });

  // Get faucet cooldown
  const { data: faucetCooldown } = useReadContract({
    address: CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI,
    functionName: 'FAUCET_COOLDOWN',
  });

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Claim from faucet
  const claimFaucet = useCallback(async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }

    if (!canClaim) {
      toast({
        title: 'Cannot Claim',
        description: 'You need to wait before claiming again',
        variant: 'destructive',
      });
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESSES.MockIDRX,
        abi: MockIDRXABI,
        functionName: 'faucet',
      });

      toast({
        title: 'Claiming IDRX',
        description: 'Please confirm the transaction in your wallet...',
      });
    } catch (error: any) {
      console.error('Error claiming from faucet:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to claim from faucet',
        variant: 'destructive',
      });
    }
  }, [address, canClaim, writeContract]);

  // Refetch all data
  const refetch = useCallback(() => {
    refetchCanClaim();
    refetchTimeUntilNextClaim();
  }, [refetchCanClaim, refetchTimeUntilNextClaim]);

  // Show success toast when transaction is confirmed
  if (isConfirmed) {
    toast({
      title: 'Success!',
      description: 'IDRX claimed successfully',
    });
    refetch();
  }

  return {
    claimFaucet,
    canClaim: canClaim as boolean | undefined,
    timeUntilNextClaim: timeUntilNextClaim as bigint | undefined,
    lastClaimTime: lastClaimTime as bigint | undefined,
    faucetAmount: faucetAmount as bigint | undefined,
    faucetCooldown: faucetCooldown as bigint | undefined,
    isLoading: isPending || isConfirming,
    isConfirmed,
    hash,
    refetch,
  };
}
