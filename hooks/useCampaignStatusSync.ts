'use client';

import { useEffect, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { supabase } from '@/lib/supabase-client-auth';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';
import { verifyCampaignExists } from '@/lib/verify-campaign';

/**
 * Hook to poll for Safe transaction completion and update campaign status
 *
 * This hook checks every 30 seconds if a pending campaign has been executed on-chain.
 * Once the campaign exists on-chain, it updates the Supabase status to 'active'.
 *
 * @param campaignId - The campaign ID (bytes32 hash) to poll for
 * @param enabled - Whether to enable polling (default: true)
 * @param interval - Polling interval in milliseconds (default: 30000 = 30 seconds)
 * @param onStatusUpdate - Optional callback when status is updated to 'active'
 */
export function useCampaignStatusSync(
  campaignId: string | null,
  enabled = true,
  interval = 30000,
  onStatusUpdate?: (campaignId: string) => void
) {
  const publicClient = usePublicClient();
  const hasUpdatedRef = useRef(false);

  useEffect(() => {
    if (!campaignId || !enabled || !publicClient) {
      return;
    }

    // Prevent multiple updates for the same campaign
    if (hasUpdatedRef.current) {
      console.log(`[useCampaignStatusSync] Already updated campaign ${campaignId.slice(0, 10)}..., skipping polling`);
      return;
    }

    // Check if campaign exists on-chain
    const checkCampaignStatus = async () => {
      try {
        console.log(`[useCampaignStatusSync] Checking campaign ${campaignId.slice(0, 10)}... on-chain...`);

        // Use the verification utility for consistent checking
        const exists = await verifyCampaignExists(campaignId);

        if (exists) {
          console.log(`[useCampaignStatusSync] ✅ Campaign ${campaignId.slice(0, 10)}... exists! Updating database...`);

          // Update Supabase status to 'active'
          const { error } = await supabase
            .from('campaigns')
            .update({ status: 'active' })
            .eq('campaign_id', campaignId);

          if (error) {
            console.error('[useCampaignStatusSync] ❌ Failed to update database:', error);
          } else {
            console.log('[useCampaignStatusSync] ✅ Database updated successfully!');
            hasUpdatedRef.current = true;

            // Trigger callback if provided
            if (onStatusUpdate) {
              onStatusUpdate(campaignId);
            }

            // Reload page to reflect new status (after a short delay)
            setTimeout(() => {
              console.log('[useCampaignStatusSync] Reloading page...');
              window.location.reload();
            }, 1000);
          }
        } else {
          console.log(`[useCampaignStatusSync] ⏳ Campaign ${campaignId.slice(0, 10)}... not yet created on-chain`);
        }
      } catch (error) {
        console.error('[useCampaignStatusSync] Error checking campaign status:', error);
        // Don't throw - polling should continue even if one check fails
      }
    };

    // Check immediately on mount
    checkCampaignStatus();

    // Set up polling interval
    const pollInterval = setInterval(checkCampaignStatus, interval);

    // Cleanup on unmount
    return () => {
      clearInterval(pollInterval);
      console.log(`[useCampaignStatusSync] Cleanup: stopped polling for ${campaignId?.slice(0, 10)}...`);
    };
  }, [campaignId, enabled, interval, publicClient, onStatusUpdate]);
}
