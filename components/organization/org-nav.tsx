'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { OrganizationWithAdmin } from '@/lib/types/organization';
import { signOutClient } from '@/lib/supabase-client-auth';
import { useRouter } from 'next/navigation';
import { formatPinataImageUrl } from '@/lib/pinata-client';

interface OrgNavProps {
  organization: OrganizationWithAdmin;
}

export function OrgNav({ organization }: OrgNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutClient();
    router.push('/');
  };

  const navItems = [
    {
      href: '/organization/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/organization/dashboard/campaigns',
      label: 'Campaigns',
      icon: FolderOpen,
    },
    {
      href: '/organization/dashboard/donations',
      label: 'Donations',
      icon: Users,
    },
    {
      href: '/organization/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Organization */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl hidden sm:inline-block">ZK Zakat</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg">
              {organization.logo_url && (
                <img
                  src={formatPinataImageUrl(organization.logo_url)}
                  alt={organization.name}
                  className="w-6 h-6 rounded"
                />
              )}
              <span className="text-sm font-medium">{organization.name}</span>
            </div>
          </div>

          {/* Right side - Navigation and User Menu */}
          <div className="flex items-center gap-4">
            {/* Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isParent = pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive || isParent
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm">
                  Menu
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={organization.logo_url || undefined} alt={organization.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{organization.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {organization.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/organization/dashboard/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
