"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Shield, Eye, CheckCircle, Lock, Users, FileCheck } from "lucide-react";

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const slides = [
    {
      src: "/community-receiving-food-aid-with-dignity.jpg",
      alt: "Komunitas menerima bantuan pangan dengan bermartabat",
    },
    {
      src: "/child-with-meal-support.jpg",
      alt: "Anak dengan makanan bergizi dari donasi",
    },
    {
      src: "/happy-family-receiving-aid.jpg",
      alt: "Keluarga tersenyum setelah menerima bantuan",
    },
  ];

  useEffect(() => {
    if (!isMounted) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length, isMounted]);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  const features = [
    { icon: Lock, title: "Privasi Donor", desc: "Nominal dirahasiakan, publik hanya melihat total" },
    { icon: Shield, title: "Proteksi Mustahik", desc: "Identitas penerima tidak pernah dipublikasikan" },
    { icon: CheckCircle, title: "ZK Receipt", desc: "Bukti penerimaan tanpa buka data sensitif" },
    { icon: Eye, title: "Anti Salah Alokasi", desc: "ZK mencegah human error dan double-claim" },
    { icon: FileCheck, title: "Audit Cepat", desc: "Total masuk vs keluar diverifikasi instan" },
    { icon: Users, title: "Syariah Compliant", desc: "Sesuai prinsip transparansi dan keadilan Islam" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100" suppressHydrationWarning>
      <div className="max-w-md mx-auto px-4 py-8">
        
        <div className="flex justify-center mb-8">
          <img
            src="/logo-name.png"
            alt="ZKT.app Logo"
            className="h-17 object-contain"
          />
        </div>

        <div className="text-center mb-8">
         <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
          Zakat On-Chain yang Privat dan Terverifikasi.{' '}
          <span className="text-primary">Aman, Syariah, dan Dapat Diaudit.</span>
        </h1>
         <p className="text-base text-muted-foreground leading-relaxed mb-8">
          ZKT.app menjaga privasi donor, melindungi penerima, dan memastikan setiap penyaluran dapat diverifikasi melalui Zero-Knowledge Proof — tanpa membuka identitas siapa pun.
        </p>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex gap-3 mb-8">
          <button className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
            Lihat Penyaluran
          </button>
          <button className="flex-1 border-2 border-emerald-600 text-emerald-600 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition">
            Pelajari
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8 group">
          <div className="relative w-full aspect-video">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {features.map((feature, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
              <feature.icon className="w-8 h-8 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold mb-3">Mengapa ZKT.app?</h2>
          <p className="text-sm leading-relaxed mb-4 text-emerald-50">
            Donor dapat menunaikan zakat dengan privasi penuh. Baznas tetap memimpin penyaluran. Auditor dapat memverifikasi tanpa membuka identitas. Penerima tetap terlindungi.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-xs italic text-emerald-50">
              Dibangun untuk melindungi kepercayaan donor, menjaga martabat penerima, dan membantu Baznas menyalurkan zakat tanpa risiko pelanggaran syariah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}