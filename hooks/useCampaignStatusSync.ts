'use client';

import { useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { supabase } from '@/lib/supabase-client';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';

/**
 * Hook to poll for Safe transaction completion and update campaign status
 *
 * This hook checks every 30 seconds if a pending campaign has been executed on-chain.
 * Once the campaign exists on-chain, it updates the Supabase status to 'active'.
 *
 * @param campaignId - The campaign ID (bytes32 hash) to poll for
 * @param enabled - Whether to enable polling (default: true)
 * @param interval - Polling interval in milliseconds (default: 30000 = 30 seconds)
 */
export function useCampaignStatusSync(
  campaignId: string | null,
  enabled = true,
  interval = 30000
) {
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!campaignId || !enabled || !publicClient) {
      return;
    }

    // Check if campaign exists on-chain
    const checkCampaignStatus = async () => {
      try {
        const campaignData = await publicClient.readContract({
          address: ZKT_CAMPAIGN_POOL_ADDRESS,
          abi: ZKTCampaignPoolABI,
          functionName: 'campaigns',
          args: [campaignId as `0x${string}`],
        });

        // campaignData returns a tuple: [exists, allocationLocked, disbursed, closed, ...]
        // If campaignData[0] is true, the campaign exists on-chain
        if (campaignData && campaignData[0]) {

          // Update Supabase status to 'active'
          const { error } = await supabase
            .from('campaigns')
            .update({ status: 'active' })
            .eq('campaign_id', campaignId);

          if (error) {
            // Error updating status
          } else {

            // Trigger a page reload to reflect the new status
            // (optional: you might want to use a state management solution instead)
            window.location.reload();
          }
        }
      } catch (error) {
        // Campaign doesn't exist on-chain yet, that's expected for pending campaigns
      }
    };

    // Check immediately on mount
    checkCampaignStatus();

    // Set up polling interval
    const pollInterval = setInterval(checkCampaignStatus, interval);

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, [campaignId, enabled, interval, publicClient]);
}
