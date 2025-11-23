export type Campaign = {
  id: number;
  title: string;
  organization: string;
  category: string;
  raised: number;
  goal: number;
  donors: number;
  daysLeft: number;
  image: string;
};

export const campaigns: Campaign[] = [
  {
    id: 1,
    title: "Emergency Relief for Earthquake Victims in Cianjur",
    organization: "Baznas Indonesia",
    category: "Emergency",
    raised: 125000,
    goal: 150000,
    donors: 2500,
    daysLeft: 12,
    image: "/child-with-meal-support.jpg"
  },
  {
    id: 2,
    title: "Build a Clean Water Well for Remote Village",
    organization: "Human Initiative",
    category: "Waqf",
    raised: 8500,
    goal: 12000,
    donors: 170,
    daysLeft: 45,
    image: "/community-receiving-food-aid-with-dignity.jpg"
  },
  {
    id: 3,
    title: "Scholarship Fund for 100 Orphan Students",
    organization: "Rumah Zakat",
    category: "Zakat",
    raised: 45000,
    goal: 50000,
    donors: 900,
    daysLeft: 5,
    image: "/happy-family-receiving-aid.jpg"
  },
  {
    id: 4,
    title: "Food Packages for Families in Need",
    organization: "Dompet Dhuafa",
    category: "Sadaqah",
    raised: 12000,
    goal: 25000,
    donors: 240,
    daysLeft: 20,
    image: "/child-with-meal-support.jpg"
  },
  {
    id: 5,
    title: "Medical Aid for Remote Communities",
    organization: "Lazismu",
    category: "Zakat",
    raised: 35000,
    goal: 60000,
    donors: 700,
    daysLeft: 18,
    image: "/community-receiving-food-aid-with-dignity.jpg"
  },
  {
    id: 6,
    title: "Mosque Renovation Project",
    organization: "BWI",
    category: "Waqf",
    raised: 80000,
    goal: 100000,
    donors: 1600,
    daysLeft: 60,
    image: "/happy-family-receiving-aid.jpg"
  }
];

export const categories = ["Zakat", "Infaq", "Sadaqah", "Waqf", "Emergency"];
export const locations = ["Indonesia", "Palestine", "Syria", "Yemen", "Global"];
export const organizations = ["Baznas", "Dompet Dhuafa", "Rumah Zakat", "Human Initiative", "Lazismu"];

export const calculateProgress = (raised: number, goal: number) => {
  const progress = (raised / goal) * 100;
  return -((100 - progress));
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

export const getCampaignById = (id: number) => {
  return campaigns.find((campaign) => campaign.id === id);
};