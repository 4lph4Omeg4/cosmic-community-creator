# Supabase Storage Setup Instructions

Om Supabase Storage te laten werken, moet je de Row Level Security (RLS) policies instellen voor beide buckets.

## Stappen:

1. **Ga naar je Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecteer je project**: `wdclgadjetxhcududipz`
3. **Ga naar Storage** in het linker menu
4. **Voor elke bucket** (`starnation-images` en `starnation-videos`):

   a. Klik op de bucket naam
   b. Ga naar "Policies" tab
   c. Klik op "New Policy"
   d. Selecteer "Create policy from scratch"
   e. Geef het een naam (bijv. "Allow public uploads")
   f. Voor "Allowed operations", selecteer: `INSERT`, `SELECT`, `UPDATE`, `DELETE`
   g. Voor "Policy definition", gebruik:
      ```sql
      true
      ```
   h. Klik "Review" en dan "Save policy"

   **OF** gebruik deze SQL in de SQL Editor:

   ```sql
   -- Voor starnation-images bucket
   CREATE POLICY "Allow public uploads to starnation-images"
   ON storage.objects FOR INSERT
   TO public
   WITH CHECK (bucket_id = 'starnation-images');

   CREATE POLICY "Allow public reads from starnation-images"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'starnation-images');

   CREATE POLICY "Allow public updates to starnation-images"
   ON storage.objects FOR UPDATE
   TO public
   USING (bucket_id = 'starnation-images');

   CREATE POLICY "Allow public deletes from starnation-images"
   ON storage.objects FOR DELETE
   TO public
   USING (bucket_id = 'starnation-images');

   -- Voor starnation-videos bucket
   CREATE POLICY "Allow public uploads to starnation-videos"
   ON storage.objects FOR INSERT
   TO public
   WITH CHECK (bucket_id = 'starnation-videos');

   CREATE POLICY "Allow public reads from starnation-videos"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'starnation-videos');

   CREATE POLICY "Allow public updates to starnation-videos"
   ON storage.objects FOR UPDATE
   TO public
   USING (bucket_id = 'starnation-videos');

   CREATE POLICY "Allow public deletes from starnation-videos"
   ON storage.objects FOR DELETE
   TO public
   USING (bucket_id = 'starnation-videos');
   ```

5. **Zorg dat de buckets "Public" zijn**:
   - Ga naar Storage > [bucket name] > Settings
   - Zet "Public bucket" aan

## Alternatief: Service Role Key (Niet aanbevolen voor client-side)

Als je toch authenticatie wilt gebruiken, moet je de Service Role Key gebruiken in plaats van de Anon Key, maar dit is **NIET VEILIG** voor client-side code omdat het alle rechten heeft.

