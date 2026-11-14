import type { Metadata } from "next";

import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturedCampaigns } from "@/components/landing/featured-campaigns"

export const metadata: Metadata = {
  title: "Transparent & Traceable Donation Platform",
  description:
    "Donate securely and transparently through zero-knowledge proofs and blockchain technology. Every donation is recorded and trackable in real-time.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Transparent & Traceable Donation Platform | zkt.app",
    description:
      "Donate securely and transparently through zero-knowledge proofs and blockchain technology. Every donation is recorded and trackable in real-time.",
    url: "/",
  },
};


export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <Hero />
      {/* <Trusted /> */}
      <FeaturedCampaigns />
      <HowItWorks />
      <section id="campaigns" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-pretty">Featured Campaigns</h2>
            <Button asChild variant="default" className="bg-primary text-primary-foreground hover:opacity-90">
              <Link href="#campaigns">{"Explore more"}</Link>
            </Button>
          </div>
 */}
        </div>
      </section>
    </main>
  )
}

