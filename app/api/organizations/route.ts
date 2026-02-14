import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceRoleClient } from '@/lib/supabase-server';
import type { Organization } from '@/lib/types/organization';

/**
 * GET /api/organizations
 * List organizations (public or filtered by status)
 * Query params:
 *   - status: Filter by verification status (pending, approved, rejected)
 *   - limit: Maximum number of results (default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by status if provided
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query = query.eq('verification_status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching organizations:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      organizations: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    console.error('Error in GET /api/organizations:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/organizations
 * Create a new organization
 * Requires authenticated user (will be linked as primary admin)
 */
export async function POST(request: NextRequest) {
  try {
    // Use regular client for auth check (respects RLS)
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'name',
      'legalName',
      'registrationNumber',
      'organizationType',
      'email',
    ];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Use SERVICE ROLE client for database writes (bypasses RLS)
    const adminSupabase = createServiceRoleClient();

    // Check if organization with this email already exists
    const { data: existingOrg } = await adminSupabase
      .from('organizations')
      .select('id')
      .eq('email', body.email)
      .maybeSingle();

    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization with this email already exists' },
        { status: 400 }
      );
    }

    // Check if registration number already exists
    const { data: existingReg } = await adminSupabase
      .from('organizations')
      .select('id')
      .eq('registration_number', body.registrationNumber)
      .maybeSingle();

    if (existingReg) {
      return NextResponse.json(
        { error: 'Organization with this registration number already exists' },
        { status: 400 }
      );
    }

    // Prepare organization data
    const organizationData: Partial<Organization> = {
      name: body.name,
      legal_name: body.legalName,
      registration_number: body.registrationNumber,
      organization_type: body.organizationType,
      email: body.email,
      description: body.description || '',
      logo_url: body.logo_url,
      year_established: body.yearEstablished ? parseInt(body.yearEstablished) : null,
      country: body.country || 'Indonesia',
      city: body.city,
      address: body.address,
      phone: body.phone,
      website: body.website,
      mission_statement: body.missionStatement,
      past_projects: body.pastProjects,
      beneficiary_count: body.beneficiaryCount ? parseInt(body.beneficiaryCount) : null,
      annual_budget: body.annualBudget ? parseFloat(body.annualBudget) : null,
      certifications: body.certifications,
      board_members: body.boardMembers,
      registration_document_url: body.registration_document_url,
      tax_document_url: body.tax_document_url,
      bank_statement_url: body.bank_statement_url,
      proof_of_address_url: body.proof_of_address_url,
      verification_status: 'pending',
    };

    // Insert organization using service role (bypasses RLS)
    const { data: orgData, error: orgError } = await adminSupabase
      .from('organizations')
      .insert(organizationData)
      .select()
      .single();

    if (orgError) {
      console.error('Error creating organization:', orgError);
      return NextResponse.json(
        { error: orgError.message },
        { status: 500 }
      );
    }

    // Link user to organization as primary admin using service role
    const { error: adminError } = await adminSupabase
      .from('organization_admins')
      .insert({
        organization_id: orgData.id,
        user_id: user.id,
        role: 'admin',
        is_primary: true,
      });

    if (adminError) {
      console.error('Error linking user to organization:', adminError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json(
      {
        organization: orgData,
        message: 'Organization created successfully. Awaiting admin review.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/organizations:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
