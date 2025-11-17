"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useWallet } from "@/components/wallet/wallet-context"
import { useToast } from "@/components/ui/use-toast"

type Props = {
  campaignId: string
  campaignTitle: string
}

export function DonationDialog({ campaignId, campaignTitle }: Props) {
  const { state, donate } = useWallet()
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [amount, setAmount] = React.useState<string>("25")
  const [isApproving, setIsApproving] = React.useState(false)
  const [isDonating, setIsDonating] = React.useState(false)
  const [approved, setApproved] = React.useState(false)

  const canDonate = state.isConnected && Number(amount) > 0 && Number(amount) <= state.usdtBalance && approved

  async function handleApprove() {
    setIsApproving(true)
    await new Promise((r) => setTimeout(r, 700)) // simulate approval tx
    setApproved(true)
    setIsApproving(false)
    toast({ title: "Approval granted", description: "USDT allowance approved for donation." })
  }

  async function handleDonate() {
    try {
      if (!canDonate) return
      setIsDonating(true)
      await new Promise((r) => setTimeout(r, 900)) // simulate chain latency
      const { txHash } = donate({
        campaignId,
        campaignTitle,
        amountUSDT: Number(amount),
      })
      setIsDonating(false)
      setOpen(false)
      setApproved(false)
      toast({ title: "Donation successful", description: `TX: ${txHash.slice(0, 10)}…` })
    } catch (e: any) {
      setIsDonating(false)
      toast({ title: "Donation failed", description: e?.message || "Unknown error" })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setApproved(false)
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:opacity-90">Donate Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Donate in USDT</DialogTitle>
          <DialogDescription>
            Support “{campaignTitle}”. This is a mock transaction; no real funds are used.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (USDT)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="25"
            />
            <p className="text-xs text-muted-foreground">Balance: {state.usdtBalance.toFixed(2)} USDT</p>
          </div>
          {!state.isConnected && <p className="text-sm text-destructive">Please connect your wallet first.</p>}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleApprove} disabled={!state.isConnected || isApproving || approved}>
              {approved ? "Approved" : isApproving ? "Approving…" : "Approve USDT"}
            </Button>
            <Button
              onClick={handleDonate}
              disabled={!canDonate || isDonating}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              {isDonating ? "Donating…" : "Donate"}
            </Button>
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
