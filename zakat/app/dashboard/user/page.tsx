"use client";

import { useState } from "react";
import { Wallet, Shield, CheckCircle, Clock, TrendingUp, FileText, Download, Eye, Copy, ExternalLink, Heart, Users, Target } from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with actual wallet context
  const [isConnected, setIsConnected] = useState(true);
  const [copiedTx, setCopiedTx] = useState(null);
  
  const mockData = {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    usdtBalance: 1250.50,
    totalDonated: 5500000,
    donationCount: 12,
    lastDonation: "10 Nov 2025",
    donations: [
      {
        id: "1",
        campaignTitle: "Paket Pangan Darurat",
        charity: "BAZNAS Pusat",
        amountUSDT: 150,
        amountIDR: 2250000,
        timestamp: "2025-11-15T10:30:00",
        txHash: "0x8f3b2c1d4e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
        proofUri: "ipfs://Qm...",
        status: "verified",
        recipients: 25
      },
      {
        id: "2",
        campaignTitle: "Akses Air Bersih",
        charity: "LAZ Nasional",
        amountUSDT: 200,
        amountIDR: 3000000,
        timestamp: "2025-11-10T14:20:00",
        txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        proofUri: "ipfs://Qm...",
        status: "verified",
        recipients: 40
      },
      {
        id: "3",
        campaignTitle: "Bantuan Medis & Obat-obatan",
        charity: "Rumah Zakat",
        amountUSDT: 100,
        amountIDR: 1500000,
        timestamp: "2025-11-05T09:15:00",
        txHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
        proofUri: "ipfs://Qm...",
        status: "verified",
        recipients: 15
      },
      {
        id: "4",
        campaignTitle: "Paket Pangan Darurat",
        charity: "BAZNAS Pusat",
        amountUSDT: 75,
        amountIDR: 1125000,
        timestamp: "2025-10-28T16:45:00",
        txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
        proofUri: "ipfs://Qm...",
        status: "verified",
        recipients: 10
      },
      {
        id: "5",
        campaignTitle: "Akses Air Bersih",
        charity: "LAZ Nasional",
        amountUSDT: 120,
        amountIDR: 1800000,
        timestamp: "2025-10-20T11:30:00",
        txHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
        proofUri: "ipfs://Qm...",
        status: "verified",
        recipients: 30
      }
    ]
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
        <div className="max-w-md mx-auto px-4 py-8">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo-name.png"
              alt="ZKT.app Logo"
              className="h-16 object-contain"
            />
          </div>

          {/* Not Connected State */}
          <div className="text-center mt-20">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Hubungkan Wallet Anda
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Silakan hubungkan wallet Anda untuk melihat dashboard dan riwayat donasi.
              </p>
              <button 
                onClick={() => setIsConnected(true)}
                className="w-full bg-emerald-600 text-white py-4 px-4 rounded-xl font-semibold text-base hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
              >
                Hubungkan Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
      <div className="max-w-md mx-auto px-4 py-8 pb-24">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo-name.png"
            alt="ZKT.app Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            Dashboard Zakat Saya
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Pantau donasi Anda dengan transparan dan aman
          </p>
        </div>

        {/* Wallet Info Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium text-emerald-100">Wallet Terhubung</span>
            </div>
            <Shield className="w-5 h-5 text-emerald-200" />
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <p className="text-xs text-emerald-100 mb-2">Alamat Wallet</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono font-semibold">
                {shortenAddress(mockData.address)}
              </code>
              <button 
                onClick={() => copyToClipboard(mockData.address, 'address')}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
              >
                {copiedTx === 'address' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {mockData.usdtBalance.toFixed(2)}
            </span>
            <span className="text-emerald-100 font-medium">USDT</span>
          </div>
          <p className="text-sm text-emerald-100 mt-1">Saldo Tersedia</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <TrendingUp className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-xl font-bold text-gray-900">
              {mockData.donationCount}
            </p>
            <p className="text-xs text-gray-600 font-medium">Total Donasi</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <Heart className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-xl font-bold text-gray-900">
              {(mockData.totalDonated / 1000000).toFixed(1)}jt
            </p>
            <p className="text-xs text-gray-600 font-medium">Tersalurkan</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <Users className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-xl font-bold text-gray-900">
              {mockData.donations.reduce((sum, d) => sum + d.recipients, 0)}
            </p>
            <p className="text-xs text-gray-600 font-medium">Terbantu</p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
          <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Ringkasan Kontribusi
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-700 font-medium">Total Donasi</span>
              <span className="text-base font-bold text-gray-900">
                Rp {(mockData.totalDonated / 1000).toLocaleString('id-ID')}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-700 font-medium">Terakhir Donasi</span>
              <span className="text-sm font-semibold text-emerald-600">
                {mockData.lastDonation}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-700 font-medium">Status Verifikasi</span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Riwayat Donasi
            </h2>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {mockData.donations.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Belum ada donasi</p>
              <p className="text-sm text-gray-500 mt-1">Mulai berdonasi untuk melihat riwayat</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockData.donations.map((donation) => (
                <div 
                  key={donation.id}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base mb-1">
                        {donation.campaignTitle}
                      </h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        {donation.charity}
                      </p>
                    </div>
                    {donation.status === 'verified' && (
                      <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Amount & Date */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-emerald-200">
                    <div>
                      <p className="text-lg font-bold text-emerald-600">
                        Rp {(donation.amountIDR / 1000).toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        {donation.amountUSDT} USDT
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-700 font-medium">
                        {formatDate(donation.timestamp)}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 justify-end mt-1">
                        <Users className="w-3 h-3" />
                        {donation.recipients} penerima
                      </p>
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="bg-white/60 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600 font-medium mb-1.5">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-gray-800 flex-1 overflow-hidden text-ellipsis">
                        {donation.txHash}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(donation.txHash, donation.id)}
                        className="p-1.5 hover:bg-emerald-100 rounded-lg transition flex-shrink-0"
                      >
                        {copiedTx === donation.id ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-gray-700 py-2.5 px-3 rounded-lg text-sm font-semibold transition border border-gray-200">
                      <Eye className="w-4 h-4" />
                      <span>Lihat Bukti</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition">
                      <ExternalLink className="w-4 h-4" />
                      <span>Explorer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">
                Privasi Anda Terlindungi
              </h3>
              <p className="text-sm leading-relaxed text-emerald-50">
                Semua donasi Anda diverifikasi dengan Zero-Knowledge Proof. 
                Nominal dan identitas pribadi Anda tetap rahasia, hanya total 
                penyaluran yang terlihat publik untuk transparansi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}