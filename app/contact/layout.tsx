import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the zkt.app team for inquiries regarding campaigns, institutional partnerships, or technical support.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | zkt.app',
    description:
      'Get in touch with the zkt.app team for inquiries regarding campaigns, institutional partnerships, or technical support.',
    url: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
