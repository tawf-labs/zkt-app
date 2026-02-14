import { Card } from '@/components/ui/card';
import { formatIDRX } from '@/lib/abi';
import { Heart, Calendar } from 'lucide-react';

interface RecentDonationsProps {
  organizationId: string;
}

export function RecentDonations({ organizationId }: RecentDonationsProps) {
  // TODO: Fetch donations from the donations table when it's created
  // For now, this is a placeholder component

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Donations</h2>
      </div>

      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-muted-foreground mb-2">No donations yet</p>
        <p className="text-sm text-muted-foreground">
          Donations will appear here once donors contribute to your campaigns.
        </p>
      </div>

      {/* Placeholder for when donations exist:
      <div className="space-y-4">
        {donations.map((donation) => (
          <div key={donation.id} className="flex items-center gap-4 p-4 rounded-lg border">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{donation.donor_name || 'Anonymous'}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{new Date(donation.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatIDRX(BigInt(donation.amount))}</p>
              <p className="text-sm text-muted-foreground">{donation.campaign_title}</p>
            </div>
          </div>
        ))}
      </div>
      */}
    </Card>
  );
}
