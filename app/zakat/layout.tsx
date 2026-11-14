import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zakat Calculator & Distribution',
  description:
    'Calculate your Zakat Maal and Zakat Fitrah accurately according to Islamic nisab standards and donate privately with zero-knowledge proofs on zkt.app.',
  alternates: {
    canonical: '/zakat',
  },
  openGraph: {
    title: 'Zakat Calculator & Distribution | zkt.app',
    description:
      'Calculate your Zakat Maal and Zakat Fitrah accurately according to Islamic nisab standards and donate privately with zero-knowledge proofs on zkt.app.',
    url: '/zakat',
  },
};

export default function ZakatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
