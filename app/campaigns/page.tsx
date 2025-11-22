"use client";

import { Search, Filter, SlidersHorizontal, Users, Clock, CircleCheck } from 'lucide-react';
import Image from 'next/image';

const campaigns = [
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
  },
  {
    id: 4,
    title: "Food Packages for Families in Need",
    organization: "Dompet Dhuafa",
    category: "Sadaqah",
    raised: 12000,
    goal: 25000,
    donors: 240,
    daysLeft: 20,
    image: "/child-with-meal-support.jpg"
  },
  {
    id: 5,
    title: "Medical Aid for Remote Communities",
    organization: "Lazismu",
    category: "Zakat",
    raised: 35000,
    goal: 60000,
    donors: 700,
    daysLeft: 18,
    image: "/community-receiving-food-aid-with-dignity.jpg"
  },
  {
    id: 6,
    title: "Mosque Renovation Project",
    organization: "BWI",
    category: "Waqf",
    raised: 80000,
    goal: 100000,
    donors: 1600,
    daysLeft: 60,
    image: "/happy-family-receiving-aid.jpg"
  }
];

const categories = ["Zakat", "Infaq", "Sadaqah", "Waqf", "Emergency"];
const locations = ["Indonesia", "Palestine", "Syria", "Yemen", "Global"];
const organizations = ["Baznas", "Dompet Dhuafa", "Rumah Zakat", "Human Initiative", "Lazismu"];

export default function ExploreCampaigns() {
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

  return (
    <main className="flex-1 py-8 lg:py-12 bg-background">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Campaigns</h1>
            <p className="text-muted-foreground">Find and support verified causes that matter to you.</p>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search campaigns..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button className="inline-flex items-center justify-center rounded-md border border-black bg-transparent hover:bg-accent hover:text-accent-foreground h-9 w-9 lg:hidden">
              <Filter className="h-4 w-4" />
            </button>
            <button className="hidden lg:inline-flex items-center justify-center gap-2 rounded-md border border-black bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <SlidersHorizontal className="h-4 w-4" />
              Sort
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`cat-${cat}`}
                      className="h-4 w-4 rounded border-input"
                    />
                    <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none cursor-pointer">
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            {/* Locations */}
            <div>
              <h3 className="font-semibold mb-4">Location</h3>
              <div className="space-y-3">
                {locations.map((loc) => (
                  <div key={loc} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`loc-${loc}`}
                      className="h-4 w-4 rounded border-input"
                    />
                    <label htmlFor={`loc-${loc}`} className="text-sm font-medium leading-none cursor-pointer">
                      {loc}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            {/* Organizations */}
            <div>
              <h3 className="font-semibold mb-4">Organization</h3>
              <div className="space-y-3">
                {organizations.map((org) => (
                  <div key={org} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`org-${org}`}
                      className="h-4 w-4 rounded border-input"
                    />
                    <label htmlFor={`org-${org}`} className="text-sm font-medium leading-none cursor-pointer">
                      {org}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Campaign Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const progress = calculateProgress(campaign.raised, campaign.goal);
                
                return (
                  <div
                    key={campaign.id}
                    className="bg-card text-card-foreground rounded-xl gap-6 border py-6 shadow-sm overflow-hidden border-black/60 hover:shadow-lg transition-all duration-300 group h-full flex flex-col"
                  >
                    {/* Campaign Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={campaign.image}
                        alt={campaign.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold bg-background/90 backdrop-blur-sm border border-transparent w-fit">
                          {campaign.category}
                        </span>
                      </div>
                      
                      {/* Verified Badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-transparent text-white backdrop-blur-sm rounded-md shadow-sm">
                          <CircleCheck className="h-3 w-3" />
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Card Header */}
                    <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-5 pb-2 space-y-2">
                      <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        by{' '}
                        <span className="text-primary font-semibold hover:underline cursor-pointer">
                          {campaign.organization}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {campaign.title}
                      </h3>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 pt-2 flex-1">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-foreground">{formatCurrency(campaign.raised)}</span>
                          <span className="text-muted-foreground">of {formatCurrency(campaign.goal)}</span>
                        </div>
                        
                        {/* Progress Bar */}
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
                            <span className="font-medium text-foreground">{campaign.daysLeft} days left</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-0">
                      <button className="w-full border border-black rounded-md h-9 px-4 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all">
                        Donate Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            <div className="mt-12 flex justify-center">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 w-full sm:w-auto border border-black bg-transparent hover:bg-accent hover:text-accent-foreground">
                Load More Campaigns
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}