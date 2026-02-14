import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { getUserOrganization } from '@/lib/supabase-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatIDRX } from '@/lib/abi';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { Plus, Search, Calendar, MapPin, TrendingUp } from 'lucide-react';

export default async function OrganizationCampaignsPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const supabase = await createClient();
  const organization = await getUserOrganization();

  // Fetch organization campaigns with filters
  let query = supabase
    .from('campaigns')
    .select('*')
    .eq('organization_id', organization?.id)
    .order('created_at', { ascending: false });

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status);
  }

  const { data: campaigns } = await query;

  // Calculate stats
  const stats = {
    total: campaigns?.length || 0,
    active: campaigns?.filter(c => c.status === 'active').length || 0,
    completed: campaigns?.filter(c => c.status === 'completed').length || 0,
    totalRaised: campaigns?.reduce((sum, c) => sum + (c.total_raised || 0), 0) || 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your organization's zakat campaigns
          </p>
        </div>
        <Link href="/campaigns/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{stats.active}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.completed}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
            <p className="text-2xl font-bold mt-1">{formatIDRX(BigInt(stats.totalRaised))}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-10"
                name="search"
                defaultValue={searchParams.search}
              />
            </div>
          </div>
          <Select name="status" defaultValue={searchParams.status || 'all'}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Campaign List */}
      {campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const progress = campaign.goal > 0
              ? Math.min((campaign.total_raised / campaign.goal) * 100, 100)
              : 0;

            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.campaign_id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  {campaign.image_urls && campaign.image_urls[0] && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={formatPinataImageUrl(campaign.image_urls[0])}
                        alt={campaign.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                      <Badge
                        className={`absolute top-3 right-3 ${
                          campaign.status === 'active'
                            ? 'bg-green-500'
                            : campaign.status === 'completed'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                        }`}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{campaign.location}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{formatIDRX(BigInt(campaign.total_raised || 0))}</span>
                          <span className="text-muted-foreground">of {formatIDRX(BigInt(campaign.goal))}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                          {progress.toFixed(1)}% funded
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Created {new Date(campaign.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first campaign to start collecting zakat donations
            </p>
            <Link href="/campaigns/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
