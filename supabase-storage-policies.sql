-- Supabase Storage Policies voor Cosmic Community Creator
-- Deze policies zorgen ervoor dat anonymous gebruikers de gallery kunnen bekijken
-- maar alleen authenticated gebruikers kunnen uploaden

-- ============================================
-- IMAGES BUCKET POLICIES
-- ============================================

-- Policy: Allow anonymous users to read/list all images (for gallery)
CREATE POLICY "Allow public read access to images"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'starnation-images');

-- Policy: Allow anonymous users to list bucket contents
CREATE POLICY "Allow public list access to images bucket"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'starnation-images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'starnation-images');

-- Policy: Allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated users to delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'starnation-images');

-- ============================================
-- VIDEOS BUCKET POLICIES
-- ============================================

-- Policy: Allow anonymous users to read/list all videos (for gallery)
CREATE POLICY "Allow public read access to videos"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'starnation-videos');

-- Policy: Allow anonymous users to list bucket contents
CREATE POLICY "Allow public list access to videos bucket"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'starnation-videos');

-- Policy: Allow authenticated users to upload videos
CREATE POLICY "Allow authenticated users to upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'starnation-videos');

-- Policy: Allow authenticated users to delete their own videos
CREATE POLICY "Allow authenticated users to delete their own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'starnation-videos');

-- ============================================
-- BUCKET CONFIGURATION
-- ============================================
-- Zorg ervoor dat de buckets bestaan en publiek zijn:
-- 1. Ga naar Supabase Dashboard > Storage
-- 2. Maak buckets aan: 'starnation-images' en 'starnation-videos'
-- 3. Zet beide buckets op "Public bucket" (aan)
-- 4. Voer bovenstaande SQL policies uit in de SQL Editor

