import React from 'react';
import { Shield, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background flex-1 pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="container px-4 mx-auto auto-center gap-12 lg-gap-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium text-black">
              Verified by Baznas & Blockchain Traced
            </div>

            {/* Heading */}
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-black">
              Transparent Giving with <span className="text-black">Blockchain Trust</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-balance leading-relaxed">
              The world's first fully traceable Zakat and donation platform. Receive NFT receipts, earn governance rights, and see exactly where your money goes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/campaigns" className="text-base font-medium text-black hover:underline">
                Donate Now
              </Link>
              <Link href="/zakat" className="inline-flex items-center justify-center whitespace-nowrap  text-base font-medium border rounded-md border-black text-black bg-white hover:bg-black/5 px-8 py-3 transition-all">
                Calculate Zakat
              </Link>
            </div>

            {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-black/60">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-black">$12M+</div>
                <div className="text-xs text-black font-medium uppercase tracking-wide">
                  DONATED
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-black">100%</div>
                <div className="text-xs text-black font-medium uppercase tracking-wide">
                  TRACEABLE
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-black">50k+</div>
                <div className="text-xs text-black font-medium uppercase tracking-wide">
                  DONORS
                </div>
              </div>
            </div>
           </div>

          {/* Right Mockup Section */}
         <div className="flex-1 w-full max-w-2xl relative">
          {/* Main Browser/Device Mockup */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-black bg-gray-100 aspect-[4/3] shadow-2xl">

            {/* IMAGE REPLACEMENT */}
            <Image
              src="/your-image.jpg"   // ganti ke gambar lo
              alt="Preview"
              fill
              className="object-cover w-full h-auto"
            />

            {/* Floating Card - Top Left */}
            <div className="absolute top-6 left-6 bg-white p-3 rounded-xl border border-black max-w-[160px]">
              <div className="text-xs font-semibold text-black">Zakat Verified</div>
            </div>

            {/* Floating Card - Bottom Right */}
            <div className="absolute bottom-6 right-6 bg-white p-3 rounded-xl border border-black max-w-[200px]">
              <div className="space-y-1">
                <div className="text-xs text-gray-600">Impact Tracking</div>
                <div className="text-sm font-bold text-black">Real-time Audit</div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
    </section>
  );
}