import { notFound } from "next/navigation"
import { getCampaignById } from "@/data/campaigns"
import { DonationDialog } from "@/components/donations/donation-dialog"

type PageProps = { params: { id: string } }

export default function CampaignDetailsPage({ params }: PageProps) {
  const campaign = getCampaignById(params.id)
  if (!campaign) return notFound()

  return (
    <main className="container mx-auto min-h-dvh px-4 py-12">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <img
              src={`/.jpg?height=420&width=800&query=${campaign.imageQuery}`}
              alt={`${campaign.title} cover image`}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold">{campaign.title}</h1>
          <p className="text-muted-foreground">By {campaign.charity}</p>
          <p className="leading-relaxed">{campaign.description}</p>

          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">Disbursement Proofs</h2>
            <ProofList campaignId={campaign.id} />
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <div
              className="mb-3 h-2 w-full rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((campaign.raised / campaign.goal) * 100)}
              aria-label="Funding progress"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round((campaign.raised / campaign.goal) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${campaign.raised.toLocaleString()} raised</span>
              <span>of ${campaign.goal.toLocaleString()}</span>
            </div>
          </div>

          <DonationDialog campaignId={campaign.id} campaignTitle={campaign.title} />

          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-1 font-medium">About the charity</h3>
            <p className="text-sm text-muted-foreground">
              {campaign.charity} is verified and accountable. Disbursements are reviewed with DAO oversight and private
              documentation for recipients.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
// Client subcomponent kept isolated to avoid RSC using context
;("use client")
import { useWallet } from "@/components/wallet/wallet-context"

function ProofList({ campaignId }: { campaignId: string }) {
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
