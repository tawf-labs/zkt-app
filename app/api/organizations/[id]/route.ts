import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUser, getUserOrganization, isOrganizationAdmin } from '@/lib/supabase-auth';

/**
 * GET /api/organizations/[id]
 * Get a single organization by ID
 * Public access for approved organizations, admin access for own org
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // If organization is not approved, check if user has access
    if (data.verification_status !== 'approved') {
      const userOrg = await getUserOrganization();
      if (!userOrg || userOrg.id !== params.id) {
        return NextResponse.json(
          { error: 'Organization not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ organization: data });
  } catch (error: any) {
    console.error('Error in GET /api/organizations/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/organizations/[id]
 * Update an organization
 * Only accessible by organization admins
 */
export async function PATCH(
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

    // Check if user is admin of this organization
    const isAdmin = await isOrganizationAdmin(params.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have permission to update this organization' },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const body = await request.json();

    // Prepare update data (only allow updating certain fields)
    const allowedFields = [
      'name',
      'description',
      'logo_url',
      'phone',
      'website',
      'mission_statement',
      'past_projects',
      'beneficiary_count',
      'annual_budget',
      'certifications',
      'board_members',
      'city',
      'address',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Convert field names from camelCase to snake_case for database
        const snakeField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateData[snakeField] = body[field];
      }
    }

    const { data, error } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating organization:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ organization: data });
  } catch (error: any) {
    console.error('Error in PATCH /api/organizations/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/organizations/[id]
 * Delete an organization
 * Only accessible by organization primary admin
 */
export async function DELETE(
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

    const supabase = await createClient();

    // Check if user is primary admin of this organization
    const { data: adminData } = await supabase
      .from('organization_admins')
      .select('*')
      .eq('organization_id', params.id)
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .maybeSingle();

    if (!adminData) {
      return NextResponse.json(
        { error: 'Forbidden - Only primary admin can delete organization' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting organization:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/organizations/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
