"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Clock, CircleCheck } from "lucide-react";

export  function FeaturedCampaigns() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Featured Campaigns</h2>
            <p className="text-muted-foreground max-w-2xl">
              Support verified projects and track your impact on the blockchain.
            </p>
          </div>

          <Link href="/campaigns">
            <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all h-9 px-4 py-2 group hover:bg-accent hover:text-accent-foreground">
              View all campaigns
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>

        {/* Grid */}
        <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">  

          {/* CARD 1 */}
          <div className="bg-card text-card-foreground rounded-xl gap-6 border py-6 shadow-sm overflow-hidden border-black/60 hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/child-with-meal-support.jpg"
                alt="Emergency Relief for Earthquake Victims in Cianjur"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span
  data-slot="badge"
  className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-background/90 backdrop-blur-sm border border-transparent w-fit"
>
                  Emergency
                </span>
              </div>

              <div className="absolute bottom-3 right-3">
                <span className="badge bg-transparent text-white backdrop-blur-sm flex items-center gap-1 shadow-sm">
                  <CircleCheck className="h-3 w-3" /> Verified
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 p-5 pb-2 space-y-2">
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                by <span className="text-primary font-semibold hover:underline cursor-pointer">Baznas Indonesia</span>
              </div>

              <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                Emergency Relief for Earthquake Victims in Cianjur
              </h3>
            </div>

            {/* Content */}
            <div className="p-5 pt-2 flex-1">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-foreground">$125,000</span>
                  <span className="text-muted-foreground">of $150,000</span>
                </div>

                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ transform: "translateX(-17%)" }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>2500 donors</span>
                  </div>

                  <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">12 days left</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 pt-0">
              <button className="w-full border border-black rounded-md h-9 px-4 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all">
                Donate Now
              </button>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-card text-card-foreground rounded-xl gap-6 border py-6 shadow-sm overflow-hidden border-black/60 hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/community-receiving-food-aid-with-dignity.jpg"
                alt="Build a Clean Water Well for Remote Village"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span
  data-slot="badge"
  className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-background/90 backdrop-blur-sm border border-transparent w-fit"
>
                  Waqf
                </span>
              </div>

              <div className="absolute bottom-3 right-3">
                <span className="badge bg-transparent text-white backdrop-blur-sm flex items-center gap-1 shadow-sm">
                  <CircleCheck className="h-3 w-3" /> Verified
                </span>
              </div>
            </div>

            <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 p-5 pb-2 space-y-2">
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                by <span className="text-primary font-semibold hover:underline cursor-pointer">Human Initiative</span>
              </div>
              <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                Build a Clean Water Well for Remote Village
              </h3>
            </div>

            <div className="p-5 pt-2 flex-1">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-foreground">$8,500</span>
                  <span className="text-muted-foreground">of $12,000</span>
                </div>

                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ transform: "translateX(-29%)" }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>170 donors</span>
                  </div>
                  <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">45 days left</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button className="w-full border border-black rounded-md h-9 px-4 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all">
                Donate Now
              </button>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-card text-card-foreground rounded-xl gap-6 border py-6 shadow-sm overflow-hidden border-black/60 hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/happy-family-receiving-aid.jpg"
                alt="Scholarship Fund for 100 Orphan Students"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span
  data-slot="badge"
  className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-background/90 backdrop-blur-sm border border-transparent w-fit"
>
                  Zakat
                </span>
              </div>

              <div className="absolute bottom-3 right-3">
                <span className="badge bg-transparent text-white backrop-blur-sm flex items-center gap-1 shadow-sm">
                  <CircleCheck className="h-3 w-3" /> Verified
                </span>
              </div>
            </div>

            <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 p-5 pb-2 space-y-2">
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                by <span className="text-primary font-semibold hover:underline cursor-pointer">Rumah Zakat</span>
              </div>
              <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                Scholarship Fund for 100 Orphan Students
              </h3>
            </div>

            <div className="p-5 pt-2 flex-1">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-foreground">$45,000</span>
                  <span className="text-muted-foreground">of $50,000</span>
                </div>

                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ transform: "translateX(-10%)" }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>900 donors</span>
                  </div>
                  <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">5 days left</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button className="w-full border border-black rounded-md h-9 px-4 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all">
                Donate Now
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
