"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Users, Clock, CircleCheck } from "lucide-react";

const featuredCampaigns = [
  {
    id: 1,
    title: "Emergency Relief for Earthquake Victims in Cianjur",
    organization: "Baznas Indonesia",
    category: "Emergency",
    raised: 125000,
    goal: 150000,
    donors: 2500,
    daysLeft: 12,
    image: "/child-with-meal-support.jpg"
  },
  {
    id: 2,
    title: "Build a Clean Water Well for Remote Village",
    organization: "Human Initiative",
    category: "Waqf",
    raised: 8500,
    goal: 12000,
    donors: 170,
    daysLeft: 45,
    image: "/community-receiving-food-aid-with-dignity.jpg"
  },
  {
    id: 3,
    title: "Scholarship Fund for 100 Orphan Students",
    organization: "Rumah Zakat",
    category: "Zakat",
    raised: 45000,
    goal: 50000,
    donors: 900,
    daysLeft: 5,
    image: "/happy-family-receiving-aid.jpg"
  }
];

export function FeaturedCampaigns() {
  const router = useRouter();

  const calculateProgress = (raised, goal) => {
    const progress = (raised / goal) * 100;
    return -((100 - progress));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCardClick = (campaignId) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const handleDonateClick = (e, campaignId) => {
    e.stopPropagation();
    router.push(`/campaigns/${campaignId}`);
  };

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
            {featuredCampaigns.map((campaign) => {
              const progress = calculateProgress(campaign.raised, campaign.goal);

              return (
                <div
                  key={campaign.id}
                  onClick={() => handleCardClick(campaign.id)}
                  className="bg-card text-card-foreground rounded-xl gap-6 border py-6 shadow-sm overflow-hidden border-black/60 hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-background/90 backdrop-blur-sm border border-transparent w-fit"
                      >
                        {campaign.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="badge bg-transparent text-white backdrop-blur-sm flex items-center gap-1 shadow-sm">
                        <CircleCheck className="h-3 w-3" /> Verified
                      </span>
                    </div>
                  </div>

                  {/* Header */}
                  <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-5 pb-2 space-y-2">
                    <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      by{" "}
                      <span className="text-primary font-semibold hover:underline cursor-pointer">
                        {campaign.organization}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {campaign.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-5 pt-2 flex-1">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-foreground">
                          {formatCurrency(campaign.raised)}
                        </span>
                        <span className="text-muted-foreground">
                          of {formatCurrency(campaign.goal)}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all"
                          style={{ transform: `translateX(${progress}%)` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>{campaign.donors.toLocaleString()} donors</span>
                        </div>

                        <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="font-medium text-foreground">
                            {campaign.daysLeft} days left
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={(e) => handleDonateClick(e, campaign.id)}
                      className="w-full border border-black rounded-md h-9 px-4 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}