import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testnet Token Faucet',
  description:
    'Claim testnet IDRX tokens to test zero-knowledge donations and transparent campaign funding on zkt.app.',
  alternates: {
    canonical: '/faucet',
  },
  openGraph: {
    title: 'Testnet Token Faucet | zkt.app',
    description:
      'Claim testnet IDRX tokens to test zero-knowledge donations and transparent campaign funding on zkt.app.',
    url: '/faucet',
  },
};

export default function FaucetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
