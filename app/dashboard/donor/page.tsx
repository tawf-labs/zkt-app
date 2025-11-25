"use client";

import React, { useState } from 'react';
import { Award, FileText, Vote, Wallet, ShieldCheck, Download, ExternalLink, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';

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
                  <div className="text-2xl font-bold text-purple-600">850 vZKT</div>
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
                                <tr className="border-b border-border hover:bg-accent/50">
                                  <td className="py-4 px-4 text-sm">Nov 20, 2025</td>
                                  <td className="py-4 px-4 text-sm font-medium">Emergency Relief Fund</td>
                                  <td className="py-4 px-4 text-sm font-semibold">Rp 158.000</td>
                                  <td className="py-4 px-4">
                                    <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">Zakat</span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                      0x7f3d...a21c
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </td>
                                </tr>
                                <tr className="border-b border-border hover:bg-accent/50">
                                  <td className="py-4 px-4 text-sm">Nov 18, 2025</td>
                                  <td className="py-4 px-4 text-sm font-medium">Children Education Fund</td>
                                  <td className="py-4 px-4 text-sm font-semibold">Rp 316.000</td>
                                  <td className="py-4 px-4">
                                    <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 border-purple-200">Education</span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                      0x9e2a...b34f
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </td>
                                </tr>
                                <tr className="border-b border-border hover:bg-accent/50">
                                  <td className="py-4 px-4 text-sm">Nov 15, 2025</td>
                                  <td className="py-4 px-4 text-sm font-medium">Clean Water Initiative</td>
                                  <td className="py-4 px-4 text-sm font-semibold">Rp 158.000</td>
                                  <td className="py-4 px-4">
                                    <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">Health</span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                      0x4c8e...d92a
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </td>
                                </tr>
                                <tr className="border-b border-border hover:bg-accent/50">
                                  <td className="py-4 px-4 text-sm">Nov 12, 2025</td>
                                  <td className="py-4 px-4 text-sm font-medium">Emergency Relief Fund</td>
                                  <td className="py-4 px-4 text-sm font-semibold">Rp 79.000</td>
                                  <td className="py-4 px-4">
                                    <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">Zakat</span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                      0x1b5f...e87d
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </td>
                                </tr>
                                <tr className="hover:bg-accent/50">
                                  <td className="py-4 px-4 text-sm">Nov 8, 2025</td>
                                  <td className="py-4 px-4 text-sm font-medium">Medical Equipment Fund</td>
                                  <td className="py-4 px-4 text-sm font-semibold">Rp 79.000</td>
                                  <td className="py-4 px-4">
                                    <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">Health</span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <a href="#" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                      0x6a9c...f13b
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </td>
                                </tr>
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
                            <div className="text-3xl font-bold text-purple-600 mb-2">850 vZKT</div>
                            <p className="text-sm text-muted-foreground mb-4">Soul-bound tokens earned through donations</p>
                            <div className="flex gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Proposals Voted</div>
                                <div className="font-semibold">12</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Participation Rate</div>
                                <div className="font-semibold">85%</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 border-purple-200">Top 15%</span>
                          </div>
                        </div>
                      </div>

                      {/* Active Proposals */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Active Proposals</h3>
                        <div className="space-y-4">
                          {/* Proposal 1 */}
                          <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-green-100 text-green-700 border-green-200">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Active
                                  </span>
                                  <span className="text-xs text-muted-foreground">Proposal #17</span>
                                </div>
                                <h4 className="font-semibold text-base mb-2">Increase Education Fund Allocation to 35%</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Proposal to increase the percentage of total donations allocated to education-related campaigns from 25% to 35%, focusing on underprivileged children's access to quality education.
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">For: 2,450 vZKT (68%)</span>
                                  <span className="text-muted-foreground">Against: 1,150 vZKT (32%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div className="bg-green-500 h-2" style={{ width: '68%' }}></div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-xs text-muted-foreground">Ends in 3 days</span>
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
                            </div>
                          </div>

                          {/* Proposal 2 */}
                          <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-green-100 text-green-700 border-green-200">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Active
                                  </span>
                                  <span className="text-xs text-muted-foreground">Proposal #16</span>
                                </div>
                                <h4 className="font-semibold text-base mb-2">Implement Quarterly Impact Reports</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Require all organizations to submit detailed quarterly impact reports with measurable outcomes and beneficiary testimonials to increase transparency.
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">For: 3,120 vZKT (82%)</span>
                                  <span className="text-muted-foreground">Against: 685 vZKT (18%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div className="bg-green-500 h-2" style={{ width: '82%' }}></div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-xs text-muted-foreground">Ends in 5 days</span>
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
                            </div>
                          </div>

                          {/* Proposal 3 */}
                          <div className="bg-white text-card-foreground rounded-xl border border-black shadow-sm p-6 opacity-60">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                                    Passed
                                  </span>
                                  <span className="text-xs text-muted-foreground">Proposal #15</span>
                                </div>
                                <h4 className="font-semibold text-base mb-2">Add Emergency Response Category</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Create a new campaign category for emergency disaster response with expedited approval process for verified relief organizations.
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">For: 4,200 vZKT (91%)</span>
                                  <span className="text-muted-foreground">Against: 415 vZKT (9%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div className="bg-blue-500 h-2" style={{ width: '91%' }}></div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-xs text-muted-foreground">Ended Nov 10, 2025</span>
                                <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                                  Implemented
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;