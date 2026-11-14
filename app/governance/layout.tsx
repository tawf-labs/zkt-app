import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DAO Governance',
  description:
    'Participate in decentralized charitable governance, review proposals, and vote on community fund allocations and protocol decisions on zkt.app.',
  alternates: {
    canonical: '/governance',
  },
  openGraph: {
    title: 'DAO Governance | zkt.app',
    description:
      'Participate in decentralized charitable governance, review proposals, and vote on community fund allocations and protocol decisions on zkt.app.',
    url: '/governance',
  },
};

export default function GovernanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
