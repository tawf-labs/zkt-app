'use client';

import { useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, MockIDRXABI } from '@/lib/abi';
import { isMultisigAdmin, ADMIN_ROLE, DEFAULT_ADMIN_ROLE } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';

export function useRoleManagement() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if address has a specific role
  const useHasRole = (role: `0x${string}`, account?: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.MockIDRX,
      abi: MockIDRXABI,
      functionName: 'hasRole',
      args: [role, (account || address) as `0x${string}`],
      query: {
        enabled: !!(account || address),
      },
    });
  };

  // Grant a role to an address (admin only)
  const grantRole = useCallback(
    async (role: `0x${string}`, account: string) => {
      if (!address) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          variant: 'destructive',
        });
        return;
      }

      if (!isMultisigAdmin(address)) {
        toast({
          title: 'Unauthorized',
          description: 'Only the admin can grant roles',
          variant: 'destructive',
        });
        return;
      }

      if (!account || account.length !== 42) {
        toast({
          title: 'Invalid Address',
          description: 'Please provide a valid address',
          variant: 'destructive',
        });
        return;
      }

      try {
        writeContract({
          address: CONTRACT_ADDRESSES.MockIDRX,
          abi: MockIDRXABI,
          functionName: 'grantRole',
          args: [role, account as `0x${string}`],
        });

        toast({
          title: 'Granting Role',
          description: `Granting role to ${account.slice(0, 6)}...${account.slice(-4)}`,
        });
      } catch (error: any) {
        console.error('Error granting role:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to grant role',
          variant: 'destructive',
        });
      }
    },
    [address, writeContract]
  );

  // Revoke a role from an address (admin only)
  const revokeRole = useCallback(
    async (role: `0x${string}`, account: string) => {
      if (!address) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          variant: 'destructive',
        });
        return;
      }

      if (!isMultisigAdmin(address)) {
        toast({
          title: 'Unauthorized',
          description: 'Only the admin can revoke roles',
          variant: 'destructive',
        });
        return;
      }

      if (!account || account.length !== 42) {
        toast({
          title: 'Invalid Address',
          description: 'Please provide a valid address',
          variant: 'destructive',
        });
        return;
      }

      try {
        writeContract({
          address: CONTRACT_ADDRESSES.MockIDRX,
          abi: MockIDRXABI,
          functionName: 'revokeRole',
          args: [role, account as `0x${string}`],
        });

        toast({
          title: 'Revoking Role',
          description: `Revoking role from ${account.slice(0, 6)}...${account.slice(-4)}`,
        });
      } catch (error: any) {
        console.error('Error revoking role:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to revoke role',
          variant: 'destructive',
        });
      }
    },
    [address, writeContract]
  );

  // Renounce own role
  const renounceRole = useCallback(
    async (role: `0x${string}`) => {
      if (!address) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          variant: 'destructive',
        });
        return;
      }

      try {
        writeContract({
          address: CONTRACT_ADDRESSES.MockIDRX,
          abi: MockIDRXABI,
          functionName: 'renounceRole',
          args: [role, address as `0x${string}`],
        });

        toast({
          title: 'Renouncing Role',
          description: 'Renouncing your role...',
        });
      } catch (error: any) {
        console.error('Error renouncing role:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to renounce role',
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
      description: 'Role operation completed successfully',
    });
  }

  return {
    grantRole,
    revokeRole,
    renounceRole,
    useHasRole,
    isAdmin: isMultisigAdmin(address),
    isLoading: isPending || isConfirming,
    isConfirmed,
    hash,
  };
}
