-- 1. Add new columns to the existing blogs table
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'visible',
ADD COLUMN IF NOT EXISTS excerpt text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS author text,
ADD COLUMN IF NOT EXISTS theme_template text;

-- 2. Create a settings table for the dynamic Navbar and other globals
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);
