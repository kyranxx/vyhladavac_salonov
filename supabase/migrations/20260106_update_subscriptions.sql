-- =========================================================
-- Update subscriptions table to match webhook handler
-- Run this in Supabase SQL Editor
-- =========================================================

-- Add missing columns to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'premium',
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_until TIMESTAMP WITH TIME ZONE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Update salons table for featured/verified tracking
ALTER TABLE salons 
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_until TIMESTAMP WITH TIME ZONE;

-- =========================================================
-- Admin bypass RLS for subscriptions management
-- =========================================================

-- Allow service role to manage all subscriptions (for webhooks)
CREATE POLICY IF NOT EXISTS "Service role can manage all subscriptions" ON subscriptions
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
    
-- =========================================================
-- DONE!
-- =========================================================
