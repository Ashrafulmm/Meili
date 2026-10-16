# 🚀 Meili Beauty Shop - Complete Setup Guide

Welcome! This guide will help you set up your e-commerce platform with Supabase for database, authentication, and image storage.

---

## ⚠️ IMPORTANT SECURITY NOTE

**You shared sensitive credentials in the chat. Please do the following IMMEDIATELY:**

1. **Revoke your Vercel Blob token:**
   - Go to Vercel Dashboard → Your Project → Settings → Blob
   - Click "Regenerate token"
   - The old token is now invalid

2. **Verify your Supabase anon key:**
   - The key you shared (`sb_publishable_V2lzZRYfdxqchbdX8kvQUw_wlKIoDdr`) is NOT a valid Supabase anon key
   - Real Supabase anon keys are JWTs starting with `eyJ...` (about 200 characters)
   - Go to Supabase Dashboard → Settings → API → Copy the full "anon public" key

---

## 📋 Setup Steps

### Step 1: Run the Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase-schema.sql` in this project
5. Copy ALL the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for it to complete (should take 5-10 seconds)

✅ This creates all tables, policies, and the storage bucket.

---

### Step 2: Create Your Admin Account

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email and a strong password
4. Check "Auto Confirm User"
5. Click **Create user**

Now make yourself an admin:

6. Go to **SQL Editor** → **New Query**
7. Run this SQL (replace with your email):

```sql
update public.profiles 
set role = 'admin' 
where email = 'your-email@example.com';
```

✅ You're now an admin!

---

### Step 3: Set Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these variables:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://ktfxnbtmuwsqdszciwvg.supabase.co`
- Environment: Production, Preview, Development (check all)

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: (paste the FULL anon key from Supabase Dashboard → Settings → API)
- Environment: Production, Preview, Development (check all)

3. Click **Save**

---

### Step 4: Redeploy Your Site

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Find the latest deployment
3. Click the three dots (⋮) → **Redeploy**
4. Wait for deployment to complete

✅ Your site is now connected to Supabase!

---

## 🎨 How to Use the Admin Dashboard

### Login
1. Go to `your-domain.com/admin/login`
2. Enter your admin email and password
3. You'll be redirected to the admin dashboard

### Add Products
1. Go to **Products** → **Add product**
2. Fill in the details:
   - **Title**: Product name
   - **Price**: In ৳ (Taka)
   - **Category**: Select from dropdown
   - **Stock**: Available quantity
   - **Description**: Full product description
   - **Images**: 
     - Click **Upload** to upload from your computer (requires Supabase configured)
     - OR click **Add URL** to paste image URLs
     - First image is the main photo
   - **Homepage sections**: Check which sections to show this product in
     - Best deals
     - K-Beauty
     - Your pick
     - For you
3. Click **Add product**

### Manage Orders
1. Go to **Orders**
2. Click the eye icon (👁) to view order details
3. Change status: Pending → Confirmed → Processing → Shipped → Delivered
4. Click **Update**

### Manage Banners
1. Go to **Banners** → **Add banner**
2. Upload banner image or paste URL
3. Add title, subtitle, and link
4. Toggle visibility with the eye icon

### Store Settings
1. Go to **Settings**
2. Update store name, contact info, social links
3. Edit SEO title and description
4. Click **Save changes**

---

## 🖼️ Image Upload

### Option 1: Direct Upload (Recommended)
- Click **Upload** button in the product form
- Select images from your computer
- Images are stored in Supabase Storage
- Public URLs are generated automatically

### Option 2: Manual URLs
- Click **Add URL** button
- Paste image URL from any source (Unsplash, Imgur, etc.)
- Works even without Supabase configured

---

## 🔧 Troubleshooting

### "Supabase not configured" warning
- Check that you set both environment variables in Vercel
- Make sure variable names start with `VITE_`
- Redeploy after adding environment variables

### Can't upload images
- Verify Supabase storage bucket exists (check SQL schema ran successfully)
- Check that your user has admin role in the profiles table
- Check browser console for error messages

### Can't login to admin
- Make sure you created a user in Supabase Authentication
- Verify your user has `role = 'admin'` in the profiles table
- Check email is confirmed

### Products not showing on homepage
- Check that products have sections assigned (Best deals, K-Beauty, etc.)
- Go to Admin → Products → Edit product → Check "Homepage sections"

---

## 📞 Support

If you need help:
1. Check the Supabase logs: Dashboard → Logs
2. Check Vercel function logs: Dashboard → Functions
3. Review browser console (F12) for frontend errors

---

## 🔐 Security Best Practices

✅ **DO:**
- Use strong passwords
- Enable 2FA on Supabase and Vercel
- Regularly rotate API keys
- Monitor your database usage

❌ **DON'T:**
- Share API keys or tokens publicly
- Use the service_role key in frontend code
- Commit `.env` files to Git
- Use the same password everywhere

---

## 📊 Database Structure

Your Supabase database has these tables:
- `profiles` - User accounts and roles
- `products` - Product catalog
- `product_images` - Multiple images per product
- `product_sections` - Homepage section assignments
- `categories` - Product categories
- `sections` - Homepage sections (Best deals, K-Beauty, etc.)
- `orders` - Customer orders
- `order_items` - Items in each order
- `banners` - Homepage banners
- `store_settings` - Global store configuration

All tables have Row Level Security (RLS) enabled for safety.

---

## 🎉 You're All Set!

Your Meili Beauty Shop is now fully connected to Supabase. You can:
- ✅ Manage products with multiple images
- ✅ Control which products appear in homepage sections
- ✅ Process orders
- ✅ Update store settings
- ✅ Upload images directly from the admin panel

Happy selling! ✨
