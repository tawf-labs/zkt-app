import { createClient } from '@/lib/supabase-server';
import { getUserOrganization } from '@/lib/supabase-auth';
import { DashboardStats } from '@/components/organization/dashboard-stats';
import { RecentCampaigns } from '@/components/organization/recent-campaigns';
import { RecentDonations } from '@/components/organization/recent-donations';
import { Card } from '@/components/ui/card';
import { formatPinataImageUrl } from '@/lib/pinata-client';
import { Calendar, MapPin, Building2 } from 'lucide-react';

export default async function OrganizationDashboardPage() {
  const supabase = await createClient();
  const organization = await getUserOrganization();

  // Fetch organization campaigns
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('organization_id', organization?.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const totalRaised = campaigns?.reduce((sum, c) => sum + (c.total_raised || 0), 0) || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const totalCampaigns = campaigns?.length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {organization?.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your organization today.
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats
        totalCampaigns={totalCampaigns}
        activeCampaigns={activeCampaigns}
        totalRaised={totalRaised}
        totalDonors={0} // TODO: Calculate from donations table
      />

      {/* Organization Info Card */}
      {organization && (
        <Card className="p-6">
          <div className="flex items-start gap-6">
            {organization.logo_url && (
              <img
                src={formatPinataImageUrl(organization.logo_url)}
                alt={organization.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{organization.name}</h2>
              <p className="text-muted-foreground mb-4">{organization.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{organization.organization_type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{organization.city}, {organization.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Since {organization.year_established}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Campaigns and Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentCampaigns campaigns={campaigns || []} />
        <RecentDonations organizationId={organization?.id || ''} />
      </div>
    </div>
  );
}
