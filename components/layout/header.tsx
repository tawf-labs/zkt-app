"use client";

import Link from "next/link";
import { Menu, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSearch } from "@/components/shared/SearchContext";
import { SearchDropdown } from "@/components/shared/SearchDropdown";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { useLanguage } from "@/components/providers/language-provider";

export function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } =
    useSearch();
  const { language, setLanguage, t } = useLanguage();

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSearchOpen(false);
      window.location.href = `/campaigns?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" className="h-8 object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/campaigns" className="text-foreground hover:text-primary transition-colors">Campaigns</Link>
            <Link href="/governance" className="text-foreground hover:text-primary transition-colors">Governance</Link>
            <Link href="/explorer" className="text-foreground hover:text-primary transition-colors">Explorer</Link>

            {/* Dashboard dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
              >
                Dashboard
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50">
                  <ul className="flex flex-col p-2">
                    <li>
                      <Link href="/dashboard/donor" className="block px-4 py-2.5 rounded-md text-sm hover:bg-accent hover:text-primary transition-colors">
                        Donor
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/organization" className="block px-4 py-2.5 rounded-md text-sm hover:bg-accent hover:text-primary transition-colors">
                        Organization
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/auditor" className="block px-4 py-2.5 rounded-md text-sm hover:bg-accent hover:text-primary transition-colors">
                        Sharia Council
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* SEARCH BAR */}
          <div className="relative hidden lg:block w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />

            <input
              type="search"
              placeholder={t("header.search")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onKeyDown={handleEnter}
              className="w-full pl-9 py-1.5 h-10 bg-accent/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />

            {/* DROPDOWN */}
            {isSearchOpen && searchQuery && <SearchDropdown />}
          </div>

          <Link href="/campaigns/new" className="hidden sm:flex items-center gap-2 border border-border h-10 px-4 rounded-lg hover:bg-accent hover:border-primary/30 transition-all text-sm font-medium">
            + Create Proposal
          </Link>

          <ConnectWalletButton />

          <button className="md:hidden size-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
