"use client"
import { useWallet } from "@/components/wallet/wallet-context"

export default function ProofList({ campaignId }: { campaignId: string }) {
  const { state } = useWallet()
  const proofs = state.donations.filter((d) => d.campaignId === campaignId && d.proofUri)

  if (proofs.length === 0) {
    return <p className="text-sm text-muted-foreground">No proofs published yet.</p>
  }

  return (
    <ul className="space-y-2">
      {proofs.map((d) => (
        <li key={d.id} className="rounded-md border border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Proof: {d.proofUri}</span>
            <span className="text-xs text-muted-foreground">
              TX: {d.txHash.slice(0, 10)}… • {new Date(d.timestamp).toLocaleDateString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
