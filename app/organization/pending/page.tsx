'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client-auth';
import type { Organization } from '@/lib/types/organization';

export default function OrganizationPendingPage() {
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndOrg = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // Not authenticated - redirect to login
          router.push('/organization/login');
          return;
        }

        // Get user's organization
        const userId = session.user.id;
        const { data: orgAdmin } = await supabase
          .from('organization_admins')
          .select('organizations (*)')
          .eq('user_id', userId)
          .maybeSingle();

        if (!orgAdmin?.organizations) {
          // No organization found - redirect to register
          router.push('/organization/register');
          return;
        }

        const org = orgAdmin.organizations as Organization;

        // Check if org is approved - if so, redirect to dashboard
        if (org.verification_status === 'approved') {
          router.push('/organization/dashboard');
          return;
        }

        // Check if org is rejected - if so, redirect to rejected page
        if (org.verification_status === 'rejected') {
          router.push('/organization/rejected');
          return;
        }

        // Org is pending - show pending page
        setOrganization(org);
      } catch (error) {
        console.error('Error checking organization status:', error);
        router.push('/organization/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndOrg();
  }, [router]);

  const handleRefresh = () => {
    router.refresh();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="animate-pulse flex justify-center mb-6">
            <div className="w-20 h-20 bg-amber-100 rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Organization Pending Approval</h1>

        <p className="text-gray-600 mb-6">
          Your organization <strong>{organization.name}</strong> is currently under review.
          Our team will verify your information and approve your account shortly.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            You will receive an email notification once your organization has been approved.
            This typically takes 1-3 business days.
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={handleRefresh}>
            Refresh Status
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={handleGoHome}
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
