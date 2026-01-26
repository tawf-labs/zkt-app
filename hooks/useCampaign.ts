'use client';

import { useCallback, useState } from 'react';
import { useContractRead } from 'wagmi';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';

export const useCampaign = (campaignId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: campaign, isLoading: isReadLoading, refetch } = useContractRead({
    address: ZKT_CAMPAIGN_POOL_ADDRESS,
    abi: ZKTCampaignPoolABI,
    functionName: 'campaigns',
    args: campaignId ? [campaignId as `0x${string}`] : undefined,
    enabled: !!campaignId,
  });

  const reloadCampaign = useCallback(async () => {
    setIsLoading(true);
    try {
      await refetch();
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  return {
    campaign: campaign,
    isLoading: isReadLoading || isLoading,
    refetch: reloadCampaign,
  };
};
