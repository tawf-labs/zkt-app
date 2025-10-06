export type Campaign = {
  id: string
  title: string
  charity: string
  raised: number
  goal: number
  imageQuery: string
  description?: string
}

export const campaigns: Campaign[] = [
  {
    id: "1",
    title: "Emergency Food Packs",
    charity: "Global Relief Network",
    raised: 1500,
    goal: 5000,
    imageQuery: "volunteers%20distributing%20food%20aid",
    description:
      "Providing essential food packs to vulnerable families facing acute shortages. Your support brings immediate relief.",
  },
  {
    id: "2",
    title: "Clean Water Access",
    charity: "Hope Wells",
    raised: 3800,
    goal: 8000,
    imageQuery: "water%20distribution%20community%20aid",
    description: "Building and repairing wells to ensure safe, reliable access to clean water for rural communities.",
  },
  {
    id: "3",
    title: "Medical Aid Kits",
    charity: "CareBridge",
    raised: 2200,
    goal: 6000,
    imageQuery: "medical%20aid%20delivery%20to%20families",
    description: "Supplying clinics with medicines and first-aid kits to support urgent healthcare needs.",
  },
]

export function getCampaignById(id: string) {
  return campaigns.find((c) => c.id === id)
}
