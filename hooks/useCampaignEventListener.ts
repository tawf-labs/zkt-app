'use client'

import { useEffect, useRef } from 'react'
import { usePublicClient } from 'wagmi'
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool'
import { supabase } from '@/lib/supabase-client'

/**
 * Hook that listens for CampaignCreated events from the contract
 * Uses getLogs polling instead of watchContractEvent to avoid RPC filter expiration
 * 
 * NOTE: This hook is designed to be safely called in WalletStateController
 * All state updates are contained within effects, not during render
 */
export const useCampaignEventListener = () => {
  const publicClient = usePublicClient()
  const lastBlockRef = useRef<bigint>(BigInt(0))
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    // Guard against multiple initializations
    if (isInitializedRef.current) return
    if (!publicClient) return

    isInitializedRef.current = true

    const setupListener = async () => {
      try {

        // Get the initial block number
        const currentBlock = await publicClient.getBlockNumber()
        lastBlockRef.current = currentBlock

        // Poll for events every 15 seconds instead of using filters (which expire on Base Sepolia)
        intervalRef.current = setInterval(async () => {
          try {
            const latestBlock = await publicClient.getBlockNumber()
            
            if (latestBlock <= lastBlockRef.current) {
              return // No new blocks
            }
            const logs = await (publicClient as any).getLogs({
              address: ZKT_CAMPAIGN_POOL_ADDRESS,
              event: {
                name: 'CampaignCreated',
                type: 'event',
                inputs: [
                  { indexed: true, name: 'campaignId', type: 'bytes32' },
                  { indexed: false, name: 'startTime', type: 'uint256' },
                  { indexed: false, name: 'endTime', type: 'uint256' },
                ],
              },
              fromBlock: lastBlockRef.current + BigInt(1),
              toBlock: latestBlock,
            })

            lastBlockRef.current = latestBlock

            // Process each event
            for (const log of logs) {
              const campaignId = log.args?.campaignId as string

              // Check if campaign already exists in Supabase
              try {
                const { data, error } = await supabase
                  .from('campaigns')
                  .select('id, status')
                  .eq('campaign_id', campaignId)
                  .single()

                if (
                  error &&
                  error.code === 'PGRST116'
                ) {
                } else if (!error && data) {
                  // Campaign exists in Supabase
                  if (data.status === 'pending_execution') {
                    // Update status to 'active' since Safe transaction executed
                    const { error: updateError } = await supabase
                      .from('campaigns')
                      .update({ status: 'active' })
                      .eq('campaign_id', campaignId)
                  }
                }
              } catch (err) {
              }
            }
          } catch (pollError) {
          }
        }, 15000) // Poll every 15 seconds

      } catch (err) {
      }
    }

    setupListener()

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [publicClient])
}