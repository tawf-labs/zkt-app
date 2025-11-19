"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Wallet, PieChart, Blocks, LayoutGrid, Users, UserCircle } from "lucide-react"
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [showDashboardDialog, setShowDashboardDialog] = useState(false)
  
  const navItems = [
    { href: "/", icon: Home, label: "Beranda" },
    { href: "/campaigns", icon: Blocks, label: "Campaign" },
    { href: "/bayar", icon: PieChart, label: "Bayar Zakat" },
    { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  ]
  
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href.replace("/#", "/"))
  }

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowDashboardDialog(true)
  }

  const selectDashboard = (type: 'user' | 'organizer') => {
    setShowDashboardDialog(false)
    router.push(`/dashboard/${type}`)
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
            const isDashboard = item.href === "/dashboard"
            
            return isDashboard ? (
              <button
                key={item.href}
                onClick={handleDashboardClick}
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
              </button>
            ) : (
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

      {/* Dashboard Selection Dialog */}
      <Dialog open={showDashboardDialog} onOpenChange={setShowDashboardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Dashboard</DialogTitle>
            <DialogDescription>
              Pilih jenis dashboard yang ingin Anda akses
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 mt-4">
            <button
              onClick={() => selectDashboard('user')}
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UserCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">User Dashboard</h3>
                <p className="text-sm text-muted-foreground">Lihat donasi dan riwayat zakat Anda</p>
              </div>
            </button>

            <button
              onClick={() => selectDashboard('organizer')}
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Organizer Dashboard</h3>
                <p className="text-sm text-muted-foreground">Kelola campaign dan distribusi zakat</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  )
}