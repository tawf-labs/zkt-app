import type React from "react";
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

export const metadata: Metadata = {
  title: "ZK Zakat",
  description: "Private, verifiable Zakat with ZK proofs",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
<WalletProvider>
					<CurrencyProvider>
            <Header />
            <Suspense fallback={null}>{children}</Suspense>
            <Footer />
            <Toaster />
          </CurrencyProvider>
</WalletProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}