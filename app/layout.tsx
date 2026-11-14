// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WalletProvider } from "@/components/providers/web3-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { SearchProvider } from "@/components/shared/SearchContext";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zkt.app';
const siteUrl = rawSiteUrl.replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "zkt.app - Transparent and Traceable Zakat Donations",
    template: "%s | zkt.app",
  },
  description:
    "Private, verifiable Zakat and charitable donations powered by zero-knowledge proofs and blockchain transparency. Track donations in real-time.",
  applicationName: "zkt.app",
  generator: "Next.js",
  keywords: [
    "Zakat",
    "Zakat Maal",
    "Zakat Fitrah",
    "Crypto Zakat",
    "Blockchain Donation",
    "Zero Knowledge Proofs",
    "zk-SNARKs",
    "ZK Zakat",
    "Transparent Charity",
    "Web3 Philanthropy",
    "Infaq",
    "Sadaqah",
    "Waqf",
    "Ethereum",
    "Base",
  ],
  authors: [{ name: "zkt.app", url: siteUrl }],
  creator: "zkt.app",
  publisher: "zkt.app",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    url: siteUrl,
    siteName: "zkt.app",
    title: "zkt.app - Transparent and Traceable Zakat Donations",
    description:
      "Private, verifiable Zakat and charitable donations powered by zero-knowledge proofs and blockchain transparency.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "zkt.app - Transparent and Traceable Zakat Donations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "zkt.app - Transparent and Traceable Zakat Donations",
    description:
      "Private, verifiable Zakat and charitable donations powered by zero-knowledge proofs and blockchain transparency.",
    images: ["/twitter-image"],
    creator: "@zktapp",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "zkt.app",
        description:
          "Private, verifiable Zakat and charitable donations powered by zero-knowledge proofs and blockchain transparency.",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/campaigns?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: ["en-US", "id-ID"],
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "zkt.app",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
          width: 542,
          height: 460,
        },
        description:
          "Web3 charitable platform enabling private, verifiable Zakat donations using zero-knowledge cryptography.",
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>
            <WalletProvider>
                <CurrencyProvider>
                  <SearchProvider>
                    <Header />
                    <Suspense fallback={null}>{children}</Suspense>
                    <Footer />
                    <Toaster />
                  </SearchProvider>
                </CurrencyProvider>
            </WalletProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
