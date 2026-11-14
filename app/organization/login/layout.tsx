import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organization Portal Login',
  description:
    'Sign in to the zkt.app organization portal to manage campaigns, monitor donations, and track impact on-chain.',
  alternates: {
    canonical: '/organization/login',
  },
  openGraph: {
    title: 'Organization Portal Login | zkt.app',
    description:
      'Sign in to the zkt.app organization portal to manage campaigns, monitor donations, and track impact on-chain.',
    url: '/organization/login',
  },
};

export default function OrganizationLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
