"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Target, 
  Shield, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  Wallet,
  Package,
  Activity,
  BarChart3,
  PieChart
} from "lucide-react";

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Mock data for organizer
  const organizerData = {
    name: "BAZNAS Pusat",
    verified: true,
    totalReceived: 195000000,
    totalDisbursed: 158000000,
    pendingDisbursement: 37000000,
    activeCampaigns: 3,
    completedCampaigns: 12,
    totalDonors: 847,
    totalBeneficiaries: 1250,
    campaigns: [
      {
        id: "1",
        title: "Paket Pangan Darurat",
        status: "active",
        raised: 45000000,
        goal: 150000000,
        donors: 234,
        beneficiaries: 150,
        disbursed: 38000000,
        pending: 7000000,
        startDate: "2025-10-01",
        endDate: "2025-12-31",
        lastDisbursement: "2025-11-15"
      },
      {
        id: "2",
        title: "Akses Air Bersih",
        status: "active",
        raised: 95000000,
        goal: 200000000,
        donors: 412,
        beneficiaries: 300,
        disbursed: 80000000,
        pending: 15000000,
        startDate: "2025-09-15",
        endDate: "2025-12-31",
        lastDisbursement: "2025-11-10"
      },
      {
        id: "3",
        title: "Bantuan Medis & Obat-obatan",
        status: "active",
        raised: 55000000,
        goal: 120000000,
        donors: 201,
        beneficiaries: 200,
        disbursed: 40000000,
        pending: 15000000,
        startDate: "2025-10-10",
        endDate: "2025-12-15",
        lastDisbursement: "2025-11-05"
      }
    ],
    recentDisbursements: [
      {
        id: "1",
        campaignTitle: "Paket Pangan Darurat",
        amount: 5000000,
        recipients: 25,
        location: "Jakarta Timur",
        date: "2025-11-15T10:30:00",
        status: "verified",
        txHash: "0x8f3b2c1d4e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
        proofUri: "ipfs://Qm..."
      },
      {
        id: "2",
        campaignTitle: "Akses Air Bersih",
        amount: 8000000,
        recipients: 40,
        location: "Bekasi",
        date: "2025-11-10T14:20:00",
        status: "verified",
        txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        proofUri: "ipfs://Qm..."
      },
      {
        id: "3",
        campaignTitle: "Bantuan Medis & Obat-obatan",
        amount: 12000000,
        recipients: 60,
        location: "Depok",
        date: "2025-11-05T09:15:00",
        status: "verified",
        txHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
        proofUri: "ipfs://Qm..."
      },
      {
        id: "4",
        campaignTitle: "Paket Pangan Darurat",
        amount: 3500000,
        recipients: 18,
        location: "Tangerang",
        date: "2025-11-01T11:45:00",
        status: "verified",
        txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
        proofUri: "ipfs://Qm..."
      }
    ],
    analytics: {
      donorGrowth: "+23%",
      disbursementRate: "81%",
      avgDonation: 230000,
      repeatDonors: "34%"
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    });
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <ArrowDownRight className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              +23%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            Rp {(organizerData.totalReceived / 1000000).toFixed(1)}jt
          </p>
          <p className="text-xs text-gray-600 font-medium">Total Diterima</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              81%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            Rp {(organizerData.totalDisbursed / 1000000).toFixed(1)}jt
          </p>
          <p className="text-xs text-gray-600 font-medium">Total Tersalurkan</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            Rp {(organizerData.pendingDisbursement / 1000000).toFixed(1)}jt
          </p>
          <p className="text-xs text-gray-600 font-medium">Menunggu Penyaluran</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {organizerData.totalDonors}
          </p>
          <p className="text-xs text-gray-600 font-medium">Total Donatur</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Statistik Cepat (30 Hari)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-2xl font-bold mb-1">{organizerData.activeCampaigns}</p>
            <p className="text-xs text-emerald-100">Program Aktif</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-2xl font-bold mb-1">{organizerData.totalBeneficiaries}</p>
            <p className="text-xs text-emerald-100">Penerima Manfaat</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-2xl font-bold mb-1">
              Rp {(organizerData.analytics.avgDonation / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-emerald-100">Rata-rata Donasi</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-2xl font-bold mb-1">{organizerData.analytics.repeatDonors}</p>
            <p className="text-xs text-emerald-100">Donatur Berulang</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Aktivitas Terkini
          </h3>
          <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            Lihat Semua
          </button>
        </div>
        <div className="space-y-3">
          {organizerData.recentDisbursements.slice(0, 3).map((disbursement) => (
            <div 
              key={disbursement.id}
              className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
            >
              <div className="bg-emerald-600 rounded-lg p-2">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 mb-1">
                  Penyaluran ke {disbursement.location}
                </p>
                <p className="text-xs text-gray-600">
                  {disbursement.campaignTitle} • {disbursement.recipients} penerima
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">
                  {(disbursement.amount / 1000000).toFixed(1)}jt
                </p>
                <p className="text-xs text-gray-600">{formatDate(disbursement.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Campaigns Tab
  const CampaignsTab = () => (
    <div className="space-y-6">
      {/* Add Campaign Button */}
      <div className="flex gap-3">
        <button className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Buat Program Baru
        </button>
        <button className="border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-gray-50 transition flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Campaign Cards */}
      <div className="space-y-4">
        {organizerData.campaigns.map((campaign) => {
          const progress = Math.round((campaign.raised / campaign.goal) * 100);
          const disbursementRate = Math.round((campaign.disbursed / campaign.raised) * 100);
          
          return (
            <div 
              key={campaign.id}
              className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {campaign.title}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(campaign.status)}`}>
                    {campaign.status === 'active' && <Activity className="w-3 h-3" />}
                    {campaign.status === 'active' ? 'Aktif' : 'Selesai'}
                  </span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progress Penggalangan</span>
                  <span className="text-sm font-bold text-emerald-600">{progress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200 mb-2">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-emerald-600">
                    Rp {(campaign.raised / 1000000).toFixed(1)}jt
                  </span>
                  <span className="text-gray-600 font-medium">
                    dari Rp {(campaign.goal / 1000000).toFixed(0)}jt
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Donatur</p>
                  <p className="text-lg font-bold text-gray-900">{campaign.donors}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Penerima</p>
                  <p className="text-lg font-bold text-gray-900">{campaign.beneficiaries}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tersalurkan</p>
                  <p className="text-lg font-bold text-emerald-600">{disbursementRate}%</p>
                </div>
              </div>

              {/* Disbursement Info */}
              <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900">Status Penyaluran</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Sudah Disalurkan</span>
                    <span className="font-bold text-emerald-600">
                      Rp {(campaign.disbursed / 1000000).toFixed(1)}jt
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Menunggu Penyaluran</span>
                    <span className="font-bold text-yellow-600">
                      Rp {(campaign.pending / 1000000).toFixed(1)}jt
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Mulai: {formatDate(campaign.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Selesai: {formatDate(campaign.endDate)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-emerald-600 text-white py-2.5 px-3 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                  <Package className="w-4 h-4" />
                  Salurkan Dana
                </button>
                <button className="border-2 border-gray-300 text-gray-700 py-2.5 px-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Laporan
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Disbursements Tab
  const DisbursementsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3">
        <button className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Penyaluran Baru
        </button>
        <button className="border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-gray-50 transition flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="font-bold text-lg mb-4">Ringkasan Penyaluran</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-3xl font-bold mb-1">
              {organizerData.recentDisbursements.length}
            </p>
            <p className="text-sm text-emerald-100">Total Penyaluran</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-3xl font-bold mb-1">
              {organizerData.recentDisbursements.reduce((sum, d) => sum + d.recipients, 0)}
            </p>
            <p className="text-sm text-emerald-100">Total Penerima</p>
          </div>
        </div>
      </div>

      {/* Disbursement List */}
      <div className="space-y-4">
        {organizerData.recentDisbursements.map((disbursement) => (
          <div 
            key={disbursement.id}
            className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-base text-gray-900 mb-1">
                  {disbursement.campaignTitle}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{disbursement.location}</span>
                  <span>•</span>
                  <span>{formatDateTime(disbursement.date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Verified</span>
              </div>
            </div>

            {/* Amount & Recipients */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-600 mb-1">Jumlah Disalurkan</p>
                <p className="text-2xl font-bold text-emerald-600">
                  Rp {(disbursement.amount / 1000000).toFixed(1)}jt
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-1">Penerima Manfaat</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-end">
                  <Users className="w-5 h-5 text-emerald-600" />
                  {disbursement.recipients}
                </p>
              </div>
            </div>

            {/* Transaction Info */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Transaction Hash</p>
              <code className="text-xs font-mono text-gray-600 break-all">
                {disbursement.txHash}
              </code>
            </div>

            {/* ZK Proof Badge */}
            <div className="bg-emerald-50 rounded-xl p-3 border-2 border-emerald-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-gray-700 font-medium">
                  Terverifikasi dengan Zero-Knowledge Proof - Identitas penerima terlindungi
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                Lihat Bukti
              </button>
              <button className="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
      <div className="max-w-md mx-auto px-4 py-8 pb-24">
        
        {/* Logo */}
         <div className="flex justify-center mb-8">
          <img
            src="/logo-name.png"
            alt="ZKT.app Logo"
            className="h-17 object-contain"
          />
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 rounded-full p-3">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {organizerData.name}
                </h1>
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Terverifikasi</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
              <option value="90d">90 Hari Terakhir</option>
              <option value="all">Semua Waktu</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
              activeTab === "campaigns"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Target className="w-4 h-4" />
            Program
          </button>
          <button
            onClick={() => setActiveTab("disbursements")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition whitespace-nowrap ${
              activeTab === "disbursements"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Package className="w-4 h-4" />
            Penyaluran
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "campaigns" && <CampaignsTab />}
          {activeTab === "disbursements" && <DisbursementsTab />}
        </div>
      </div>
    </div>
  );
}