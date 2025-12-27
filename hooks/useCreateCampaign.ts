'use client';

import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { uploadFilesToPinata } from '@/lib/pinata-client';
import { saveCampaignData, type CampaignData } from '@/lib/supabase-client';
import { toast } from '@/components/ui/use-toast';
import { createCampaignId } from '@/lib/donate';
import { useCreateCampaignOnChain } from './useCreateCampaignOnChain';
import { canProposeAdminAction } from '@/lib/constants';

interface CreateCampaignParams {
  title: string;
  description: string;
  category: string;
  location: string;
  goal: number;
  organizationName: string;
  organizationVerified: boolean;
  imageFiles: File[];
  tags: string[];
  startTime: number;
  endTime: number;
}

export const useCreateCampaign = () => {
  const { address, isConnected } = useAccount();
  const { createCampaignOnChain, isLoading: isOnChainLoading } = useCreateCampaignOnChain();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check if current user can propose admin actions (multisig admin or signer)
  const canCreateCampaign = canProposeAdminAction(address);

  const createCampaign = useCallback(
    async (params: CreateCampaignParams) => {
      if (!address || !isConnected) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet',
          variant: 'destructive',
        });
        return;
      }

      // Check if user is authorized to create campaigns on-chain
      if (!canCreateCampaign) {
        toast({
          title: 'Unauthorized',
          description: 'Only the multisig admin or signers can create campaigns on-chain. Your campaign will be saved to the database for admin approval.',
          variant: 'destructive',
        });
      }

      setIsLoading(true);
      setUploadProgress(0);

      try {
        // Step 1: Upload images to Pinata (20%)
        setUploadProgress(20);
        console.log('📤 Uploading images to Pinata...');
        const imageUrls = await uploadFilesToPinata(params.imageFiles);
        
        // Step 2: Create campaign ID (30%)
        setUploadProgress(30);
        console.log('🔑 Generating campaign ID...');
        const campaignId = createCampaignId(`${params.title}-${Date.now()}`);

        // Step 3: Save off-chain data to Supabase (50%)
        setUploadProgress(50);
        console.log('💾 Saving metadata to Supabase...');
        const campaignData: CampaignData = {
          campaignId,
          title: params.title,
          description: params.description,
          category: params.category,
          location: params.location,
          goal: params.goal,
          organizationName: params.organizationName,
          organizationVerified: params.organizationVerified,
          imageUrls,
          tags: params.tags,
          startTime: params.startTime,
          endTime: params.endTime,
        };

        const supabaseResult = await saveCampaignData(campaignData);
        console.log('✅ Campaign data saved to Supabase:', supabaseResult);

        let onChainResult = null;
        
        // Step 4: Create campaign on blockchain only if user can propose admin actions (80%)
        if (canCreateCampaign) {
          setUploadProgress(80);
          console.log('⛓️  Creating campaign on blockchain...');
          onChainResult = await createCampaignOnChain({
            campaignId,
            startTime: params.startTime,
            endTime: params.endTime,
          });

          if (!onChainResult) {
            throw new Error('Failed to create campaign on blockchain');
          }
          
          console.log('🎉 Campaign created successfully on blockchain!');
          console.log('Block result:', onChainResult);
        }

        setUploadProgress(100);
        console.log('🎉 Campaign created successfully!');
        console.log('Campaign ID:', campaignId);

        toast({
          title: 'Success',
          description: canCreateCampaign 
            ? 'Campaign created successfully on blockchain!' 
            : 'Campaign submitted for admin approval!',
        });

        return {
          campaignId,
          imageUrls,
          ...campaignData,
          txHash: onChainResult?.txHash,
        };
      } catch (error) {
        console.error('Error creating campaign:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to create campaign',
          variant: 'destructive',
        });
        throw error;
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    },
    [address, isConnected, canCreateCampaign, createCampaignOnChain]
  );

  return {
    createCampaign,
    isLoading: isLoading || isOnChainLoading,
    uploadProgress,
    isMultisigAdmin: canCreateCampaign,
  };
};
