import { CampaignCard } from "@/components/shared/campaign-card"
import { campaigns } from "@/data/campaigns"

export function FeaturedCampaigns() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {campaigns.map((c) => (
        <CampaignCard key={c.id} campaign={c} />
      ))}
    </div>
  )
}
