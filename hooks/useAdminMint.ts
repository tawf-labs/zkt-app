'use client';

import { useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, MockIDRXABI, parseIDRX } from '@/lib/abi';
import { isMultisigAdmin, ADMIN_ROLE } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';

export function useAdminMint() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Check if current user has admin role
  const { data: hasAdminRole } = useReadContract({
    address: CONTRACT_ADDRESSES.MockIDRX,
    abi: MockIDRXABI,
    functionName: 'hasRole',
    args: [ADMIN_ROLE, address || '0x0'],
    query: {
      enabled: !!address,
    },
  });

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Mint tokens to an address (admin only)
  const adminMint = useCallback(
    async (to: string, amount: number) => {
      if (!address) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          variant: 'destructive',
        });
        return;
      }

      // Check if user is multisig admin
      if (!isMultisigAdmin(address)) {
        toast({
          title: 'Unauthorized',
          description: 'Only the multisig admin can mint tokens',
          variant: 'destructive',
        });
        return;
      }

      // Validate inputs
      if (!to || to === '0x0' || to.length !== 42) {
        toast({
          title: 'Invalid Address',
          description: 'Please provide a valid recipient address',
          variant: 'destructive',
        });
        return;
      }

      if (amount <= 0) {
        toast({
          title: 'Invalid Amount',
          description: 'Amount must be greater than 0',
          variant: 'destructive',
        });
        return;
      }

      try {
        const amountInWei = parseIDRX(amount);

        writeContract({
          address: CONTRACT_ADDRESSES.MockIDRX,
          abi: MockIDRXABI,
          functionName: 'adminMint',
          args: [to as `0x${string}`, amountInWei],
        });

        toast({
          title: 'Minting Tokens',
          description: `Minting ${amount} IDRX to ${to.slice(0, 6)}...${to.slice(-4)}`,
        });
      } catch (error: any) {
        console.error('Error minting tokens:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to mint tokens',
          variant: 'destructive',
        });
      }
    },
    [address, writeContract]
  );

  // Show success toast when transaction is confirmed
  if (isConfirmed) {
    toast({
      title: 'Success!',
      description: 'Tokens minted successfully',
    });
  }

  return {
    adminMint,
    isAdmin: isMultisigAdmin(address) || hasAdminRole,
    isLoading: isPending || isConfirming,
    isConfirmed,
    hash,
  };
}
