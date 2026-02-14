import { createClient } from '@/lib/supabase-server';
import { AdminOrgTable } from '@/components/admin/admin-org-table';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = await createClient();

  // Fetch organizations with filters
  let query = supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('verification_status', searchParams.status);
  }

  const { data: organizations } = await query;

  // Count by status
  const counts = {
    all: organizations?.length || 0,
    pending: organizations?.filter(o => o.verification_status === 'pending').length || 0,
    approved: organizations?.filter(o => o.verification_status === 'approved').length || 0,
    rejected: organizations?.filter(o => o.verification_status === 'rejected').length || 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Organization Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve organization registration requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold mt-1">{counts.all}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{counts.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{counts.approved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold mt-1 text-red-600">{counts.rejected}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <Select name="status" defaultValue={searchParams.status || 'all'}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Organizations Table */}
      <AdminOrgTable organizations={organizations || []} />
    </div>
  );
}
