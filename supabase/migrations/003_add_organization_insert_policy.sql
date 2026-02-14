-- Fix: Add INSERT policy for organizations table
-- This allows authenticated users to create new organizations

-- Authenticated users can create organizations
CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can insert themselves as organization admins
CREATE POLICY "Authenticated users can join organizations"
  ON public.organization_admins
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
