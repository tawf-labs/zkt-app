import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUser } from '@/lib/supabase-auth';

/**
 * POST /api/organizations/[id]/reject
 * Reject an organization (admin only)
 * Requires a rejection reason
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // TODO: Add proper admin role check
    // For now, we'll allow any authenticated user to reject
    // In production, check if user has admin role:
    // const isAdmin = await checkIsAdmin(user.id);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body = await request.json();
    const { rejection_reason } = body;

    if (!rejection_reason || rejection_reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if organization exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('verification_status')
      .eq('id', params.id)
      .single();

    if (!existingOrg) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    if (existingOrg.verification_status === 'rejected') {
      return NextResponse.json(
        { error: 'Organization is already rejected' },
        { status: 400 }
      );
    }

    if (existingOrg.verification_status === 'approved') {
      return NextResponse.json(
        { error: 'Cannot reject an already approved organization' },
        { status: 400 }
      );
    }

    // Update organization status to rejected
    const { data, error } = await supabase
      .from('organizations')
      .update({
        verification_status: 'rejected',
        verified_at: new Date().toISOString(),
        verified_by: user.id,
        rejection_reason: rejection_reason.trim(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error rejecting organization:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      organization: data,
      message: 'Organization rejected successfully',
    });
  } catch (error: any) {
    console.error('Error in POST /api/organizations/[id]/reject:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
