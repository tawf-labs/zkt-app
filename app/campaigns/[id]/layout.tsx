import type { Metadata } from 'next';
import { campaigns } from '@/data/campaigns';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numId = parseInt(id, 10);
  const staticCampaign = !isNaN(numId)
    ? campaigns.find((c) => c.id === numId)
    : undefined;

  if (staticCampaign) {
    const title = staticCampaign.title;
    const description = `Support "${staticCampaign.title}" organized by ${staticCampaign.organization}. Category: ${staticCampaign.category}. Goal: ${staticCampaign.goal.toLocaleString()} IDRX. Traceable on-chain with zero-knowledge donor privacy.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/campaigns/${id}`,
      },
      openGraph: {
        title: `${title} | zkt.app`,
        description,
        url: `/campaigns/${id}`,
        images: [
          {
            url: staticCampaign.image,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | zkt.app`,
        description,
        images: [staticCampaign.image],
      },
    };
  }

  return {
    title: 'Campaign Details',
    description:
      'View campaign details, verified progress, and donate securely with zero-knowledge proofs on zkt.app.',
    alternates: {
      canonical: `/campaigns/${id}`,
    },
    openGraph: {
      title: 'Campaign Details | zkt.app',
      description:
        'View campaign details, verified progress, and donate securely with zero-knowledge proofs on zkt.app.',
      url: `/campaigns/${id}`,
    },
  };
}

export default function CampaignDetailLayout({ children }: Props) {
  return children;
}
