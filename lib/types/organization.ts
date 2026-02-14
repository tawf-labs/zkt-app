// Organization types for the registration and dashboard system

export type OrganizationType =
  | 'amil_zakat'
  | 'charity'
  | 'nonprofit'
  | 'foundation'
  | 'community_org';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type OrganizationRole = 'admin' | 'editor' | 'viewer';

// Basic organization information
export interface Organization {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  organization_type: OrganizationType;
  legal_name: string;
  registration_number: string;
  year_established?: number;
  country: string;
  city?: string;
  address?: string;
  email: string;
  phone?: string;
  website?: string;
  mission_statement?: string;
  past_projects?: string;
  beneficiary_count?: number;
  annual_budget?: number;
  certifications?: string;
  board_members?: string;

  // Document URLs
  registration_document_url?: string;
  tax_document_url?: string;
  bank_statement_url?: string;
  proof_of_address_url?: string;

  // Verification
  verification_status: VerificationStatus;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;

  // Metadata
  created_at: string;
  updated_at: string;
}

// Organization admin (links user to organization)
export interface OrganizationAdmin {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  is_primary: boolean;
  created_at: string;
}

// Organization with admin info
export interface OrganizationWithAdmin extends Organization {
  admin_role?: OrganizationRole;
  is_primary?: boolean;
}

// Registration form data (4 steps)
export interface OrganizationRegistrationData {
  // Step 1: Basic Info
  name: string;
  legalName: string;
  registrationNumber: string;
  yearEstablished: string;
  organizationType: string;
  description: string;

  // Step 2: Contact Info
  email: string;
  phone: string;
  website: string;
  country: string;
  city: string;
  address: string;

  // Step 3: Organization Details
  missionStatement: string;
  pastProjects: string;
  beneficiaryCount: string;
  annualBudget: string;
  certifications: string;
  boardMembers: string;

  // Step 4: Documents (File objects)
  logoFile?: File;
  registrationDocument?: File;
  taxDocument?: File;
  bankStatement?: File;
  proofOfAddress?: File;
}

// Campaign linked to organization
export interface OrganizationCampaign {
  id: string;
  campaign_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  goal: number;
  total_raised: number;
  organization_id: string;
  organization_name: string;
  organization_verified: boolean;
  image_urls: string[];
  tags: string[];
  start_time: number;
  end_time: number;
  status: string;
  created_at: string;
}

// Dashboard stats
export interface OrganizationDashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRaised: number;
  totalDonors: number;
}

// Admin approval data
export interface OrganizationApproval {
  organization_id: string;
  status: VerificationStatus;
  rejection_reason?: string;
  approved_by?: string;
}
