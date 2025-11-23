"use client";

import { useState } from 'react';
import { ArrowLeft, Users, Clock, CircleCheck, Share2, Heart, MapPin, Calendar, Target, TrendingUp, Shield, FileText } from 'lucide-react';

const campaignDetail = {
  id: 1,
  title: "Emergency Relief for Earthquake Victims in Cianjur",
  organization: {
    name: "Baznas Indonesia",
    verified: true,
    logo: "/org-logo.jpg"
  },
  category: "Emergency",
  location: "Cianjur, West Java, Indonesia",
  raised: 125000,
  goal: 150000,
  donors: 2500,
  daysLeft: 12,
  createdDate: "Oct 15, 2024",
  image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop"
  ],
  description: `The devastating earthquake that struck Cianjur has left thousands of families without homes, food, and basic necessities. The disaster has affected over 10,000 residents, with many losing everything they owned.

Our emergency relief campaign aims to provide immediate assistance to the affected families through:

• Emergency food packages for 1,000 families
• Temporary shelter and bedding materials
• Clean water and sanitation facilities
• Medical aid and healthcare services
• Psychological support for trauma victims

Every donation, no matter how small, will make a direct impact on the lives of those affected. Your generosity will help rebuild hope and restore dignity to families in their darkest hour.

We are working closely with local authorities and volunteers to ensure that aid reaches those who need it most. All funds are managed transparently, and we provide regular updates on the distribution of aid.`,
  updates: [
    {
      date: "Nov 20, 2024",
      title: "Distribution of 500 Food Packages Completed",
      content: "Alhamdulillah, we have successfully distributed 500 emergency food packages to affected families in the most severely impacted areas."
    },
    {
      date: "Nov 15, 2024",
      title: "Medical Team Deployed",
      content: "Our medical team has arrived on-site and has begun providing healthcare services to earthquake victims."
    }
  ],
  milestones: [
    { amount: 50000, label: "Emergency food for 300 families", achieved: true },
    { amount: 100000, label: "Temporary shelters for 500 families", achieved: true },
    { amount: 150000, label: "Medical aid and rehabilitation", achieved: false }
  ]
};

const donationAmounts = [10, 25, 50, 100, 250, 500];

export default function CampaignDetail() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [activeTab, setActiveTab] = useState('story');
  const [selectedImage, setSelectedImage] = useState(0);

  const calculateProgress = (raised, goal) => {
    return (raised / goal) * 100;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const progress = calculateProgress(campaignDetail.raised, campaignDetail.goal);

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
                  src={campaignDetail.images[selectedImage]}
                  alt={campaignDetail.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-semibold bg-background/90 backdrop-blur-sm border border-border">
                    {campaignDetail.category}
                  </span>
                </div>

                {/* Verified Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-background/90 backdrop-blur-sm rounded-md border border-border">
                    <CircleCheck className="h-4 w-4 text-green-600" />
                    Verified Campaign
                  </span>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-3">
                {campaignDetail.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-20 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>by</span>
                    <span className="text-primary font-semibold hover:underline cursor-pointer">
                      {campaignDetail.organization.name}
                    </span>
                    {campaignDetail.organization.verified && (
                      <CircleCheck className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-3">
                    {campaignDetail.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{campaignDetail.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Started {campaignDetail.createdDate}</span>
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
                      {formatCurrency(campaignDetail.raised)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      raised of {formatCurrency(campaignDetail.goal)} goal
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
                    <span className="font-semibold">{campaignDetail.donors.toLocaleString()}</span>
                    <span className="text-muted-foreground">donors</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-secondary px-3 py-1.5 rounded-md">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">{campaignDetail.daysLeft} days left</span>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5" />
                  <h3 className="font-bold text-lg">Campaign Milestones</h3>
                </div>
                <div className="space-y-3">
                  {campaignDetail.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        milestone.achieved ? 'border-green-600 bg-green-600' : 'border-border'
                      }`}>
                        {milestone.achieved && (
                          <CircleCheck className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-sm font-medium ${milestone.achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {milestone.label}
                          </span>
                          <span className={`text-sm font-semibold ${milestone.achieved ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {formatCurrency(milestone.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  onClick={() => setActiveTab('updates')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'updates'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Updates ({campaignDetail.updates.length})
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
                    {campaignDetail.description}
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

            {activeTab === 'updates' && (
              <div className="space-y-6">
                {campaignDetail.updates.map((update, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{update.title}</h4>
                        <p className="text-sm text-muted-foreground">{update.date}</p>
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed">{update.content}</p>
                  </div>
                ))}
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
                        ${(Math.random() * 450 + 50).toFixed(0)}
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
                    <h4 className="font-semibold text-lg">Chain: Base Mainnet</h4>
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
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Or enter custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="0"
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 pl-7 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
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
                    <span className="font-semibold">$50</span>
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
                    {campaignDetail.organization.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-semibold">{campaignDetail.organization.name}</span>
                      <CircleCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Verified Organization</p>
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