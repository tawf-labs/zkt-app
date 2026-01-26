"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, Lock, ExternalLink, Gift } from "lucide-react";
import { useWallet } from "@/components/providers/web3-provider";
import { useToast } from "@/hooks/use-toast";
import { parseDonationAmount } from "@/lib/donate";
import { supabase } from "@/lib/supabase-client";
import { useCampaignStatus } from "@/hooks/useCampaignStatus";
import { CONTRACT_ADDRESSES } from "@/lib/abi";

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string | number; // can be hash (string) or numeric ID
  campaignIdHash?: string; // on-chain campaign ID (bytes32 hash)
  campaignTitle: string;
  campaignGoal: number;
  campaignRaised: number;
  onSuccess?: () => void;
}

export function DonationDialog({
  open,
  onOpenChange,
  campaignId,
  campaignIdHash,
  campaignTitle,
  campaignGoal,
  campaignRaised,
  onSuccess,
}: DonationDialogProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mintedNftId, setMintedNftId] = useState<bigint | null>(null);
  const [donationTxHash, setDonationTxHash] = useState<string | null>(null);
  const { donate, isConnected, idrxBalance, formattedIdrxBalance, isDonating } = useWallet();
  const { toast } = useToast();

  // Reset NFT state when dialog closes
  useEffect(() => {
    if (!open) {
      setMintedNftId(null);
      setDonationTxHash(null);
      setAmount("");
    }
  }, [open]);

  // Fetch campaign status to check if donations are allowed
  const { 
    statusInfo,
    canDonate,
    isLoading: isLoadingStatus,
    campaign,
    allocationLocked,
    refetch: refetchCampaignStatus,
  } = useCampaignStatus(
    campaignIdHash || (typeof campaignId === 'string' && campaignId.startsWith('0x') ? campaignId : null)
  );

  // Force refetch when dialog opens to bypass cache and get latest contract state
  useEffect(() => {
    if (open && !isLoadingStatus) {
      refetchCampaignStatus();
    }
  }, [open, refetchCampaignStatus, campaign, allocationLocked, canDonate]);

  const handleDonate = async () => {
    // CRITICAL: Hard block donations unless allocation is explicitly locked

    if (!campaign?.exists) {
      toast({
        variant: "destructive",
        title: "Campaign Not Found",
        description: "This campaign does not exist on-chain. Please try again.",
      });
      return;
    }

    if (!allocationLocked) {
      toast({
        variant: "destructive",
        title: "Allocation Not Locked",
        description: "This campaign's allocation has not been finalized and locked yet. Donations cannot be accepted. Please contact the campaign administrator.",
      });
      return;
    }

    // Check campaign status before attempting donation
    if (!canDonate && statusInfo) {
      toast({
        variant: "destructive",
        title: "Campaign Not Ready",
        description: statusInfo.description || "This campaign is not yet accepting donations. Allocation must be locked and campaign must be within active time window.",
      });
      return;
    }

    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to donate",
      });
      return;
    }

    if (!amount || amount.trim() === "") {
      toast({
        variant: "destructive",
        title: "Amount Required",
        description: "Please enter a donation amount",
      });
      return;
    }

    const donationAmount = parseFloat(amount);
    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid donation amount greater than 0",
      });
      return;
    }

    // Check if amount exceeds balance (use raw bigint balance, not formatted string)
    const balance = idrxBalance ? Number(idrxBalance) / 1e6 : 0; // Convert from base units (6 decimals)
    if (donationAmount > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `You have ${balance.toLocaleString('id-ID')} IDRX available`,
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Convert to BigInt (wei format)
      const amountInWei = parseDonationAmount(donationAmount.toString());

      // Determine if campaignId is a hash (0x...) or numeric
      let poolId: string | bigint;
      if (typeof campaignId === 'string' && campaignId.startsWith('0x')) {
        // It's a hash, use directly
        poolId = campaignId;
      } else {
        // It's numeric, convert to BigInt
        const numericId = typeof campaignId === 'string' ? parseInt(campaignId, 10) : campaignId;
        poolId = BigInt(numericId);
      }

      const { txHash, nftTokenId } = await donate({
        poolId,
        campaignTitle,
        amountIDRX: amountInWei,
      });

      // Store the NFT token ID and tx hash
      if (nftTokenId !== null && nftTokenId !== undefined) {
        setMintedNftId(nftTokenId);
        setDonationTxHash(txHash);

        // Show success toast with NFT info
        toast({
          title: "NFT Minted! 🎨",
          description: `Receipt NFT #${nftTokenId} has been minted to your wallet`,
        });
      }

      // Update Supabase with new raised amount
      try {
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('total_raised')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const newTotalRaised = (campaign?.total_raised || campaignRaised) + donationAmount;

        await supabase
          .from('campaigns')
          .update({ total_raised: newTotalRaised })
          .eq('campaign_id', campaignId);
      } catch (supabaseError) {
      }

      // Trigger parent refresh (but don't close dialog yet)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      
      toast({
        variant: "destructive",
        title: "Donation Failed",
        description: error?.reason || error?.message || "Transaction failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [10000, 50000, 100000, 500000];
  const remaining = campaignGoal - campaignRaised;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Allow closing only if not processing or if showing success
      if (!isProcessing && !isDonating) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mintedNftId ? "🎉 Donation Successful!" : "Donate to Campaign"}
          </DialogTitle>
          <DialogDescription>
            {mintedNftId ? "Your NFT receipt has been minted" : campaignTitle}
          </DialogDescription>
        </DialogHeader>

        {/* Success Screen with NFT Info */}
        {mintedNftId && (
          <div className="space-y-4 py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <Gift className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-900 mb-1">Your NFT Receipt</p>
              <p className="text-sm text-green-700 mb-3">
                Token ID: #{mintedNftId.toString()}
              </p>
              <div className="space-y-2 text-xs text-green-800">
                <p className="font-medium">NFT Contract:</p>
                <p className="font-mono break-all">{CONTRACT_ADDRESSES.DonationReceiptNFT}</p>
                <a
                  href={`https://sepolia.basescan.org/token/${CONTRACT_ADDRESSES.DonationReceiptNFT}?a=${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 hover:underline mt-2"
                >
                  View on Basescan <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {donationTxHash && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                <p className="font-medium text-blue-900 mb-1">Transaction:</p>
                <a
                  href={`https://sepolia.basescan.org/tx/${donationTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-700 hover:text-blue-900 hover:underline break-all"
                >
                  {donationTxHash}
                </a>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-900">
              <p className="font-semibold mb-1">⚠️ NFT Not Showing in Wallet?</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-800">
                <li>Check your wallet's NFT/Collectibles tab</li>
                <li>Import NFT with contract address above</li>
                <li>Refresh your wallet or switch networks</li>
              </ul>
            </div>

            <Button
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        )}

        {/* Donation Form (show when no NFT minted yet) */}
        {!mintedNftId && (
        <div className="space-y-6 py-4">
          {/* Allocation Guard Alert */}
          {!allocationLocked && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 text-sm">Donations Disabled</p>
                <p className="text-xs text-red-800 mt-1">
                  This campaign is not ready to accept donations. The allocation has not been finalized and locked. 
                  Please contact the campaign administrator.
                </p>
              </div>
            </div>
          )}

          {/* Campaign Progress */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-semibold">{campaignRaised.toLocaleString('id-ID')} IDRX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Goal</span>
              <span className="font-semibold">{campaignGoal.toLocaleString('id-ID')} IDRX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-semibold text-primary">{remaining.toLocaleString('id-ID')} IDRX</span>
            </div>
          </div>

          {/* Wallet Balance */}
          {isConnected && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Your Balance</span>
              <span className="font-bold text-primary">{formattedIdrxBalance} IDRX</span>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (IDRX)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in IDRX"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              disabled={isProcessing || isDonating}
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  disabled={isProcessing || isDonating}
                  className="text-xs"
                >
                  {(quickAmount / 1000).toFixed(0)}K
                </Button>
              ))}
            </div>
          </div>

          {/* Warning */}
          {!isConnected && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                Please connect your wallet to make a donation
              </p>
            </div>
          )}

          {/* Campaign Status Warning */}
          {!canDonate && statusInfo && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Lock className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-800">
                  Campaign Not Ready
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  {statusInfo.description}
                </p>
              </div>
            </div>
          )}

          {/* Transaction Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm space-y-1">
            <p className="font-semibold text-blue-900">ℹ️ Transaction Details</p>
            <ul className="list-disc list-inside text-blue-800 space-y-0.5 text-xs">
              <li>Approval required for first-time donation</li>
              <li>You'll receive a soulbound NFT receipt</li>
              <li>Earn vZKT governance tokens (1:1 ratio)</li>
              <li>All transactions recorded on Base Sepolia</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing || isDonating}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleDonate}
              disabled={!canDonate || !isConnected || !amount || isProcessing || isDonating || isLoadingStatus || !allocationLocked}
              title={!allocationLocked ? "Allocation must be locked to donate" : ""}
            >
              {isProcessing || isDonating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isDonating ? "Processing..." : "Confirming..."}
                </>
              ) : !allocationLocked ? (
                "Allocation Not Locked"
              ) : !canDonate ? (
                "Campaign Not Ready"
              ) : (
                "Confirm Donation"
              )}
            </Button>
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
