-- ============================================
-- SALON FINDER SK - Initial Database Schema
-- Created: 2025-12-12
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('user', 'salon_owner', 'admin');
CREATE TYPE salon_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE salon_tier AS ENUM ('free', 'premium');
CREATE TYPE category_type AS ENUM ('primary', 'secondary');
CREATE TYPE subscription_type AS ENUM ('premium', 'featured', 'verified');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');
CREATE TYPE change_request_type AS ENUM ('create', 'update', 'photo_add', 'photo_delete', 'service_update');
CREATE TYPE change_request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE banner_placement AS ENUM ('hero', 'sidebar', 'between_listings', 'footer', 'category_header', 'city_header');
CREATE TYPE analytics_event_type AS ENUM ('salon_view', 'salon_click_phone', 'salon_click_website', 'salon_click_booking', 'search', 'banner_impression', 'banner_click');

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role DEFAULT 'user',
  full_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================

CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_sk VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_hu VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  category_type category_type DEFAULT 'primary',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DISTRICTS TABLE
-- ============================================

CREATE TABLE public.districts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_sk VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_hu VARCHAR(100) NOT NULL,
  region_sk VARCHAR(100),
  region_en VARCHAR(100),
  region_hu VARCHAR(100),
  is_major_city BOOLEAN DEFAULT FALSE,
  population INT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SALONS TABLE
-- ============================================

CREATE TABLE public.salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Basic Info (FREE tier)
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  address VARCHAR(255) NOT NULL,
  district_id INT REFERENCES public.districts(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  logo_url VARCHAR(500),
  
  -- Opening Hours (FREE tier)
  opening_hours JSONB DEFAULT '{}',
  
  -- Premium Features
  description_sk TEXT,
  description_en TEXT,
  description_hu TEXT,
  website VARCHAR(255),
  booking_url VARCHAR(255),
  facebook_url VARCHAR(255),
  instagram_url VARCHAR(255),
  google_reviews_url VARCHAR(255),
  google_maps_url VARCHAR(255),
  
  -- Additional Info (Premium)
  has_parking BOOLEAN DEFAULT FALSE,
  has_wifi BOOLEAN DEFAULT FALSE,
  has_card_payment BOOLEAN DEFAULT FALSE,
  payment_methods TEXT[],
  
  -- Status
  status salon_status DEFAULT 'pending',
  rejection_note TEXT,
  
  -- Subscription Tier
  tier salon_tier DEFAULT 'free',
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
  approved_at TIMESTAMPTZ,
  
  -- Search optimization
  search_vector TSVECTOR
);

-- Full-text search index
CREATE INDEX idx_salons_search ON public.salons USING GIN(search_vector);
CREATE INDEX idx_salons_district ON public.salons(district_id);
CREATE INDEX idx_salons_status ON public.salons(status);
CREATE INDEX idx_salons_featured ON public.salons(is_featured, featured_until);
CREATE INDEX idx_salons_slug ON public.salons(slug);

-- ============================================
-- SALON_CATEGORIES (Junction Table)
-- ============================================

CREATE TABLE public.salon_categories (
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
  category_id INT REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (salon_id, category_id)
);

-- ============================================
-- PHOTOS TABLE
-- ============================================

CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_salon ON public.photos(salon_id);

-- ============================================
-- SERVICES TABLE
-- ============================================

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
  name_sk VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_hu VARCHAR(255),
  price DECIMAL(10, 2),
  price_to DECIMAL(10, 2),
  duration_minutes INT,
  sort_order INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_salon ON public.services(salon_id);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  type subscription_type NOT NULL,
  status subscription_status DEFAULT 'pending',
  
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  
  amount_paid DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_salon ON public.subscriptions(salon_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_expires ON public.subscriptions(expires_at);

-- ============================================
-- CHANGE_REQUESTS TABLE
-- ============================================

CREATE TABLE public.change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  request_type change_request_type NOT NULL,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  
  status change_request_status DEFAULT 'pending',
  admin_note TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_change_requests_status ON public.change_requests(status);
CREATE INDEX idx_change_requests_salon ON public.change_requests(salon_id);

-- ============================================
-- BANNER_ADS TABLE
-- ============================================

CREATE TABLE public.banner_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(255) NOT NULL,
  placement banner_placement NOT NULL,
  
  image_url VARCHAR(500) NOT NULL,
  image_url_mobile VARCHAR(500),
  link_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  
  -- Targeting
  target_categories INT[],
  target_districts INT[],
  
  -- Scheduling
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Stats
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  
  -- Payment
  amount_paid DECIMAL(10, 2),
  advertiser_name VARCHAR(255),
  advertiser_email VARCHAR(255),
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_banner_ads_placement ON public.banner_ads(placement);
CREATE INDEX idx_banner_ads_active ON public.banner_ads(is_active, starts_at, expires_at);

-- ============================================
-- ANALYTICS_EVENTS TABLE
-- ============================================

CREATE TABLE public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type analytics_event_type NOT NULL,
  
  salon_id UUID REFERENCES public.salons(id) ON DELETE SET NULL,
  banner_id UUID REFERENCES public.banner_ads(id) ON DELETE SET NULL,
  
  -- Context
  user_agent TEXT,
  ip_hash VARCHAR(64),
  referrer VARCHAR(500),
  
  -- Search context
  search_query VARCHAR(255),
  search_category_id INT,
  search_district_id INT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_created ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_salon ON public.analytics_events(salon_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_salon_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.description_sk, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.address, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for search vector
CREATE TRIGGER salon_search_vector_update
  BEFORE INSERT OR UPDATE ON public.salons
  FOR EACH ROW
  EXECUTE FUNCTION update_salon_search_vector();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_salons_updated_at
  BEFORE UPDATE ON public.salons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banner_ads_updated_at
  BEFORE UPDATE ON public.banner_ads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA: CATEGORIES
-- ============================================

INSERT INTO public.categories (slug, name_sk, name_en, name_hu, icon, category_type, sort_order) VALUES
-- Primary Categories (17)
('damske-kadernictvo', 'Dámske kaderníctvo', 'Women''s Hairdressing', 'Női fodrászat', '💇‍♀️', 'primary', 1),
('panske-kadernictvo', 'Pánske kaderníctvo', 'Men''s Hairdressing', 'Férfi fodrászat', '💇‍♂️', 'primary', 2),
('detske-kadernictvo', 'Detské kaderníctvo', 'Children''s Hairdressing', 'Gyermek fodrászat', '👶', 'primary', 3),
('kozmetika', 'Kozmetika', 'Cosmetics', 'Kozmetika', '✨', 'primary', 4),
('manikura', 'Manikúra', 'Manicure', 'Manikűr', '💅', 'primary', 5),
('pedikura', 'Pedikúra', 'Pedicure', 'Pedikűr', '🦶', 'primary', 6),
('masaze', 'Masáže', 'Massages', 'Masszázs', '💆', 'primary', 7),
('make-up', 'Make-up', 'Makeup', 'Smink', '💄', 'primary', 8),
('tetovanie', 'Tetovanie', 'Tattooing', 'Tetoválás', '🎨', 'primary', 9),
('permanentny-make-up', 'Permanentný make-up', 'Permanent Makeup', 'Permanens smink', '✏️', 'primary', 10),
('riasenky', 'Mihalnice', 'Eyelashes', 'Műszempilla', '👁️', 'primary', 11),
('solárium', 'Solárium', 'Solarium', 'Szolárium', '☀️', 'primary', 12),
('wellness', 'Wellness', 'Wellness', 'Wellness', '🧖', 'primary', 13),
('fitness', 'Fitness', 'Fitness', 'Fitnesz', '💪', 'primary', 14),
('laserove-centrum', 'Laserové centrum', 'Laser Center', 'Lézerközpont', '⚡', 'primary', 15),
('svadobny-salon', 'Svadobný salón', 'Wedding Salon', 'Esküvői szalon', '👰', 'primary', 16),
('fotostudio', 'Fotostudio', 'Photo Studio', 'Fotóstúdió', '📸', 'primary', 17),

-- Secondary Categories (15)
('farbenie-vlasov', 'Farbenie vlasov', 'Hair Coloring', 'Hajfestés', '🎨', 'secondary', 101),
('strihy', 'Strihy', 'Haircuts', 'Hajvágás', '✂️', 'secondary', 102),
('styling', 'Styling', 'Styling', 'Styling', '💫', 'secondary', 103),
('ombre-balayage', 'Ombre & Balayage', 'Ombre & Balayage', 'Ombre és Balayage', '🌈', 'secondary', 104),
('vlasove-predlzovanie', 'Predĺženie vlasov', 'Hair Extensions', 'Hajhosszabbítás', '💁‍♀️', 'secondary', 105),
('depilacia', 'Depilácia', 'Depilation', 'Szőrtelenítés', '🪒', 'secondary', 106),
('lifting-riasenky', 'Lifting mihalníc', 'Lash Lift', 'Szempilla lifting', '🔝', 'secondary', 107),
('gél-nechty', 'Gélové nechty', 'Gel Nails', 'Gél köröm', '💎', 'secondary', 108),
('akrylove-nechty', 'Akrylové nechty', 'Acrylic Nails', 'Akril köröm', '💅', 'secondary', 109),
('japonska-manikura', 'Japonská manikúra', 'Japanese Manicure', 'Japán manikűr', '🇯🇵', 'secondary', 110),
('braidy', 'Vrkoče/Braidy', 'Braids', 'Fonatok', '🧵', 'secondary', 111),
('piercing', 'Piercing', 'Piercing', 'Piercing', '💍', 'secondary', 112),
('licenie', 'Líčenie', 'Face Makeup', 'Arcfestés', '💋', 'secondary', 113),
('sauna', 'Sauna', 'Sauna', 'Szauna', '🧖‍♂️', 'secondary', 114),
('henna', 'Henna', 'Henna', 'Henna', '🌿', 'secondary', 115);

-- ============================================
-- INITIAL DATA: DISTRICTS (Slovak Districts)
-- ============================================

INSERT INTO public.districts (slug, name_sk, name_en, name_hu, region_sk, region_en, region_hu, is_major_city, population) VALUES
-- Bratislava
('bratislava', 'Bratislava', 'Bratislava', 'Pozsony', 'Bratislavský kraj', 'Bratislava Region', 'Pozsonyi kerület', TRUE, 475000),

-- Major Cities
('kosice', 'Košice', 'Košice', 'Kassa', 'Košický kraj', 'Košice Region', 'Kassai kerület', TRUE, 240000),
('presov', 'Prešov', 'Prešov', 'Eperjes', 'Prešovský kraj', 'Prešov Region', 'Eperjesi kerület', TRUE, 90000),
('zilina', 'Žilina', 'Žilina', 'Zsolna', 'Žilinský kraj', 'Žilina Region', 'Zsolnai kerület', TRUE, 85000),
('nitra', 'Nitra', 'Nitra', 'Nyitra', 'Nitriansky kraj', 'Nitra Region', 'Nyitrai kerület', TRUE, 77000),
('banska-bystrica', 'Banská Bystrica', 'Banská Bystrica', 'Besztercebánya', 'Banskobystrický kraj', 'Banská Bystrica Region', 'Besztercebányai kerület', TRUE, 78000),
('trnava', 'Trnava', 'Trnava', 'Nagyszombat', 'Trnavský kraj', 'Trnava Region', 'Nagyszombati kerület', TRUE, 65000),
('trencin', 'Trenčín', 'Trenčín', 'Trencsén', 'Trenčiansky kraj', 'Trenčín Region', 'Trencséni kerület', TRUE, 55000),

-- Other important cities
('poprad', 'Poprad', 'Poprad', 'Poprád', 'Prešovský kraj', 'Prešov Region', 'Eperjesi kerület', FALSE, 51000),
('martin', 'Martin', 'Martin', 'Turócszentmárton', 'Žilinský kraj', 'Žilina Region', 'Zsolnai kerület', FALSE, 54000),
('piestany', 'Piešťany', 'Piešťany', 'Pöstyén', 'Trnavský kraj', 'Trnava Region', 'Nagyszombati kerület', FALSE, 28000),
('nove-zamky', 'Nové Zámky', 'Nové Zámky', 'Érsekújvár', 'Nitriansky kraj', 'Nitra Region', 'Nyitrai kerület', FALSE, 38000),
('komarno', 'Komárno', 'Komárno', 'Komárom', 'Nitriansky kraj', 'Nitra Region', 'Nyitrai kerület', FALSE, 34000),
('dunajska-streda', 'Dunajská Streda', 'Dunajská Streda', 'Dunaszerdahely', 'Trnavský kraj', 'Trnava Region', 'Nagyszombati kerület', FALSE, 23000),
('levice', 'Levice', 'Levice', 'Léva', 'Nitriansky kraj', 'Nitra Region', 'Nyitrai kerület', FALSE, 34000),
('lucenec', 'Lučenec', 'Lučenec', 'Losonc', 'Banskobystrický kraj', 'Banská Bystrica Region', 'Besztercebányai kerület', FALSE, 28000),
('ruzomberok', 'Ružomberok', 'Ružomberok', 'Rózsahegy', 'Žilinský kraj', 'Žilina Region', 'Zsolnai kerület', FALSE, 27000),
('liptovsky-mikulas', 'Liptovský Mikuláš', 'Liptovský Mikuláš', 'Liptószentmiklós', 'Žilinský kraj', 'Žilina Region', 'Zsolnai kerület', FALSE, 31000),
('zvolen', 'Zvolen', 'Zvolen', 'Zólyom', 'Banskobystrický kraj', 'Banská Bystrica Region', 'Besztercebányai kerület', FALSE, 43000),
('prievidza', 'Prievidza', 'Prievidza', 'Privigye', 'Trenčiansky kraj', 'Trenčín Region', 'Trencséni kerület', FALSE, 46000),
('michalovce', 'Michalovce', 'Michalovce', 'Nagymihály', 'Košický kraj', 'Košice Region', 'Kassai kerület', FALSE, 39000),
('humenne', 'Humenné', 'Humenné', 'Homonna', 'Prešovský kraj', 'Prešov Region', 'Eperjesi kerület', FALSE, 34000),
('spisska-nova-ves', 'Spišská Nová Ves', 'Spišská Nová Ves', 'Igló', 'Košický kraj', 'Košice Region', 'Kassai kerület', FALSE, 37000),
('bardejov', 'Bardejov', 'Bardejov', 'Bártfa', 'Prešovský kraj', 'Prešov Region', 'Eperjesi kerület', FALSE, 33000),
('senica', 'Senica', 'Senica', 'Szenice', 'Trnavský kraj', 'Trnava Region', 'Nagyszombati kerület', FALSE, 21000),
('skalica', 'Skalica', 'Skalica', 'Szakolca', 'Trnavský kraj', 'Trnava Region', 'Nagyszombati kerület', FALSE, 15000);

COMMIT;
