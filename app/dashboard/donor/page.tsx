"use client";

import React, { useState } from 'react';
import { Award, FileText, Vote, Wallet, ShieldCheck, Download } from 'lucide-react';

interface NFTReceipt {
  id: string;
  receiptNumber: string;
  amount: string;
  category: string;
  date: string;
  campaign: string;
  address: string;
}

const DonorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'receipts' | 'history' | 'governance'>('receipts');

  const receipts: NFTReceipt[] = [
    {
      id: '1',
      receiptNumber: '1001',
      amount: '$50.00 USD',
      category: 'Zakat',
      date: 'Oct 24, 2025',
      campaign: 'Emergency Relief Fund',
      address: '0x8a...92b'
    },
    {
      id: '2',
      receiptNumber: '1002',
      amount: '$50.00 USD',
      category: 'Zakat',
      date: 'Oct 24, 2025',
      campaign: 'Emergency Relief Fund',
      address: '0x8a...92b'
    },
    {
      id: '3',
      receiptNumber: '1003',
      amount: '$50.00 USD',
      category: 'Zakat',
      date: 'Oct 24, 2025',
      campaign: 'Emergency Relief Fund',
      address: '0x8a...92b'
    },
    {
      id: '4',
      receiptNumber: '1004',
      amount: '$50.00 USD',
      category: 'Zakat',
      date: 'Oct 24, 2025',
      campaign: 'Emergency Relief Fund',
      address: '0x8a...92b'
    }
  ];

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
                <button className="w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-all hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 justify-start bg-secondary/50 font-semibold">
                  <Award className="mr-2 h-4 w-4" />
                  Overview
                </button>
                <button className="w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent h-9 px-4 py-2 justify-start text-muted-foreground hover:text-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  Tax Reports
                </button>
                <button className="w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent h-9 px-4 py-2 justify-start text-muted-foreground hover:text-foreground">
                  <Vote className="mr-2 h-4 w-4" />
                  Governance (DAO)
                </button>
                <button className="w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent h-9 px-4 py-2 justify-start text-muted-foreground hover:text-foreground">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet Settings
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-card-foreground rounded-xl border shadow-sm bg-white/5 border-black p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Total Donated</div>
                  <div className="text-2xl font-bold text-primary">$1,250.00</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </div>
                <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Campaigns Supported</div>
                  <div className="text-2xl font-bold">14</div>
                  <p className="text-xs text-muted-foreground mt-1">Across 3 categories</p>
                </div>
                <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Governance Power</div>
                  <div className="text-2xl font-bold text-purple-600">850 SBT</div>
                  <p className="text-xs text-muted-foreground mt-1">Top 15% of donors</p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {receipts.map((receipt) => (
                        <div
                          key={receipt.id}
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
                                RECEIPT #{receipt.receiptNumber}
                              </div>
                              <div className="font-bold text-lg">{receipt.amount}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {receipt.category} • {receipt.date}
                              </div>
                            </div>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium absolute top-3 right-3 bg-white/80 backdrop-blur text-foreground border-border/50 shadow-sm">
                              Verified
                            </span>
                          </div>

                          {/* Receipt Info */}
                          <div className="p-4">
                            <h3 className="font-semibold truncate">{receipt.campaign}</h3>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-xs font-mono text-muted-foreground">
                                {receipt.address}
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
                  {activeTab === 'history' && (
                    <div className="text-center py-12 text-muted-foreground">
                      Donation history content will appear here
                    </div>
                  )}
                  {activeTab === 'governance' && (
                    <div className="text-center py-12 text-muted-foreground">
                      DAO proposals content will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;