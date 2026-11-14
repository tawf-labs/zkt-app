import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organization Registration',
  description:
    'Register your charitable organization, NGO, or foundation on zkt.app to launch verified donation campaigns and receive on-chain funding.',
  alternates: {
    canonical: '/organization/register',
  },
  openGraph: {
    title: 'Organization Registration | zkt.app',
    description:
      'Register your charitable organization, NGO, or foundation on zkt.app to launch verified donation campaigns and receive on-chain funding.',
    url: '/organization/register',
  },
};

export default function OrganizationRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
