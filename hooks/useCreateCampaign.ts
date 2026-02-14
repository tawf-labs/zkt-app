'use client';

import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { uploadFilesToPinata } from '@/lib/pinata-client';
import { saveCampaignData, updateCampaignData, type CampaignData } from '@/lib/supabase-client-auth';
import { toast } from '@/components/ui/use-toast';
import { useCreateCampaignOnChain } from './useCreateCampaignOnChain';
import { keccak256, stringToBytes } from 'viem';

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

// Generate unique campaign identifier
const generateCampaignIdentifier = (walletAddress: string, title: string): string => {
  const timestamp = Date.now();
  return `${walletAddress}-${title}-${timestamp}`;
};

export const useCreateCampaign = () => {
  const { address, isConnected } = useAccount();
  const { createCampaignOnChain, isLoading: isOnChainLoading } = useCreateCampaignOnChain();
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');

  const createCampaign = useCallback(
    async (params: CreateCampaignParams) => {
      if (!address || !isConnected) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        });
        return null;
      }

      setIsLoading(true);
      setUploadProgress(0);

      try {
        // ============================================
        // STEP 1: Generate unique campaign ID
        // ============================================
        setCurrentStep('Generating campaign ID...');
        setUploadProgress(10);
        
        const campaignIdentifier = generateCampaignIdentifier(address, params.title);
        const campaignIdHash = keccak256(stringToBytes(campaignIdentifier));

        // ============================================
        // STEP 2: Upload images to IPFS/Pinata
        // ============================================
        setCurrentStep('Uploading images...');
        setUploadProgress(25);
        
        let imageUrls: string[] = [];
        if (params.imageFiles.length > 0) {
          imageUrls = await uploadFilesToPinata(params.imageFiles);
        }

        // ============================================
        // STEP 3: Create campaign on blockchain FIRST
        // ============================================
        setCurrentStep('Creating campaign on blockchain...');
        setUploadProgress(50);

        const onChainResult = await createCampaignOnChain({
          campaignId: campaignIdentifier,
          startTime: params.startTime,
          endTime: params.endTime,
        });

        if (!onChainResult) {
          throw new Error('Failed to create campaign on blockchain');
        }

        // ============================================
        // STEP 4: Save metadata to Supabase
        // ============================================
        setCurrentStep('Saving campaign data...');
        setUploadProgress(75);

        const campaignData: CampaignData = {
          campaignId: onChainResult.campaignIdBytes32,
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
          createdBy: address,
          status: 'active',
        };

        const supabaseResult = await saveCampaignData(campaignData);

        // ============================================
        // STEP 5: Complete
        // ============================================
        setCurrentStep('Complete!');
        setUploadProgress(100);

        toast({
          title: 'Success! 🎉',
          description: 'Campaign created successfully on blockchain and database',
        });

        return {
          ...campaignData,
          ...onChainResult,
        };

      } catch (error) {

        // Detailed error message
        let errorMessage = 'Failed to create campaign';
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: 'Campaign Creation Failed',
          description: errorMessage,
          variant: 'destructive',
        });

        return null;

      } finally {
        setIsLoading(false);
        setUploadProgress(0);
        setCurrentStep('');
      }
    },
    [address, isConnected, createCampaignOnChain]
  );

  return {
    createCampaign,
    isLoading: isLoading || isOnChainLoading,
    uploadProgress,
    currentStep,
  };
};