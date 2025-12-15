-- ============================================
-- SALON FINDER SK - Add Missing Foreign Key Indexes
-- Created: 2025-12-15
-- 
-- Adds indexes for foreign keys that were missing,
-- which improves JOIN and DELETE performance.
-- ============================================

-- analytics_events.banner_id
CREATE INDEX IF NOT EXISTS idx_analytics_events_banner_id 
  ON public.analytics_events(banner_id);

-- change_requests.reviewed_by
CREATE INDEX IF NOT EXISTS idx_change_requests_reviewed_by 
  ON public.change_requests(reviewed_by);

-- change_requests.user_id
CREATE INDEX IF NOT EXISTS idx_change_requests_user_id 
  ON public.change_requests(user_id);

-- salon_categories.category_id
CREATE INDEX IF NOT EXISTS idx_salon_categories_category_id 
  ON public.salon_categories(category_id);

-- salons.owner_id
CREATE INDEX IF NOT EXISTS idx_salons_owner_id 
  ON public.salons(owner_id);

-- subscriptions.user_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
  ON public.subscriptions(user_id);

-- ============================================
-- NOTE: About "Unused Index" warnings
-- ============================================
-- The following indexes are flagged as "unused" but should be KEPT:
-- - idx_salons_search (full-text search)
-- - idx_salons_district (filter by city)
-- - idx_salons_featured (featured salon queries)
-- - idx_photos_salon (get photos for a salon)
-- - idx_services_salon (get services for a salon)
-- - idx_subscriptions_salon (get subscriptions for a salon)
-- - idx_subscriptions_status (filter by status)
-- - idx_subscriptions_expires (find expiring subscriptions)
-- - idx_change_requests_status (filter by status)
-- - idx_change_requests_salon (get requests for a salon)
-- - idx_banner_ads_placement (filter ads by placement)
-- - idx_analytics_created (time-based analytics queries)
-- - idx_analytics_salon (get analytics for a salon)
--
-- These are unused because the app is new with minimal traffic.
-- They WILL be needed for good performance in production!
-- ============================================
