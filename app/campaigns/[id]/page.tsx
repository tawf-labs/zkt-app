"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, Clock, CircleCheck, Share2, Heart, MapPin, Calendar, Shield, FileText, Loader2 } from 'lucide-react';
import { useCampaign } from '@/hooks/useCampaigns';
import { formatIDRX } from '@/lib/abi';

const donationAmounts = [BigInt(10000), BigInt(25000), BigInt(50000), BigInt(100000), BigInt(250000), BigInt(500000)];

export default function CampaignDetail() {
  const params = useParams();
  const campaignId = Number(params.id);
  const { campaign, isLoading, error } = useCampaign(campaignId);
  
  const [selectedAmount, setSelectedAmount] = useState<bigint | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [activeTab, setActiveTab] = useState('story');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-foreground">Campaign not found</p>
          <p className="text-muted-foreground mt-2">The campaign you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const progress = (Number(campaign.currentAmount) / Number(campaign.targetAmount)) * 100;
  const daysLeft = campaign.endDate > BigInt(0) 
    ? Math.max(0, Number((campaign.endDate - BigInt(Math.floor(Date.now() / 1000))) / BigInt(86400)))
    : 0;

  return (
    <main className="flex-1 py-8 lg:py-12 bg-background">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Back Button */}
        <button className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative h-[400px] rounded-xl overflow-hidden border border-border">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-semibold bg-background/90 backdrop-blur-sm border border-border">
                    {campaign.category}
                  </span>
                </div>

                {/* Verified Badge */}
                {campaign.isVerified && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-background/90 backdrop-blur-sm rounded-md border border-border">
                      <CircleCheck className="h-4 w-4 text-green-600" />
                      Verified Campaign
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>by</span>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      {campaign.organizationName}
                    </span>
                    {campaign.isVerified && (
                      <CircleCheck className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-3">
                    {campaign.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{campaign.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Campaign #{campaign.id.toString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="inline-flex items-center justify-center rounded-md border border-border bg-transparent hover:bg-accent hover:text-accent-foreground h-9 w-9">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md border border-border bg-transparent hover:bg-accent hover:text-accent-foreground h-9 w-9">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {formatIDRX(campaign.currentAmount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      raised of {formatIDRX(campaign.targetAmount)} goal
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(progress)}%
                    </div>
                    <div className="text-sm text-muted-foreground">funded</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{campaign.donorCount.toString()}</span>
                    <span className="text-muted-foreground">donors</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-secondary px-3 py-1.5 rounded-md">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">{daysLeft} days left</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'story'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Campaign Story
                </button>
                <button
                  onClick={() => setActiveTab('donors')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'donors'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Donors
                </button>
                <button
                  onClick={() => setActiveTab('blockchain')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'blockchain'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Blockchain
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'story' && (
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-foreground leading-relaxed">
                    {campaign.description}
                  </div>
                </div>
                
                {/* Blockchain Verified Badge */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <div className="font-semibold">Blockchain Verified</div>
                      <p className="text-sm text-muted-foreground">
                        All donations are recorded on the blockchain. You'll receive an NFT receipt as permanent proof.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'donors' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-2">Recent donors supporting this campaign</p>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div>
                          <div className="font-medium">Anonymous Donor</div>
                          <div className="text-sm text-muted-foreground">
                            {i === 0 ? '2 mins ago' : `${Math.floor(Math.random() * 24) + 1} hours ago`}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-primary">
                        {Math.floor((Math.random() * 450 + 50) * 1000).toLocaleString('id-ID')} IDRX
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'blockchain' && (
              <div className="space-y-6">
                {/* Smart Contract */}
                <div className="bg-muted/50 border border-border rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Smart Contract</h4>
                    </div>
                    <div className="font-mono text-xs bg-background p-3 rounded border border-border break-all">
                      0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7
                    </div>
                    <button className="w-full border border-border rounded-md h-9 px-4 text-sm font-semibold hover:bg-accent transition-all">
                      View on Block Explorer
                    </button>
                  </div>
                </div>

                {/* Chain Info */}
                <div className="bg-muted/50 border border-border rounded-xl p-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Chain: Base Sepolia Testnet</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Transactions</span>
                        <span className="font-semibold">2,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Update</span>
                        <span className="font-semibold">2 mins ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Used</span>
                        <span className="font-semibold">0.0045 ETH</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transparency Note */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <div className="font-semibold">100% Transparent</div>
                      <p className="text-sm text-muted-foreground">
                        Every donation and fund distribution is recorded on the blockchain, ensuring complete transparency and accountability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Donation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Make a Donation</h3>

                {/* Donation Amounts */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`border rounded-lg py-3 px-4 text-center font-semibold transition-all ${
                        selectedAmount === amount
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary hover:bg-accent'
                      }`}
                    >
                      {(Number(amount) / 1000).toFixed(0)}K IDRX
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Or enter custom amount (IDRX)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="0"
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      IDRX
                    </span>
                  </div>
                </div>

                {/* Donate Button */}
                <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent rounded-md h-11 px-4 text-sm font-bold transition-all shadow-sm mb-4">
                  Donate Now
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  Your donation is secure and 100% goes to the campaign
                </p>

                {/* Donation Info */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average donation</span>
                    <span className="font-semibold">50,000 IDRX</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recent donation</span>
                    <span className="font-semibold">2 mins ago</span>
                  </div>
                </div>
              </div>

              {/* Organization Info */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-6">
                <h3 className="font-bold text-lg mb-4">About Organization</h3>
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                    {campaign.organizationName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-semibold">{campaign.organizationName}</span>
                      {campaign.isVerified && (
                        <CircleCheck className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{campaign.isVerified ? 'Verified' : 'Unverified'} Organization</p>
                  </div>
                </div>
                <button className="w-full border border-border rounded-md h-9 px-4 text-sm font-semibold hover:bg-accent transition-all">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}