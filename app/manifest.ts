import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'zkt.app - Transparent & Traceable Zakat Donations',
    short_name: 'zkt.app',
    description:
      'Private, verifiable Zakat and charitable donations powered by zero-knowledge proofs and blockchain transparency.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
