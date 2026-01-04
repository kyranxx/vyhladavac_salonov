-- =========================================================
-- ADD COMPANIES TABLE & DISPLAY IDS
-- Run this in your Supabase SQL Editor
-- Project: txodloobftonmurltjpm
-- =========================================================

-- 1. Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    display_id SERIAL UNIQUE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    ico VARCHAR(20),
    dic VARCHAR(20),
    ic_dph VARCHAR(25),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Slovensko',
    email VARCHAR(255),
    phone VARCHAR(50),
    bank_account VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Add company_id to salons
ALTER TABLE salons ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL;

-- 3. Add display_id to salons (if not exists)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS display_id SERIAL;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_salons_company_id ON salons(company_id);

-- 5. Row Level Security for companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own companies" ON companies;
CREATE POLICY "Users can view own companies" ON companies
    FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own companies" ON companies;
CREATE POLICY "Users can insert own companies" ON companies
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own companies" ON companies;
CREATE POLICY "Users can update own companies" ON companies
    FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own companies" ON companies;
CREATE POLICY "Users can delete own companies" ON companies
    FOR DELETE USING (auth.uid() = owner_id);

-- Done!
SELECT 'Companies table created successfully!' as result;
