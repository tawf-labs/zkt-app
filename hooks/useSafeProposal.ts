'use client';

import { useState } from 'react';
import SafeApiKit from '@safe-global/api-kit';
import Safe from '@safe-global/protocol-kit';
import { encodeFunctionData } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';
import { MULTISIG_ADMIN_ADDRESS } from '@/lib/constants';
import { ZKTCoreABI } from '@/lib/abi';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Base Sepolia chainId
const BASE_SEPOLIA_CHAIN_ID = BigInt(84532);

// Safe Transaction Service URL for Base Sepolia
const SAFE_SERVICE_URL = 'https://safe-transaction-base-sepolia.safe.global';

interface ProposeTransactionParams {
  to: `0x${string}`;
  value?: string;
  data: `0x${string}`;
  operation?: number; // 0 = CALL, 1 = DELEGATECALL
}

export function useSafeProposal() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isProposing, setIsProposing] = useState(false);
  const [proposalHash, setProposalHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const proposeTransaction = async (params: ProposeTransactionParams) => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsProposing(true);
    setError(null);
    
    try {
      // Initialize Safe API Kit
      const safeApiKit = new SafeApiKit({
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      // Initialize Protocol Kit with the Safe address
      const protocolKit = await Safe.init({
        provider: walletClient.transport.url || window.ethereum,
        signer: address,
        safeAddress: MULTISIG_ADMIN_ADDRESS,
      });

      // Create the transaction
      const safeTransaction = await protocolKit.createTransaction({
        transactions: [
          {
            to: params.to,
            value: params.value || '0',
            data: params.data,
            operation: params.operation || 0,
          },
        ],
      });

      // Get the transaction hash
      const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);

      // Sign the transaction
      const signature = await protocolKit.signHash(safeTxHash);

      // Propose the transaction to the Safe service
      await safeApiKit.proposeTransaction({
        safeAddress: MULTISIG_ADMIN_ADDRESS,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: address,
        senderSignature: signature.data,
      });

      setProposalHash(safeTxHash);
      return safeTxHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to propose transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProposing(false);
    }
  };

  // Helper function to propose createCampaign transaction
  const proposeCreateCampaign = async (
    contractAddress: `0x${string}`,
    campaignId: `0x${string}`,
    startTime: bigint,
    endTime: bigint
  ) => {
    const data = encodeFunctionData({
      abi: ZKTCoreABI,
      functionName: 'createCampaign',
      args: [campaignId, startTime, endTime],
    });

    return proposeTransaction({
      to: contractAddress,
      data,
      value: '0',
    });
  };

  return {
    proposeTransaction,
    proposeCreateCampaign,
    isProposing,
    proposalHash,
    error,
  };
}
