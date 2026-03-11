-- Migration: Add campaigns table with RLS
-- Run this in your Supabase SQL Editor

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'deployed', 'paused', 'completed')),
    budget_allocated DECIMAL(10,2) DEFAULT 0,
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own campaigns
CREATE POLICY "Users can view own campaigns" ON public.campaigns
    FOR SELECT USING (auth.uid() = owner_id);

-- Policy: Users can create their own campaigns
CREATE POLICY "Users can create campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update their own campaigns
CREATE POLICY "Users can update own campaigns" ON public.campaigns
    FOR UPDATE USING (auth.uid() = owner_id);

-- Policy: Users can delete their own campaigns
CREATE POLICY "Users can delete own campaigns" ON public.campaigns
    FOR DELETE USING (auth.uid() = owner_id);

-- Policy: Anyone can view campaigns with status 'deployed' (public campaigns)
CREATE POLICY "Anyone can view deployed campaigns" ON public.campaigns
    FOR SELECT USING (status = 'deployed');
