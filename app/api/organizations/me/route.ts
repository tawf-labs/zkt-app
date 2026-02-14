import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * GET /api/organizations/me
 * Returns the current user's organization status
 * Requires authenticated session (reads from cookies)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user from session (set by Supabase OAuth)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is an organization admin
    const { data: orgAdmin, error } = await supabase
      .from('organization_admins')
      .select('organizations (*)')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Database error fetching organization:', error)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    if (!orgAdmin?.organizations) {
      // User is not an organization admin
      return NextResponse.json(
        { organization: null },
        { status: 404 }
      )
    }

    // Return organization data
    return NextResponse.json({
      organization: orgAdmin.organizations
    })
  } catch (error) {
    console.error('Error in /api/organizations/me:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
