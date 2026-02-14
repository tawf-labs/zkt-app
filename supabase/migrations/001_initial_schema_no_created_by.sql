-- ZK Zakat Database Schema (No created_by in campaigns)
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql/new

-- ============================================================================
-- ORGANIZATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100) NOT NULL UNIQUE,
  organization_type VARCHAR(50) NOT NULL, -- 'NGO', 'Foundation', 'Mosque', 'Other'
  email VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  year_established INTEGER,
  country VARCHAR(100) DEFAULT 'Indonesia',
  city VARCHAR(100),
  address TEXT,
  phone VARCHAR(50),
  website VARCHAR(255),

  -- Additional details
  mission_statement TEXT,
  past_projects TEXT, -- JSON string array
  beneficiary_count INTEGER,
  annual_budget DECIMAL(15, 2),
  certifications TEXT, -- JSON string array
  board_members TEXT, -- JSON string array

  -- Document URLs (Pinata IPFS hashes)
  registration_document_url TEXT,
  tax_document_url TEXT,
  bank_statement_url TEXT,
  proof_of_address_url TEXT,

  -- Verification status
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_organizations_email ON public.organizations(email);
CREATE INDEX IF NOT EXISTS idx_organizations_verification_status ON public.organizations(verification_status);
CREATE INDEX IF NOT EXISTS idx_organizations_created_at ON public.organizations(created_at DESC);

-- ============================================================================
-- ORGANIZATION ADMINS TABLE (junction table)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organization_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  is_primary BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one user can only be linked once per organization
  UNIQUE(organization_id, user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_org_admins_user_id ON public.organization_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_org_admins_org_id ON public.organization_admins(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_admins_is_primary ON public.organization_admins(is_primary);

-- ============================================================================
-- CAMPAIGNS TABLE (without created_by)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id VARCHAR(255) NOT NULL UNIQUE, -- On-chain campaign identifier
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  location VARCHAR(255),

  -- Organization details (denormalized for easy access)
  organization_name VARCHAR(255) NOT NULL,
  organization_verified BOOLEAN DEFAULT false,

  -- Campaign images
  image_urls TEXT[] DEFAULT '{}',

  -- Tags
  tags TEXT[] DEFAULT '{}',

  -- Financial goals
  goal DECIMAL(15, 2) NOT NULL DEFAULT 0,
  total_raised DECIMAL(15, 2) DEFAULT 0,

  -- Time details
  start_time BIGINT,
  end_time BIGINT,

  -- Campaign status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),

  -- Safe transaction hash (for pending campaigns)
  safe_tx_hash VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_campaign_id ON public.campaigns(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON public.campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON public.campaigns(created_at DESC);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Organizations table
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Public can view approved organizations
CREATE POLICY IF NOT EXISTS "Public can view approved organizations"
  ON public.organizations
  FOR SELECT
  TO public
  USING (verification_status = 'approved');

-- Authenticated users can view their own organizations
CREATE POLICY IF NOT EXISTS "Users can view their organizations"
  ON public.organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id
      FROM public.organization_admins
      WHERE user_id = auth.uid()
    )
  );

-- Organization admins can update their organization
CREATE POLICY IF NOT EXISTS "Admins can update their organization"
  ON public.organizations
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id
      FROM public.organization_admins
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Organization admins table
ALTER TABLE public.organization_admins ENABLE ROW LEVEL SECURITY;

-- Users can view their own admin relationships
CREATE POLICY IF NOT EXISTS "Users can view their admin roles"
  ON public.organization_admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Campaigns table
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Public can view active campaigns
CREATE POLICY IF NOT EXISTS "Public can view active campaigns"
  ON public.campaigns
  FOR SELECT
  TO public
  USING (status = 'active');

-- Organization admins can view their organization's campaigns
CREATE POLICY IF NOT EXISTS "Admins can view their campaigns"
  ON public.campaigns
  FOR SELECT
  TO authenticated
  USING (
    organization_name IN (
      SELECT name
      FROM public.organizations
      WHERE id IN (
        SELECT organization_id
        FROM public.organization_admins
        WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_organization_admins_updated_at ON public.organization_admins;
CREATE TRIGGER update_organization_admins_updated_at
  BEFORE UPDATE ON public.organization_admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON public.campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is an organization admin
CREATE OR REPLACE FUNCTION public.is_organization_admin(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_admins
    WHERE organization_id = org_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
