import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Campaign',
  description:
    'Launch a transparent donation or Zakat campaign on zkt.app secured by multisig Safe governance and blockchain tracking.',
  alternates: {
    canonical: '/campaigns/new',
  },
  openGraph: {
    title: 'Create Campaign | zkt.app',
    description:
      'Launch a transparent donation or Zakat campaign on zkt.app secured by multisig Safe governance and blockchain tracking.',
    url: '/campaigns/new',
  },
};

export default function CreateCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
