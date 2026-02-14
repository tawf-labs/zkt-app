import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUser } from '@/lib/supabase-auth';

/**
 * POST /api/organizations/[id]/approve
 * Approve an organization (admin only)
 * In production, you should check if the user has admin privileges
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
    // For now, we'll allow any authenticated user to approve
    // In production, check if user has admin role:
    // const isAdmin = await checkIsAdmin(user.id);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const supabase = await createClient();

    // Check if organization exists and is pending
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

    if (existingOrg.verification_status === 'approved') {
      return NextResponse.json(
        { error: 'Organization is already approved' },
        { status: 400 }
      );
    }

    // Update organization status to approved
    const { data, error } = await supabase
      .from('organizations')
      .update({
        verification_status: 'approved',
        verified_at: new Date().toISOString(),
        verified_by: user.id,
        rejection_reason: null,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error approving organization:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      organization: data,
      message: 'Organization approved successfully',
    });
  } catch (error: any) {
    console.error('Error in POST /api/organizations/[id]/approve:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
