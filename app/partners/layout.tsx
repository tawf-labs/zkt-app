import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partners & Institutions',
  description:
    'Partner with zkt.app as a verified charitable organization, NGO, or zakat institution. Submit credentials and connect with global donors.',
  alternates: {
    canonical: '/partners',
  },
  openGraph: {
    title: 'Partners & Institutions | zkt.app',
    description:
      'Partner with zkt.app as a verified charitable organization, NGO, or zakat institution. Submit credentials and connect with global donors.',
    url: '/partners',
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
