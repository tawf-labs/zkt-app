"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESSES, MockIDRXABI, formatIDRX } from "@/lib/abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Droplet, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { useIDRXBalance } from "@/hooks/useIDRXBalance";
import { handleTransactionError, handleWalletError } from "@/lib/errors";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { balance, formattedBalance, refetch: refetchBalance } = useIDRXBalance();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);

  // Try to check if new IDRX has faucet (it might not)
  const {
    data: canClaim,
    isLoading: isCheckingEligibility,
    refetch: refetchEligibility,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.IDRX,
    abi: MockIDRXABI,
    functionName: "canClaimFaucet",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10_000,
    },
  });

  // Get last claim timestamp for countdown
  const { data: lastClaimTime } = useReadContract({
    address: CONTRACT_ADDRESSES.IDRX,
    abi: MockIDRXABI,
    functionName: "lastClaimTime",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !canClaim,
    },
  });

  // Calculate countdown
  useEffect(() => {
    if (!lastClaimTime || canClaim) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const lastClaim = Number(lastClaimTime);
      const nextClaimTime = lastClaim + 24 * 60 * 60; // 24 hours in seconds
      const now = Math.floor(Date.now() / 1000);
      const remaining = nextClaimTime - now;

      if (remaining <= 0) {
        setCountdown(null);
        refetchEligibility();
      } else {
        setCountdown(remaining);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastClaimTime, canClaim, refetchEligibility]);

  // Faucet claim transaction
  const {
    writeContract,
    data: txHash,
    isPending: isClaimPending,
    error: claimError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Handle claim
  const handleClaim = async () => {
    if (!isConnected) {
      handleWalletError(new Error("not-connected"), { toast });
      return;
    }

    if (!canClaim) {
      toast({
        title: "Cannot Claim",
        description: "You must wait 24 hours between claims",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESSES.IDRX,
        abi: MockIDRXABI,
        functionName: "faucet",
        args: [],
      });
    } catch (error) {
      handleTransactionError(error, { toast, action: "claim faucet" });
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Faucet Claimed!",
        description: "IDRX tokens have been sent to your wallet",
      });
      refetchBalance();
      refetchEligibility();
    }
  }, [isConfirmed, toast, refetchBalance, refetchEligibility]);

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Droplet className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">IDRX Faucet</CardTitle>
          <CardDescription>
            Get free testnet IDRX tokens for testing donations on Base Sepolia
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Token Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🪙 Token Information</p>
            <div className="space-y-1 text-blue-800 dark:text-blue-200">
              <p>Token: <span className="font-mono text-xs">IDRX (TestUSDC)</span></p>
              <p>Address: <span className="font-mono text-xs break-all">{CONTRACT_ADDRESSES.IDRX}</span></p>
              <a
                href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.IDRX}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs hover:underline mt-2"
              >
                View on Explorer <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Current Balance */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
            <p className="text-2xl font-bold">{formattedBalance} IDRX</p>
          </div>

          {/* Eligibility Status */}
          {isConnected ? (
            <Alert className={canClaim ? "border-green-500" : "border-yellow-500"}>
              {canClaim ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-500" />
              )}
              <AlertDescription>
                {isCheckingEligibility ? (
                  "Checking eligibility..."
                ) : canClaim ? (
                  "✅ You can claim from the faucet"
                ) : countdown !== null ? (
                  <>
                    ⏳ Next claim available in: <strong>{formatCountdown(countdown)}</strong>
                  </>
                ) : (
                  "You must wait 24 hours between claims"
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to use the faucet
              </AlertDescription>
            </Alert>
          )}

          {/* Claim Button */}
          <Button
            onClick={handleClaim}
            disabled={!isConnected || !canClaim || isClaimPending || isConfirming}
            className="w-full"
            size="lg"
          >
            {isClaimPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isClaimPending ? "Claiming..." : "Confirming..."}
              </>
            ) : isConfirmed ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Claimed Successfully!
              </>
            ) : (
              "Claim IDRX Tokens"
            )}
          </Button>

          {/* Transaction Hash */}
          {txHash && (
            <div className="text-center text-sm">
              <p className="text-muted-foreground mb-1">Transaction Hash:</p>
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {txHash}
              </a>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm space-y-2">
            <p className="font-semibold text-blue-900 dark:text-blue-100">ℹ️ Faucet Information</p>
            <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
              <li>Claim limit: Once every 24 hours per address</li>
              <li>Network: Base Sepolia Testnet</li>
              <li>Tokens are for testing purposes only</li>
              <li>Use tokens to donate to campaigns and test governance</li>
            </ul>
          </div>

          {/* Error Display */}
          {claimError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {claimError.message || "Failed to claim from faucet"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
