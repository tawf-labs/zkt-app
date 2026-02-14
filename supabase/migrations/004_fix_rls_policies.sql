-- Fix RLS policies for organization registration
-- This script drops existing policies and recreates them correctly

-- First, drop the INSERT policy if it exists
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;

-- Drop the INSERT policy for organization_admins if it exists
DROP POLICY IF EXISTS "Authenticated users can join organizations" ON public.organization_admins;

-- Recreate INSERT policy for organizations - allow any authenticated user to create
CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Recreate INSERT policy for organization_admins - allow users to add themselves
CREATE POLICY "Authenticated users can join organizations"
  ON public.organization_admins
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Also need UPDATE policy for organization_admins (in case they need to update their role)
CREATE POLICY "Users can update their admin roles"
  ON public.organization_admins
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Verify policies are created
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('organizations', 'organization_admins')
ORDER BY tablename, policyname;
