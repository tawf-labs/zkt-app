"use client";

import { useState } from "react";
import { Calculator, CreditCard, Shield, CheckCircle, Lock } from "lucide-react";

export default function PaymentPage() {
  const [activeTab, setActiveTab] = useState("bayar");
  const [jenisZakat, setJenisZakat] = useState("zakat-penghasilan");
  const [subJenisZakat, setSubJenisZakat] = useState("");
  const [nominal, setNominal] = useState("");
  const [gender, setGender] = useState("bapak");
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    alamat: ""
  });
  const [acceptCookies, setAcceptCookies] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const jenisZakatOptions = [
    { value: "zakat-penghasilan", label: "Zakat Penghasilan", subOptions: [] },
    { value: "zakat-maal", label: "Zakat Maal", subOptions: [] },
    { value: "infak-sedekah", label: "Infak/Sedekah", subOptions: [] },
    { value: "sedekah-baznas", label: "Sedekah BAZNAS", subOptions: [] },
    { value: "fidyah", label: "Fidyah", subOptions: [] }
  ];

  const formatRupiah = (value) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(number);
  };

  const handleNominalChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setNominal(value);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
      <div className="max-w-md mx-auto px-4  py-8 pb-24">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo-name.png"
            alt="ZKT.app Logo"
            className="h-17 object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            Tunaikan Zakat, Infak, dan Sedekah Anda{' '}
            <span className="text-emerald-600">dengan Aman dan Mudah</span>
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Bayar zakat Anda secara privat dengan proteksi Zero-Knowledge Proof
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("bayar")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
              activeTab === "bayar"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Bayar
          </button>
          <button
            onClick={() => setActiveTab("kalkulator")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
              activeTab === "kalkulator"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            Kalkulator
          </button>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          
          {/* Pilih Jenis Dana */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Pilih Jenis Dana
            </label>
            <div className="grid grid-cols-1 gap-2">
              {jenisZakatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setJenisZakat(option.value)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition border-2 ${
                    jenisZakat === option.value
                      ? "bg-emerald-50 border-emerald-600 text-emerald-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nominal Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Masukkan Nominal
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                type="text"
                value={formatRupiah(nominal)}
                onChange={handleNominalChange}
                placeholder="0"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-600 focus:outline-none text-lg font-semibold"
              />
            </div>
          </div>

          {/* Form Data Diri */}
          <div className="border-t border-gray-100 pt-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Silahkan lengkapi data di bawah ini:
            </h3>

            {/* Gender Selection */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setGender("bapak")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  gender === "bapak"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Bapak
              </button>
              <button
                onClick={() => setGender("ibu")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  gender === "ibu"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Ibu
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.nama}
                  onChange={(e) => handleInputChange("nama", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none text-sm"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none text-sm"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Nomor Telepon/WhatsApp"
                  value={formData.telepon}
                  onChange={(e) => handleInputChange("telepon", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none text-sm"
                />
              </div>
              <div>
                <textarea
                  placeholder="Alamat Lengkap"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptCookies}
                onChange={(e) => setAcceptCookies(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                Untuk kemudahan pengisian data secara otomatis pada pembayaran selanjutnya, 
                saya menyetujui adanya penggunaan cookies pada laman ini.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                Dengan mengisi formulir ini, Muzaki menyatakan bahwa zakat yang ditunaikan 
                berasal dari sumber halal yang sesuai dengan peraturan, bukan hasil pencucian uang, 
                dan merupakan harta yang dimiliki secara penuh, serta menyetujui untuk menerima 
                Bukti Setor Zakat (BSZ), laporan penyaluran, dan informasi layanan BAZNAS melalui 
                email dan WhatsApp.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            disabled={!acceptTerms || !nominal || !formData.nama || !formData.email}
            className="w-full bg-emerald-600 text-white py-4 px-4 rounded-xl font-semibold text-base hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Lanjutkan Pembayaran
          </button>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">Privat</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Lock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">Terenkripsi</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">Terverifikasi</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Pembayaran Anda Dilindungi
          </h2>
          <p className="text-sm leading-relaxed text-emerald-50">
            Nominal dan identitas Anda dijaga dengan teknologi Zero-Knowledge Proof. 
            Hanya total penyaluran yang terlihat publik, data pribadi Anda sepenuhnya privat 
            dan sesuai prinsip syariah.
          </p>
        </div>
      </div>
    </div>
  );
}