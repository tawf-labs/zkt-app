"use client";

import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESSES, ZKTCoreABI } from "@/lib/abi";
import { formatAddress, formatTimestamp } from "@/lib/abi";

export type TransactionType = 'all' | 'donation' | 'campaign' | 'proposal' | 'vote';

export interface BlockchainTransaction {
  hash: string;
  type: TransactionType;
  from: string;
  to?: string;
  amount?: bigint;
  timestamp: number;
  blockNumber: bigint;
  description: string;
  status: 'success' | 'pending' | 'failed';
}

export function useTransactionHistory(blockRange: number = 10000) {
  const publicClient = usePublicClient();
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      if (!publicClient) return;

      try {
        setIsLoading(true);
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock - BigInt(blockRange);

        // Query all relevant events
        const [donationLogs, campaignLogs, proposalLogs, voteLogs] = await Promise.all([
          // DonationReceived events
          publicClient.getLogs({
            address: CONTRACT_ADDRESSES.ZKTCore,
            event: {
              type: 'event',
              name: 'DonationReceived',
              inputs: [
                { name: 'donor', type: 'address', indexed: true },
                { name: 'campaignId', type: 'uint256', indexed: true },
                { name: 'amount', type: 'uint256', indexed: false },
                { name: 'receiptTokenId', type: 'uint256', indexed: false },
              ],
            },
            fromBlock,
            toBlock: 'latest',
          }),
          
          // CampaignCreated events
          publicClient.getLogs({
            address: CONTRACT_ADDRESSES.ZKTCore,
            event: {
              type: 'event',
              name: 'CampaignCreated',
              inputs: [
                { name: 'campaignId', type: 'uint256', indexed: true },
                { name: 'organization', type: 'address', indexed: true },
                { name: 'name', type: 'string', indexed: false },
                { name: 'targetAmount', type: 'uint256', indexed: false },
              ],
            },
            fromBlock,
            toBlock: 'latest',
          }),
          
          // ProposalCreated events
          publicClient.getLogs({
            address: CONTRACT_ADDRESSES.ZKTCore,
            event: {
              type: 'event',
              name: 'ProposalCreated',
              inputs: [
                { name: 'proposalId', type: 'uint256', indexed: true },
                { name: 'proposer', type: 'address', indexed: true },
                { name: 'title', type: 'string', indexed: false },
              ],
            },
            fromBlock,
            toBlock: 'latest',
          }),
          
          // VoteCast events
          publicClient.getLogs({
            address: CONTRACT_ADDRESSES.ZKTCore,
            event: {
              type: 'event',
              name: 'VoteCast',
              inputs: [
                { name: 'voter', type: 'address', indexed: true },
                { name: 'proposalId', type: 'uint256', indexed: true },
                { name: 'support', type: 'bool', indexed: false },
              ],
            },
            fromBlock,
            toBlock: 'latest',
          }),
        ]);

        // Process and format transactions
        const formattedTransactions: BlockchainTransaction[] = [];

        // Process donation events
        for (const log of donationLogs) {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
          const args = log.args as any;
          
          formattedTransactions.push({
            hash: log.transactionHash || '0x',
            type: 'donation',
            from: args.donor || '0x',
            to: CONTRACT_ADDRESSES.ZKTCore,
            amount: args.amount as bigint,
            timestamp: Number(block.timestamp),
            blockNumber: log.blockNumber,
            description: `Donation to Campaign #${args.campaignId?.toString()}`,
            status: 'success',
          });
        }

        // Process campaign events
        for (const log of campaignLogs) {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
          const args = log.args as any;
          
          formattedTransactions.push({
            hash: log.transactionHash || '0x',
            type: 'campaign',
            from: args.organization || '0x',
            to: CONTRACT_ADDRESSES.ZKTCore,
            timestamp: Number(block.timestamp),
            blockNumber: log.blockNumber,
            description: `Created campaign: ${args.name || 'Unknown Campaign'}`,
            status: 'success',
          });
        }

        // Process proposal events
        for (const log of proposalLogs) {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
          const args = log.args as any;
          
          formattedTransactions.push({
            hash: log.transactionHash || '0x',
            type: 'proposal',
            from: args.proposer || '0x',
            to: CONTRACT_ADDRESSES.ZKTCore,
            timestamp: Number(block.timestamp),
            blockNumber: log.blockNumber,
            description: `Created proposal: ${args.title || 'Unknown Proposal'}`,
            status: 'success',
          });
        }

        // Process vote events
        for (const log of voteLogs) {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
          const args = log.args as any;
          
          formattedTransactions.push({
            hash: log.transactionHash || '0x',
            type: 'vote',
            from: args.voter || '0x',
            to: CONTRACT_ADDRESSES.ZKTCore,
            timestamp: Number(block.timestamp),
            blockNumber: log.blockNumber,
            description: `Voted ${args.support ? 'FOR' : 'AGAINST'} on Proposal #${args.proposalId?.toString()}`,
            status: 'success',
          });
        }

        // Sort by timestamp descending (newest first)
        formattedTransactions.sort((a, b) => b.timestamp - a.timestamp);

        setTransactions(formattedTransactions);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, [publicClient, blockRange]);

  return { transactions, isLoading, error };
}
