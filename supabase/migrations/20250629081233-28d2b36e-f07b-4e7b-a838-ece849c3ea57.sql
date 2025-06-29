
-- Mettre à jour le bucket uploads avec une limite de taille plus élevée
UPDATE storage.buckets 
SET file_size_limit = 23068672 -- 22MB en bytes
WHERE id = 'uploads';

-- Si le bucket n'existe pas, le créer
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads', 
  'uploads', 
  true, 
  23068672, -- 22MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 23068672,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];

-- Supprimer les anciennes politiques restrictives s'il y en a
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;

-- Créer des politiques plus permissives pour l'upload public
CREATE POLICY "Anyone can upload to uploads bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anyone can view uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Anyone can update uploads" ON storage.objects
  FOR UPDATE USING (bucket_id = 'uploads');

CREATE POLICY "Anyone can delete uploads" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads');
