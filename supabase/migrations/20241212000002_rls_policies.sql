-- ============================================
-- SALON FINDER SK - Row Level Security Policies
-- Created: 2025-12-12
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow insert during registration
CREATE POLICY "Enable insert for authenticated users only"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- CATEGORIES POLICIES (Public read)
-- ============================================

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (is_active = TRUE);

-- ============================================
-- DISTRICTS POLICIES (Public read)
-- ============================================

CREATE POLICY "Districts are viewable by everyone"
  ON public.districts FOR SELECT
  USING (is_active = TRUE);

-- ============================================
-- SALONS POLICIES
-- ============================================

-- Anyone can view approved salons
CREATE POLICY "Approved salons are viewable by everyone"
  ON public.salons FOR SELECT
  USING (status = 'approved');

-- Salon owners can view their own salons (any status)
CREATE POLICY "Salon owners can view own salons"
  ON public.salons FOR SELECT
  USING (auth.uid() = owner_id);

-- Authenticated users can create salons
CREATE POLICY "Authenticated users can create salons"
  ON public.salons FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Salon owners can update their own salons
CREATE POLICY "Salon owners can update own salons"
  ON public.salons FOR UPDATE
  USING (auth.uid() = owner_id);

-- ============================================
-- SALON_CATEGORIES POLICIES
-- ============================================

-- Anyone can view salon categories for approved salons
CREATE POLICY "Salon categories viewable for approved salons"
  ON public.salon_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND (status = 'approved' OR owner_id = auth.uid())
    )
  );

-- Salon owners can manage their salon categories
CREATE POLICY "Salon owners can manage salon categories"
  ON public.salon_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Salon owners can delete salon categories"
  ON public.salon_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- PHOTOS POLICIES
-- ============================================

-- Anyone can view approved photos for approved salons
CREATE POLICY "Approved photos viewable for approved salons"
  ON public.photos FOR SELECT
  USING (
    is_approved = TRUE AND 
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND status = 'approved'
    )
  );

-- Salon owners can view all their photos
CREATE POLICY "Salon owners can view own photos"
  ON public.photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

-- Salon owners can add photos
CREATE POLICY "Salon owners can add photos"
  ON public.photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

-- Salon owners can delete their photos
CREATE POLICY "Salon owners can delete photos"
  ON public.photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- SERVICES POLICIES
-- ============================================

-- Anyone can view approved services for approved salons
CREATE POLICY "Approved services viewable for approved salons"
  ON public.services FOR SELECT
  USING (
    is_approved = TRUE AND 
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND status = 'approved'
    )
  );

-- Salon owners can view all their services
CREATE POLICY "Salon owners can view own services"
  ON public.services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

-- Salon owners can manage services
CREATE POLICY "Salon owners can manage services"
  ON public.services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Salon owners can update services"
  ON public.services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Salon owners can delete services"
  ON public.services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- ============================================
-- CHANGE_REQUESTS POLICIES
-- ============================================

-- Users can view their own change requests
CREATE POLICY "Users can view own change requests"
  ON public.change_requests FOR SELECT
  USING (user_id = auth.uid());

-- Users can create change requests for their salons
CREATE POLICY "Users can create change requests"
  ON public.change_requests FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- BANNER_ADS POLICIES
-- ============================================

-- Anyone can view active banner ads
CREATE POLICY "Active banner ads are viewable"
  ON public.banner_ads FOR SELECT
  USING (
    is_active = TRUE AND 
    starts_at <= NOW() AND 
    expires_at > NOW()
  );

-- ============================================
-- ANALYTICS_EVENTS POLICIES
-- ============================================

-- Anyone can insert analytics events
CREATE POLICY "Anyone can insert analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (TRUE);

-- Only admins can view analytics (handled at application level)
-- No SELECT policy for regular users

COMMIT;
