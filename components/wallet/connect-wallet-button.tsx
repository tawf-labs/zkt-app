"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useWallet } from "./wallet-context"

export function ConnectWalletButton() {
  const { state, connect, disconnect, formatAddress } = useWallet()
  const [open, setOpen] = React.useState(false)

  if (state.isConnected && state.address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="bg-primary text-primary-foreground hover:opacity-90">
            {formatAddress(state.address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Balance: {state.usdtBalance.toFixed(2)} USDT</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/dashboard">My Zakat Dashboard</a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => disconnect()}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:opacity-90">Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>Select a mock wallet to continue. No real funds are used.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Button
            variant="outline"
            onClick={() => {
              connect()
              setOpen(false)
            }}
          >
            Connect Mock Wallet
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
