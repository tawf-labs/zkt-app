import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Campaigns',
  description:
    'Discover and donate to verified Zakat, Waqf, Sadaqah, and emergency relief campaigns with transparent on-chain tracking and zero-knowledge privacy.',
  alternates: {
    canonical: '/campaigns',
  },
  openGraph: {
    title: 'Explore Campaigns | zkt.app',
    description:
      'Discover and donate to verified Zakat, Waqf, Sadaqah, and emergency relief campaigns with transparent on-chain tracking and zero-knowledge privacy.',
    url: '/campaigns',
  },
};

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
