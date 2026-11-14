import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZK Transaction Explorer',
  description:
    'Verify and trace zero-knowledge donation transactions, smart contract executions, and charitable distributions on-chain with full transparency.',
  alternates: {
    canonical: '/explorer',
  },
  openGraph: {
    title: 'ZK Transaction Explorer | zkt.app',
    description:
      'Verify and trace zero-knowledge donation transactions, smart contract executions, and charitable distributions on-chain with full transparency.',
    url: '/explorer',
  },
};

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
