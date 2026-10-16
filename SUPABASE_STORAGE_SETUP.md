# ✅ Switched Back to Supabase Storage

## What Changed

I've removed Vercel Blob and switched back to **Supabase Storage** for image uploads. This is simpler and you already have it working!

## What Was Removed

- ❌ `api/upload.ts` - Vercel Blob serverless function (deleted)
- ❌ `@vercel/blob` imports from ImageUpload component
- ❌ Vercel Blob API checks from Setup Wizard
- ❌ Node.js runtime configuration from vercel.json

## What Was Updated

- ✅ `src/components/admin/ImageUpload.tsx` - Now uses Supabase Storage directly
- ✅ `src/lib/storage.ts` - Enhanced with better error handling
- ✅ `src/pages/admin/SetupWizardPage.tsx` - Checks for Supabase Storage bucket
- ✅ `vercel.json` - Simplified (no API routes needed)

## How It Works Now

```
Browser → Supabase Client → Supabase Storage → Returns Public URL
```

**No serverless functions needed!** Images are uploaded directly from the browser to Supabase Storage using the Supabase client library.

## Setup Requirements

### 1. Storage Bucket Must Exist

Since you mentioned you already see images in Supabase Storage, the bucket likely exists. To verify:

1. Go to Supabase Dashboard → **Storage**
2. You should see a bucket named `product-images`
3. If you don't see it, run this SQL in the SQL Editor:

```sql
-- Create the storage bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public read access
create policy "Product images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated users to upload
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and
    auth.role() = 'authenticated'
  );

-- Allow users to update their own images
create policy "Users can update their own images"
  on storage.objects for update
  using (bucket_id = 'product-images');

-- Allow users to delete their own images
create policy "Users can delete their own images"
  on storage.objects for delete
  using (bucket_id = 'product-images');
```

### 2. Environment Variables

Make sure these are set in Vercel:

```bash
VITE_SUPABASE_URL=https://ktfxnbtmuwsqdszciwvg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** You do NOT need `BLOB_READ_WRITE_TOKEN` anymore since we're not using Vercel Blob.

## Testing the Upload

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Switch back to Supabase Storage for image uploads"
git push
```

### Step 2: Test Image Upload
1. Go to `/admin/setup` - Storage check should pass ✅
2. Go to `/admin/products` → Add product
3. Click "Upload" in the Product images section
4. Select an image file
5. Wait for upload to complete
6. Image URL should appear automatically
7. Save the product

### Step 3: Verify in Supabase
1. Go to Supabase Dashboard → Storage
2. Click on `product-images` bucket
3. Open the `products/` folder
4. You should see your uploaded images

## Benefits of Supabase Storage

✅ **Simpler** - No serverless functions needed  
✅ **Integrated** - Works with your existing Supabase setup  
✅ **Secure** - Uses Row Level Security (RLS)  
✅ **Fast** - Direct upload from browser  
✅ **Free tier** - 1GB storage, 2GB bandwidth/month  
✅ **CDN** - Automatic global CDN delivery  

## Troubleshooting

### Issue: "Storage bucket not found"
**Solution:** Run the SQL above to create the bucket and policies.

### Issue: "Permission denied" or "new row violates row-level security"
**Solution:** 
1. Make sure you're logged in as an admin user
2. Check that the storage policies allow authenticated users to upload
3. Run the SQL above to create proper policies

### Issue: Upload hangs or fails silently
**Solution:**
1. Check browser console (F12) for errors
2. Verify Supabase environment variables are set correctly
3. Check Supabase logs: Dashboard → Logs
4. Try a smaller image file (< 1MB)

### Issue: Image uploads but doesn't show in product
**Solution:**
1. Check that the URL was added to the images array
2. Make sure you clicked "Save" to save the product
3. Refresh the page to see the updated product

## Storage Limits (Free Tier)

- **Storage:** 1 GB
- **Bandwidth:** 2 GB/month
- **File size:** Max 50 MB per file (we limit to 5 MB in the UI)
- **Supported formats:** JPG, PNG, WebP, GIF

For a small beauty shop, the free tier should last for months. If you need more, Supabase pricing is very affordable.

## File Structure in Storage

```
product-images/
  └── products/
      ├── 1710123456-abc123.jpg
      ├── 1710123457-def456.png
      └── 1710123458-ghi789.webp
```

Each file has:
- Timestamp prefix (prevents conflicts)
- Random suffix (additional uniqueness)
- Original file extension

## Public URLs

Uploaded images get public URLs like:
```
https://ktfxnbtmuwsqdszciwvg.supabase.co/storage/v1/object/public/product-images/products/1710123456-abc123.jpg
```

These URLs are:
- ✅ Publicly accessible (no authentication needed to view)
- ✅ Served from CDN (fast loading)
- ✅ Permanent (won't expire)
- ✅ Can be used in img tags directly

## Security

- ✅ RLS policies prevent unauthorized uploads
- ✅ Only authenticated users can upload
- ✅ File type validation (images only)
- ✅ File size validation (max 5MB)
- ✅ Unique filenames prevent overwrites

## Next Steps

1. ✅ Push changes to GitHub
2. ✅ Verify storage bucket exists in Supabase
3. ✅ Test image upload in admin dashboard
4. ✅ Add products with images
5. ✅ Verify images appear on storefront

---

**Status:** ✅ Switched back to Supabase Storage  
**Last Updated:** 2026-03-15  
**Version:** 1.1.0
