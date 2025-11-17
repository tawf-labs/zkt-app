"use client"

import { useWallet } from "@/components/wallet/wallet-context"

export default function DashboardPage() {
  const { state } = useWallet()
  return (
    <main className="container mx-auto min-h-dvh px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">My Zakat</h1>
      {!state.isConnected ? (
        <p className="text-muted-foreground">Please connect your wallet to view your dashboard.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-lg border border-border p-4">
            <h2 className="mb-2 font-medium">Wallet</h2>
            <p className="text-sm text-muted-foreground">Balance: {state.usdtBalance.toFixed(2)} USDT</p>
          </section>

          <section className="md:col-span-2 rounded-lg border border-border p-4">
            <h2 className="mb-3 font-medium">Donation History</h2>
            {state.donations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No donations yet.</p>
            ) : (
              <ul className="space-y-2">
                {state.donations.map((d) => (
                  <li key={d.id} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="text-pretty">
                        <span className="font-medium">{d.campaignTitle}</span>
                        <span className="text-muted-foreground"> • {d.amountUSDT.toFixed(2)} USDT</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        TX: {d.txHash.slice(0, 10)}… • {new Date(d.timestamp).toLocaleString()}
                      </div>
                    </div>
                    {d.proofUri && <p className="mt-1 text-xs text-muted-foreground">Proof: {d.proofUri}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
