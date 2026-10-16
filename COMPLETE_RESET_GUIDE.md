# 🔄 Complete Reset Guide

Follow these steps EXACTLY in order. This will fix everything.

---

## ⚠️ WARNING: This will delete ALL data

This reset will:
- ❌ Delete all products
- ❌ Delete all orders
- ❌ Delete all categories
- ❌ Delete all banners
- ❌ Delete all users (except your Supabase auth account)

**Only proceed if you want a completely fresh start.**

---

## 📋 Step-by-Step Instructions

### Step 1: Reset the Database

1. **Go to Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new
   ```

2. **Open the file `reset-database.sql`** in this project

3. **Copy ALL the content** (Ctrl+A, Ctrl+C)

4. **Paste into SQL Editor** (Ctrl+V)

5. **Click "Run"** (or press Ctrl+Enter)

6. **Wait for "Success"** message (should take 5-10 seconds)

✅ **Database is now completely reset!**

---

### Step 2: Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
   ```
   https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/table
   ```

2. You should see these 10 tables:
   - ✅ profiles
   - ✅ categories
   - ✅ sections
   - ✅ products
   - ✅ product_images
   - ✅ product_sections
   - ✅ orders
   - ✅ order_items
   - ✅ banners
   - ✅ store_settings

**If you see all 10 tables → Continue to Step 3**

**If tables are missing → Go back to Step 1 and try again**

---

### Step 3: Verify Storage Bucket

1. Go to **Storage** in the left sidebar
   ```
   https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/storage
   ```

2. You should see:
   - ✅ `product-images` bucket

**If you see it → Continue to Step 4**

**If it's missing → Go back to Step 1 and run the SQL again**

---

### Step 4: Create Your Admin User

1. Go to **Authentication** → **Users**
   ```
   https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/auth/users
   ```

2. Click **"Add user"** → **"Create new user"**

3. Fill in:
   - **Email:** your-email@example.com (use your real email)
   - **Password:** create a strong password (save it!)
   - ✓ Check **"Auto Confirm User"**

4. Click **"Create user"**

✅ **User created!**

---

### Step 5: Make Yourself Admin

1. Go back to **SQL Editor**
   ```
   https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new
   ```

2. **Run this SQL** (replace with YOUR email):
   ```sql
   update public.profiles 
   set role = 'admin' 
   where email = 'your-email@example.com';
   ```

3. Click **"Run"**

4. You should see: **"Success. No rows returned"**

✅ **You're now an admin!**

---

### Step 6: Verify You're Admin

1. Go to **Table Editor** → **profiles** table
   ```
   https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/editor
   ```

2. Find your email in the list

3. Check the **role** column - it should say **"admin"**

**If it says "admin" → Continue to Step 7**

**If it says "customer" → Go back to Step 5**

---

### Step 7: Push Code to GitHub

Make sure you have the latest code:

```bash
git add .
git commit -m "Complete database reset and fixes"
git push
```

Vercel will auto-deploy.

---

### Step 8: Test the Connection

1. Visit the test page:
   ```
   https://your-domain.com/admin/test
   ```

2. Click **"Run Connection Test"**

3. You should see:
   - ✅ VITE_SUPABASE_URL: SET
   - ✅ VITE_SUPABASE_ANON_KEY: SET
   - ✅ Connected to Supabase successfully!
   - ✅ Products table exists!
   - ✅ Storage bucket "product-images" exists

4. **Test your login:**
   - Enter your admin email and password
   - Click "Test Login"
   - You should see: ✅ Login successful! ✅ User has admin role

**If all tests pass → Continue to Step 9**

**If any test fails → Check the error message and follow the suggested fix**

---

### Step 9: Test Adding a Product

1. Go to admin dashboard:
   ```
   https://your-domain.com/admin
   ```

2. Click **"Products"** → **"Add product"**

3. Fill in:
   - **Title:** Test Product
   - **Price:** 999
   - **Category:** Skincare
   - **Stock:** 10
   - **Description:** This is a test
   - **Upload an image** (or paste a URL)
   - **Check "Best deals"** section

4. Click **"Add product"**

5. You should see:
   - ✅ Loading spinner
   - ✅ Success message: "Product added successfully!"
   - ✅ Product appears in the list

6. Go to homepage:
   ```
   https://your-domain.com/
   ```

7. Your test product should appear in the **"Best deals"** section

✅ **Everything is working!**

---

## 🆘 Troubleshooting

### Problem: Test page doesn't load

**Solution:**
1. Make sure you pushed the latest code to GitHub
2. Wait for Vercel to finish deploying
3. Hard refresh the page (Ctrl+Shift+R)
4. Try again

### Problem: "Environment variables not set"

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Make sure you have:
   - `VITE_SUPABASE_URL` = `https://ktfxnbtmuwsqdszciwvg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **Important:** Names must start with `VITE_` (not `NEXT_PUBLIC_`)
4. Redeploy your site

### Problem: "Products table error: relation does not exist"

**Solution:**
1. Go to Supabase → SQL Editor
2. Run `reset-database.sql` again
3. Wait for success message
4. Try again

### Problem: "Insert failed: new row violates row-level security"

**Solution:**
1. Go to Supabase → SQL Editor
2. Run this SQL (replace with your email):
   ```sql
   update public.profiles set role = 'admin' where email = 'your-email@example.com';
   ```
3. Try again

### Problem: "Login failed: Invalid login credentials"

**Solution:**
1. Go to Supabase → Authentication → Users
2. Make sure your user exists
3. Try resetting your password:
   - Click ⋮ next to your user
   - Click "Send magic link"
   - Check your email

---

## ✅ Success Checklist

You'll know everything is working when:

- [ ] Database reset completed successfully
- [ ] All 10 tables exist in Table Editor
- [ ] Storage bucket "product-images" exists
- [ ] Admin user created in Authentication
- [ ] User role is "admin" in profiles table
- [ ] Code pushed to GitHub
- [ ] Vercel deployed successfully
- [ ] Test page loads at `/admin/test`
- [ ] All connection tests pass (green checks)
- [ ] Login test passes
- [ ] Can add products in admin dashboard
- [ ] Products appear on homepage

---

## 📞 Still Not Working?

If you've followed all steps and it's still not working:

1. **Take screenshots** of:
   - Test page results
   - Supabase Table Editor (showing tables)
   - Supabase Storage (showing bucket)
   - Vercel Environment Variables
   - Browser console errors (F12)

2. **Share the screenshots** so I can see exactly what's wrong

---

## 🎯 Quick Summary

1. ✅ Run `reset-database.sql` in Supabase SQL Editor
2. ✅ Create admin user in Authentication
3. ✅ Set user role to 'admin' with SQL
4. ✅ Push code to GitHub
5. ✅ Visit `/admin/test` and run tests
6. ✅ Test adding a product

**That's it! Follow these steps exactly and everything will work.** 🚀
