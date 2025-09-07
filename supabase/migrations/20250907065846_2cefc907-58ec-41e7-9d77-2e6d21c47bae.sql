-- Create storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('cv-uploads', 'cv-uploads', false);

-- Create policies for CV uploads
CREATE POLICY "Users can upload their own CVs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own CVs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own CVs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update user_profiles table to store additional profile data
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS education_level TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS experiences JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS objectives TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS cv_url TEXT;