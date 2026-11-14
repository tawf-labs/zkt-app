import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mainnet Launch Roadmap',
  description:
    'Follow the progress of the zkt.app mainnet deployment and test our zero-knowledge donation features on testnet.',
  alternates: {
    canonical: '/mainnet',
  },
  openGraph: {
    title: 'Mainnet Launch Roadmap | zkt.app',
    description:
      'Follow the progress of the zkt.app mainnet deployment and test our zero-knowledge donation features on testnet.',
    url: '/mainnet',
  },
};

export default function MainnetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
