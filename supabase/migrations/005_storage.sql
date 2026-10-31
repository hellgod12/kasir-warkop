-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to product images
CREATE POLICY "Public Access Product Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload Product Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated Delete Product Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
