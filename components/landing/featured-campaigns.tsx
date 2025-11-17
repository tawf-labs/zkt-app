import { campaigns } from "@/data/campaigns"
import CampaignCard from "@/components/shared/campaign-card"

function FeaturedCampaigns() {
  // Show first 3 campaigns as featured
  const featuredCampaigns = campaigns.slice(0, 3)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredCampaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  )
}

export { FeaturedCampaigns }