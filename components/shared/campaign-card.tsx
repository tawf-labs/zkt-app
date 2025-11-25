"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, Clock, CircleCheck } from "lucide-react";
import { Campaign } from "@/data/campaigns";
import { DonationDialog } from "@/components/donations/donation-dialog";

interface CampaignCardProps {
  campaign: Campaign;
  calculateProgress: (raised: number, goal: number) => number;
  formatCurrency: (amount: number) => string;
}

export function CampaignCard({ 
  campaign, 
  calculateProgress, 
  formatCurrency 
}: CampaignCardProps) {
  const router = useRouter();
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const progress = calculateProgress(campaign.raised, campaign.goal);

  const handleCardClick = () => {
    router.push(`/campaigns/${campaign.id}`);
  };

  const handleDonateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDonationDialog(true);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white text-card-foreground rounded-xl gap-6 border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300 group h-full flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Image Section */}
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
            className="inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold bg-white/95 backdrop-blur-sm border border-primary/20 text-primary w-fit"
          >
            {campaign.category}
          </span>
        </div>

        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1.5 bg-primary text-white px-2.5 py-1 rounded-md text-xs font-medium shadow-md">
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

          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-primary/80 h-full transition-all"
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
          onClick={handleDonateClick}
          className="w-full h-11 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 transition-all"
        >
          Donate Now
        </button>
      </div>

      {/* Donation Dialog */}
      <DonationDialog
        open={showDonationDialog}
        onOpenChange={setShowDonationDialog}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        campaignGoal={campaign.goal}
        campaignRaised={campaign.raised}
      />
    </div>
  );
}