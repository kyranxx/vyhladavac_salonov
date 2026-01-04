-- =========================================================
-- REGISTER SALÓNOV - Complete Database Setup
-- Run this in your new Supabase project's SQL Editor
-- =========================================================

-- =========================================================
-- 1. PROFILES TABLE (Extended user data)
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =========================================================
-- 2. COMPANIES TABLE (Business entities for invoicing)
-- =========================================================
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

CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);

-- =========================================================
-- 3. CATEGORIES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_sk TEXT NOT NULL,
    name_en TEXT,
    name_hu TEXT,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description_sk TEXT,
    description_en TEXT,
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================================
-- 4. SALONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS salons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    display_id SERIAL UNIQUE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description_sk TEXT,
    description_en TEXT,
    description_hu TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    website TEXT,
    instagram TEXT,
    facebook TEXT,
    opening_hours JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    approved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_salons_owner_id ON salons(owner_id);
CREATE INDEX IF NOT EXISTS idx_salons_company_id ON salons(company_id);
CREATE INDEX IF NOT EXISTS idx_salons_city ON salons(city);
CREATE INDEX IF NOT EXISTS idx_salons_status ON salons(status);
CREATE INDEX IF NOT EXISTS idx_salons_slug ON salons(slug);

-- =========================================================
-- 5. SALON_CATEGORIES (Many-to-many)
-- =========================================================
CREATE TABLE IF NOT EXISTS salon_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(salon_id, category_id)
);

-- =========================================================
-- 6. SALON_PHOTOS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS salon_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================================
-- 7. SERVICES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration_minutes INTEGER,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================================
-- 8. SUBSCRIPTIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    status TEXT DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================================
-- 9. REVIEWS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================================
-- 10. ROW LEVEL SECURITY POLICIES
-- =========================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable" ON profiles
    FOR SELECT USING (true);

-- Companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companies" ON companies
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own companies" ON companies
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own companies" ON companies
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own companies" ON companies
    FOR DELETE USING (auth.uid() = owner_id);

-- Salons
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved salons are public" ON salons
    FOR SELECT USING (status = 'approved' OR auth.uid() = owner_id);

CREATE POLICY "Users can insert own salons" ON salons
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own salons" ON salons
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own salons" ON salons
    FOR DELETE USING (auth.uid() = owner_id);

-- Categories (public read)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public" ON categories
    FOR SELECT USING (true);

-- Salon Categories
ALTER TABLE salon_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Salon categories are public" ON salon_categories
    FOR SELECT USING (true);

CREATE POLICY "Owners can manage salon categories" ON salon_categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM salons WHERE salons.id = salon_id AND salons.owner_id = auth.uid())
    );

-- Photos
ALTER TABLE salon_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are public" ON salon_photos
    FOR SELECT USING (true);

CREATE POLICY "Owners can manage photos" ON salon_photos
    FOR ALL USING (
        EXISTS (SELECT 1 FROM salons WHERE salons.id = salon_id AND salons.owner_id = auth.uid())
    );

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are public" ON services
    FOR SELECT USING (true);

CREATE POLICY "Owners can manage services" ON services
    FOR ALL USING (
        EXISTS (SELECT 1 FROM salons WHERE salons.id = salon_id AND salons.owner_id = auth.uid())
    );

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM salons WHERE salons.id = salon_id AND salons.owner_id = auth.uid())
    );

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are public" ON reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =========================================================
-- 11. INSERT DEFAULT CATEGORIES
-- =========================================================
INSERT INTO categories (name_sk, name_en, slug, icon, sort_order) VALUES
    ('Dámske kaderníctvo', 'Women Hair Salon', 'damske-kadernictvo', '💇‍♀️', 1),
    ('Pánske kaderníctvo', 'Men Hair Salon', 'panske-kadernictvo', '💇‍♂️', 2),
    ('Barbershop', 'Barbershop', 'barbershop', '✂️', 3),
    ('Kozmetika', 'Cosmetics', 'kozmetika', '💄', 4),
    ('Manikúra', 'Manicure', 'manikura', '💅', 5),
    ('Pedikúra', 'Pedicure', 'pedikura', '🦶', 6),
    ('Masáže', 'Massage', 'masaze', '💆', 7),
    ('Wellness & Spa', 'Wellness & Spa', 'wellness', '🧖', 8),
    ('Tetovacie štúdio', 'Tattoo Studio', 'tetovacie-studio', '🎨', 9),
    ('Solárium', 'Solarium', 'solarium', '☀️', 10),
    ('Permanentný make-up', 'Permanent Makeup', 'permanentny-makeup', '✨', 11),
    ('Mihalnice', 'Eyelashes', 'mihalnice', '👁️', 12),
    ('Obočie', 'Eyebrows', 'obocie', '🖌️', 13),
    ('Depilačné štúdio', 'Waxing Studio', 'depilacne-studio', '🪒', 14),
    ('Laserové centrum', 'Laser Center', 'laserove-centrum', '💥', 15),
    ('Fitness & Personal training', 'Fitness', 'fitness', '💪', 16),
    ('Joga štúdio', 'Yoga Studio', 'joga', '🧘', 17),
    ('Fototerapia', 'Phototherapy', 'fototerapia', '📸', 18),
    ('Líčenie', 'Makeup', 'licenie', '🎭', 19),
    ('Svadobný salón', 'Wedding Salon', 'svadobny-salon', '👰', 20),
    ('Detské kaderníctvo', 'Kids Hair', 'detske-kadernictvo', '👧', 21),
    ('Kryoterapia', 'Cryotherapy', 'kryoterapia', '❄️', 22),
    ('Aromaterapia', 'Aromatherapy', 'aromaterapia', '🌸', 23),
    ('Akupunktúra', 'Acupuncture', 'akupunktura', '📍', 24),
    ('Reiki', 'Reiki', 'reiki', '🙏', 25),
    ('Ayurvéda', 'Ayurveda', 'ayurveda', '🍃', 26),
    ('Lymfodrenáž', 'Lymphatic drainage', 'lymfodrenaz', '💧', 27)
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- 12. CREATE TEST DATA (Companies & Salons)
-- =========================================================
-- Note: These will be created with the first admin user who signs up
-- You can run this after creating your first user, replacing the UUID

-- To get your user ID after signing up, run:
-- SELECT id, email FROM auth.users;

-- =========================================================
-- SETUP COMPLETE!
-- =========================================================
