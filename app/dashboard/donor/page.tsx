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
                                <p className="font-medium">Campaign #{r.poolId.toString()}</p>
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
                            <CardDescription>Campaign #{r.poolId.toString()}</CardDescription>
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
