import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
        <div className="space-y-5">
          <h1 className="text-balance text-3xl font-semibold leading-tight md:text-4xl">
            {"Private, Verifiable Zakat. "}
            <span className="text-primary">{"Fulfill Your Duty with Confidence."}</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Donate privately with zero-knowledge proofs, ensure Sharia compliance via DAO oversight, and receive
            verifiable proofs of disbursement.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="bg-primary text-primary-foreground hover:opacity-90">
              <Link href="#campaigns">{"Explore Campaigns"}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              <Link href="#how-it-works">{"How it works"}</Link>
            </Button>
          </div>
          <div aria-live="polite" className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-pretty">{"Transparent. Private. Impactful."}</span>
          </div>
        </div>

        {/* Imagery block - respectful, dignified aid scenarios */}
        <div className="grid gap-4 md:gap-5">
          <div className="overflow-hidden rounded-lg border border-border">
            <img
              src="/community-receiving-food-aid-with-dignity.jpg"
              alt="Community members receiving food aid distribution"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-lg border border-border">
              <img
                src="/child-with-meal-support.jpg"
                alt="Child with a nutritious meal provided by donations"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <img
                src="/happy-family-receiving-aid.jpg"
                alt="Family smiling after receiving essential aid"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
