"use client";

import Link from "next/link"
import { Menu, Search, ChevronDown } from "lucide-react"
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button"
import { useState } from "react"

export function Header() {
const [isDropdownOpen, setDropdownOpen] = useState(false)

return (
   <header className="sticky top-0 z-50 w-full border-b border-black bg-transparent backdrop-blur"> 
   <div className="container mx-auto flex h-16 items-center justify-between px-4">

    {/* Left: Logo + Navigation */}
    <div className="flex items-center gap-6 lg:gap-10">

      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <img
          src="/logo-name.png"
          alt="ZKT.app Logo"
          className="h-6 sm:h-8 md:h-10 object-contain translate-y-[-3px]"
        />
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-black">
        <Link href="/zakat" className="transition-colors hover:text-gray-700">
          Zakat
        </Link>

        <Link href="/campaigns" className="transition-colors hover:text-gray-700">
          Explore
        </Link>

        {/* Dashboard with dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 transition-colors hover:text-gray-700"
          >
            Dashboard
            <ChevronDown className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-transparent backdrop-blur-md border border-black/60 rounded-md shadow-lg z-50">
              <ul className="flex flex-col p-2">
                <li>
                  <Link
                    href="/dashboard/donor"
                    className="block px-4 py-2 rounded-md hover:bg-white/50"
                  >
                    Donor Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/organization"
                    className="block px-4 py-2 rounded-md hover:bg-white/50"
                  >
                    Organization Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/auditor"
                    className="block px-4 py-2 rounded-md hover:bg-white/50"
                  >
                    Auditor (BASNAZ) Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <Link href="/about" className="transition-colors hover:text-gray-700">
          How it works
        </Link>
      </nav>
    </div>

    {/* Right Section */}
    <div className="flex items-center gap-4">

      {/* Search */}
      <div className="relative hidden lg:block w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <input
          type="search"
          placeholder="Search for campaigns..."
          className="bg-transparent border-none shadow-none outline-none
          text-black placeholder:text-gray-400
          pl-9 py-1.5 h-9 w-full
          focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">

        {/* Start Campaign */}
        <button
          className="hidden sm:flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium 
          border h-9 px-4 py-2 border-black text-black hover:bg-black/5"
        >
          Start a Campaign
        </button>

        {/* Connect Wallet */}
        <ConnectWalletButton />

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 size-9 rounded-md text-black transition-all 
            hover:bg-black/5"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</header>


)
}
