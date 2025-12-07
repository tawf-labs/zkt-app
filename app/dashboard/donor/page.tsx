"use client";

import React, { useState, useMemo } from 'react';
import { Award, FileText, Vote, Wallet, ShieldCheck, Download, ExternalLink, TrendingUp, CheckCircle2, XCircle, Clock, Settings, Loader2, Plus, Send } from 'lucide-react';
import { useDonationReceipts } from '@/hooks/useDonationReceipts';
import { useProposals } from '@/hooks/useProposals';
import { useVotingPower } from '@/hooks/useVotingPower';
import { useUserProposals } from '@/hooks/useUserProposals';
import { useIDRXBalance } from '@/hooks/useIDRXBalance';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { useAccount, useWriteContract, useDisconnect } from 'wagmi';
import { formatIDRX, formatAddress, formatTimestamp, CONTRACT_ADDRESSES, ZKTCoreABI } from '@/lib/abi';
import { handleTransactionError, handleWalletError } from '@/lib/errors';
import { useToast } from '@/hooks/use-toast';
import { aggregateDonationsByYear, generateCSVReport, downloadCSV } from '@/lib/taxReports';

type SidebarTab = 'overview' | 'tax-reports' | 'governance-dao' | 'wallet-settings';

const DonorDashboard: React.FC = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { receipts, isLoading } = useDonationReceipts();
  const { proposals, isLoading: isLoadingProposals, refetch: refetchProposals } = useProposals([0, 1, 2, 3]);
  const { votingPower, formattedVotingPower, isLoading: isLoadingVotingPower } = useVotingPower();
  const { proposals: userProposals, isLoading: isLoadingUserProposals } = useUserProposals();
  const { balance: idrxBalance, formattedBalance, isLoading: isLoadingBalance } = useIDRXBalance();
  const { transactions, isLoading: isLoadingTransactions } = useTransactionHistory();
  const { writeContractAsync, isPending: isVoting } = useWriteContract();
  
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('overview');
  const [activeTab, setActiveTab] = useState<'receipts' | 'history' | 'governance'>('receipts');
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [pendingVoteProposalId, setPendingVoteProposalId] = useState<string | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);
  
  // Calculate tax reports from receipts
  const taxReports = useMemo(() => aggregateDonationsByYear(receipts), [receipts]);
  
  // Filter user transactions
  const userTransactions = useMemo(() => {
    if (!address) return [];
    return transactions.filter(tx => tx.from.toLowerCase() === address.toLowerCase()).slice(0, 10);
  }, [transactions, address]);

  const handleVote = async (proposalId: string, voteType: "for" | "against") => {
    if (!isConnected) {
      handleWalletError(new Error("not-connected"), { toast });
      return;
    }

    setPendingVoteProposalId(proposalId);
    
    try {
      const voteSupport = voteType === "for";
      
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ZKTCore,
        abi: ZKTCoreABI,
        functionName: "vote",
        args: [BigInt(proposalId), voteSupport],
      });

      toast({
        title: "Vote Cast! 🗳️",
        description: `Your vote ${voteType === "for" ? "for" : "against"} the proposal has been recorded.`,
      });

      setHasVoted({ ...hasVoted, [proposalId]: true });
      await refetchProposals();
    } catch (error) {
      handleTransactionError(error, { toast, action: "vote" });
    } finally {
      setPendingVoteProposalId(null);
    }
  };

  const handleCreateProposal = async () => {
    if (!isConnected) {
      handleWalletError(new Error("not-connected"), { toast });
      return;
    }

    // Frontend validation
    if (!proposalTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a proposal title",
        variant: "destructive",
      });
      return;
    }

    if (proposalTitle.length < 10) {
      toast({
        title: "Validation Error",
        description: "Title must be at least 10 characters",
        variant: "destructive",
      });
      return;
    }

    if (!proposalDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a proposal description",
        variant: "destructive",
      });
      return;
    }

    if (proposalDescription.length < 50) {
      toast({
        title: "Validation Error",
        description: "Description must be at least 50 characters",
        variant: "destructive",
      });
      return;
    }

    // Check voting power requirement (minimum 100 vZKT)
    const minVotingPower = BigInt(100 * 10**18);
    if ((votingPower || BigInt(0)) < minVotingPower) {
      toast({
        title: "Insufficient Voting Power",
        description: "You need at least 100 vZKT to create a proposal. Make more donations to earn voting power.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingProposal(true);
    
    try {
      // 7 days voting period (approximately 50,400 blocks on Base Sepolia with 12s block time)
      const votingPeriod = BigInt(50400);
      
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.ZKTCore,
        abi: ZKTCoreABI,
        functionName: "createProposal",
        args: [proposalTitle, proposalDescription, votingPeriod],
      });

      toast({
        title: "Proposal Created! 🎉",
        description: "Your proposal has been submitted to the DAO for voting.",
      });

      setProposalTitle('');
      setProposalDescription('');
      setShowProposalForm(false);
    } catch (error) {
      handleTransactionError(error, { toast, action: "create proposal" });
    } finally {
      setIsCreatingProposal(false);
    }
  };

  const handleDownloadTaxReport = (year: number) => {
    const report = taxReports.find(r => r.year === year);
    if (!report || !address) {
      toast({
        title: "Error",
        description: "Unable to generate report",
        variant: "destructive",
      });
      return;
    }

    const csvContent = generateCSVReport(report, address);
    downloadCSV(csvContent, `ZKT_Tax_Report_${year}_${formatAddress(address)}.csv`);
    
    toast({
      title: "Report Downloaded",
      description: `Tax report for ${year} has been downloaded successfully.`,
    });
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

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
                      {address ? address.slice(0, 2).toUpperCase() : 'NA'}
                    </div>
                  </div>
                  <h2 className="font-bold text-xl">{isConnected ? 'Donor' : 'Not Connected'}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{isConnected ? formatAddress(address!) : 'Please connect wallet'}</p>
                  {isConnected && (
                    <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full text-xs font-mono text-muted-foreground mb-6">
                      <Wallet className="h-3 w-3" />
                      {formatAddress(address!)}
                    </div>
                  )}
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
                  <div className="text-2xl font-bold text-primary">
                    {isConnected ? (
                      `${formatIDRX(receipts.reduce((sum, r) => sum + r.amount, BigInt(0)))} IDRX`
                    ) : (
                      'Connect Wallet'
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime donations</p>
                </div>
                <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">NFT Receipts</div>
                  <div className="text-2xl font-bold">{isConnected ? receipts.length : '0'}</div>
                  <p className="text-xs text-muted-foreground mt-1">Donation certificates</p>
                </div>
                <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Campaigns Supported</div>
                  <div className="text-2xl font-bold">
                    {isConnected ? new Set(receipts.map(r => r.poolId.toString())).size : '0'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Unique campaigns</p>
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
                    <>
                      {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : !isConnected ? (
                        <div className="text-center py-20">
                          <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg font-semibold text-foreground">Connect Your Wallet</p>
                          <p className="text-muted-foreground mt-2">Please connect your wallet to view your donation receipts</p>
                        </div>
                      ) : receipts.length === 0 ? (
                        <div className="text-center py-20">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg font-semibold text-foreground">No Receipts Yet</p>
                          <p className="text-muted-foreground mt-2">Make your first donation to receive an NFT receipt</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {receipts.map((receipt) => (
                            <div
                              key={receipt.tokenId.toString()}
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
                                    NFT #{receipt.tokenId.toString()}
                                  </div>
                                  <div className="font-bold text-lg">{formatIDRX(receipt.amount)} IDRX</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Campaign #{receipt.poolId.toString()} • {formatTimestamp(Number(receipt.timestamp))}
                                  </div>
                                </div>
                                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium absolute top-3 right-3 bg-white/80 backdrop-blur text-foreground border-border/50 shadow-sm">
                                  Verified
                                </span>
                              </div>

                              {/* Receipt Info */}
                              <div className="p-4">
                                <h3 className="font-semibold truncate">Donation Receipt NFT</h3>
                                <div className="flex justify-between items-center mt-4">
                                  <span className="text-xs font-mono text-muted-foreground">
                                    {formatAddress(receipt.donor)}
                                  </span>
                                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0">
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === 'history' && (
                    <div className="space-y-6">
                      {/* Monthly Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-4">
                          <div className="text-sm text-muted-foreground mb-1">Total Donated</div>
                          <div className="text-2xl font-bold">
                            {isConnected ? formatIDRX(receipts.reduce((sum, r) => sum + r.amount, BigInt(0))) : '0'} IDRX
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Lifetime donations</div>
                        </div>
                        <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-4">
                          <div className="text-sm text-muted-foreground mb-1">Donations Made</div>
                          <div className="text-2xl font-bold">{isConnected ? receipts.length : '0'}</div>
                          <div className="text-xs text-muted-foreground mt-1">Total transactions</div>
                        </div>
                        <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-4">
                          <div className="text-sm text-muted-foreground mb-1">NFT Receipts</div>
                          <div className="text-2xl font-bold">{isConnected ? receipts.length : '0'}</div>
                          <div className="text-xs text-muted-foreground mt-1">Collected</div>
                        </div>
                      </div>

                      {/* Transaction History Table */}
                      <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm">
                        <div className="p-6">
                          <h3 className="font-semibold text-lg mb-4">Recent Donations</h3>
                          {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                          ) : !isConnected ? (
                            <div className="text-center py-10 text-muted-foreground">
                              Please connect your wallet to view donation history
                            </div>
                          ) : receipts.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                              No donations yet. Make your first donation to get started!
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-border">
                                    <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Date</th>
                                    <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Campaign</th>
                                    <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Amount</th>
                                    <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">NFT ID</th>
                                    <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Transaction</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {receipts.map((receipt) => (
                                    <tr key={receipt.tokenId.toString()} className="border-b border-border hover:bg-accent/50">
                                      <td className="py-4 px-4 text-sm">{formatTimestamp(Number(receipt.timestamp))}</td>
                                      <td className="py-4 px-4 text-sm font-medium">Campaign #{receipt.poolId.toString()}</td>
                                      <td className="py-4 px-4 text-sm font-semibold">{formatIDRX(receipt.amount)} IDRX</td>
                                      <td className="py-4 px-4">
                                        <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
                                          #{receipt.tokenId.toString()}
                                        </span>
                                      </td>
                                      <td className="py-4 px-4">
                                        <a 
                                          href={`https://sepolia.basescan.org/nft/${CONTRACT_ADDRESSES.DonationReceiptNFT}/${receipt.tokenId.toString()}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                        >
                                          View NFT
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'governance' && (
                    <div className="space-y-6">
                      {/* Voting Power Card */}
                      <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">Your Voting Power</h3>
                          <Vote className="h-5 w-5 text-primary" />
                        </div>
                        {isLoadingVotingPower ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : !isConnected ? (
                          <div className="text-center py-6 text-muted-foreground">
                            Please connect your wallet to view voting power
                          </div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold mb-2">{formattedVotingPower} vZKT</div>
                            <p className="text-sm text-muted-foreground">Based on your donation history and participation</p>
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="text-sm text-muted-foreground mb-2">Voting Status</div>
                              <div className="flex gap-2">
                                {(votingPower || BigInt(0)) > BigInt(0) ? (
                                  <>
                                    <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-green-100 text-green-700 border-green-200">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Eligible to Vote
                                    </span>
                                    <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                                      Active Voter
                                    </span>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 border-yellow-200">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Make a donation to earn voting power
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Active Proposals */}
                      <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                        <h3 className="font-semibold text-lg mb-4">Active Proposals</h3>
                        {isLoadingProposals ? (
                          <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : !isConnected ? (
                          <div className="text-center py-10 text-muted-foreground">
                            Please connect your wallet to view proposals
                          </div>
                        ) : proposals.length === 0 ? (
                          <div className="text-center py-10 text-muted-foreground">
                            No active proposals at the moment
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {proposals.map((proposal) => {
                              const totalVotes = proposal.votesFor + proposal.votesAgainst;
                              const forPercentage = totalVotes > BigInt(0) 
                                ? Number((proposal.votesFor * BigInt(100)) / totalVotes) 
                                : 0;
                              const againstPercentage = 100 - forPercentage;
                              
                              const statusConfig = {
                                'Pending': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Pending' },
                                'Active': { color: 'bg-green-100 text-green-700 border-green-200', label: 'Active' },
                                'Approved': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Approved' },
                                'Rejected': { color: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' },
                                'Executed': { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Executed' },
                              };

                              const config = statusConfig[proposal.status] || statusConfig['Pending'];
                              const hasUserVoted = hasVoted[proposal.id.toString()];
                              const isPending = pendingVoteProposalId === proposal.id.toString();

                              return (
                                <div key={proposal.id.toString()} className="border border-border rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${config.color}`}>
                                          {config.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">#{proposal.id.toString()}</span>
                                      </div>
                                      <h4 className="font-semibold">{proposal.title}</h4>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-4">{proposal.description}</p>
                                  
                                  {/* Voting Stats */}
                                  <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">For ({forPercentage}%)</span>
                                      <span className="font-medium">{formatIDRX(proposal.votesFor)} vZKT</span>
                                    </div>
                                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                                      <div className="h-full bg-green-500" style={{ width: `${forPercentage}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Against ({againstPercentage}%)</span>
                                      <span className="font-medium">{formatIDRX(proposal.votesAgainst)} vZKT</span>
                                    </div>
                                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                                      <div className="h-full bg-red-500" style={{ width: `${againstPercentage}%` }}></div>
                                    </div>
                                  </div>

                                  {/* Voting Buttons */}
                                  {hasUserVoted ? (
                                    <div className="text-sm text-green-600 flex items-center gap-1">
                                      <CheckCircle2 className="h-4 w-4" />
                                      You voted on this proposal
                                    </div>
                                  ) : proposal.status === 'Active' && (votingPower || BigInt(0)) > BigInt(0) ? (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleVote(proposal.id.toString(), "for")}
                                        disabled={isPending || isVoting}
                                        className="flex-1 inline-flex items-center justify-center rounded-lg bg-green-500 text-white px-4 py-2 text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {isPending ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <CheckCircle2 className="h-4 w-4 mr-2" />
                                        )}
                                        Vote For
                                      </button>
                                      <button
                                        onClick={() => handleVote(proposal.id.toString(), "against")}
                                        disabled={isPending || isVoting}
                                        className="flex-1 inline-flex items-center justify-center rounded-lg border border-border bg-white text-foreground px-4 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {isPending ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <XCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Vote Against
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground">
                                      {(votingPower || BigInt(0)) === BigInt(0) 
                                        ? "Make a donation to earn voting power" 
                                        : "Voting closed"}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
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

                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : !isConnected ? (
                    <div className="bg-white rounded-xl border border-black shadow-sm p-12 text-center">
                      <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg mb-2">Connect Your Wallet</h3>
                      <p className="text-muted-foreground">Please connect your wallet to view tax reports</p>
                    </div>
                  ) : taxReports.length === 0 ? (
                    <div className="bg-white rounded-xl border border-black shadow-sm p-12 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg mb-2">No Donations Yet</h3>
                      <p className="text-muted-foreground">Make your first donation to start generating tax reports</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                          <div className="text-sm text-muted-foreground mb-1">Total Deductible ({new Date().getFullYear()})</div>
                          <div className="text-2xl font-bold">
                            {taxReports[0] ? formatIDRX(taxReports[0].totalDonations) : '0'} IDRX
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Across {taxReports[0]?.donationCount || 0} donations
                          </p>
                        </div>
                        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                          <div className="text-sm text-muted-foreground mb-1">All-Time Donations</div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatIDRX(taxReports.reduce((sum, r) => sum + r.totalDonations, BigInt(0)))} IDRX
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {taxReports.reduce((sum, r) => sum + r.donationCount, 0)} total donations
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-black shadow-sm">
                        <div className="p-6 border-b border-border">
                          <h3 className="font-semibold text-lg">Annual Reports</h3>
                          <p className="text-sm text-muted-foreground mt-1">Download comprehensive tax reports by year</p>
                        </div>
                        <div className="p-6 space-y-4">
                          {taxReports.map((report) => (
                            <div key={report.year} className="flex items-center justify-between border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                              <div>
                                <div className="font-semibold">{report.year} Tax Year</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {formatIDRX(report.totalDonations)} IDRX • {report.donationCount} donations
                                  {report.year === new Date().getFullYear() && ' • In Progress'}
                                </div>
                              </div>
                              <button 
                                onClick={() => handleDownloadTaxReport(report.year)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-black hover:bg-gray-50 text-sm font-medium"
                              >
                                <Download className="h-4 w-4" />
                                Download CSV
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
                            <span>All transactions are verified on the blockchain for authenticity</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Consult with a tax professional for personalized advice</span>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Governance DAO Tab */}
              {sidebarTab === 'governance-dao' && (
                <>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">DAO Governance</h1>
                    <p className="text-muted-foreground">Participate in platform decisions with your voting power</p>
                  </div>

                  {!isConnected ? (
                    <div className="bg-white rounded-xl border border-black shadow-sm p-12 text-center">
                      <Vote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg mb-2">Connect Your Wallet</h3>
                      <p className="text-muted-foreground">Please connect your wallet to participate in governance</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 shadow-sm p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Your Voting Power</h3>
                            {isLoadingVotingPower ? (
                              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                            ) : (
                              <>
                                <div className="text-3xl font-bold text-purple-600 mb-2">{formattedVotingPower} vZKT</div>
                                <p className="text-sm text-muted-foreground mb-4">Soul-bound tokens earned through donations</p>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => setShowProposalForm(!showProposalForm)}
                            disabled={(votingPower || BigInt(0)) < BigInt(100 * 10**18)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={(votingPower || BigInt(0)) < BigInt(100 * 10**18) ? "Need 100 vZKT to create proposals" : "Create new proposal"}
                          >
                            <Plus className="h-4 w-4" />
                            New Proposal
                          </button>
                        </div>
                      </div>

                      {showProposalForm && (
                        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                          <h3 className="font-semibold text-lg mb-4">Create New Proposal</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Title (min. 10 characters)</label>
                              <input
                                type="text"
                                value={proposalTitle}
                                onChange={(e) => setProposalTitle(e.target.value)}
                                placeholder="Enter proposal title..."
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                maxLength={200}
                              />
                              <p className="text-xs text-muted-foreground mt-1">{proposalTitle.length}/200 characters</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Description (min. 50 characters)</label>
                              <textarea
                                value={proposalDescription}
                                onChange={(e) => setProposalDescription(e.target.value)}
                                placeholder="Provide detailed description of your proposal..."
                                rows={6}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                maxLength={1000}
                              />
                              <p className="text-xs text-muted-foreground mt-1">{proposalDescription.length}/1000 characters</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleCreateProposal}
                                disabled={isCreatingProposal}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
                              >
                                {isCreatingProposal ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4" />
                                    Submit Proposal
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setShowProposalForm(false);
                                  setProposalTitle('');
                                  setProposalDescription('');
                                }}
                                className="px-4 py-2 rounded-md border border-border hover:bg-accent"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                          <div className="text-sm text-muted-foreground mb-1">Your Proposals</div>
                          <div className="text-2xl font-bold">{isLoadingUserProposals ? <Loader2 className="h-6 w-6 animate-spin" /> : userProposals.length}</div>
                        </div>
                        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                          <div className="text-sm text-muted-foreground mb-1">Votes Cast</div>
                          <div className="text-2xl font-bold">{Object.keys(hasVoted).length}</div>
                        </div>
                        <div className="bg-white rounded-xl border border-black shadow-sm p-6">
                          <div className="text-sm text-muted-foreground mb-1">Active Proposals</div>
                          <div className="text-2xl font-bold">{isLoadingProposals ? <Loader2 className="h-6 w-6 animate-spin" /> : proposals.filter(p => p.status === 'Active').length}</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-black shadow-sm">
                        <div className="p-6 border-b border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">Your Submitted Proposals</h3>
                              <p className="text-sm text-muted-foreground mt-1">Track proposals you've created</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          {isLoadingUserProposals ? (
                            <div className="flex items-center justify-center py-10">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                          ) : userProposals.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>You haven't created any proposals yet</p>
                              <p className="text-sm mt-1">Click "New Proposal" to submit your first proposal</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {userProposals.map((proposal) => {
                                const totalVotes = proposal.votesFor + proposal.votesAgainst;
                                const forPercentage = totalVotes > BigInt(0) 
                                  ? Number((proposal.votesFor * BigInt(100)) / totalVotes) 
                                  : 0;
                                
                                const statusConfig = {
                                  'Pending': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Pending' },
                                  'Active': { color: 'bg-green-100 text-green-700 border-green-200', label: 'Active' },
                                  'Approved': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Approved' },
                                  'Rejected': { color: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' },
                                  'Executed': { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Executed' },
                                };
                                const config = statusConfig[proposal.status] || statusConfig['Pending'];

                                return (
                                  <div key={proposal.id.toString()} className="border border-border rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.color}`}>
                                        {config.label}
                                      </span>
                                      <span className="text-xs text-muted-foreground">#{proposal.id.toString()}</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">{proposal.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-3">{proposal.description}</p>
                                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                      <span>For: {formatIDRX(proposal.votesFor)} vZKT ({forPercentage}%)</span>
                                      <span>Against: {formatIDRX(proposal.votesAgainst)} vZKT ({100 - forPercentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${forPercentage}%` }}></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-black shadow-sm">
                        <div className="p-6 border-b border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">All Active Proposals</h3>
                              <p className="text-sm text-muted-foreground mt-1">Vote on important platform decisions</p>
                            </div>
                            <a href="/governance" className="text-sm text-primary hover:underline">View All</a>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          {isLoadingProposals ? (
                            <div className="flex items-center justify-center py-10">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                          ) : proposals.filter(p => p.status === 'Active').slice(0, 3).map((proposal) => {
                            const totalVotes = proposal.votesFor + proposal.votesAgainst;
                            const forPercentage = totalVotes > BigInt(0) 
                              ? Number((proposal.votesFor * BigInt(100)) / totalVotes) 
                              : 0;

                            return (
                              <div key={proposal.id.toString()} className="border border-border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border-green-200">
                                    Active
                                  </span>
                                  <span className="text-xs text-muted-foreground">#{proposal.id.toString()}</span>
                                </div>
                                <h4 className="font-semibold mb-2">{proposal.title}</h4>
                                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                  <span>For: {formatIDRX(proposal.votesFor)} vZKT ({forPercentage}%)</span>
                                  <span>Against: {formatIDRX(proposal.votesAgainst)} vZKT ({100 - forPercentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${forPercentage}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Wallet Settings Tab */}
              {sidebarTab === 'wallet-settings' && (
                <>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Wallet Settings</h1>
                    <p className="text-muted-foreground">Manage your wallet connection and view transaction history</p>
                  </div>

                  {!isConnected ? (
                    <div className="bg-white rounded-xl border border-black shadow-sm p-12 text-center">
                      <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg mb-2">No Wallet Connected</h3>
                      <p className="text-muted-foreground">Please connect your wallet to view settings</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-xl border border-black shadow-sm">
                        <div className="p-6 border-b border-border">
                          <h3 className="font-semibold text-lg">Connected Wallet</h3>
                          <p className="text-sm text-muted-foreground mt-1">Your currently connected wallet address</p>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4 p-4 bg-accent/30 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-muted-foreground mb-1">Address</div>
                              <div className="font-mono font-semibold truncate">{address}</div>
                            </div>
                            <button 
                              onClick={handleDisconnect}
                              className="ml-4 px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50 text-sm font-medium flex-shrink-0"
                            >
                              Disconnect
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-border rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">Network</div>
                              <div className="font-semibold">Base Sepolia</div>
                              <p className="text-xs text-muted-foreground mt-1">Testnet</p>
                            </div>
                            <div className="p-4 border border-border rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">IDRX Balance</div>
                              {isLoadingBalance ? (
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              ) : (
                                <>
                                  <div className="font-semibold">{formattedBalance} IDRX</div>
                                  <p className="text-xs text-muted-foreground mt-1">Available</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-black shadow-sm">
                        <div className="p-6 border-b border-border">
                          <h3 className="font-semibold text-lg">Recent Transactions</h3>
                          <p className="text-sm text-muted-foreground mt-1">Your latest blockchain activities</p>
                        </div>
                        <div className="p-6">
                          {isLoadingTransactions ? (
                            <div className="flex items-center justify-center py-10">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                          ) : userTransactions.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No transactions found</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {userTransactions.map((tx, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border-blue-200 capitalize">
                                        {tx.type}
                                      </span>
                                      <span className="text-sm text-muted-foreground">{formatTimestamp(tx.timestamp)}</span>
                                    </div>
                                    <div className="text-sm font-medium">{tx.description}</div>
                                    {tx.amount && (
                                      <div className="text-sm text-muted-foreground mt-1">
                                        Amount: {formatIDRX(tx.amount)} IDRX
                                      </div>
                                    )}
                                  </div>
                                  <a
                                    href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-4 inline-flex items-center gap-1 text-sm text-primary hover:underline flex-shrink-0"
                                  >
                                    {formatAddress(tx.hash)}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-black shadow-sm">
                        <div className="p-6 border-b border-border">
                          <h3 className="font-semibold text-lg">Quick Stats</h3>
                          <p className="text-sm text-muted-foreground mt-1">Overview of your activity</p>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-primary">{receipts.length}</div>
                              <div className="text-xs text-muted-foreground mt-1">NFT Receipts</div>
                            </div>
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">{formattedVotingPower}</div>
                              <div className="text-xs text-muted-foreground mt-1">Voting Power</div>
                            </div>
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-green-600">{userProposals.length}</div>
                              <div className="text-xs text-muted-foreground mt-1">Proposals Created</div>
                            </div>
                            <div className="text-center p-4 border border-border rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{userTransactions.length}</div>
                              <div className="text-xs text-muted-foreground mt-1">Transactions</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-blue-600" />
                          Security Information
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>All transactions are secured by blockchain technology</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Your private keys never leave your wallet</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Always verify transaction details before signing</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Keep your seed phrase safe and never share it</span>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
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