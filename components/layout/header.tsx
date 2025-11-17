"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, PieChart, Blocks, User } from "lucide-react"
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button"

export function Header() {
  const pathname = usePathname()
  
  const navItems = [
    { href: "/", icon: Home, label: "Beranda" },
    { href: "/#campaigns", icon: Blocks, label: "Campaign" },
    { href: "/dao", icon: PieChart, label: "DAO" },
    { href: "/profile", icon: User, label: "Profil" },
  ]
  
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href.replace("/#", "/"))
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* LEFT NAV ITEMS */}
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 py-2 px-4 min-w-[70px]"
              >
                <Icon 
                  className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-[10px] font-medium ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
          
          {/* CENTER WALLET BUTTON */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <ConnectWalletButton 
                variant="ghost" 
                className="text-primary-foreground hover:bg-primary-foreground/10 p-2" 
              />
            </div>
          </div>
          
          {/* RIGHT NAV ITEMS */}
          {navItems.slice(2, 4).map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 py-2 px-4 min-w-[70px]"
              >
                <Icon 
                  className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-[10px] font-medium ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}