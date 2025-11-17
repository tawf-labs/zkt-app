"use client";

import { useState } from "react";
import { Heart, Users, Target, CheckCircle, Shield, FileText, ChevronRight, ArrowLeft } from "lucide-react";

// Data campaigns
const campaigns = [
  {
    id: "1",
    title: "Paket Pangan Darurat",
    charity: "BAZNAS Pusat",
    raised: 45000000,
    goal: 150000000,
    imageQuery: "volunteers-distributing-food-aid",
    description: "Menyediakan paket pangan esensial untuk keluarga rentan yang menghadapi kekurangan akut. Dukungan Anda membawa bantuan langsung.",
    beneficiaries: 150,
    image: "/community-receiving-food-aid-with-dignity.jpg"
  },
  {
    id: "2",
    title: "Akses Air Bersih",
    charity: "LAZ Nasional",
    raised: 95000000,
    goal: 200000000,
    imageQuery: "water-distribution-community-aid",
    description: "Membangun dan memperbaiki sumur untuk memastikan akses aman dan andal ke air bersih untuk komunitas pedesaan.",
    beneficiaries: 300,
    image: "/happy-family-receiving-aid.jpg"
  },
  {
    id: "3",
    title: "Bantuan Medis & Obat-obatan",
    charity: "Rumah Zakat",
    raised: 55000000,
    goal: 120000000,
    imageQuery: "medical-aid-delivery-to-families",
    description: "Memasok klinik dengan obat-obatan dan kit pertolongan pertama untuk mendukung kebutuhan kesehatan mendesak.",
    beneficiaries: 200,
    image: "/child-with-meal-support.jpg"
  },
];

// Komponen Card Campaign
function CampaignCard({ campaign, onClick }) {
  const percentage = Math.round((campaign.raised / campaign.goal) * 100);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={campaign.image} 
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 right-3 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
          {percentage}%
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
          {campaign.title}
        </h3>
        
        <p className="text-xs text-gray-600 mb-4 flex items-center gap-1.5 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          {campaign.charity}
        </p>

        <div className="mb-4">
          <div className="h-2.5 w-full rounded-full bg-gray-200 mb-2.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-emerald-600">
              Rp {(campaign.raised / 1000000).toFixed(1)}jt
            </span>
            <span className="text-gray-500 font-medium">
              dari Rp {(campaign.goal / 1000000).toFixed(0)}jt
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{campaign.beneficiaries} Penerima</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
            <span>Lihat Detail</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Detail Campaign
function CampaignDetail({ campaign, onBack, onDonate }) {
  const percentage = Math.round((campaign.raised / campaign.goal) * 100);
  
  // Mock proofs data
  const proofs = [
    {
      id: "1",
      date: "15 Nov 2025",
      amount: 5000000,
      recipients: 25,
      location: "Jakarta Timur",
      verified: true
    },
    {
      id: "2",
      date: "10 Nov 2025",
      amount: 8000000,
      recipients: 40,
      location: "Bekasi",
      verified: true
    },
    {
      id: "3",
      date: "5 Nov 2025",
      amount: 12000000,
      recipients: 60,
      location: "Depok",
      verified: true
    }
  ];

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

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 mb-6 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-6">
          <img 
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Title & Charity */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {campaign.title}
          </h1>
          <p className="text-gray-700 flex items-center gap-2 font-medium">
            <Shield className="w-5 h-5 text-emerald-600" />
            oleh {campaign.charity}
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 mb-6">
          <div className="mb-5">
            <div className="h-3 w-full rounded-full bg-gray-200 mb-3">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between mb-5">
              <div>
                <p className="font-bold text-3xl text-emerald-600 mb-1">
                  Rp {(campaign.raised / 1000000).toFixed(1)}jt
                </p>
                <p className="text-sm text-gray-600 font-medium">terkumpul</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-gray-900 mb-1">
                  Rp {(campaign.goal / 1000000).toFixed(0)}jt
                </p>
                <p className="text-sm text-gray-600 font-medium">target</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onDonate}
            className="w-full bg-emerald-600 text-white py-4 px-4 rounded-xl font-bold text-base hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 mb-4"
          >
            <Heart className="w-5 h-5" />
            Salurkan Donasi
          </button>

          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>{campaign.beneficiaries} Keluarga Terbantu</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>{percentage}% dari Target Tercapai</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
          <h2 className="font-bold text-xl text-gray-900 mb-3">
            Tentang Program
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {campaign.description}
          </p>
        </div>

        {/* Disbursement Proofs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
          <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Bukti Penyaluran
          </h2>
          
          <div className="space-y-3 mb-4">
            {proofs.map((proof) => (
              <div 
                key={proof.id}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">
                        {proof.date}
                      </span>
                      {proof.verified && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{proof.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-emerald-600">
                      Rp {(proof.amount / 1000000).toFixed(1)}jt
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {proof.recipients} penerima
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-emerald-200">
                  <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs text-gray-700 font-medium">
                    Terverifikasi dengan Zero-Knowledge Proof
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
            <p className="text-sm text-gray-800 leading-relaxed font-medium">
              💡 <strong className="text-gray-900">Privasi Terjaga:</strong> Identitas penerima dilindungi. 
              Hanya jumlah, lokasi umum, dan verifikasi yang ditampilkan untuk transparansi.
            </p>
          </div>
        </div>

        {/* About Charity */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Tentang Lembaga
          </h3>
          <p className="text-sm leading-relaxed text-emerald-50">
            {campaign.charity} telah terverifikasi dan akuntabel. Penyaluran 
            ditinjau dengan pengawasan DAO dan dokumentasi privat untuk penerima 
            menggunakan teknologi Zero-Knowledge Proof.
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Component - Campaign List
export default function CampaignsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);

  if (showDonationForm) {
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

          <button 
            onClick={() => setShowDonationForm(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 mb-6 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Form Donasi
            </h2>
            <p className="text-gray-700 font-medium">
              untuk {selectedCampaign?.title}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <p className="text-center text-gray-700 font-medium">
              Form donasi akan ditampilkan di sini...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCampaign) {
    return (
      <CampaignDetail 
        campaign={selectedCampaign}
        onBack={() => setSelectedCampaign(null)}
        onDonate={() => setShowDonationForm(true)}
      />
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
            Program Penyaluran Zakat{' '}
            <span className="text-emerald-600">Transparan & Terverifikasi</span>
          </h1>
          <p className="text-base text-gray-700 leading-relaxed">
            Setiap penyaluran dilindungi dengan Zero-Knowledge Proof. Privasi penerima 
            terjaga, transparansi tetap terjamin.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
            <p className="text-2xl font-bold text-emerald-600 mb-1">
              {campaigns.length}
            </p>
            <p className="text-xs text-gray-700 font-semibold">Program Aktif</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
            <p className="text-2xl font-bold text-emerald-600 mb-1">
              {campaigns.reduce((sum, c) => sum + c.beneficiaries, 0)}
            </p>
            <p className="text-xs text-gray-700 font-semibold">Terbantu</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
            <p className="text-2xl font-bold text-emerald-600 mb-1">
              {(campaigns.reduce((sum, c) => sum + c.raised, 0) / 1000000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-700 font-semibold">Tersalurkan</p>
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="space-y-5 mb-8">
          {campaigns.map((campaign) => (
            <CampaignCard 
              key={campaign.id}
              campaign={campaign}
              onClick={() => setSelectedCampaign(campaign)}
            />
          ))}
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
            <h2 className="text-xl font-bold leading-tight">
              Mengapa Donasi Melalui ZKT.app?
            </h2>
          </div>
          <div className="space-y-3 text-sm text-emerald-50">
            <div className="flex gap-2">
              <span className="font-bold">✓</span>
              <div>
                <p className="font-bold text-white mb-0.5">Privasi Donor Terjamin</p>
                <p className="text-xs">Nominal Anda tidak dipublikasikan</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">✓</span>
              <div>
                <p className="font-bold text-white mb-0.5">Identitas Mustahik Dilindungi</p>
                <p className="text-xs">Zero-Knowledge Proof menjaga martabat</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">✓</span>
              <div>
                <p className="font-bold text-white mb-0.5">Transparan & Dapat Diaudit</p>
                <p className="text-xs">Setiap penyaluran terverifikasi</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">✓</span>
              <div>
                <p className="font-bold text-white mb-0.5">Sesuai Syariah</p>
                <p className="text-xs">Diawasi oleh lembaga resmi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}