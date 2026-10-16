# 🔧 Complete Troubleshooting Guide

## 🎯 Quick Diagnostic

**Visit this page first:** `your-domain.com/admin/diagnostic`

This page will automatically check:
- ✅ Environment variables
- ✅ Supabase connection
- ✅ Database tables
- ✅ Storage bucket
- ✅ Authentication

It will tell you exactly what's wrong and how to fix it.

---

## 🚨 Most Common Issues

### Issue #1: 404 Error on Admin Pages

**Symptom:** You click on Products, Orders, etc. and get "404 Not Found"

**Cause:** Vercel doesn't know how to handle client-side routing

**Solution:**
1. Make sure `vercel.json` exists in your project root
2. It should contain:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
3. Push to GitHub
4. Vercel will auto-deploy

---

### Issue #2: Environment Variables Not Working

**Symptom:** Diagnostic page shows "Missing: VITE_SUPABASE_URL" or "Missing: VITE_SUPABASE_ANON_KEY"

**Cause:** Wrong variable names or not redeployed

**Solution:**

1. **Check variable names in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - You MUST have these EXACT names (case-sensitive):
     ```
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     ```
   
2. **Common mistake:** Using Next.js naming
   - ❌ `NEXT_PUBLIC_SUPABASE_URL` (wrong)
   - ❌ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (wrong)
   - ✅ `VITE_SUPABASE_URL` (correct)
   - ✅ `VITE_SUPABASE_ANON_KEY` (correct)

3. **Check values:**
   - `VITE_SUPABASE_URL` = `https://ktfxnbtmuwsqdszciwvg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (the full JWT token)

4. **Redeploy:**
   - After adding/changing environment variables, you MUST redeploy
   - Go to Deployments → Latest deployment → ⋮ → Redeploy

---

### Issue #3: Products Not Saving

**Symptom:** You click "Add product" but nothing happens or you get an error

**Possible Causes & Solutions:**

#### A. Database tables don't exist
**Check:** Diagnostic page shows "Products table: relation does not exist"

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase-schema-clean.sql`
3. Wait for "Success" message

#### B. User is not admin
**Check:** Diagnostic page shows "Logged in but not admin"

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL (replace with your email):
   ```sql
   update public.profiles set role = 'admin' where email = 'your-email@example.com';
   ```

#### C. RLS policy blocking
**Check:** Browser console shows "new row violates row-level security policy"

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:
   ```sql
   -- Allow admins to insert products
   drop policy if exists "Admins can insert products" on public.products;
   create policy "Admins can insert products"
   on public.products for insert
   with check (
     exists (
       select 1 from public.profiles
       where id = auth.uid() and role = 'admin'
     )
   );
   ```

#### D. Wrong environment variables
**Check:** Diagnostic page shows missing env vars

**Fix:** See Issue #2 above

---

### Issue #4: Can't Upload Images

**Symptom:** Click "Upload" but nothing happens or get error

**Possible Causes & Solutions:**

#### A. Storage bucket doesn't exist
**Check:** Diagnostic page shows "Storage bucket not found"

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase-schema-clean.sql` (includes storage bucket creation)

#### B. Storage policies missing
**Check:** Browser console shows "new row violates row-level security policy"

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:
   ```sql
   -- Allow admins to upload images
   drop policy if exists "Admins can upload product images" on storage.objects;
   create policy "Admins can upload product images"
   on storage.objects for insert
   with check (
     bucket_id = 'product-images' and
     exists (
       select 1 from public.profiles
       where id = auth.uid() and role = 'admin'
     )
   );
   ```

#### C. File too large
**Check:** Error message says "File too large"

**Fix:** Max file size is 5MB. Compress your images first.

---

### Issue #5: Can't Login

**Symptom:** Login page shows "Invalid login credentials"

**Possible Causes & Solutions:**

#### A. User doesn't exist
**Fix:**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Check "Auto Confirm User"
5. Click "Create user"

#### B. User not confirmed
**Fix:**
1. Go to Authentication → Users
2. Find your user
3. Click ⋮ → "Send magic link" OR manually confirm

#### C. Wrong password
**Fix:**
1. Go to Authentication → Users
2. Find your user
3. Click ⋮ → "Reset password"

---

## 📋 Complete Checklist

Run through this checklist to ensure everything is set up correctly:

### 1. Supabase Setup
- [ ] Ran `supabase-schema-clean.sql` in SQL Editor
- [ ] Checked Table Editor - all 10 tables exist
- [ ] Checked Storage - `product-images` bucket exists
- [ ] Created user in Authentication → Users
- [ ] Set user role to 'admin' with SQL command

### 2. Vercel Setup
- [ ] Added `VITE_SUPABASE_URL` environment variable
- [ ] Added `VITE_SUPABASE_ANON_KEY` environment variable
- [ ] Variable names start with `VITE_` (not `NEXT_PUBLIC_`)
- [ ] Redeployed after adding environment variables
- [ ] `vercel.json` file exists in project root

### 3. Testing
- [ ] Visited `/admin/diagnostic` - all checks pass
- [ ] Logged in to `/admin/login`
- [ ] Added a product successfully
- [ ] Product appears on homepage
- [ ] Uploaded an image successfully

---

## 🔍 How to Debug

### Step 1: Check Browser Console
1. Open your site
2. Press F12 (or right-click → Inspect)
3. Click "Console" tab
4. Look for red error messages
5. Screenshot them and share

### Step 2: Check Network Tab
1. Press F12 → Network tab
2. Try to add a product
3. Look for failed requests (red)
4. Click on them to see the error details

### Step 3: Check Supabase Logs
1. Go to Supabase Dashboard → Logs
2. Check "API" logs for database errors
3. Check "Auth" logs for login errors

### Step 4: Use Diagnostic Page
1. Visit `your-domain.com/admin/diagnostic`
2. It will show exactly what's wrong
3. Follow the fix instructions

---

## 💡 Pro Tips

### Tip 1: Test Locally First
Before deploying to Vercel, test locally:
```bash
npm run dev
```
Visit `http://localhost:5173/admin/diagnostic`

### Tip 2: Check Environment Variables
In Vercel, you can preview environment variables:
- Settings → Environment Variables
- Click "Reveal" to see values
- Make sure they're correct

### Tip 3: Clear Browser Cache
Sometimes old code is cached:
- Press Ctrl+Shift+R (hard refresh)
- Or clear browser cache completely

### Tip 4: Check Deployment Logs
In Vercel:
- Deployments → Latest deployment → Click on it
- Check "Build Logs" for errors
- Check "Function Logs" for runtime errors

---

## 🆘 Still Not Working?

If you've tried everything and it's still not working:

1. **Run the diagnostic page** and screenshot the results
2. **Check browser console** (F12) and screenshot any errors
3. **Check Supabase logs** and screenshot relevant errors
4. **Verify all checklist items** are complete

Common mistakes:
- ❌ Using `NEXT_PUBLIC_` instead of `VITE_`
- ❌ Not redeploying after adding env vars
- ❌ Missing `vercel.json` file
- ❌ SQL schema not run
- ❌ User not set to admin role
- ❌ Storage bucket not created

---

## 📞 Quick Reference

### Important URLs
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg
- **SQL Editor:** https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new
- **Table Editor:** https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/editor
- **Authentication:** https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/auth/users
- **Storage:** https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/storage
- **Logs:** https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/logs

### Important Files
- `supabase-schema-clean.sql` - Database setup
- `vercel.json` - Vercel routing config
- `.env.local` - Local environment variables (for development)
- `src/lib/supabase.ts` - Supabase client
- `src/lib/api.ts` - Database operations

### Important Commands
```bash
# Run locally
npm run dev

# Build for production
npm run build

# Deploy (automatic via GitHub)
git push
```

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Diagnostic page shows all green checks
- ✅ You can login to admin dashboard
- ✅ You can add/edit/delete products
- ✅ Products appear on homepage
- ✅ You can upload images
- ✅ Orders save correctly
- ✅ No 404 errors on navigation

---

**Start with the diagnostic page: `/admin/diagnostic`** 🎯
