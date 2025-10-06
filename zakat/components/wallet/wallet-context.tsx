"use client"

import React from "react"

export type Donation = {
  id: string
  campaignId: string
  campaignTitle: string
  amountUSDT: number
  txHash: string
  timestamp: number
  proofUri?: string
}

type WalletState = {
  address: string | null
  usdtBalance: number // USDT integer with 2 decimals semantics (e.g., 1234.56)
  donations: Donation[]
  isConnected: boolean
}

type WalletContextType = {
  state: WalletState
  connect: (address?: string) => void
  disconnect: () => void
  donate: (opts: { campaignId: string; campaignTitle: string; amountUSDT: number }) => { txHash: string }
  formatAddress: (addr?: string | null) => string
}

const WalletContext = React.createContext<WalletContextType | undefined>(undefined)

const STORAGE_KEY = "zk-zakat-wallet-state-v1"

const mockAddresses = [
  "0x5fB5a15E2e3bF2B3d9c7c7dB2cC1aBfF3e1D4C77",
  "0xA8cE2f9C947d5bA2f01D1cEF7b9c1Af7E3bB9c20",
  "0x1F42d7E3aB1f9ce42D7b5eEEa2c0fFA1aBf23777",
]

function loadState(): WalletState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(s: WalletState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {}
}

function seedDonations(address: string): Donation[] {
  // Provide a couple of seeded donations and proofs for demo
  const now = Date.now()
  return [
    {
      id: crypto.randomUUID(),
      campaignId: "1",
      campaignTitle: "Emergency Food Packs",
      amountUSDT: 25,
      txHash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
      timestamp: now - 1000 * 60 * 60 * 24 * 3,
      proofUri: "ipfs://mock-proof-1",
    },
    {
      id: crypto.randomUUID(),
      campaignId: "2",
      campaignTitle: "Clean Water Access",
      amountUSDT: 40,
      txHash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
      timestamp: now - 1000 * 60 * 60 * 24 * 1,
      proofUri: "ipfs://mock-proof-2",
    },
  ]
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<WalletState>(() => {
    const loaded = loadState()
    return (
      loaded ?? {
        address: null,
        usdtBalance: 1000, // 1000.00 USDT starting mock balance
        donations: [],
        isConnected: false,
      }
    )
  })

  React.useEffect(() => {
    saveState(state)
  }, [state])

  const connect = React.useCallback((addr?: string) => {
    const address = addr || mockAddresses[Math.floor(Math.random() * mockAddresses.length)]
    setState((prev) => {
      const alreadySeeded = prev.isConnected || prev.donations.length > 0
      return {
        address,
        usdtBalance: prev.usdtBalance ?? 1000,
        donations: alreadySeeded ? prev.donations : seedDonations(address),
        isConnected: true,
      }
    })
  }, [])

  const disconnect = React.useCallback(() => {
    setState({
      address: null,
      usdtBalance: 1000,
      donations: [],
      isConnected: false,
    })
  }, [])

  const donate = React.useCallback((opts: { campaignId: string; campaignTitle: string; amountUSDT: number }) => {
    const { campaignId, campaignTitle, amountUSDT } = opts
    if (!amountUSDT || amountUSDT <= 0) {
      throw new Error("Invalid amount")
    }
    setState((prev) => {
      if (!prev.isConnected || !prev.address) throw new Error("Wallet not connected")
      if (amountUSDT > prev.usdtBalance) throw new Error("Insufficient USDT balance")
      const txHash = `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`
      const donation: Donation = {
        id: crypto.randomUUID(),
        campaignId,
        campaignTitle,
        amountUSDT,
        txHash,
        timestamp: Date.now(),
        proofUri: Math.random() > 0.5 ? `ipfs://mock-proof-${Math.floor(Math.random() * 1000)}` : undefined,
      }
      return {
        ...prev,
        usdtBalance: Number((prev.usdtBalance - amountUSDT).toFixed(2)),
        donations: [donation, ...prev.donations],
      }
    })
    const txHash = `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`
    return { txHash }
  }, [])

  const formatAddress = React.useCallback((addr?: string | null) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`
  }, [])

  const value: WalletContextType = { state, connect, disconnect, donate, formatAddress }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = React.useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used within WalletProvider")
  return ctx
}
