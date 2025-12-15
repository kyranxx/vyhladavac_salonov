-- ============================================
-- SALON FINDER SK - Remove Admin RLS Policies
-- Created: 2025-12-15
-- 
-- Removes the admin_*_all policies that cause 
-- "multiple permissive policies" warnings.
-- Admin access should use the service role key
-- which bypasses RLS entirely.
-- ============================================

-- Drop admin policies from all tables
DROP POLICY IF EXISTS "admin_salons_all" ON public.salons;
DROP POLICY IF EXISTS "admin_profiles_all" ON public.profiles;
DROP POLICY IF EXISTS "admin_photos_all" ON public.photos;
DROP POLICY IF EXISTS "admin_services_all" ON public.services;
DROP POLICY IF EXISTS "admin_subscriptions_all" ON public.subscriptions;
DROP POLICY IF EXISTS "admin_change_requests_all" ON public.change_requests;
DROP POLICY IF EXISTS "admin_banner_ads_all" ON public.banner_ads;
DROP POLICY IF EXISTS "admin_categories_all" ON public.categories;
DROP POLICY IF EXISTS "admin_districts_all" ON public.districts;
DROP POLICY IF EXISTS "admin_analytics_all" ON public.analytics_events;
DROP POLICY IF EXISTS "admin_salon_categories_all" ON public.salon_categories;

-- Drop the is_admin function (no longer needed)
DROP FUNCTION IF EXISTS public.is_admin();

-- ============================================
-- NOTE: For admin access in your application:
-- Use the SUPABASE_SERVICE_ROLE_KEY instead of 
-- the anon key. This bypasses all RLS policies.
-- ============================================
