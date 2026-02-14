/**
 * SAFE MULTISIG INTEGRATION
 *
 * This hook provides Safe multisig functionality for campaign creation.
 *
 * Safe Address: 0xD264BE80817EAfaC5F7575698913FEc4cB38a016
 * Requires: 3/7 signatures for execution
 */
'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { toast } from '@/components/ui/use-toast'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool'
import { saveCampaignData, type CampaignData } from '@/lib/supabase-client-auth'

export interface NGOAllocation {
  ngoId: string
  ngoName: string
  bps: number
}

export interface CreateCampaignWithSafeParams {
  campaignId: string
  startTime: number
  endTime: number
  title?: string
  description?: string
  category?: string
  location?: string
  goal?: number
  organizationName?: string
  organizationVerified?: boolean
  imageUrls?: string[]
  tags?: string[]
}

export interface CreateCampaignWithAllocationsParams extends CreateCampaignWithSafeParams {
  allocations: NGOAllocation[]
}

export interface CreateCampaignWithSafeResult {
  isLoading: boolean
  error: string | null
  safeTxHash: string | null
  createCampaignWithSafe: (params: CreateCampaignWithSafeParams) => Promise<{ safeTxHash: string }>
  createCampaignWithAllocations: (params: CreateCampaignWithAllocationsParams) => Promise<{ safeTxHash: string }>
  isHydrated: boolean
}

const SAFE_ADDRESS = '0xD264BE80817EAfaC5F7575698913FEc4cB38a016'
const CONTRACT_ADDRESS = ZKT_CAMPAIGN_POOL_ADDRESS

/**
 * Hook for creating campaigns via Safe multisig
 */
export const useCreateCampaignWithSafe = (): CreateCampaignWithSafeResult => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [safeTxHash, setSafeTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const createCampaignWithSafe = useCallback(
    async (params: CreateCampaignWithSafeParams) => {
      if (!isConnected || !address) {
        throw new Error('Please connect your wallet first')
      }

      if (!walletClient) {
        throw new Error('Wallet client not available')
      }

      // Validate params
      if (!params.campaignId || params.campaignId.length === 0) {
        throw new Error('Campaign ID is required')
      }
      if (!params.startTime || params.startTime <= 0) {
        throw new Error('Start time must be a valid timestamp')
      }
      if (!params.endTime || params.endTime <= params.startTime) {
        throw new Error('End time must be after start time')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Get provider from window.ethereum (ethers v5)
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)

        // Initialize Protocol Kit - for Protocol Kit v6 with ethers v5
        const protocolKit = await Safe.init({
          provider: (window as any).ethereum,
          signer: address,
          safeAddress: SAFE_ADDRESS
        })

        // Encode transaction data using ZKTCampaignPool ABI (ethers v5)
        const iface = new ethers.utils.Interface(ZKTCampaignPoolABI)
        const data = iface.encodeFunctionData('createCampaign', [
          params.campaignId,
          params.startTime,
          params.endTime
        ])

        // Create Safe transaction
        const safeTransaction = await protocolKit.createTransaction({
          transactions: [{
            to: CONTRACT_ADDRESS,
            value: '0',
            data
          }]
        })

        const signedSafeTx = await protocolKit.signTransaction(safeTransaction)
        const safeTxHash = await protocolKit.getTransactionHash(signedSafeTx)

        // Get signature
        const signature = signedSafeTx.signatures.get(address.toLowerCase())
        if (!signature) {
          throw new Error('Failed to get signature')
        }

        // Initialize API Kit
        const apiKit = new SafeApiKit({
          chainId: BigInt(84532), // Base Sepolia
          txServiceUrl: 'https://safe-transaction-base-sepolia.safe.global/api'
        })

        // Propose transaction
        await apiKit.proposeTransaction({
          safeAddress: SAFE_ADDRESS,
          safeTransactionData: safeTransaction.data,
          safeTxHash,
          senderAddress: address,
          senderSignature: signature.data
        })

        setSafeTxHash(safeTxHash)

        // Save campaign metadata to Supabase immediately after Safe approval
        if (params.title && params.description && params.location && params.organizationName) {
          try {
            const campaignData: CampaignData = {
              campaignId: params.campaignId,
              title: params.title,
              description: params.description,
              category: params.category || 'Other',
              location: params.location,
              goal: params.goal || 0,
              organizationName: params.organizationName,
              organizationVerified: params.organizationVerified || false,
              imageUrls: params.imageUrls || [],
              tags: params.tags || [],
              startTime: params.startTime,
              endTime: params.endTime,
              status: 'pending_execution',
              safeTxHash: safeTxHash,
            }

            await saveCampaignData(campaignData)

            toast({
              title: '✅ Campaign Metadata Saved!',
              description: 'Campaign will appear after Safe executes the transaction.',
            })
          } catch (dbError) {
            // Don't throw error - the on-chain transaction is still valid
            toast({
              title: '⚠️ Metadata Save Failed',
              description: 'Campaign created on-chain but metadata not saved. You may need to try again.',
              variant: 'destructive',
            })
          }
        }

        toast({
          title: '✅ Campaign Proposed!',
          description: 'Transaction proposed to Safe. Waiting for confirmations from all signers.',
        })

        return { safeTxHash }

      } catch (err: any) {
        const errorMsg = err?.message || String(err)
        setError(errorMsg)

        toast({
          title: '❌ Failed',
          description: errorMsg,
          variant: 'destructive',
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [address, isConnected, walletClient]
  )

  /**
   * Create a campaign with allocations in a single Safe transaction
   * This bundles createCampaign, setAllocation (for each NGO), and lockAllocation
   * into one atomic transaction that executes when Safe signers approve
   */
  const createCampaignWithAllocations = useCallback(
    async (params: CreateCampaignWithAllocationsParams) => {
      if (!isConnected || !address) {
        throw new Error('Please connect your wallet first')
      }

      if (!walletClient) {
        throw new Error('Wallet client not available')
      }

      // Validate params
      if (!params.campaignId || params.campaignId.length === 0) {
        throw new Error('Campaign ID is required')
      }
      if (!params.startTime || params.startTime <= 0) {
        throw new Error('Start time must be a valid timestamp')
      }
      if (!params.endTime || params.endTime <= params.startTime) {
        throw new Error('End time must be after start time')
      }

      // Validate allocations
      if (!params.allocations || params.allocations.length === 0) {
        throw new Error('At least one allocation is required')
      }

      const totalBps = params.allocations.reduce((sum, alloc) => sum + alloc.bps, 0)
      if (totalBps !== 10000) {
        throw new Error(`Total allocation must be 100% (10000 bps), got ${(totalBps / 100).toFixed(2)}%`)
      }

      setIsLoading(true)
      setError(null)

      try {
        // Get provider from window.ethereum (ethers v5)
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)

        // Initialize Protocol Kit
        const protocolKit = await Safe.init({
          provider: (window as any).ethereum,
          signer: address,
          safeAddress: SAFE_ADDRESS
        })


        // Encode transaction data using ZKTCampaignPool ABI
        const iface = new ethers.utils.Interface(ZKTCampaignPoolABI)

        // Build transaction array with all contract calls
        const transactions = [
          // 1. Create campaign
          {
            to: CONTRACT_ADDRESS,
            value: '0',
            data: iface.encodeFunctionData('createCampaign', [
              params.campaignId,
              params.startTime,
              params.endTime
            ])
          },
          // 2. Set allocations for each NGO
          ...params.allocations.map(alloc => ({
            to: CONTRACT_ADDRESS,
            value: '0',
            data: iface.encodeFunctionData('setAllocation', [
              params.campaignId,
              alloc.ngoId,
              alloc.bps
            ])
          })),
          // 3. Lock allocations
          {
            to: CONTRACT_ADDRESS,
            value: '0',
            data: iface.encodeFunctionData('lockAllocation', [params.campaignId])
          }
        ]

        // Create Safe transaction with all calls
        const safeTransaction = await protocolKit.createTransaction({
          transactions
        })

        const signedSafeTx = await protocolKit.signTransaction(safeTransaction)
        const safeTxHash = await protocolKit.getTransactionHash(signedSafeTx)

        // Get signature
        const signature = signedSafeTx.signatures.get(address.toLowerCase())
        if (!signature) {
          throw new Error('Failed to get signature')
        }

        // Initialize API Kit
        const apiKit = new SafeApiKit({
          chainId: BigInt(84532), // Base Sepolia
          txServiceUrl: 'https://safe-transaction-base-sepolia.safe.global/api'
        })

        // Propose transaction
        await apiKit.proposeTransaction({
          safeAddress: SAFE_ADDRESS,
          safeTransactionData: safeTransaction.data,
          safeTxHash,
          senderAddress: address,
          senderSignature: signature.data
        })

        setSafeTxHash(safeTxHash)

        // Save campaign metadata to Supabase immediately after Safe approval
        if (params.title && params.description && params.location && params.organizationName) {
          try {
            const campaignData: CampaignData = {
              campaignId: params.campaignId,
              title: params.title,
              description: params.description,
              category: params.category || 'Other',
              location: params.location,
              goal: params.goal || 0,
              organizationName: params.organizationName,
              organizationVerified: params.organizationVerified || false,
              imageUrls: params.imageUrls || [],
              tags: params.tags || [],
              startTime: params.startTime,
              endTime: params.endTime,
              status: 'pending_execution',
              safeTxHash: safeTxHash,
            }

            await saveCampaignData(campaignData)

            toast({
              title: '✅ Campaign Metadata Saved!',
              description: 'Campaign will be fully created after Safe executes the transaction.',
            })
          } catch (dbError) {
            // Don't throw error - the on-chain transaction is still valid
            toast({
              title: '⚠️ Metadata Save Failed',
              description: 'Campaign proposed to Safe but metadata not saved. You may need to try again.',
              variant: 'destructive',
            })
          }
        }

        toast({
          title: '✅ Campaign Proposed!',
          description: `Transaction with ${transactions.length} operations proposed to Safe. Waiting for confirmations from all signers.`,
        })

        return { safeTxHash }

      } catch (err: any) {
        const errorMsg = err?.message || String(err)
        setError(errorMsg)

        toast({
          title: '❌ Failed',
          description: errorMsg,
          variant: 'destructive',
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [address, isConnected, walletClient]
  )

  return {
    createCampaignWithSafe,
    createCampaignWithAllocations,
    isLoading,
    safeTxHash,
    error,
    isHydrated,
  }
}
