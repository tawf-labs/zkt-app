"use client";

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useCampaigns } from '@/hooks/useCampaigns';
import { usePoolDonors } from '@/hooks/usePoolDonors';
import { CONTRACT_ADDRESSES, ZKTCoreABI, formatIDRX, formatAddress } from '@/lib/abi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, TrendingUp, Users, Plus, Wallet } from 'lucide-react';

export default function OrganizationDashboard() {
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState('overview');
  
  // Fetch all campaigns/pools
  const { campaigns, isLoading } = useCampaigns([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  // Filter campaigns by current user address
  const myCampaigns = campaigns.filter(c => c.organizationAddress.toLowerCase() === address?.toLowerCase());

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to view organization dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Organization Dashboard</h1>
            <p className="text-muted-foreground">Manage your campaigns and track donations</p>
          </div>
          <Button asChild>
            <a href="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />Create Proposal
            </a>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
            </div>
            <p className="text-3xl font-bold">{myCampaigns.filter(c => c.isActive).length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Raised</p>
            </div>
            <p className="text-3xl font-bold">{formatIDRX(myCampaigns.reduce((sum, c) => sum + c.currentAmount, BigInt(0)))} IDRX</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Donors</p>
            </div>
            <p className="text-3xl font-bold">{myCampaigns.reduce((sum, c) => sum + Number(c.donorCount), 0)}</p>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Campaigns</h2>
            {myCampaigns.length > 0 && (
              <Badge variant="outline">{myCampaigns.length} Total</Badge>
            )}
          </div>
          
          {myCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <LayoutDashboard className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No campaigns yet. Create your first proposal!</p>
              <Button asChild>
                <a href="/campaigns/new">
                  <Plus className="h-4 w-4 mr-2" />Create Proposal
                </a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id.toString()} campaign={campaign} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Campaign Card Component
function CampaignCard({ campaign }: { campaign: any }) {
  const { donors } = usePoolDonors(campaign.id);
  const progressPercentage = campaign.targetAmount > BigInt(0) 
    ? Number((campaign.currentAmount * BigInt(100)) / campaign.targetAmount)
    : 0;

  return (
    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg">{campaign.title}</h3>
            <Badge variant={campaign.isActive ? "default" : "secondary"}>
              {campaign.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{campaign.category}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">Raised</p>
          <p className="font-bold">{formatIDRX(campaign.currentAmount)} IDRX</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Goal</p>
          <p className="font-bold">{formatIDRX(campaign.targetAmount)} IDRX</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Donors</p>
          <p className="font-bold">{campaign.donorCount.toString()}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.min(100, progressPercentage).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all" 
            style={{width: `${Math.min(100, progressPercentage)}%`}}
          />
        </div>
      </div>

      {/* Donor List Preview */}
      {donors.length > 0 && (
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">Recent Donors:</p>
          <div className="flex gap-1">
            {donors.slice(0, 5).map((donor, idx) => (
              <div 
                key={idx} 
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium"
                title={donor}
              >
                {donor.slice(2, 4).toUpperCase()}
              </div>
            ))}
            {donors.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                +{donors.length - 5}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <a href={`/campaigns/${campaign.id}`}>View Details</a>
        </Button>
      </div>
    </div>
  );
}
