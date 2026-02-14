"use client";

import React, { useState } from 'react';
import { Award, FileText, Vote, Wallet, ShieldCheck, Download, ExternalLink, TrendingUp, CheckCircle2, XCircle, Clock, Settings, Gift, RefreshCw, ImageIcon } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useDonationNFTs, DonationNFT } from '@/hooks/useDonationNFTs';
import { useVotingPower } from '@/hooks/useVotingPower';
import { useProposals } from '@/hooks/useProposals';
import { CONTRACT_ADDRESSES } from '@/lib/abi';
import { formatIDRX } from '@/lib/abi';
import { getCampaignName, getCampaignCategory } from '@/lib/campaign-utils';

type SidebarTab = 'overview' | 'tax-reports' | 'governance-dao' | 'wallet-settings';

const DonorDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { nfts, balance, isLoading: isLoadingNFTs, refetch: refetchNFTs } = useDonationNFTs();
  const { votingPower, isLoading: isLoadingVoting } = useVotingPower();
  const { proposals, isLoading: isLoadingProposals } = useProposals([0, 1, 2, 3]);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('overview');
  const [activeTab, setActiveTab] = useState<'receipts' | 'history' | 'governance'>('receipts');

  // Calculate overview statistics from real data
  const totalDonated = nfts.reduce((sum, nft) => sum + Number(nft.amount), 0);
  const uniqueCampaigns = new Set(nfts.map((nft) => nft.campaignId)).size;

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
              {/* Profile Card */}
              <div className="bg-card text-card-foreground rounded-xl border border-black/60 shadow-sm">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full mb-4 border-2 border-black/20">
                    <div className="aspect-square h-full w-full bg-white flex items-center justify-center text-2xl font-bold text-primary border-black">
                      JD
                    </div>
                  </div>
                  <h2 className="font-bold text-xl">John Doe</h2>
                  <p className="text-sm text-muted-foreground mb-4">@johndoe</p>
                  <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full text-xs font-mono text-muted-foreground mb-6">
                    <Wallet className="h-3 w-3" />
                    0x71C...92F
                  </div>
                  <button className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-black shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 bg-transparent">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button 
                  onClick={() => setSidebarTab('overview')}
                  className={`w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-all hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 justify-start ${
                    sidebarTab === 'overview' ? 'bg-secondary/50 font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Overview
                </button>
                <button 
                  onClick={() => setSidebarTab('tax-reports')}
                  className={`w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent h-9 px-4 py-2 justify-start ${
                    sidebarTab === 'tax-reports' ? 'bg-secondary/50 font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Tax Reports
                </button>
                <button 
                  onClick={() => setSidebarTab('governance-dao')}
                  className={`w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent h-9 px-4 py-2 justify-start ${
                    sidebarTab === 'governance-dao' ? 'bg-secondary/50 font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Vote className="mr-2 h-4 w-4" />
                  Governance (DAO)
                </button>
                <button 
                  onClick={() => setSidebarTab('wallet-settings')}
                  className={`w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent h-9 px-4 py-2 justify-start ${
                    sidebarTab === 'wallet-settings' ? 'bg-secondary/50 font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Wallet Settings
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Overview Tab */}
              {sidebarTab === 'overview' && (
                <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-card-foreground rounded-xl border shadow-sm bg-white/5 border-black p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Total Donated</div>
                  <div className="text-2xl font-bold text-primary">{formatIDRX(BigInt(totalDonated))} IDRX</div>
                  <p className="text-xs text-muted-foreground mt-1">{nfts.length} donation{nfts.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Campaigns Supported</div>
                  <div className="text-2xl font-bold">{uniqueCampaigns}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across multiple categories</p>
                </div>
                <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Governance Power</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {isLoadingVoting ? '...' : `${votingPower?.toString() || '0'} vZKT`}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {votingPower && Number(votingPower) > 0 ? 'Voting enabled' : 'Make donations to earn power'}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-col gap-2 w-full">
                {/* Tab List */}
                <div className="inline-flex items-center w-full justify-start border-b border-black/60 space-x-6">
                  <button
                    onClick={() => setActiveTab('receipts')}
                    className={`inline-flex h-full items-center justify-center gap-1.5 border-b-2 text-sm font-medium whitespace-nowrap transition-all px-0 py-3 ${
                      activeTab === 'receipts'
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    My NFT Receipts
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`inline-flex h-full items-center justify-center gap-1.5 border-b-2 text-sm font-medium whitespace-nowrap transition-all px-0 py-3 ${
                      activeTab === 'history'
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Donation History
                  </button>
                  <button
                    onClick={() => setActiveTab('governance')}
                    className={`inline-flex h-full items-center justify-center gap-1.5 border-b-2 text-sm font-medium whitespace-nowrap transition-all px-0 py-3 ${
                      activeTab === 'governance'
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    DAO Proposals
                  </button>
                </div>

                {/* Tab Content */}
                <div className="pt-6">
                  {activeTab === 'receipts' && (
                    <div>
                      {/* Header with Refresh Button */}
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="font-semibold text-lg">Your Donation NFTs</h3>
                          <p className="text-sm text-muted-foreground">
                            {balance} NFT{balance !== 1 ? 's' : ''} found
                          </p>
                        </div>
                        <button
                          onClick={() => refetchNFTs()}
                          disabled={isLoadingNFTs}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`h-4 w-4 ${isLoadingNFTs ? 'animate-spin' : ''}`} />
                          Refresh
                        </button>
                      </div>

                      {/* NFTs Grid */}
                      {!isConnected ? (
                        <div className="text-center py-12">
                          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Please connect your wallet to view your NFT receipts</p>
                        </div>
                      ) : isLoadingNFTs ? (
                        <div className="text-center py-12">
                          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                          <p className="text-muted-foreground">Loading your NFT receipts...</p>
                        </div>
                      ) : nfts.length === 0 ? (
                        <div className="text-center py-12">
                          <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground mb-2">No donation NFTs yet</p>
                          <p className="text-sm text-muted-foreground">Your NFT receipts will appear here after you donate to campaigns</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {nfts.map((nft) => (
                            <div
                              key={nft.tokenId.toString()}
                              className="bg-white text-card-foreground rounded-xl border shadow-sm overflow-hidden border-black/60 hover:shadow-md transition-shadow group cursor-pointer"
                            >
                              {/* Receipt Visual */}
                              <div className="relative aspect-square bg-gradient-to-br from-secondary to-background p-6 flex flex-col items-center justify-center border-b border-black/60">
                                <div className="absolute inset-0 opacity-10 bg-white [background-size:16px_16px]"></div>
                                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                  <ShieldCheck className="h-8 w-8" />
                                </div>
                                <div className="text-center relative z-10">
                                  <div className="font-mono text-xs text-muted-foreground mb-1">
                                    RECEIPT #{nft.tokenId.toString()}
                                  </div>
                                  <div className="font-bold text-lg">{formatIDRX(nft.amount)} IDRX</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {nft.isImpact ? 'Impact NFT' : 'Donation NFT'} • Campaign ID: {nft.campaignId.slice(0, 8)}...
                                  </div>
                                </div>
                                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium absolute top-3 right-3 bg-white/80 backdrop-blur text-foreground border-border/50 shadow-sm">
                                  Verified
                                </span>
                              </div>

                              {/* Receipt Info */}
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <h3 className="font-semibold text-sm flex-1 truncate">Campaign: {nft.campaignId.slice(0, 10)}...</h3>
                                  <a
                                    href={`https://sepolia.basescan.org/nft/${CONTRACT_ADDRESSES.DonationReceiptNFT}/${nft.tokenId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0 ml-2"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Token ID:</span>
                                    <span className="font-mono">{nft.tokenId.toString()}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Amount:</span>
                                    <span className="font-semibold">{formatIDRX(nft.amount)} IDRX</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'history' && (
                    <div className="space-y-6">
                      {/* Monthly Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-4">
                          <div className="text-sm text-muted-foreground mb-1">This Month</div>
                          <div className="text-2xl font-bold">Rp 790.000</div>
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3" />
                            +25% vs last month
                          </div>
                        </div>
                        <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-4">
                          <div className="text-sm text-muted-foreground mb-1">Total Impact</div>
                          <div className="text-2xl font-bold">542 people</div>
                          <div className="text-xs text-muted-foreground mt-1">Directly helped</div>
                        </div>
                        <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-4">
                          <div className="text-sm text-muted-foreground mb-1">Categories</div>
                          <div className="flex gap-2 mt-2">
                            <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">Zakat</span>
                            <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 border-purple-200">Education</span>
                            <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">Health</span>
                          </div>
                        </div>
                      </div>

                      {/* Transaction History Table */}
                      <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm">
                        <div className="p-6">
                          <h3 className="font-semibold text-lg mb-4">Recent Donations</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Date</th>
                                  <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Campaign</th>
                                  <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Amount</th>
                                  <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Type</th>
                                  <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Transaction</th>
                                </tr>
                              </thead>
                              <tbody>
                                {isLoadingNFTs ? (
                                  <tr>
                                    <td colSpan={5} className="text-center py-8">
                                      <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin text-primary" />
                                      <p className="text-muted-foreground">Loading donation history...</p>
                                    </td>
                                  </tr>
                                ) : nfts.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="text-center py-8">
                                      <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                      <p className="text-muted-foreground">No donations yet</p>
                                      <p className="text-sm text-muted-foreground mt-1">Your donation history will appear here after you make a donation</p>
                                    </td>
                                  </tr>
                                ) : (
                                  nfts.map((nft, index) => {
                                    const category = getCampaignCategory(nft.campaignId);
                                    const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
                                      Zakat: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
                                      Education: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
                                      Health: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
                                      Waqf: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
                                      Sadaqah: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
                                      Emergency: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
                                      Infaq: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
                                    };
                                    const style = categoryStyles[category] || categoryStyles.Zakat;

                                    // Format date from block number (approximate)
                                    const donationDate = nft.blockNumber
                                      ? new Date(Number(nft.blockNumber) * 1000).toLocaleDateString('id-ID', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        })
                                      : 'Recently';

                                    return (
                                      <tr key={`${nft.tokenId}-${index}`} className="border-b border-border hover:bg-accent/50">
                                        <td className="py-4 px-4 text-sm">{donationDate}</td>
                                        <td className="py-4 px-4 text-sm font-medium">
                                          <div className="flex flex-col">
                                            <span>{getCampaignName(nft.campaignId)}</span>
                                            <span className="text-xs text-muted-foreground font-mono">
                                              ID: {nft.campaignId.slice(0, 10)}...
                                            </span>
                                          </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm font-semibold">{formatIDRX(nft.amount)} IDRX</td>
                                        <td className="py-4 px-4">
                                          <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${style.bg} ${style.text} ${style.border}`}>
                                            {category}
                                          </span>
                                        </td>
                                        <td className="py-4 px-4">
                                          <a
                                            href={`https://sepolia.basescan.org/nft/${CONTRACT_ADDRESSES.DonationReceiptNFT}/${nft.tokenId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                          >
                                            #{nft.tokenId.toString()}
                                            <ExternalLink className="h-3 w-3" />
                                          </a>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'governance' && (
                    <div className="space-y-6">
                      {/* Voting Power Card */}
                      <div className="bg-gradient-to-br from-purple-50 to-white text-card-foreground rounded-xl border border-purple-200 shadow-sm p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Your Voting Power</h3>
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                              {isLoadingVoting ? '...' : `${votingPower?.toString() || '0'} vZKT`}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">Soul-bound tokens earned through donations</p>
                            <div className="flex gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Proposals Voted</div>
                                <div className="font-semibold">0</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Participation Rate</div>
                                <div className="font-semibold">0%</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 border-purple-200">
                              {votingPower && Number(votingPower) > 0 ? 'Voter' : 'New Donor'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Active Proposals */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Active Proposals</h3>
                        {isLoadingProposals ? (
                          <div className="text-center py-12">
                            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading proposals...</p>
                          </div>
                        ) : proposals.length === 0 ? (
                          <div className="text-center py-12">
                            <Vote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No active proposals</p>
                            <p className="text-sm text-muted-foreground mt-1">Check back later for new governance proposals</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {proposals.map((proposal) => {
                              const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
                              const forPercentage = totalVotes > 0 ? Number((proposal.votesFor * BigInt(100)) / totalVotes) : 0;
                              const isActive = !proposal.executed && !proposal.cancelled;
                              const hasEnded = Number(proposal.endTime) < Date.now() / 1000;

                              return (
                                <div key={proposal.id.toString()} className={`bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6 ${hasEnded ? 'opacity-60' : ''}`}>
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${isActive && !hasEnded ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                          {isActive && !hasEnded && <Clock className="h-3 w-3 mr-1" />}
                                          {proposal.cancelled ? 'Cancelled' : hasEnded ? 'Ended' : isActive ? 'Active' : 'Executed'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">Proposal #{proposal.id}</span>
                                      </div>
                                      <h4 className="font-semibold text-base mb-2">{proposal.title}</h4>
                                      <p className="text-sm text-muted-foreground mb-4">{proposal.description}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">For: {proposal.votesFor.toString()} vZKT ({forPercentage}%)</span>
                                        <span className="text-muted-foreground">Against: {proposal.votesAgainst.toString()} vZKT</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div className={`${isActive && !hasEnded ? 'bg-green-500' : 'bg-blue-500'} h-2`} style={{ width: `${forPercentage}%` }}></div>
                                      </div>
                                    </div>
                                    {isActive && !hasEnded && (
                                      <div className="flex items-center justify-between pt-2 border-t border-border">
                                        <span className="text-xs text-muted-foreground">
                                          Ends in {Math.ceil((Number(proposal.endTime) - Date.now() / 1000) / 86400)} days
                                        </span>
                                        <div className="flex gap-2">
                                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border shadow-xs h-9 px-4 py-2 bg-green-500 text-white border-green-600 hover:bg-green-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Vote For
                                          </button>
                                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border shadow-xs h-9 px-4 py-2 bg-white border-black hover:bg-gray-50">
                                            <XCircle className="h-4 w-4" />
                                            Vote Against
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                    {hasEnded && (
                                      <div className="flex items-center justify-between pt-2 border-t border-border">
                                        <span className="text-xs text-muted-foreground">
                                          Ended {new Date(Number(proposal.endTime) * 1000).toLocaleDateString('id-ID')}
                                        </span>
                                        <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                                          {proposal.executed ? 'Executed' : 'Ended'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* How to Earn More Voting Power */}
                      <div className="bg-purple-50 text-card-foreground rounded-xl border border-purple-200 p-6">
                        <h4 className="font-semibold mb-3">How to Earn More Voting Power</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Make donations to any campaign (1 vZKT per 10,000 IDRX donated)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Participate in governance votes (5 vZKT bonus per vote)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Maintain consistent monthly donations (10% bonus vZKT)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </>
              )}

              {/* Tax Reports Tab */}
              {sidebarTab === 'tax-reports' && (
                <>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Tax Reports</h1>
                    <p className="text-muted-foreground">Download tax-deductible donation receipts for filing</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                      <div className="text-sm text-muted-foreground mb-1">Total Deductible (2025)</div>
                      <div className="text-2xl font-bold">Rp 19.750.000</div>
                      <p className="text-xs text-muted-foreground mt-1">Across 45 donations</p>
                    </div>
                    <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                      <div className="text-sm text-muted-foreground mb-1">Tax Benefit Estimate</div>
                      <div className="text-2xl font-bold text-green-600">Rp 4.937.500</div>
                      <p className="text-xs text-muted-foreground mt-1">At 25% tax rate</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-black shadow-sm">
                    <div className="p-6 border-b border-border">
                      <h3 className="font-semibold text-lg">Annual Reports</h3>
                      <p className="text-sm text-muted-foreground mt-1">Download comprehensive tax reports by year</p>
                    </div>
                    <div className="p-6 space-y-4">
                      {['2025', '2024', '2023'].map((year) => (
                        <div key={year} className="flex items-center justify-between border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div>
                            <div className="font-semibold">{year} Tax Year</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {year === '2025' ? 'In Progress - YTD' : 'Complete'}
                            </div>
                          </div>
                          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-black hover:bg-gray-50 text-sm font-medium">
                            <Download className="h-4 w-4" />
                            Download PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                    <h4 className="font-semibold mb-3">Tax Deduction Information</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>All donations to registered charities are tax-deductible in Indonesia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Keep these receipts with your annual tax filing documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Consult with a tax professional for personalized advice</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* Governance DAO Tab */}
              {sidebarTab === 'governance-dao' && (
                <>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">DAO Governance</h1>
                    <p className="text-muted-foreground">Participate in platform decisions with your voting power</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 shadow-sm p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Your Voting Power</h3>
                        <div className="text-3xl font-bold text-purple-600 mb-2">850 vZKT</div>
                        <p className="text-sm text-muted-foreground mb-4">Soul-bound tokens earned through donations</p>
                      </div>
                      <span className="inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 border-purple-200">Top 15%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                      <div className="text-sm text-muted-foreground mb-1">Proposals Voted</div>
                      <div className="text-2xl font-bold">12</div>
                    </div>
                    <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                      <div className="text-sm text-muted-foreground mb-1">Participation Rate</div>
                      <div className="text-2xl font-bold">85%</div>
                    </div>
                    <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                      <div className="text-sm text-muted-foreground mb-1">Active Proposals</div>
                      <div className="text-2xl font-bold">3</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-black shadow-sm">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Active Proposals</h3>
                          <p className="text-sm text-muted-foreground mt-1">Vote on important platform decisions</p>
                        </div>
                        <a href="/governance" className="text-sm text-primary hover:underline">View All</a>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border-green-200">
                            Active
                          </span>
                          <span className="text-xs text-muted-foreground">Ends in 3 days</span>
                        </div>
                        <h4 className="font-semibold mb-2">Increase Education Fund Allocation to 35%</h4>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>For: 2,450 vZKT (68%)</span>
                          <span>Against: 1,150 vZKT (32%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border-green-200">
                            Active
                          </span>
                          <span className="text-xs text-muted-foreground">Ends in 5 days</span>
                        </div>
                        <h4 className="font-semibold mb-2">Implement Quarterly Impact Reports</h4>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>For: 3,120 vZKT (82%)</span>
                          <span>Against: 685 vZKT (18%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Wallet Settings Tab */}
              {sidebarTab === 'wallet-settings' && (
                <>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Wallet Settings</h1>
                    <p className="text-muted-foreground">Manage your wallet connection and preferences</p>
                  </div>

                  <div className="bg-white rounded-xl border border-black shadow-sm">
                    <div className="p-6 border-b border-border">
                      <h3 className="font-semibold text-lg">Connected Wallet</h3>
                      <p className="text-sm text-muted-foreground mt-1">Your currently connected wallet address</p>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4 p-4 bg-accent/30 rounded-lg">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Address</div>
                          <div className="font-mono font-semibold">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
                        </div>
                        <button className="px-4 py-2 rounded-md border border-black hover:bg-gray-50 text-sm font-medium">
                          Disconnect
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-border rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Network</div>
                          <div className="font-semibold">Base Sepolia</div>
                        </div>
                        <div className="p-4 border border-border rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Balance</div>
                          <div className="font-semibold">15,800,000 IDRX</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-black shadow-sm">
                    <div className="p-6 border-b border-border">
                      <h3 className="font-semibold text-lg">Notification Preferences</h3>
                      <p className="text-sm text-muted-foreground mt-1">Choose how you want to be notified</p>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        { label: 'Donation Confirmations', desc: 'Get notified when your donations are processed' },
                        { label: 'New Proposals', desc: 'Alerts for new DAO governance proposals' },
                        { label: 'Campaign Updates', desc: 'Updates from campaigns you have supported' },
                        { label: 'Tax Reports', desc: 'Annual tax report availability notifications' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-sm text-muted-foreground mt-1">{item.desc}</div>
                          </div>
                          <button className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90">
                            Enabled
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
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