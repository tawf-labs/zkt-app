import { campaigns } from "@/data/campaigns";

/**
 * Get campaign name by campaignId (bytes32 hash).
 * Tries to match with static campaigns first, falls back to truncated hash.
 */
export function getCampaignName(campaignId: string): string {
  // Try to match campaignId with static campaigns by checking if the ID appears in the hash
  for (const campaign of campaigns) {
    if (campaignId.includes(campaign.id.toString())) {
      return campaign.title;
    }
  }

  // If no match, return truncated hash
  return `Campaign ${campaignId.slice(0, 8)}...`;
}

/**
 * Get campaign category by campaignId.
 * Returns the category or 'Zakat' as default.
 */
export function getCampaignCategory(campaignId: string): string {
  for (const campaign of campaigns) {
    if (campaignId.includes(campaign.id.toString())) {
      return campaign.category;
    }
  }

  return "Zakat";
}

/**
 * Calculate donation statistics from NFT amounts.
 */
export function calculateDonationStats(totalAmount: number, nftCount: number, uniqueCampaigns: number) {
  return {
    totalDonated: totalAmount,
    campaignsSupported: uniqueCampaigns,
    averageDonation: nftCount > 0 ? totalAmount / nftCount : 0,
  };
}
