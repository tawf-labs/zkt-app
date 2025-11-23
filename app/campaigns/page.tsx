"use client";

import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { campaigns, categories, locations, organizations, calculateProgress, formatCurrency } from '@/data/campaigns';
import { CampaignCard } from '@/components/shared/campaign-card';
import { useSearch } from "@/components/shared/SearchContext"; 

export default function ExploreCampaigns() {

  const { searchQuery, setSearchQuery } = useSearch();

  const filteredCampaigns = campaigns.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                value={searchQuery}  
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                    <input type="checkbox" id={`cat-${cat}`} className="h-4 w-4 rounded border-input" />
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
                    <input type="checkbox" id={`loc-${loc}`} className="h-4 w-4 rounded border-input" />
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
                    <input type="checkbox" id={`org-${org}`} className="h-4 w-4 rounded border-input" />
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
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  calculateProgress={calculateProgress}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>

            {/* If no results */}
            {filteredCampaigns.length === 0 && (
              <p className="text-center text-muted-foreground mt-10">
                No campaigns found for "{searchQuery}"
              </p>
            )}

            {/* Load More */}
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
