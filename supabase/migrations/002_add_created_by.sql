-- Add created_by column to campaigns table if it doesn't exist
-- Run this in Supabase SQL Editor after the initial schema

DO $$
BEGIN
  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'campaigns'
    AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.campaigns
    ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Comment on the column
COMMENT ON COLUMN public.campaigns.created_by IS 'UUID of the user who created the campaign';
