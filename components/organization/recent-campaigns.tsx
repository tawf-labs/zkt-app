import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatIDRX } from '@/lib/abi';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { Plus, ArrowRight, Calendar } from 'lucide-react';

interface RecentCampaignsProps {
  campaigns: any[];
}

export function RecentCampaigns({ campaigns }: RecentCampaignsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Campaigns</h2>
        <Link href="/organization/dashboard/campaigns">
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground mb-4">No campaigns yet</p>
          <Link href="/campaigns/new">
            <Button>Create Your First Campaign</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.slice(0, 5).map((campaign) => {
            const progress = campaign.goal > 0
              ? Math.min((campaign.total_raised / campaign.goal) * 100, 100)
              : 0;

            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.campaign_id}`}
                className="block group"
              >
                <div className="flex items-start gap-4 p-4 rounded-lg border border-transparent hover:border-primary/20 hover:bg-gray-50 transition-colors">
                  {campaign.image_urls && campaign.image_urls[0] && (
                    <img
                      src={formatPinataImageUrl(campaign.image_urls[0])}
                      alt={campaign.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                        {campaign.title}
                      </h3>
                      <Badge
                        variant={
                          campaign.status === 'active'
                            ? 'default'
                            : campaign.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{formatIDRX(BigInt(campaign.total_raised || 0))} raised</span>
                        <span className="text-muted-foreground">of {formatIDRX(BigInt(campaign.goal))} goal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
