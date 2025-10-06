"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Zakat Home">
            <Image src="/placeholder-logo.png" alt="ZK Zakat logo" width={28} height={28} className="rounded-sm" />
            <span className={cn("text-sm font-semibold tracking-tight")}>ZK Zakat</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/#campaigns" className="text-sm text-muted-foreground hover:text-foreground">
              Campaigns
            </Link>
            <Link href="/dao" className="text-sm text-muted-foreground hover:text-foreground">
              DAO
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden md:inline-flex bg-transparent">
            <Link href="/#how-it-works">How it works</Link>
          </Button>
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
