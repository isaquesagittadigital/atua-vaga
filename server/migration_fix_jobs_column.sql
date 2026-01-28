-- Fix: Add missing requirements column
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS requirements TEXT[];
