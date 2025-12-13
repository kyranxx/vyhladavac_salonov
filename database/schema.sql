-- ============================================
-- SALON FINDER SK - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_sk VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_hu VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    category_type VARCHAR(20) DEFAULT 'primary' CHECK (category_type IN ('primary', 'secondary')),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (slug, name_sk, name_en, name_hu, icon, category_type, sort_order) VALUES
('damske-kadernictvo', 'Dámske kaderníctvo', 'Women''s Hair Salon', 'Női fodrászat', '💇‍♀️', 'primary', 1),
('panske-kadernictvo', 'Pánske kaderníctvo', 'Men''s Hair Salon', 'Férfi fodrászat', '💇‍♂️', 'primary', 2),
('kozmetika', 'Kozmetika', 'Cosmetics', 'Kozmetika', '✨', 'primary', 3),
('manikura', 'Manikúra', 'Manicure', 'Manikűr', '💅', 'primary', 4),
('pedikura', 'Pedikúra', 'Pedicure', 'Pedikűr', '🦶', 'primary', 5),
('masaze', 'Masáže', 'Massage', 'Masszázs', '💆', 'primary', 6),
('barbershop', 'Barbershop', 'Barbershop', 'Borbély', '✂️', 'primary', 7),
('wellness', 'Wellness', 'Wellness', 'Wellness', '🧖', 'primary', 8),
('make-up', 'Make-up', 'Make-up', 'Smink', '💄', 'secondary', 9),
('mihalnice', 'Mihalnice', 'Eyelashes', 'Szempillák', '👁️', 'secondary', 10),
('tetovanie', 'Tetovanie', 'Tattoo', 'Tetoválás', '🎨', 'secondary', 11),
('permanentny-make-up', 'Permanentný make-up', 'Permanent Make-up', 'Permanens smink', '✏️', 'secondary', 12),
('solarium', 'Solárium', 'Solarium', 'Szolárium', '☀️', 'secondary', 13)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. DISTRICTS TABLE (Cities)
-- ============================================
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_sk VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    name_hu VARCHAR(100),
    region_sk VARCHAR(100),
    is_major_city BOOLEAN DEFAULT FALSE,
    population INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Slovak cities
INSERT INTO districts (slug, name_sk, name_en, name_hu, region_sk, is_major_city) VALUES
('bratislava', 'Bratislava', 'Bratislava', 'Pozsony', 'Bratislavský kraj', TRUE),
('kosice', 'Košice', 'Košice', 'Kassa', 'Košický kraj', TRUE),
('zilina', 'Žilina', 'Žilina', 'Zsolna', 'Žilinský kraj', TRUE),
('nitra', 'Nitra', 'Nitra', 'Nyitra', 'Nitriansky kraj', TRUE),
('presov', 'Prešov', 'Prešov', 'Eperjes', 'Prešovský kraj', TRUE),
('banska-bystrica', 'Banská Bystrica', 'Banská Bystrica', 'Besztercebánya', 'Banskobystrický kraj', TRUE),
('trnava', 'Trnava', 'Trnava', 'Nagyszombat', 'Trnavský kraj', TRUE),
('trencin', 'Trenčín', 'Trenčín', 'Trencsén', 'Trenčiansky kraj', TRUE),
('martin', 'Martin', 'Martin', 'Túrócszentmárton', 'Žilinský kraj', FALSE),
('poprad', 'Poprad', 'Poprad', 'Poprád', 'Prešovský kraj', FALSE),
('piestany', 'Piešťany', 'Piešťany', 'Pöstyén', 'Trnavský kraj', FALSE),
('prievidza', 'Prievidza', 'Prievidza', 'Privigye', 'Trenčiansky kraj', FALSE),
('zvolen', 'Zvolen', 'Zvolen', 'Zólyom', 'Banskobystrický kraj', FALSE),
('komarno', 'Komárno', 'Komárno', 'Komárom', 'Nitriansky kraj', FALSE),
('nove-zamky', 'Nové Zámky', 'Nové Zámky', 'Érsekújvár', 'Nitriansky kraj', FALSE),
('michalovce', 'Michalovce', 'Michalovce', 'Nagymihály', 'Košický kraj', FALSE),
('levice', 'Levice', 'Levice', 'Léva', 'Nitriansky kraj', FALSE),
('humenne', 'Humenné', 'Humenné', 'Homonna', 'Prešovský kraj', FALSE),
('spisska-nova-ves', 'Spišská Nová Ves', 'Spišská Nová Ves', 'Igló', 'Košický kraj', FALSE),
('bardejov', 'Bardejov', 'Bardejov', 'Bártfa', 'Prešovský kraj', FALSE),
('liptovsky-mikulas', 'Liptovský Mikuláš', 'Liptovský Mikuláš', 'Liptószentmiklós', 'Žilinský kraj', FALSE),
('ruzomberok', 'Ružomberok', 'Ružomberok', 'Rózsahegy', 'Žilinský kraj', FALSE),
('lucenec', 'Lučenec', 'Lučenec', 'Losonc', 'Banskobystrický kraj', FALSE),
('dunajska-streda', 'Dunajská Streda', 'Dunajská Streda', 'Dunaszerdahely', 'Trnavský kraj', FALSE),
('pezinok', 'Pezinok', 'Pezinok', 'Bazin', 'Bratislavský kraj', FALSE),
('hlohovec', 'Hlohovec', 'Hlohovec', 'Galgóc', 'Trnavský kraj', FALSE),
('senica', 'Senica', 'Senica', 'Szenice', 'Trnavský kraj', FALSE),
('cadca', 'Čadca', 'Čadca', 'Csaca', 'Žilinský kraj', FALSE),
('dolny-kubin', 'Dolný Kubín', 'Dolný Kubín', 'Alsókubin', 'Žilinský kraj', FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. SALONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district_id INT REFERENCES districts(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    logo_url VARCHAR(500),
    
    -- Descriptions
    description_sk TEXT,
    description_en TEXT,
    description_hu TEXT,
    
    -- Links
    website VARCHAR(255),
    booking_url VARCHAR(255),
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    google_maps_url VARCHAR(255),
    
    -- Opening Hours (JSON)
    opening_hours JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    rejection_note TEXT,
    
    -- Subscription
    tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_until TIMESTAMPTZ,
    
    -- Statistics
    view_count INT DEFAULT 0,
    click_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_salons_owner ON salons(owner_id);
CREATE INDEX IF NOT EXISTS idx_salons_status ON salons(status);
CREATE INDEX IF NOT EXISTS idx_salons_city ON salons(city);
CREATE INDEX IF NOT EXISTS idx_salons_district ON salons(district_id);
CREATE INDEX IF NOT EXISTS idx_salons_featured ON salons(is_featured, featured_until);

-- ============================================
-- 4. SALON_CATEGORIES (Junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS salon_categories (
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (salon_id, category_id)
);

-- ============================================
-- 5. SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name_sk VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    name_hu VARCHAR(255),
    price DECIMAL(10, 2),
    price_to DECIMAL(10, 2),
    duration_minutes INT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_salon ON services(salon_id);

-- ============================================
-- 6. PHOTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_salon ON photos(salon_id);

-- ============================================
-- 7. SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    type VARCHAR(20) NOT NULL CHECK (type IN ('premium', 'featured', 'verified')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    
    amount_paid DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_salon ON subscriptions(salon_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Salons: Anyone can view approved, owners can edit their own
CREATE POLICY "Anyone can view approved salons" ON salons
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own salons" ON salons
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own salons" ON salons
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own salons" ON salons
    FOR UPDATE USING (auth.uid() = owner_id);

-- Services: Anyone can view, owners can edit
CREATE POLICY "Anyone can view services of approved salons" ON services
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM salons WHERE salons.id = services.salon_id AND salons.status = 'approved')
    );

CREATE POLICY "Users can manage their salon services" ON services
    FOR ALL USING (
        EXISTS (SELECT 1 FROM salons WHERE salons.id = services.salon_id AND salons.owner_id = auth.uid())
    );

-- Photos: Anyone can view, owners can edit
CREATE POLICY "Anyone can view photos of approved salons" ON photos
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM salons WHERE salons.id = photos.salon_id AND salons.status = 'approved')
    );

CREATE POLICY "Users can manage their salon photos" ON photos
    FOR ALL USING (
        EXISTS (SELECT 1 FROM salons WHERE salons.id = photos.salon_id AND salons.owner_id = auth.uid())
    );

-- Subscriptions: Users can only see their own
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 9. HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to salons
CREATE TRIGGER update_salons_updated_at
    BEFORE UPDATE ON salons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to subscriptions
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONE! Your database is ready.
-- ============================================
