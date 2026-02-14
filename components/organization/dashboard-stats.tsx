import { Card } from '@/components/ui/card';
import { formatIDRX } from '@/lib/abi';
import { LayoutDashboard, FolderOpen, DollarSign, Users } from 'lucide-react';

interface DashboardStatsProps {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRaised: number;
  totalDonors: number;
}

export function DashboardStats({
  totalCampaigns,
  activeCampaigns,
  totalRaised,
  totalDonors,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
            <p className="text-2xl font-bold mt-1">{totalCampaigns}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
            <p className="text-2xl font-bold mt-1">{activeCampaigns}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <FolderOpen className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
            <p className="text-2xl font-bold mt-1">{formatIDRX(BigInt(totalRaised))}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
            <p className="text-2xl font-bold mt-1">{totalDonors}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}
