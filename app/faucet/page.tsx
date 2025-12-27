"use client";

import { useAccount } from "wagmi";
import { formatIDRX } from "@/lib/abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Droplet, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useIDRXBalance } from "@/hooks/useIDRXBalance";
import { useFaucet } from "@/hooks/useFaucet";
import { useEffect, useState } from "react";

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { formattedBalance, refetch: refetchBalance } = useIDRXBalance();
  const {
    claimFaucet,
    canClaim,
    timeUntilNextClaim,
    faucetAmount,
    faucetCooldown,
    isLoading,
    isConfirmed,
    hash,
  } = useFaucet();
  
  const [countdown, setCountdown] = useState<number>(0);

  // Update countdown
  useEffect(() => {
    if (!timeUntilNextClaim || canClaim) {
      setCountdown(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Number(timeUntilNextClaim);
      setCountdown(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [timeUntilNextClaim, canClaim]);

  // Refresh balance on successful claim
  useEffect(() => {
    if (isConfirmed) {
      refetchBalance();
    }
  }, [isConfirmed, refetchBalance]);

  // Format countdown
  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return "0h 0m 0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Format cooldown period
  const formatCooldown = (seconds: bigint) => {
    const hrs = Number(seconds) / 3600;
    return `${hrs} hours`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Droplet className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">MockIDRX Faucet</CardTitle>
          <CardDescription>
            Get free testnet MockIDRX tokens for testing donations on Base Sepolia
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Balance */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
            <p className="text-2xl font-bold">{formattedBalance} IDRX</p>
          </div>

          {/* Faucet Amount Display */}
          {faucetAmount && (
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Claim Amount</p>
              <p className="text-xl font-semibold">{formatIDRX(faucetAmount)} IDRX</p>
            </div>
          )}

          {/* Eligibility Status */}
          {isConnected ? (
            <Alert className={canClaim ? "border-green-500" : "border-yellow-500"}>
              {canClaim ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-500" />
              )}
              <AlertDescription>
                {canClaim ? (
                  "✅ You can claim from the faucet"
                ) : countdown > 0 ? (
                  <>
                    ⏳ Next claim available in: <strong>{formatCountdown(countdown)}</strong>
                  </>
                ) : (
                  "Checking eligibility..."
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
            onClick={claimFaucet}
            disabled={!isConnected || !canClaim || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isConfirmed ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Claimed Successfully!
              </>
            ) : (
              "Claim MockIDRX"
            )}
          </Button>

          {/* Transaction Hash */}
          {hash && (
            <div className="text-center text-sm">
              <p className="text-muted-foreground mb-1">Transaction Hash:</p>
              <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {hash}
              </a>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm space-y-2">
            <p className="font-semibold text-blue-900 dark:text-blue-100">ℹ️ Faucet Information</p>
            <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
              <li>Claim limit: Once every {faucetCooldown ? formatCooldown(faucetCooldown) : '24 hours'} per address</li>
              <li>Claim amount: {faucetAmount ? formatIDRX(faucetAmount) : '100'} IDRX per claim</li>
              <li>Network: Base Sepolia Testnet</li>
              <li>Tokens are for testing purposes only</li>
              <li>Use tokens to donate to campaigns and test governance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
