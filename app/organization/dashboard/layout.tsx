import { redirect } from 'next/navigation';
import { getUserOrganization } from '@/lib/supabase-auth';
import { OrgNav } from '@/components/organization/org-nav';

export default async function OrganizationDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organization = await getUserOrganization();

  if (!organization) {
    redirect('/organization/login');
  }

  // Check verification status
  if (organization.verification_status !== 'approved') {
    if (organization.verification_status === 'pending') {
      redirect('/organization/pending');
    } else if (organization.verification_status === 'rejected') {
      redirect('/organization/rejected');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OrgNav organization={organization} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
