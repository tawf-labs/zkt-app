import React from 'react';
import { LayoutDashboard, TrendingUp, Users, FileText, Settings, Download, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function BaznasDashboard() {
  const donations = [
    { donor: 'Anonymous Donor', address: '0x72...9a2', campaign: 'Emergency Relief for...', amount: '$150.00', status: 'Verified' },
    { donor: 'Anonymous Donor', address: '0x72...9a2', campaign: 'Emergency Relief for...', amount: '$150.00', status: 'Verified' },
    { donor: 'Anonymous Donor', address: '0x72...9a2', campaign: 'Emergency Relief for...', amount: '$150.00', status: 'Verified' },
    { donor: 'Anonymous Donor', address: '0x72...9a2', campaign: 'Emergency Relief for...', amount: '$150.00', status: 'Verified' },
    { donor: 'Anonymous Donor', address: '0x72...9a2', campaign: 'Emergency Relief for...', amount: '$150.00', status: 'Verified' },
  ];

  const deploymentRequests = [
    { title: 'Medical Supplies Procurement', amount: '$12,500', status: 'Pending Approval' },
    { title: 'Medical Supplies Procurement', amount: '$12,500', status: 'Pending Approval' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-black font-bold">
              BZ
            </div>
            <div>
              <div className="font-bold">Baznas Ind...</div>
              <div className="text-xs text-muted-foreground">Organization</div>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-white shadow-sm font-semibold text-gray-900">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
              <TrendingUp className="h-4 w-4" />
              Campaigns
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
              <Users className="h-4 w-4" />
              Donors
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
              <FileText className="h-4 w-4" />
              Reports
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-black">
          <div className="rounded-xl border border-black bg-white p-4">
            <div className="text-xs font-semibold text-black mb-1">Audit Status</div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Compliant
            </div>
            <div className="text-xs text-gray-500 mt-2">Last audit: 2 days ago</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-black">Welcome back, admin. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-black bg-white shadow-sm">
              <Download className="h-4 w-4" />
              Export Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black shadow-md">
              <Plus className="h-4 w-4" />
              New Campaign
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
            <div className="text-sm font-medium text-black mb-2">Total Funds Raised</div>
            <div className="text-2xl font-bold">$2,450,000</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              +15% this month
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
            <div className="text-sm font-medium text-black mb-2">Active Donors</div>
            <div className="text-2xl font-bold">12,543</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              +8% new donors
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
            <div className="text-sm font-medium text-black mb-2">Funds Deployed</div>
            <div className="text-2xl font-bold">$1,800,000</div>
            <div className="text-xs text-black mt-1">73% utilization rate</div>
          </div>
          
          <div className="bg-white rounded-xl border border-black p-6 shadow-sm">
            <div className="text-sm font-medium text-black mb-2">Pending Reports</div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-orange-600 mt-1">Action required</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Donations Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-black shadow-sm">
              <div className="p-6 border-b border-black">
                <h2 className="font-semibold">Recent Donations</h2>
                <p className="text-sm text-black mt-1">Real-time view of incoming funds.</p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="text-left py-2 px-2 font-medium text-black">Donor</th>
                        <th className="text-left py-2 px-2 font-medium text-black">Campaign</th>
                        <th className="text-left py-2 px-2 font-medium text-black">Amount</th>
                        <th className="text-left py-2 px-2 font-medium text-black">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation, idx) => (
                        <tr key={idx} className="border-b border-black hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="font-medium">{donation.donor}</div>
                            <div className="text-xs text-black">{donation.address}</div>
                          </td>
                          <td className="py-3 px-2 truncate max-w-[150px]">{donation.campaign}</td>
                          <td className="py-3 px-2 font-bold text-green-600">+{donation.amount}</td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
                              {donation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* One-Click Reporting */}
            <div className="bg-gray-100/50 rounded-xl border border-black shadow-sm">
              <div className="p-6 border-b border-black">
                <h2 className="font-semibold">One-Click Reporting</h2>
                <p className="text-sm text-black mt-1">Generate compliance reports for Baznas automatically.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Financials</span>
                    <span className="px-2 py-0.5 rounded-md border border-black text-xs font-medium">Ready</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impact Assessment</span>
                    <span className="px-2 py-0.5 rounded-md border border-black text-xs font-medium">Ready</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Donor Transparency</span>
                    <span className="px-2 py-0.5 rounded-md border border-black text-xs font-medium">Ready</span>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-white text-black hover:bg-gray-100 shadow-sm font-medium">
                  <Download className="h-4 w-4" />
                  Generate PDF Report
                </button>
              </div>
            </div>

            {/* Deployment Requests */}
            <div className="bg-white rounded-xl border border-black shadow-sm">
              <div className="p-6 border-b border-black">
                <h2 className="font-semibold">Deployment Requests</h2>
                <p className="text-sm text-black mt-1">Funds waiting for deployment approval.</p>
              </div>
              <div className="p-6 space-y-4">
                {deploymentRequests.map((request, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-black last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <ArrowDownRight className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{request.title}</div>
                      <div className="text-xs text-black">{request.amount} • {request.status}</div>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1 text-xs font-medium rounded-md border border-black hover:bg-gray-50">
                          View
                        </button>
                        <button className="px-3 py-1 text-xs font-medium rounded-md bg-white text-black hover:bg-gray-100">
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}