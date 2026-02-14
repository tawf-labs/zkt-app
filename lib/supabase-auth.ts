import { createClient } from '@/lib/supabase-server';
import type {
  Organization,
  OrganizationAdmin,
  OrganizationWithAdmin,
} from '@/lib/types/organization';

/**
 * Get the current session from Supabase auth
 * Returns null if no session exists
 */
export async function getSession() {
  const supabase = await createClient();
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get the current authenticated user
 * Returns null if no user is authenticated
 */
export async function getUser() {
  const supabase = await createClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get the organization associated with the current user
 * Returns null if user is not linked to any organization
 */
export async function getUserOrganization(): Promise<OrganizationWithAdmin | null> {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('organization_admins')
      .select(`
        organization_id,
        role,
        is_primary,
        organizations (*)
      `)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user organization:', error);
      return null;
    }

    if (!data || !data.organizations) {
      return null;
    }

    // Return organization with admin role info
    return {
      ...(data.organizations as Organization),
      admin_role: data.role as any,
      is_primary: data.is_primary,
    };
  } catch (error) {
    console.error('Error fetching user organization:', error);
    return null;
  }
}

/**
 * Check if user is an admin of the specified organization
 */
export async function isOrganizationAdmin(organizationId: string): Promise<boolean> {
  const user = await getUser();
  if (!user) {
    return false;
  }

  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('organization_admins')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    return data.role === 'admin' || data.role === 'editor';
  } catch {
    return false;
  }
}

/**
 * Link a user to an organization as an admin
 */
export async function linkUserToOrganization(
  userId: string,
  organizationId: string,
  role: 'admin' | 'editor' | 'viewer' = 'admin',
  isPrimary: boolean = false
): Promise<OrganizationAdmin | null> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('organization_admins')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        role,
        is_primary: isPrimary,
      })
      .select()
      .single();

    if (error) {
      console.error('Error linking user to organization:', error);
      return null;
    }

    return data as OrganizationAdmin;
  } catch (error) {
    console.error('Error linking user to organization:', error);
    return null;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient();
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
