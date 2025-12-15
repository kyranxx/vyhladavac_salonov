-- ============================================
-- SALON FINDER SK - Security & Performance Fixes
-- Created: 2025-12-15
-- Fixes Supabase Security Advisor and Performance Advisor warnings
-- ============================================

-- ============================================
-- SECURITY FIX 1: Function Search Path Mutable
-- Set search_path parameter on functions
-- ============================================

-- Drop and recreate update_salon_search_vector with fixed search_path
CREATE OR REPLACE FUNCTION public.update_salon_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.description_sk, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.address, '')), 'C');
  RETURN NEW;
END;
$$;

-- Drop and recreate update_updated_at_column with fixed search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================
-- PERFORMANCE FIX 1: Auth RLS Initialization Plan
-- Use (SELECT auth.uid()) instead of auth.uid() to cache the value
-- ============================================

-- ============================================
-- DROP ALL EXISTING POLICIES
-- ============================================

-- Drop profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Drop categories policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;

-- Drop districts policies
DROP POLICY IF EXISTS "Districts are viewable by everyone" ON public.districts;

-- Drop salons policies
DROP POLICY IF EXISTS "Approved salons are viewable by everyone" ON public.salons;
DROP POLICY IF EXISTS "Salon owners can view own salons" ON public.salons;
DROP POLICY IF EXISTS "Authenticated users can create salons" ON public.salons;
DROP POLICY IF EXISTS "Salon owners can update own salons" ON public.salons;
DROP POLICY IF EXISTS "Anyone can view approved salons" ON public.salons;
DROP POLICY IF EXISTS "Users can view their own salons" ON public.salons;
DROP POLICY IF EXISTS "Users can insert their own salons" ON public.salons;
DROP POLICY IF EXISTS "Users can update their own salons" ON public.salons;

-- Drop salon_categories policies
DROP POLICY IF EXISTS "Salon categories viewable for approved salons" ON public.salon_categories;
DROP POLICY IF EXISTS "Salon owners can manage salon categories" ON public.salon_categories;
DROP POLICY IF EXISTS "Salon owners can delete salon categories" ON public.salon_categories;

-- Drop photos policies
DROP POLICY IF EXISTS "Approved photos viewable for approved salons" ON public.photos;
DROP POLICY IF EXISTS "Salon owners can view own photos" ON public.photos;
DROP POLICY IF EXISTS "Salon owners can add photos" ON public.photos;
DROP POLICY IF EXISTS "Salon owners can delete photos" ON public.photos;
DROP POLICY IF EXISTS "Anyone can view photos of approved salons" ON public.photos;
DROP POLICY IF EXISTS "Users can manage their salon photos" ON public.photos;

-- Drop services policies
DROP POLICY IF EXISTS "Approved services viewable for approved salons" ON public.services;
DROP POLICY IF EXISTS "Salon owners can view own services" ON public.services;
DROP POLICY IF EXISTS "Salon owners can manage services" ON public.services;
DROP POLICY IF EXISTS "Salon owners can update services" ON public.services;
DROP POLICY IF EXISTS "Salon owners can delete services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view services of approved salons" ON public.services;
DROP POLICY IF EXISTS "Users can manage their salon services" ON public.services;

-- Drop subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;

-- Drop change_requests policies
DROP POLICY IF EXISTS "Users can view own change requests" ON public.change_requests;
DROP POLICY IF EXISTS "Users can create change requests" ON public.change_requests;

-- Drop banner_ads policies
DROP POLICY IF EXISTS "Active banner ads are viewable" ON public.banner_ads;

-- Drop analytics_events policies
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics_events;

-- ============================================
-- RECREATE OPTIMIZED POLICIES
-- Using (SELECT auth.uid()) for performance
-- Consolidated to avoid multiple permissive policies
-- ============================================

-- ============================================
-- PROFILES POLICIES (Optimized)
-- ============================================

-- Combined SELECT policy (no multiple permissive for same action)
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================
-- CATEGORIES POLICIES (Optimized)
-- ============================================

CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (is_active = TRUE);

-- ============================================
-- DISTRICTS POLICIES (Optimized)
-- ============================================

CREATE POLICY "districts_select_public"
  ON public.districts FOR SELECT
  USING (is_active = TRUE);

-- ============================================
-- SALONS POLICIES (Optimized & Consolidated)
-- ============================================

-- Consolidated SELECT: approved salons OR owned by current user
CREATE POLICY "salons_select_policy"
  ON public.salons FOR SELECT
  USING (status = 'approved' OR owner_id = (SELECT auth.uid()));

CREATE POLICY "salons_insert_policy"
  ON public.salons FOR INSERT
  WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "salons_update_policy"
  ON public.salons FOR UPDATE
  USING (owner_id = (SELECT auth.uid()));

-- ============================================
-- SALON_CATEGORIES POLICIES (Optimized)
-- ============================================

CREATE POLICY "salon_categories_select_policy"
  ON public.salon_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND (status = 'approved' OR owner_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY "salon_categories_insert_policy"
  ON public.salon_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "salon_categories_delete_policy"
  ON public.salon_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- PHOTOS POLICIES (Optimized & Consolidated)
-- ============================================

-- Consolidated SELECT: approved photos for approved salons OR all photos for salon owner
CREATE POLICY "photos_select_policy"
  ON public.photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND (
        (status = 'approved' AND is_approved = TRUE) OR 
        owner_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "photos_insert_policy"
  ON public.photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "photos_update_policy"
  ON public.photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "photos_delete_policy"
  ON public.photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- SERVICES POLICIES (Optimized & Consolidated)
-- ============================================

-- Consolidated SELECT: approved services for approved salons OR all services for salon owner
CREATE POLICY "services_select_policy"
  ON public.services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND (
        (status = 'approved' AND is_approved = TRUE) OR 
        owner_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "services_insert_policy"
  ON public.services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "services_update_policy"
  ON public.services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "services_delete_policy"
  ON public.services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- SUBSCRIPTIONS POLICIES (Optimized & Consolidated)
-- ============================================

CREATE POLICY "subscriptions_select_policy"
  ON public.subscriptions FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "subscriptions_insert_policy"
  ON public.subscriptions FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "subscriptions_update_policy"
  ON public.subscriptions FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

-- ============================================
-- CHANGE_REQUESTS POLICIES (Optimized)
-- ============================================

CREATE POLICY "change_requests_select_policy"
  ON public.change_requests FOR SELECT
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "change_requests_insert_policy"
  ON public.change_requests FOR INSERT
  WITH CHECK (
    user_id = (SELECT auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.salons 
      WHERE id = salon_id AND owner_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- BANNER_ADS POLICIES (Optimized)
-- ============================================

CREATE POLICY "banner_ads_select_public"
  ON public.banner_ads FOR SELECT
  USING (
    is_active = TRUE AND 
    starts_at <= NOW() AND 
    expires_at > NOW()
  );

-- ============================================
-- ANALYTICS_EVENTS POLICIES (Optimized)
-- ============================================

CREATE POLICY "analytics_insert_public"
  ON public.analytics_events FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- ADMIN POLICIES
-- Admins should be able to access everything
-- ============================================

-- Helper function to check if user is admin (with fixed search_path)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
END;
$$;

-- Admin access policies (with corrected names to avoid duplicates)
CREATE POLICY "admin_salons_all"
  ON public.salons FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_profiles_all"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_photos_all"
  ON public.photos FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_services_all"
  ON public.services FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_subscriptions_all"
  ON public.subscriptions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_change_requests_all"
  ON public.change_requests FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_banner_ads_all"
  ON public.banner_ads FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_categories_all"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_districts_all"
  ON public.districts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_analytics_all"
  ON public.analytics_events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_salon_categories_all"
  ON public.salon_categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- DONE! Security and Performance fixes applied.
-- ============================================

-- NOTE: For "Leaked Password Protection Disabled" warning:
-- This must be enabled in Supabase Dashboard:
-- 1. Go to Authentication > Providers > Email
-- 2. Enable "Leaked Password Protection" toggle
-- This cannot be done via SQL.
