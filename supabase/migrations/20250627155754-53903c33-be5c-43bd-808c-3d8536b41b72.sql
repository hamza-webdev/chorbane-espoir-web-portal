
-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads', 
  'uploads', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create RLS policies for the uploads bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
