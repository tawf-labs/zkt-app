"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { useWallet } from "@/components/providers/web3-provider";
import { useToast } from "@/hooks/use-toast";
import { parseDonationAmount } from "@/lib/donate";
import { supabase } from "@/lib/supabase-client";

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: number;
  campaignTitle: string;
  campaignGoal: number;
  campaignRaised: number;
  onSuccess?: () => void;
}

export function DonationDialog({
  open,
  onOpenChange,
  campaignId,
  campaignTitle,
  campaignGoal,
  campaignRaised,
  onSuccess,
}: DonationDialogProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { donate, isConnected, formattedIdrxBalance, isDonating } = useWallet();
  const { toast } = useToast();

  const handleDonate = async () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to donate",
      });
      return;
    }

    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Convert to BigInt (wei format)
      const amountInWei = parseDonationAmount(donationAmount.toString());

      const { txHash } = await donate({
        poolId: BigInt(campaignId),
        campaignTitle,
        amountIDRX: amountInWei,
      });

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

        console.log(`✅ Supabase updated: ${newTotalRaised} IDRX`);
      } catch (supabaseError) {
        console.warn('Could not update Supabase (non-critical):', supabaseError);
      }

      toast({
        title: "Donation Successful! 🎉",
        description: `You donated ${donationAmount.toLocaleString('id-ID')} IDRX to ${campaignTitle}`,
      });

      // Reset and close
      setAmount("");
      onOpenChange(false);

      // Trigger parent refresh
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("❌ Donation error details:", {
        message: error?.message,
        cause: error?.cause,
        reason: error?.reason,
        code: error?.code,
        fullError: error,
      });
      
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Donate to Campaign</DialogTitle>
          <DialogDescription>{campaignTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
              disabled={!isConnected || !amount || isProcessing || isDonating}
            >
              {isProcessing || isDonating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isDonating ? "Processing..." : "Confirming..."}
                </>
              ) : (
                "Confirm Donation"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
