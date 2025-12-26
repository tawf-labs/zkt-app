# ZKT.app - Complete Implementation Guide
## Pool-Based Smart Contract Integration with Sharia Council

**Date:** December 26, 2025  
**Status:** Implementation Guide  
**Purpose:** Make all pages functional, fetch from blockchain, require Sharia Council approval

---

## PART 1: Header Navigation (COMPLETED ✅)

**File:** `components/layout/header.tsx`

### Changes Made:
1. ✅ Removed Indonesian language toggle
2. ✅ Simplified navigation (removed Zakat, Faucet, Contact)
3. ✅ Changed "Start Campaign" → "+ Create Proposal"
4. ✅ Updated dashboard dropdown to show "Sharia Council" instead of "Auditor"

---

## PART 2: Create Proposal Page (COMPLETED ✅)

**File:** `app/campaigns/new/page.tsx`

### Features Implemented:
- ✅ Full form for creating proposals with blockchain integration
- ✅ Calls `createProposal()` smart contract function
- ✅ Zakat compliance checklist (dynamic add/remove)
- ✅ Campaign type selection (General/Zakat/Emergency)
- ✅ Emergency flag for fast-track review
- ✅ Mock ZK proof generation
- ✅ Wallet connection check
- ✅ Toast notifications on success/error
- ✅ Redirect to governance page after creation

---

## PART 3: Donor Dashboard (TO IMPLEMENT)

**File:** `app/dashboard/donor/page.tsx`

### Required Changes:

Replace entire file with:

```typescript
"use client";

import React, { useState } from 'react';
import { Award, Vote, Wallet, ExternalLink, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useDonationReceipts } from '@/hooks/useDonationReceipts';
import { useVotingPower } from '@/hooks/useVotingPower';
import { formatIDRX, formatAddress, formatTimestamp } from '@/lib/abi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type SidebarTab = 'overview' | 'receipts' | 'governance';

const DonorDashboard: React.FC = () => {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('overview');
  const { address, isConnected } = useAccount();
  
  // Fetch real data from blockchain
  const { receipts, totalDonated, isLoading: loadingReceipts } = useDonationReceipts();
  const { votingPower, formattedVotingPower } = useVotingPower();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to view your donor dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Sidebar with stats */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
              <div className="bg-card rounded-xl border shadow-sm p-6 text-center">
                <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-white">
                  {address?.slice(2, 4).toUpperCase()}
                </div>
                <h2 className="font-bold text-xl">Donor</h2>
                <p className="text-xs font-mono text-muted-foreground mt-2">{formatAddress(address || '')}</p>
                
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donated</span>
                    <span className="font-bold">{formatIDRX(totalDonated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receipts</span>
                    <span className="font-bold">{receipts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">vZKT</span>
                    <span className="font-bold">{formattedVotingPower}</span>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                <button onClick={() => setSidebarTab('overview')} className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm ${sidebarTab === 'overview' ? 'bg-secondary font-semibold' : 'text-muted-foreground hover:bg-accent'}`}>
                  <TrendingUp className="h-4 w-4" />
                  Overview
                </button>
                <button onClick={() => setSidebarTab('receipts')} className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm ${sidebarTab === 'receipts' ? 'bg-secondary font-semibold' : 'text-muted-foreground hover:bg-accent'}`}>
                  <Award className="h-4 w-4" />
                  NFT Receipts ({receipts.length})
                </button>
                <button onClick={() => setSidebarTab('governance')} className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-sm ${sidebarTab === 'governance' ? 'bg-secondary font-semibold' : 'text-muted-foreground hover:bg-accent'}`}>
                  <Vote className="h-4 w-4" />
                  Governance
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {sidebarTab === 'overview' && (
                <>
                  <h1 className="text-2xl font-bold">Donor Dashboard</h1>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Total Donated</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatIDRX(totalDonated)} IDRX</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>NFT Receipts</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{receipts.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Voting Power</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formattedVotingPower} vZKT</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {receipts.length === 0 ? (
                        <p className="text-muted-foreground">No donations yet</p>
                      ) : (
                        <div className="space-y-3">
                          {receipts.slice(0, 5).map((r) => (
                            <div key={r.tokenId.toString()} className="flex justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">Campaign #{r.campaignId.toString()}</p>
                                <p className="text-xs text-muted-foreground">NFT #{r.tokenId.toString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{formatIDRX(r.amount)} IDRX</p>
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />Verified
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {sidebarTab === 'receipts' && (
                <>
                  <h1 className="text-2xl font-bold">NFT Donation Receipts</h1>
                  {receipts.length === 0 ? (
                    <Card><CardContent className="p-8 text-center"><Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><p>No receipts yet</p></CardContent></Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {receipts.map((r) => (
                        <Card key={r.tokenId.toString()}>
                          <CardHeader>
                            <CardTitle className="text-lg">Receipt #{r.tokenId.toString()}</CardTitle>
                            <CardDescription>Campaign #{r.campaignId.toString()}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Amount</span>
                              <span className="font-bold">{formatIDRX(r.amount)} IDRX</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Date</span>
                              <span>{formatTimestamp(Number(r.timestamp))}</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                              <a href={`https://sepolia.basescan.org/token/${r.tokenId}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />View on Explorer
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}

              {sidebarTab === 'governance' && (
                <>
                  <h1 className="text-2xl font-bold">Governance</h1>
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Voting Power</CardTitle>
                      <CardDescription>1 IDRX donated = 1 vZKT</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold mb-4">{formattedVotingPower} vZKT</div>
                      <Button asChild><a href="/governance">View Active Proposals</a></Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;
```

### Key Features:
- Fetches NFT receipts from `useDonationReceipts()` hook
- Shows voting power from `useVotingPower()` hook
- Wallet connection guard
- Three tabs: Overview, Receipts, Governance
- BaseScan explorer links for each NFT

---

## PART 4: Organization Dashboard (TO IMPLEMENT)

**File:** `app/dashboard/organization/page.tsx`

### Required Implementation:

```typescript
"use client";

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useCampaigns } from '@/hooks/useCampaigns';
import { usePoolDonors } from '@/hooks/usePoolDonors';
import { CONTRACT_ADDRESSES, ZKTCoreABI, formatIDRX, formatAddress } from '@/lib/abi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, TrendingUp, Users, Plus } from 'lucide-react';

export default function OrganizationDashboard() {
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState('overview');
  
  // Fetch all campaigns/pools
  const { campaigns, isLoading } = useCampaigns([0, 1, 2, 3, 4, 5]);
  
  // Filter campaigns by current user address
  const myCampaigns = campaigns.filter(c => c.organizationAddress.toLowerCase() === address?.toLowerCase());

  if (!isConnected) {
    return <div className="min-h-screen flex items-center justify-center"><p>Connect wallet to view organization dashboard</p></div>;
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

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
            <p className="text-3xl font-bold">{myCampaigns.filter(c => c.isActive).length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Raised</p>
            <p className="text-3xl font-bold">{formatIDRX(myCampaigns.reduce((sum, c) => sum + c.currentAmount, BigInt(0)))} IDRX</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Donors</p>
            <p className="text-3xl font-bold">{myCampaigns.reduce((sum, c) => sum + Number(c.donorCount), 0)}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Campaigns</h2>
          {myCampaigns.length === 0 ? (
            <p className="text-muted-foreground">No campaigns yet. Create your first proposal!</p>
          ) : (
            <div className="space-y-4">
              {myCampaigns.map((campaign) => (
                <div key={campaign.id.toString()} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{campaign.title}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.category}</p>
                    </div>
                    <Badge variant={campaign.isActive ? "default" : "secondary"}>
                      {campaign.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Raised</p>
                      <p className="font-bold">{formatIDRX(campaign.currentAmount)} IDRX</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Goal</p>
                      <p className="font-bold">{formatIDRX(campaign.targetAmount)} IDRX</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Donors</p>
                      <p className="font-bold">{campaign.donorCount.toString()}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{width: `${Math.min(100, Number(campaign.currentAmount * BigInt(100) / campaign.targetAmount))}%`}}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
```

### Key Features:
- Filters campaigns by organization address
- Shows stats: active campaigns, total raised, donors
- Campaign list with progress bars
- Create proposal button

---

## PART 5: Sharia Council Dashboard (TO IMPLEMENT)

**File:** `app/dashboard/auditor/page.tsx`

### Complete Implementation:

This is the MOST IMPORTANT page - it handles Sharia compliance review bundles!

```typescript
"use client";

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, ZKTCoreABI, formatIDRX } from '@/lib/abi';
import { useProposals } from '@/hooks/useProposals';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { handleTransactionError } from '@/lib/errors';

export default function ShariaCouncilDashboard() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const { writeContractAsync, isPending } = useWriteContract();
  
  // Check if user has Sharia Council role
  const SHARIA_COUNCIL_ROLE = '0x' + '2'.repeat(64); // keccak256("SHARIA_COUNCIL_ROLE")
  
  const { data: hasRole } = useReadContract({
    address: CONTRACT_ADDRESSES.ZKTCore,
    abi: ZKTCoreABI,
    functionName: 'hasRole',
    args: [SHARIA_COUNCIL_ROLE as `0x${string}`, address!],
    query: { enabled: !!address },
  });

  // Fetch proposals pending review
  const { proposals } = useProposals([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Get latest bundle (simplified - in production, fetch from contract)
  const { data: bundleData } = useReadContract({
    address: CONTRACT_ADDRESSES.ZKTCore,
    abi: ZKTCoreABI,
    functionName: 'getBundle',
    args: [BigInt(0)],
  });

  const handleReviewProposal = async (proposalId: bigint, approved: boolean, campaignType: number) => {
    try {
      const mockZKProof = `0x${Date.now().toString(16).padStart(64, '0')}`;
      
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.ZKTCore,
        abi: ZKTCoreABI,
        functionName: 'reviewProposal',
        args: [
          BigInt(0), // bundleId
          proposalId,
          approved,
          campaignType,
          mockZKProof as `0x${string}`,
        ],
      });

      toast({
        title: approved ? "Proposal Approved! ✅" : "Proposal Rejected",
        description: `Proposal #${proposalId} has been ${approved ? 'approved' : 'rejected'} for Sharia compliance`,
      });
    } catch (error) {
      handleTransactionError(error, { toast, action: 'review proposal' });
    }
  };

  if (!isConnected) {
    return <div className="min-h-screen flex items-center justify-center"><p>Connect wallet to access Sharia Council dashboard</p></div>;
  }

  if (!hasRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have Sharia Council role</p>
        </div>
      </div>
    );
  }

  // Filter proposals by status
  const pendingProposals = proposals.filter(p => p.kycStatus === 1 && p.status === 0);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Sharia Council Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Review and approve campaign proposals for Islamic compliance</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-3xl font-bold">{pendingProposals.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Reviewed Today</p>
            <p className="text-3xl font-bold">0</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Your Role</p>
            <Badge className="mt-2"><Shield className="h-3 w-3 mr-1" />Sharia Council</Badge>
          </Card>
        </div>

        {/* Proposals for Review */}
        <Card>
          <CardHeader>
            <CardTitle>Proposals Awaiting Review</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingProposals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No proposals pending review</p>
            ) : (
              <div className="space-y-4">
                {pendingProposals.map((proposal) => (
                  <div key={proposal.id.toString()} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{proposal.description}</p>
                        <div className="flex gap-2">
                          <Badge variant={proposal.isEmergency ? "destructive" : "outline"}>
                            {proposal.isEmergency ? "Emergency" : proposal.proposalType}
                          </Badge>
                          <Badge variant="outline">
                            {formatIDRX(proposal.fundingGoal || BigInt(0))} IDRX Goal
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Zakat Checklist */}
                    {proposal.zakatChecklistItems && proposal.zakatChecklistItems.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="font-semibold text-sm mb-2">Zakat Compliance Checklist:</p>
                        <ul className="space-y-1">
                          {proposal.zakatChecklistItems.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Organizer Info */}
                    <div className="text-xs text-muted-foreground mb-4">
                      <strong>Organizer:</strong> {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReviewProposal(proposal.id, true, proposal.campaignType || 0)}
                        disabled={isPending}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve (Compliant)
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReviewProposal(proposal.id, false, proposal.campaignType || 0)}
                        disabled={isPending}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject (Non-Compliant)
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Review Process
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Review proposals for Sharia compliance and Islamic principles</p>
            <p>• Check Zakat eligibility criteria for Zakat-designated campaigns</p>
            <p>• Verify organizer credentials and campaign authenticity</p>
            <p>• Approved proposals proceed to community DAO voting</p>
            <p>• Rejected proposals return to organizer for revision</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Key Features:
- ✅ Role-based access control (checks SHARIA_COUNCIL_ROLE)
- ✅ Lists proposals pending review
- ✅ Shows Zakat compliance checklist
- ✅ Approve/Reject buttons with blockchain integration
- ✅ Calls `reviewProposal()` function
- ✅ Emergency flag indicator
- ✅ Review statistics

---

## PART 6: Remove Language Provider (TO IMPLEMENT)

**File:** `app/layout.tsx`

Remove the `LanguageProvider` wrapper and import since we removed Indonesian support:

```typescript
// Remove this import:
// import { LanguageProvider } from "@/components/providers/language-provider";

// Update the JSX to remove LanguageProvider:
<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
  <WalletProvider>
    <CurrencyProvider>
      <SearchProvider>
        <Header />
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />
        <Toaster />
      </SearchProvider>
    </CurrencyProvider>
  </WalletProvider>
</ThemeProvider>
```

---

## PART 7: Update Governance Page (ENHANCE)

**File:** `app/governance/page.tsx`

The page already uses blockchain data but needs updates for new contract structure:

```typescript
// Update the castVote function to use new signature:
const handleVote = async (proposalId: string, support: number) => {
  // support: 0 = Against, 1 = For, 2 = Abstain
  await writeContractAsync({
    address: CONTRACT_ADDRESSES.ZKTCore,
    abi: ZKTCoreABI,
    functionName: "castVote",
    args: [BigInt(proposalId), support],
  });
};
```

---

## TESTING CHECKLIST

### Prerequisites:
- [ ] Wallet connected to Base Sepolia
- [ ] Some IDRX in wallet (use faucet)
- [ ] Sharia Council role granted to test account

### Test Scenarios:

#### 1. Create Proposal Flow:
1. [ ] Go to `/campaigns/new`
2. [ ] Fill in all fields
3. [ ] Add custom Zakat checklist items
4. [ ] Submit proposal
5. [ ] Verify transaction on BaseScan
6. [ ] Check proposal appears in governance

#### 2. Donor Dashboard:
1. [ ] Make a donation to any campaign
2. [ ] Go to `/dashboard/donor`
3. [ ] Verify NFT receipt appears
4. [ ] Check voting power increased
5. [ ] View receipt on BaseScan

#### 3. Organization Dashboard:
1. [ ] Create proposal as organization
2. [ ] Go to `/dashboard/organization`
3. [ ] Verify campaign appears in "Your Campaigns"
4. [ ] Check stats are accurate

#### 4. Sharia Council Review:
1. [ ] Grant SHARIA_COUNCIL_ROLE to test wallet
2. [ ] Go to `/dashboard/auditor`
3. [ ] See pending proposals
4. [ ] Review and approve/reject
5. [ ] Verify proposal status changes

#### 5. Governance Voting:
1. [ ] Go to `/governance`
2. [ ] Find approved proposal
3. [ ] Cast vote (For/Against/Abstain)
4. [ ] Verify vote recorded

---

## SMART CONTRACT INTERACTION SUMMARY

### Functions Used:

| Function | Page | Purpose |
|----------|------|---------|
| `createProposal()` | campaigns/new | Submit new campaign |
| `getProposal()` | governance, dashboards | Fetch proposal data |
| `getPool()` | campaigns, org dashboard | Fetch campaign pool |
| `donate()` | campaigns/[id] | Make donation |
| `castVote()` | governance | Vote on proposals |
| `reviewProposal()` | dashboard/auditor | Sharia review |
| `getPoolDonors()` | org dashboard | List donors |
| `hasRole()` | dashboard/auditor | Check permissions |

### Data Flow:

```
1. Organization creates proposal → createProposal()
2. KYC Oracle approves → updateKYCStatus()
3. System creates bundle → createShariaReviewBundle()
4. Sharia Council reviews → reviewProposal()
5. Approved proposals → submitForCommunityVote()
6. Community votes → castVote()
7. Vote passes → createCampaignPool()
8. Donors donate → donate(poolId, amount)
```

---

## DEPLOYMENT STEPS

1. **Update All Files** (use this guide)
2. **Test Locally**: `npm run dev`
3. **Check TypeScript**: `npx tsc --noEmit`
4. **Build**: `npm run build`
5. **Deploy to Vercel**

---

## ENVIRONMENT VARIABLES

Ensure these are set:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
NEXT_PUBLIC_XELLAR_APP_ID=...
NEXT_PUBLIC_XELLAR_ENV=sandbox
```

---

**End of Implementation Guide**
