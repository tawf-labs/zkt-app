"use client";

import React, { useState } from 'react';
import { Search, ExternalLink, Filter, TrendingUp, Users, Coins, Vote, Calendar, Loader2 } from 'lucide-react';
import { CONTRACT_ADDRESSES, formatAddress, formatTimestamp, formatIDRX } from '@/lib/abi';
import { useTransactionHistory, TransactionType } from '@/hooks/useTransactionHistory';

const ExplorerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType>('all');
  
  const { transactions, isLoading, error } = useTransactionHistory();

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch = searchQuery === '' || 
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate stats from blockchain data
  const totalDonations = transactions
    .filter(tx => tx.type === 'donation' && tx.amount)
    .reduce((sum, tx) => sum + tx.amount!, BigInt(0));
  
  const uniqueDonors = new Set(
    transactions
      .filter(tx => tx.type === 'donation')
      .map(tx => tx.from)
  ).size;
  
  const totalTransactions = transactions.length;
  const activeCampaigns = transactions.filter(tx => tx.type === 'campaign').length;
  const totalProposals = transactions.filter(tx => tx.type === 'proposal').length;

  const getTypeIcon = (type: TransactionType) => {
    switch(type) {
      case 'donation': return <Coins className="h-4 w-4" />;
      case 'campaign': return <TrendingUp className="h-4 w-4" />;
      case 'proposal': return <Vote className="h-4 w-4" />;
      case 'vote': return <Users className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeBadge = (type: TransactionType) => {
    const styles: Record<TransactionType, string> = {
      donation: 'bg-green-100 text-green-700 border-green-200',
      campaign: 'bg-blue-100 text-blue-700 border-blue-200',
      proposal: 'bg-purple-100 text-purple-700 border-purple-200',
      vote: 'bg-orange-100 text-orange-700 border-orange-200',
      all: ''
    };
    
    return (
      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${styles[type]}`}>
        {getTypeIcon(type)}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Blockchain Explorer</h1>
            <p className="text-muted-foreground">
              Explore all transactions on the ZKT platform • Base Sepolia Network
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg font-semibold text-foreground">Error loading transactions</p>
              <p className="text-muted-foreground mt-2">{error.message}</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Donated</div>
                  <div className="text-xl font-bold">{formatIDRX(totalDonations)} IDRX</div>
                </div>
              </div>
            </div>

            <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Unique Donors</div>
                  <div className="text-xl font-bold">{uniqueDonors}</div>
                </div>
              </div>
            </div>

            <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Vote className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Proposals</div>
                  <div className="text-xl font-bold">{totalProposals}</div>
                </div>
              </div>
            </div>

            <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Transactions</div>
                  <div className="text-xl font-bold">{totalTransactions}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by transaction hash, address, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as TransactionType)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Types</option>
                  <option value="donation">Donations</option>
                  <option value="campaign">Campaigns</option>
                  <option value="proposal">Proposals</option>
                  <option value="vote">Votes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm">
            <div className="p-6">
              <h2 className="font-semibold text-lg mb-4">Recent Transactions</h2>
              
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No transactions found matching your search criteria
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((tx) => (
                    <div 
                      key={tx.hash}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          {/* Transaction Type and Hash */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {getTypeBadge(tx.type)}
                            <a 
                              href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:underline"
                            >
                              {formatAddress(tx.hash)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-green-100 text-green-700 border-green-200">
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm font-medium">{tx.description}</p>

                          {/* From/To Addresses */}
                          <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span>From:</span>
                              <a 
                                href={`https://sepolia.basescan.org/address/${tx.from}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-primary hover:underline inline-flex items-center gap-1"
                              >
                                {formatAddress(tx.from)}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            {tx.to && (
                              <>
                                <span className="hidden sm:inline">→</span>
                                <div className="flex items-center gap-1">
                                  <span>To:</span>
                                  <a 
                                    href={`https://sepolia.basescan.org/address/${tx.to}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-primary hover:underline inline-flex items-center gap-1"
                                  >
                                    {formatAddress(tx.to)}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Amount and Time */}
                        <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-start gap-2">
                          {tx.amount && (
                            <div className="text-right">
                              <div className="text-sm font-semibold text-green-600">
                                {formatIDRX(tx.amount)} IDRX
                              </div>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground text-right">
                            <div>{formatTimestamp(tx.timestamp)}</div>
                            <div className="font-mono">Block #{tx.blockNumber.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contract Information */}
          <div className="mt-6 bg-gray-50 text-card-foreground rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-3">Smart Contract Addresses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">ZKTCore</div>
                <a 
                  href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.ZKTCore}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  {CONTRACT_ADDRESSES.ZKTCore}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">MockIDRX Token</div>
                <a 
                  href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.MockIDRX}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  {CONTRACT_ADDRESSES.MockIDRX}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Receipt NFT</div>
                <a 
                  href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.DonationReceiptNFT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  {CONTRACT_ADDRESSES.DonationReceiptNFT}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          </>
        )}
        </div>
      </main>
    </div>
  );
};

export default ExplorerPage;
