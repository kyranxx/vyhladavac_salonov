-- =========================================================
-- SECURITY HARDENING - Enhanced RLS Policies
-- Run this in Supabase SQL Editor
-- =========================================================

-- 1. ADMIN POLICIES
-- =========================================================
-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN user_email IN (
        'admin@salonfinder.sk',
        'admin@apollotech.sk',
        'blanarikdaniel@gmail.com'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policy for viewing all salons (including pending)
DROP POLICY IF EXISTS "Admins can view all salons" ON salons;
CREATE POLICY "Admins can view all salons" ON salons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND is_admin(auth.users.email)
        )
    );

-- Admin policy for updating all salons (approval workflow)
DROP POLICY IF EXISTS "Admins can update all salons" ON salons;
CREATE POLICY "Admins can update all salons" ON salons
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND is_admin(auth.users.email)
        )
    );

-- Admin policy for profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND is_admin(auth.users.email)
        )
    );

-- 2. SUBSCRIPTION MANAGEMENT
-- =========================================================
-- Allow users to view their own subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM salons WHERE salons.id = salon_id AND salons.owner_id = auth.uid())
    );

-- Admins can view all subscriptions
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND is_admin(auth.users.email)
        )
    );

-- 3. REVIEWS SECURITY
-- =========================================================
-- Users can only update their own reviews
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own reviews
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage all reviews (approve/reject)
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
CREATE POLICY "Admins can manage all reviews" ON reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND is_admin(auth.users.email)
        )
    );

-- 4. PHOTO UPLOAD LIMITS (via function)
-- =========================================================
CREATE OR REPLACE FUNCTION check_photo_limit()
RETURNS TRIGGER AS $$
DECLARE
    photo_count INTEGER;
    salon_tier TEXT;
BEGIN
    -- Get salon tier
    SELECT tier INTO salon_tier FROM salons WHERE id = NEW.salon_id;
    
    -- Count existing photos
    SELECT COUNT(*) INTO photo_count FROM salon_photos WHERE salon_id = NEW.salon_id;
    
    -- Free tier: max 1 photo
    IF salon_tier = 'free' AND photo_count >= 1 THEN
        RAISE EXCEPTION 'Free tier salons can only have 1 photo. Upgrade to Premium for unlimited photos.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_photo_limit ON salon_photos;
CREATE TRIGGER enforce_photo_limit
    BEFORE INSERT ON salon_photos
    FOR EACH ROW
    EXECUTE FUNCTION check_photo_limit();

-- 5. AUDIT LOGGING TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- =========================================================
-- SECURITY HARDENING COMPLETE!
-- =========================================================
