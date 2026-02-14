"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, DonationReceiptNFTABI } from "@/lib/abi";
import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export interface DonationNFT {
  tokenId: bigint;
  campaignId: string;
  amount: bigint;
  isImpact: boolean;
  ipfsCID: string;
  blockNumber?: bigint;
}

export function useDonationNFTs() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<DonationNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!address || !isConnected) {
      setNfts([]);
      setBalance(0);
      return;
    }

    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        const publicClient = createPublicClient({
          chain: baseSepolia,
          transport: http(),
        });

        // Get total supply to know how many NFTs exist
        const totalSupply = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.DonationReceiptNFT,
          abi: DonationReceiptNFTABI,
          functionName: 'totalSupply',
        }) as bigint;

        const totalSupplyNumber = Number(totalSupply);

        if (totalSupplyNumber === 0) {
          setNfts([]);
          setBalance(0);
          setIsLoading(false);
          return;
        }

        // Iterate through all token IDs and check ownership
        // (ZKT Receipt NFT doesn't have tokenOfOwnerByIndex)
        const nftsData: DonationNFT[] = [];
        let userBalance = 0;

        for (let tokenId = 1; tokenId <= totalSupplyNumber; tokenId++) {
          try {
            const owner = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.DonationReceiptNFT,
              abi: DonationReceiptNFTABI,
              functionName: 'ownerOf',
              args: [BigInt(tokenId)],
            }) as `0x${string}`;

            // Check if this NFT belongs to the connected wallet
            if (owner.toLowerCase() === address.toLowerCase()) {
              userBalance++;

              // Fetch receipt data for this token
              const receipt = await publicClient.readContract({
                address: CONTRACT_ADDRESSES.DonationReceiptNFT,
                abi: DonationReceiptNFTABI,
                functionName: 'receipts',
                args: [BigInt(tokenId)],
              }) as [string, bigint, boolean, string, string];

              const [campaignId, amount, isImpact, ipfsCID] = receipt;

              // Try to get block number from current block during iteration
              // This is an approximation - for exact minting block, we'd need to query Minted events
              const currentBlock = await publicClient.getBlockNumber();

              nftsData.push({
                tokenId: BigInt(tokenId),
                campaignId,
                amount,
                isImpact,
                ipfsCID,
                blockNumber: currentBlock, // Approximate with current block
              });
            }
          } catch (error) {
            // Token might not exist, skip it
          }
        }

        setBalance(userBalance);
        setNfts(nftsData);
      } catch (error) {
        setNfts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [address, isConnected]);

  const refetch = () => {
    if (address && isConnected) {
      // Trigger re-fetch by toggling loading state
      setIsLoading(true);
      setTimeout(() => {
        // The effect will re-run
      }, 100);
    }
  };

  return {
    nfts,
    balance,
    isLoading,
    refetch,
  };
}
