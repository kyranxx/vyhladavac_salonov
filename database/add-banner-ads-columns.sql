-- Run this in your Supabase SQL Editor to add the missing 'status' column to banner_ads

-- Add status column if it doesn't exist
ALTER TABLE banner_ads
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired'));

-- Add impressions column if it doesn't exist
ALTER TABLE banner_ads
ADD COLUMN IF NOT EXISTS impressions INT DEFAULT 0;

-- Add clicks column if it doesn't exist
ALTER TABLE banner_ads
ADD COLUMN IF NOT EXISTS clicks INT DEFAULT 0;
