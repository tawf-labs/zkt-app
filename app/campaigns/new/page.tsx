'use client';

import { useState, useEffect } from 'react';
import {
  Upload, CheckCircle2, Loader2, X, AlertCircle,
  ChevronRight, Sparkles, Lock, ShieldCheck, ExternalLink
} from 'lucide-react';
import { useAccount, useWriteContract, usePublicClient, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from '@/components/ui/use-toast';
import { keccak256, stringToBytes, pad } from 'viem';
import { uploadFilesToPinata } from '@/lib/pinata-client';
// import { useCreateCampaignWithSafe, type NGOAllocation } from '@/hooks/useCreateCampaignWithSafe'; // DISABLED - Using direct contract instead
import { useCampaignStatus } from '@/hooks/useCampaignStatus';
import { saveCampaignData, type CampaignData } from '@/lib/supabase-client';
import { ZKT_CAMPAIGN_POOL_ADDRESS, ZKTCampaignPoolABI } from '@/lib/zkt-campaign-pool';

// Safe multisig constants (DISABLED - Not using Safe anymore)
// const SAFE_ADDRESS = '0xD264BE80817EAfaC5F7575698913FEc4cB38a016';
// const SAFE_TX_URL = 'https://app.safe.global/transactions/unsafe?safe=eth:0xD264BE80817EAfaC5F7575698913FEc4cB38a016';
// const SAFE_SIGNERS = [
//   '0x2e7AC5ED2e9359cEC39F82D050b915C518041ee8',
//   '0x236c6ea9DDc48ae72DCFb8724BF8a136aa3C6EBB',
//   '0xB4D04aFd15Fa8752EE94B1510A755e04d362876D',
//   '0x9F5952826B61f1Aab3A4E7E8Fb238a8894D1D174',
//   '0xeF4DB09D536439831FEcaA33F4250168976535E',
//   '0xE509912bAA5Dd52F3f51E994bb9F9A79FDd2249a',
//   '0x027822307511a055eB0f5907F2685DaB1204e14B',
// ];

// Helper to format date - properly handles local time for datetime-local input
const dateToLocalString = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  // Get the timezone offset in minutes and convert to milliseconds
  const tzOffset = date.getTimezoneOffset() * 60000;
  // Adjust the date by the timezone offset to get local time
  const localDate = new Date(date.getTime() - tzOffset);
  // Return in the format required by datetime-local input (YYYY-MM-DDTHH:mm)
  return localDate.toISOString().slice(0, 16);
};

const localStringToTimestamp = (localString: string): number => {
  const date = new Date(localString);
  // The datetime-local input gives us a string in local time
  // We need to convert it to a proper UTC timestamp
  return Math.floor(date.getTime() / 1000);
};

// Generate campaign identifier
const generateCampaignIdentifier = (wallet: string, name: string): string => {
  const timestamp = Date.now();
  return `${wallet}-${name.trim()}-${timestamp}`;
};

/**
 * ALLOCATION PROGRESS COMPONENT
 */
interface AllocationProgressProps {
  totalBps: number;
  allocationLocked: boolean;
}

function AllocationProgress({ totalBps, allocationLocked }: AllocationProgressProps) {
  const percentage = Math.min((totalBps / 10000) * 100, 100);

  let statusColor = 'text-red-600';
  let statusBg = 'bg-red-50';
  let statusBorder = 'border-red-200';
  let statusLabel = 'Incomplete';
  let statusIcon = '🔴';

  if (totalBps === 10000 && !allocationLocked) {
    statusColor = 'text-amber-600';
    statusBg = 'bg-amber-50';
    statusBorder = 'border-amber-200';
    statusLabel = 'Ready to Lock';
    statusIcon = '🟡';
  } else if (allocationLocked) {
    statusColor = 'text-green-600';
    statusBg = 'bg-green-50';
    statusBorder = 'border-green-200';
    statusLabel = 'Locked';
    statusIcon = '🟢';
  }

  return (
    <div className={`${statusBg} border ${statusBorder} rounded-lg p-4 mb-6`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{statusIcon}</span>
            <span className="font-semibold text-sm">Allocation: {Math.round(percentage)}% / 100%</span>
          </div>
          <span className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</span>
        </div>
        <div className="w-full bg-white rounded-full h-2 border border-current border-opacity-20">
          <div
            className={`h-2 rounded-full transition-all ${
              allocationLocked
                ? 'bg-green-500'
                : totalBps === 10000
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * STEP INDICATOR
 */
interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                idx + 1 < currentStep
                  ? 'bg-green-500 text-white'
                  : idx + 1 === currentStep
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {idx + 1 < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  idx + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        {steps.map((step, idx) => (
          <span
            key={idx}
            className={`text-xs font-medium flex-1 text-center ${
              idx + 1 === currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * STEP 1: CAMPAIGN INFO (OFF-CHAIN)
 */
interface Step1Props {
  campaignName: string;
  setCampaignName: (name: string) => void;
  startTime: number;
  setStartTime: (time: number) => void;
  endTime: number;
  setEndTime: (time: number) => void;
  onNext: () => void;
}

function Step1CampaignInfo({
  campaignName,
  setCampaignName,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onNext,
}: Step1Props) {
  const handleNext = () => {
    if (!campaignName.trim() || campaignName.length < 3) {
      toast({
        title: 'Invalid Campaign Name',
        description: 'Campaign name must be at least 3 characters',
        variant: 'destructive',
      });
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    if (startTime <= now) {
      toast({
        title: 'Invalid Start Time',
        description: 'Start time must be in the future',
        variant: 'destructive',
      });
      return;
    }

    if (endTime <= startTime) {
      toast({
        title: 'Invalid Time Range',
        description: 'End time must be after start time',
        variant: 'destructive',
      });
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 1: Campaign Information</h2>
        <p className="text-muted-foreground mb-4">
          Enter basic campaign details. Campaign will be created directly on the smart contract.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900 text-sm">Direct Contract Flow</p>
            <p className="text-sm text-green-800 mt-1">
              Your campaign will be created immediately on the blockchain. No waiting for approvals.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Campaign Name *</label>
          <input
            type="text"
            placeholder="e.g., Flood Relief Fund 2025"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Start Date & Time *</label>
            <input
              type="datetime-local"
              value={dateToLocalString(startTime)}
              onChange={(e) => setStartTime(localStringToTimestamp(e.target.value))}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">End Date & Time *</label>
            <input
              type="datetime-local"
              value={dateToLocalString(endTime)}
              onChange={(e) => setEndTime(localStringToTimestamp(e.target.value))}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg h-11 font-semibold transition-all flex items-center justify-center gap-2"
      >
        Continue to NGO Selection <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * STEP 2: NGO SELECTION (OFF-CHAIN)
 */
interface NGO {
  id: string;
  wallet: string;
  name: string;
}

interface Step2Props {
  selectedNGOs: NGO[];
  setSelectedNGOs: (ngos: NGO[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function Step2NGOSelection({ selectedNGOs, setSelectedNGOs, onNext, onBack }: Step2Props) {
  const [availableNGOs] = useState<NGO[]>([
    {
      id: keccak256(stringToBytes('TELAGA-TEST')),
      wallet: '0x2ca80Cc5e254C45E99281F670d694B22E6a90FC4',
      name: 'Telaga Foundation (Test)',
    },
    // Add more NGOs here after approving them on the contract
    // {
    //   id: keccak256(stringToBytes('NGO-2')),
    //   wallet: '0x...', // Must be approved first via approveNGO()
    //   name: 'Another NGO',
    // },
  ]);

  const toggleNGO = (ngo: NGO) => {
    const isSelected = selectedNGOs.some(s => s.id === ngo.id);
    if (isSelected) {
      setSelectedNGOs(selectedNGOs.filter(s => s.id !== ngo.id));
    } else {
      setSelectedNGOs([...selectedNGOs, ngo]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 2: Select NGOs</h2>
        <p className="text-muted-foreground mb-4">
          Choose NGOs that will receive funds from this campaign.
        </p>
      </div>

      <div className="space-y-3">
        {availableNGOs.map((ngo) => (
          <div
            key={ngo.id}
            className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
            onClick={() => toggleNGO(ngo)}
          >
            <input
              type="checkbox"
              checked={selectedNGOs.some(s => s.id === ngo.id)}
              onChange={() => {}}
              className="w-4 h-4 rounded border-input"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{ngo.name}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{ngo.wallet}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedNGOs.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-900">
            ✅ {selectedNGOs.length} NGO{selectedNGOs.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-border rounded-lg h-11 px-4 font-semibold hover:bg-accent transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedNGOs.length === 0}
          className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg h-11 font-semibold transition-all flex items-center justify-center gap-2"
        >
          Continue to Allocation <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * STEP 3: SET ALLOCATIONS (OFF-CHAIN)
 */
interface AllocationWithNgo {
  ngoId: string;
  ngoName: string;
  bps: number;
}

interface Step3Props {
  selectedNGOs: NGO[];
  allocations: AllocationWithNgo[];
  setAllocations: (allocs: AllocationWithNgo[]) => void;
  totalBps: number;
  onNext: () => void;
  onBack: () => void;
}

function Step3SetAllocation({
  selectedNGOs,
  allocations,
  setAllocations,
  totalBps,
  onNext,
  onBack,
}: Step3Props) {
  const handleAllocationChange = (ngoId: string, newBps: number) => {
    const existing = allocations.find(a => a.ngoId === ngoId);
    if (existing) {
      setAllocations(
        allocations.map(a =>
          a.ngoId === ngoId ? { ...a, bps: Math.max(0, Math.min(newBps, 10000)) } : a
        )
      );
    }
  };

  const canProceed = totalBps === 10000;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 3: Set Allocations</h2>
        <p className="text-muted-foreground mb-4">
          Define how funds will be distributed. Total must equal 100%.
        </p>
      </div>

      <AllocationProgress totalBps={totalBps} allocationLocked={false} />

      <div className="space-y-4">
        {selectedNGOs.map((ngo) => {
          const allocation = allocations.find(a => a.ngoId === ngo.id) || {
            ngoId: ngo.id,
            ngoName: ngo.name,
            bps: 0,
          };
          const percentage = (allocation.bps / 100);

          return (
            <div key={ngo.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{ngo.name}</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {percentage.toFixed(2)}%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="10000"
                value={allocation.bps}
                onChange={(e) => handleAllocationChange(ngo.id, parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <p className="text-xs text-muted-foreground">Basis points (bps): 1 bps = 0.01%</p>
            </div>
          );
        })}
      </div>

      {!canProceed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-900">
            🔴 Total allocation is {(totalBps / 100).toFixed(2)}%, must be 100%
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-border rounded-lg h-11 px-4 font-semibold hover:bg-accent transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg h-11 font-semibold transition-all flex items-center justify-center gap-2"
        >
          Confirm Allocation <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * STEP 4: CONFIRM ALLOCATION INTENTION (OFF-CHAIN)
 */
interface Step4Props {
  selectedNGOs: NGO[];
  allocations: AllocationWithNgo[];
  onNext: () => void;
  onBack: () => void;
}

function Step4ConfirmAllocation({
  selectedNGOs,
  allocations,
  onNext,
  onBack,
}: Step4Props) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 4: Confirm Allocation</h2>
        <p className="text-muted-foreground mb-4">
          Review your allocation choices. These will be set and locked when the campaign is created.
        </p>
      </div>

      <AllocationProgress totalBps={10000} allocationLocked={false} />

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900 text-sm">Allocations Will Be Locked on Creation</p>
            <p className="text-sm text-green-800 mt-1">
              When you submit, the campaign will be created with allocations automatically set and locked.
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
        <p className="font-semibold text-sm">Allocation Summary</p>
        {allocations.map((alloc) => {
          const ngo = selectedNGOs.find(n => n.id === alloc.ngoId);
          return (
            <div key={alloc.ngoId} className="flex items-center justify-between text-sm">
              <span>{ngo?.name}</span>
              <span className="font-semibold">{(alloc.bps / 100).toFixed(2)}%</span>
            </div>
          );
        })}
        <div className="border-t pt-2 mt-2 flex items-center justify-between text-sm font-bold">
          <span>Total</span>
          <span>100%</span>
        </div>
      </div>

      <label className="flex items-start gap-3 p-4 border border-green-200 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="w-4 h-4 rounded border-input mt-1 cursor-pointer"
        />
        <div>
          <p className="font-semibold text-green-900 text-sm">
            I confirm these allocations will be set and locked automatically when campaign is created
          </p>
        </div>
      </label>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-border rounded-lg h-11 px-4 font-semibold hover:bg-accent transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!confirmed}
          className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg h-11 font-semibold transition-all flex items-center justify-center gap-2"
        >
          Continue to Details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * STEP 5: CAMPAIGN DETAILS (OFF-CHAIN)
 */
interface Step5Props {
  campaignData: any;
  setCampaignData: (data: any) => void;
  imageFiles: File[];
  imagePreviewUrls: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (idx: number) => void;
  onNext: () => void;
  onBack: () => void;
}

function Step5CampaignDetails({
  campaignData,
  setCampaignData,
  imageFiles,
  imagePreviewUrls,
  onImageUpload,
  removeImage,
  onNext,
  onBack,
}: Step5Props) {
  const categories = ['Emergency', 'Education', 'Healthcare', 'Environment', 'Community'];

  const handleNext = () => {
    if (!campaignData.name.trim() || campaignData.name.length < 10) {
      toast({
        title: 'Error',
        description: 'Campaign name must be at least 10 characters',
        variant: 'destructive',
      });
      return;
    }
    if (!campaignData.description.trim() || campaignData.description.length < 50) {
      toast({
        title: 'Error',
        description: 'Description must be at least 50 characters',
        variant: 'destructive',
      });
      return;
    }
    if (!campaignData.location.trim()) {
      toast({
        title: 'Error',
        description: 'Location is required',
        variant: 'destructive',
      });
      return;
    }
    const goal = parseFloat(campaignData.goal);
    if (!campaignData.goal || isNaN(goal) || goal < 1000) {
      toast({
        title: 'Error',
        description: 'Minimum funding goal is 1,000 IDRX',
        variant: 'destructive',
      });
      return;
    }
    if (!campaignData.organizationName.trim()) {
      toast({
        title: 'Error',
        description: 'Organization name is required',
        variant: 'destructive',
      });
      return;
    }
    if (imageFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one image is required',
        variant: 'destructive',
      });
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 5: Campaign Details</h2>
        <p className="text-muted-foreground mb-4">
          Fill in campaign information and upload images.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Campaign Name</label>
          <input
            type="text"
            placeholder="e.g., Emergency Relief for Flood Victims"
            value={campaignData.name}
            onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            placeholder="Provide details about your campaign..."
            value={campaignData.description}
            onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={campaignData.category}
              onChange={(e) => setCampaignData({ ...campaignData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Location</label>
            <input
              type="text"
              placeholder="e.g., Jakarta, Indonesia"
              value={campaignData.location}
              onChange={(e) => setCampaignData({ ...campaignData, location: e.target.value })}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Funding Goal (IDRX)</label>
          <input
            type="number"
            placeholder="e.g., 10000"
            value={campaignData.goal}
            onChange={(e) => setCampaignData({ ...campaignData, goal: e.target.value })}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Organization Name</label>
          <input
            type="text"
            placeholder="Your organization name"
            value={campaignData.organizationName}
            onChange={(e) => setCampaignData({ ...campaignData, organizationName: e.target.value })}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="verified"
            checked={campaignData.organizationVerified}
            onChange={(e) => setCampaignData({ ...campaignData, organizationVerified: e.target.checked })}
            className="w-4 h-4 rounded border-input cursor-pointer"
          />
          <label htmlFor="verified" className="text-sm font-medium cursor-pointer">
            My organization is verified
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Campaign Images</label>
          <div className="border-2 border-dashed border-input rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input" className="cursor-pointer block">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-semibold text-sm">Click to upload images</p>
              <p className="text-xs text-muted-foreground">Max 5 images, 5MB each</p>
            </label>
          </div>

          {imagePreviewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
              {imagePreviewUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-20 object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Tags (Optional)</label>
          <input
            type="text"
            placeholder="e.g., relief, emergency, disaster (comma-separated)"
            value={campaignData.tags.join(', ')}
            onChange={(e) => setCampaignData({
              ...campaignData,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
            })}
            className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-border rounded-lg h-11 px-4 font-semibold hover:bg-accent transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-primary text-white hover:bg-primary/90 rounded-lg h-11 font-semibold transition-all flex items-center justify-center gap-2"
        >
          Review & Submit <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * STEP 6: REVIEW & SUBMIT TO SAFE
 */
interface Step6Props {
  campaignData: any;
  selectedNGOs: NGO[];
  allocations: AllocationWithNgo[];
  imageCount: number;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  transactionStep: string;
  currentTransaction: {
    step: number;
    total: number;
    name: string;
    hash: string;
  };
}

function Step6Review({
  campaignData,
  selectedNGOs,
  allocations,
  imageCount,
  onSubmit,
  onBack,
  isSubmitting,
  transactionStep,
  currentTransaction,
}: Step6Props) {
  const explorerUrl = 'https://sepolia.basescan.org';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 6: Review & Create Campaign</h2>
        <p className="text-muted-foreground mb-4">
          Review all details. This will create the campaign directly on the smart contract.
        </p>
      </div>

      {(transactionStep || currentTransaction.step > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-blue-900 text-sm">
                {currentTransaction.step > 0 ? `Transaction ${currentTransaction.step}/${currentTransaction.total}` : 'Processing Transaction'}
              </p>
              <p className="text-sm text-blue-800 mt-1">{transactionStep || currentTransaction.name}</p>
              {currentTransaction.hash && (
                <a
                  href={`${explorerUrl}/tx/${currentTransaction.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  View on explorer ↗
                </a>
              )}
            </div>
          </div>
          {/* Progress bar */}
          {currentTransaction.total > 0 && (
            <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTransaction.step / currentTransaction.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm">Campaign Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p className="font-semibold">{campaignData.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Category</p>
              <p className="font-semibold">{campaignData.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Location</p>
              <p className="font-semibold">{campaignData.location}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Goal</p>
              <p className="font-semibold">{campaignData.goal} IDRX</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Organization</p>
              <p className="font-semibold">{campaignData.organizationName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Images</p>
              <p className="font-semibold">{imageCount} uploaded</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-green-50 border-green-200 space-y-3">
          <h3 className="font-semibold text-sm text-green-900">📋 Allocation (Will be locked on creation)</h3>
          {allocations.map((alloc) => {
            const ngo = selectedNGOs.find(n => n.id === alloc.ngoId);
            return (
              <div key={alloc.ngoId} className="flex items-center justify-between text-sm text-green-800">
                <span>{ngo?.name}</span>
                <span className="font-semibold">{(alloc.bps / 100).toFixed(2)}%</span>
              </div>
            );
          })}
          <p className="text-xs text-green-700 border-t pt-2 mt-2">
            Allocations will be set and locked automatically when campaign is created.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900 text-sm">Direct Contract Creation</p>
              <p className="text-sm text-green-800 mt-1">
                Campaign will be created immediately on the blockchain with allocations locked. No waiting for approvals.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 border border-border rounded-lg h-11 px-4 font-semibold hover:bg-accent transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 rounded-lg h-11 font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Campaign...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Create Campaign
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * STEP 7: WAITING FOR SAFE APPROVAL
 */
interface Step7Props {
  safeTxHash: string;
}

function Step7WaitingSafe({ safeTxHash }: Step7Props) {
  const safeUrl = `${SAFE_TX_URL}`;

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg mx-auto">
        <ShieldCheck className="h-10 w-10 text-white" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Waiting for Safe Approval</h2>
        <p className="text-muted-foreground text-lg">
          Transaction proposed! Waiting for {SAFE_SIGNERS.length} signers to approve.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
        <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
          <li>Open Safe app to review the transaction</li>
          <li>{SAFE_SIGNERS.length} signers must approve</li>
          <li>After execution, campaign is created with allocations locked</li>
          <li>Campaign will automatically be ready for donations</li>
        </ol>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Safe Transaction Hash:</strong> {safeTxHash?.slice(0, 12)}...{safeTxHash?.slice(-12)}
        </p>
      </div>

      <div className="pt-4 space-y-3">
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-12 px-6 font-semibold transition-all flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Open Safe App
        </a>
        <p className="text-xs text-muted-foreground">
          After approval and execution, refresh to see your campaign
        </p>
      </div>
    </div>
  );
}

/**
 * SUCCESS SCREEN
 */
interface SuccessProps {
  createdCampaign: any;
  onReset: () => void;
}

function SuccessScreen({ createdCampaign, onReset }: SuccessProps) {
  const explorerUrl = 'https://sepolia.basescan.org';

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30 mx-auto">
        <CheckCircle2 className="h-10 w-10 text-white" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Campaign Created! 🎉</h2>
        <p className="text-muted-foreground text-lg">
          Campaign with allocations created directly on the blockchain.
        </p>
      </div>

      <div className="space-y-3 text-left">
        <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-green-500 bg-green-50">
          <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-lg mb-1 text-green-900">✅ Campaign Created on Blockchain</div>
            <p className="text-sm text-green-800">
              Campaign created with allocations locked. Ready to receive donations immediately.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-gray-50">
          <Lock className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-base mb-3 text-gray-900">📋 Campaign Details</div>
            <div className="space-y-2 text-xs text-gray-700">
              <p><strong>Campaign Name:</strong> {createdCampaign?.campaignTitle}</p>
              <p><strong>Campaign ID:</strong> <span className="font-mono break-all">{createdCampaign?.campaignId?.slice(0, 12)}...{createdCampaign?.campaignId?.slice(-12)}</span></p>
              <p><strong>Allocation Status:</strong> 🔒 Allocations locked</p>
            </div>
          </div>
        </div>

        {createdCampaign?.txHashes && createdCampaign.txHashes.length > 0 && (
          <div className="flex items-start gap-4 p-5 rounded-xl border border-blue-200 bg-blue-50">
            <ExternalLink className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-base mb-3 text-blue-900">🔗 Blockchain Transactions</div>
              <div className="space-y-2">
                {createdCampaign.txHashes.map((hash: string, idx: number) => (
                  <a
                    key={hash}
                    href={`${explorerUrl}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    {idx === 0 && 'Create Campaign: '}
                    {idx > 0 && idx < createdCampaign.txHashes.length - 1 && `Set Allocation #${idx}: `}
                    {idx === createdCampaign.txHashes.length - 1 && 'Lock Allocations: '}
                    <span className="font-mono">{hash.slice(0, 10)}...{hash.slice(-8)}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 space-y-3">
        <button
          onClick={() => window.location.href = '/campaigns'}
          className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:shadow-primary/30 rounded-xl h-12 px-6 font-semibold transition-all"
        >
          View All Campaigns
        </button>
        <button
          onClick={onReset}
          className="w-full border-2 border-border rounded-xl h-12 px-6 font-semibold hover:bg-accent transition-all"
        >
          Create Another Campaign
        </button>
      </div>
    </div>
  );
}

/**
 * MAIN PAGE COMPONENT
 */
export default function CreateCampaignPage() {
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  if (!isClientReady) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <CreateCampaignInner />;
}

function CreateCampaignInner() {
  const { address: userAddress, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStep, setTransactionStep] = useState('');
  const [txHashes, setTxHashes] = useState<string[]>([]);

  // Enhanced transaction progress tracking
  const [currentTransaction, setCurrentTransaction] = useState({
    step: 0,
    total: 0,
    name: '',
    hash: '',
  });

  const [step, setStep] = useState(1);
  const [createdCampaign, setCreatedCampaign] = useState<any>(null);

  // Check if user is a Safe signer (DISABLED - Not using Safe anymore)
  // const [isSigner, setIsSigner] = useState(false);
  // useEffect(() => {
  //   if (!userAddress) {
  //     setIsSigner(false);
  //     return;
  //   }
  //   const isUserSigner = SAFE_SIGNERS.some(
  //     (signer) => signer.toLowerCase() === userAddress.toLowerCase()
  //   );
  //   setIsSigner(isUserSigner);
  // }, [userAddress]);

  // Generate campaign ID (done once, used in contract transaction)
  const [campaignId, setCampaignId] = useState<string>('');

  // OFF-CHAIN STATE (Steps 1-4)
  const [selectedNGOs, setSelectedNGOs] = useState<NGO[]>([]);
  const [allocations, setAllocations] = useState<AllocationWithNgo[]>([]);
  const [totalBps, setTotalBps] = useState<number>(0);

  // Campaign info
  const now = Math.floor(Date.now() / 1000);
  const defaultEndTime = now + (30 * 24 * 60 * 60);
  const [campaignName, setCampaignName] = useState('');
  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(defaultEndTime);

  // Metadata
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    category: 'Emergency',
    location: '',
    goal: '',
    organizationName: '',
    organizationVerified: false,
    tags: [] as string[],
  });

  // Images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Sync campaign name
  useEffect(() => {
    if (campaignName) {
      setCampaignData(prev => ({ ...prev, name: campaignName }));
    }
  }, [campaignName]);

  // Calculate total bps
  useEffect(() => {
    const total = allocations.reduce((sum, a) => sum + a.bps, 0);
    setTotalBps(total);
  }, [allocations]);

  // Initialize allocations when NGOs are selected
  useEffect(() => {
    const newAllocations = selectedNGOs.map(ngo => {
      const existing = allocations.find(a => a.ngoId === ngo.id);
      return existing || { ngoId: ngo.id, ngoName: ngo.name, bps: 0 };
    });
    setAllocations(newAllocations);
  }, [selectedNGOs]);

  // Check campaign status after Safe (for Step 8)
  const { campaign, allocationLocked: contractAllocationLocked } = useCampaignStatus(
    campaignId?.startsWith('0x') ? campaignId : null
  );

  // Image handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);

      if (imageFiles.length + newFiles.length > 5) {
        toast({
          title: 'Too Many Images',
          description: 'Maximum 5 images allowed',
          variant: 'destructive',
        });
        return;
      }

      const invalidFiles = newFiles.filter(f => f.size > 5 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        toast({
          title: 'File Too Large',
          description: 'Each image must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    URL.revokeObjectURL(imagePreviewUrls[idx]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== idx));
  };

  // Helper function to wait for transaction confirmation
  const waitForTransaction = async (hash: string, timeout = 60000) => {
    if (!publicClient) throw new Error('Public client not available');

    setTransactionStep(`Waiting for transaction ${hash.slice(0, 10)}... to be mined...`);

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
      timeout: timeout,
    });

    if (receipt.status !== 'success') {
      throw new Error(`Transaction failed: ${hash}`);
    }

    return receipt;
  };

  // Submit to contract (Step 6)
  const handleSubmitToSafe = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: 'Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setTxHashes([]);
    const hashes: string[] = [];

    // Calculate total transactions
    const totalTransactions = 2 + allocations.length; // create + allocations + lock

    try {
      // Generate campaign ID
      const identifier = generateCampaignIdentifier(userAddress, campaignName);
      const campaignIdHash = keccak256(stringToBytes(identifier));
      setCampaignId(campaignIdHash);

      // Upload images
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          uploadedImageUrls = await uploadFilesToPinata(imageFiles);
        } catch (uploadError) {
          toast({
            title: '⚠️ Image Upload Warning',
            description: 'Using local previews instead.',
          });
          uploadedImageUrls = imagePreviewUrls;
        }
      }

      // Step 1: Create campaign on contract
      setCurrentTransaction({
        step: 1,
        total: totalTransactions,
        name: 'Creating campaign on blockchain...',
        hash: '',
      });
      setTransactionStep('Creating campaign on blockchain...');

      const createHash = await writeContractAsync({
        address: ZKT_CAMPAIGN_POOL_ADDRESS as `0x${string}`,
        abi: ZKTCampaignPoolABI,
        functionName: 'createCampaign',
        args: [campaignIdHash, startTime, endTime],
      });
      hashes.push(createHash);
      setTxHashes([...hashes]);
      setCurrentTransaction(prev => ({ ...prev, hash: createHash }));

      // Wait for confirmation
      await waitForTransaction(createHash);

      // Step 2: Set allocations for each NGO
      for (let i = 0; i < allocations.length; i++) {
        const alloc = allocations[i];
        setCurrentTransaction({
          step: 2 + i,
          total: totalTransactions,
          name: `Setting allocation ${i + 1}/${allocations.length} (${alloc.ngoName})...`,
          hash: '',
        });
        setTransactionStep(`Setting allocation ${i + 1}/${allocations.length} (${alloc.ngoName})...`);

        const allocHash = await writeContractAsync({
          address: ZKT_CAMPAIGN_POOL_ADDRESS as `0x${string}`,
          abi: ZKTCampaignPoolABI,
          functionName: 'setAllocation',
          args: [campaignIdHash, alloc.ngoId, BigInt(alloc.bps)],
        });
        hashes.push(allocHash);
        setTxHashes([...hashes]);
        setCurrentTransaction(prev => ({ ...prev, hash: allocHash }));

        // Wait for each allocation to confirm
        await waitForTransaction(allocHash);
      }

      // Step 3: Lock allocations
      setCurrentTransaction({
        step: totalTransactions,
        total: totalTransactions,
        name: 'Locking allocations...',
        hash: '',
      });
      setTransactionStep('Locking allocations...');

      const lockHash = await writeContractAsync({
        address: ZKT_CAMPAIGN_POOL_ADDRESS as `0x${string}`,
        abi: ZKTCampaignPoolABI,
        functionName: 'lockAllocation',
        args: [campaignIdHash],
      });
      hashes.push(lockHash);
      setTxHashes([...hashes]);
      setCurrentTransaction(prev => ({ ...prev, hash: lockHash }));

      // Wait for lock to confirm
      await waitForTransaction(lockHash);

      // Step 4: Save to Supabase with 'active' status
      setCurrentTransaction({
        step: totalTransactions,
        total: totalTransactions,
        name: 'Saving campaign metadata...',
        hash: '',
      });
      setTransactionStep('Saving campaign metadata...');

      await saveCampaignData({
        campaignId: campaignIdHash,
        title: campaignData.name,
        description: campaignData.description,
        category: campaignData.category,
        location: campaignData.location,
        goal: parseFloat(campaignData.goal),
        organizationName: campaignData.organizationName,
        organizationVerified: campaignData.organizationVerified,
        imageUrls: uploadedImageUrls,
        tags: campaignData.tags,
        startTime: startTime,
        endTime: endTime,
        status: 'active',
      });

      // Show success screen
      setCreatedCampaign({
        campaignTitle: campaignData.name,
        campaignId: campaignIdHash,
        allocationLocked: true,
        txHashes: hashes,
      });
      setTransactionStep('');
      setCurrentTransaction({ step: 0, total: 0, name: '', hash: '' });
      setStep(8); // Go directly to success screen
    } catch (error: any) {
      // Detailed error logging
      let errorMsg = 'Failed to create campaign';
      if (error?.message) {
        errorMsg = error.message;
      }
      if (error?.reason) {
        errorMsg = `Contract error: ${error.reason}`;
      }
      if (error?.data?.message) {
        errorMsg = `Contract error: ${error.data.message}`;
      }

      // Check for common errors
      if (error?.message?.includes('User rejected')) {
        errorMsg = 'Transaction rejected by user';
      } else if (error?.name === 'ContractFunctionExecutionError') {
        errorMsg = `Access denied: You may not have permission to create campaigns. Only the admin can call this function.`;
      }

      toast({
        title: '❌ Campaign Creation Failed',
        description: errorMsg,
        variant: 'destructive',
      });
      setTransactionStep('');
      setCurrentTransaction({ step: 0, total: 0, name: '', hash: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCreatedCampaign(null);
    setCampaignId('');
    setSelectedNGOs([]);
    setAllocations([]);
    setTotalBps(0);
    setCampaignName('');
    setStartTime(now);
    setEndTime(defaultEndTime);
    setCampaignData({
      name: '',
      description: '',
      category: 'Emergency',
      location: '',
      goal: '',
      organizationName: '',
      organizationVerified: false,
      tags: [],
    });
    setImageFiles([]);
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setImagePreviewUrls([]);
    setTxHashes([]);
    setTransactionStep('');
    setCurrentTransaction({ step: 0, total: 0, name: '', hash: '' });
  };

  const steps = ['Info', 'NGOs', 'Allocations', 'Confirm', 'Details', 'Create'];

  // SUCCESS SCREEN (step === 8)
  if (step === 8) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white border border-border rounded-2xl shadow-lg p-8">
          <SuccessScreen createdCampaign={createdCampaign} onReset={resetForm} />
        </div>
      </div>
    );
  }

  // MAIN FORM
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Create a Donation Campaign</h1>
          <p className="text-muted-foreground">
            Direct contract flow: Prepare data → Submit → Campaign created immediately with allocations locked
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg shadow-sm p-8">
          {step <= 6 && <StepIndicator currentStep={step} steps={steps} />}

          {/* Steps 1-4: OFF-CHAIN */}
          {step === 1 && (
            <Step1CampaignInfo
              campaignName={campaignName}
              setCampaignName={setCampaignName}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2NGOSelection
              selectedNGOs={selectedNGOs}
              setSelectedNGOs={setSelectedNGOs}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Step3SetAllocation
              selectedNGOs={selectedNGOs}
              allocations={allocations}
              setAllocations={setAllocations}
              totalBps={totalBps}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <Step4ConfirmAllocation
              selectedNGOs={selectedNGOs}
              allocations={allocations}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          )}

          {/* Step 5: Details (OFF-CHAIN) */}
          {step === 5 && (
            <Step5CampaignDetails
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              imageFiles={imageFiles}
              imagePreviewUrls={imagePreviewUrls}
              onImageUpload={handleImageUpload}
              removeImage={removeImage}
              onNext={() => setStep(6)}
              onBack={() => setStep(4)}
            />
          )}

          {/* Step 6: Submit to contract (ON-CHAIN) */}
          {step === 6 && (
            <Step6Review
              campaignData={campaignData}
              selectedNGOs={selectedNGOs}
              allocations={allocations}
              imageCount={imageFiles.length}
              onSubmit={handleSubmitToSafe}
              onBack={() => setStep(5)}
              isSubmitting={isSubmitting}
              transactionStep={transactionStep}
              currentTransaction={currentTransaction}
            />
          )}
        </div>
      </div>
    </div>
  );
}
