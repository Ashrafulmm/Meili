# 🚀 Meili Beauty Shop - Complete Setup Guide

## ✅ Your Credentials (Already Configured)

- **Supabase URL:** https://ktfxnbtmuwsqdszciwvg.supabase.co
- **Anon Key:** ✅ Configured in `.env.local`
- **Storage:** Will be created when you run the SQL schema

---

## 📋 Setup Steps (Do These in Order)

### Step 1: Run the Database Schema

1. Open your browser and go to:
   ```
   https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new
   ```

2. Click **New Query**

3. Open the file `supabase-schema.sql` in this project

4. Copy ALL the SQL code (Ctrl+A, Ctrl+C)

5. Paste it into the Supabase SQL Editor (Ctrl+V)

6. Click **Run** button (or press Ctrl+Enter)

7. Wait for it to complete (should say "Success. No rows returned")

✅ **Done!** All tables, policies, and storage bucket are created.

---

### Step 2: Create Your Admin Account

1. Go to Supabase Dashboard → **Authentication** → **Users**
   ```
   https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/auth/users
   ```

2. Click **Add user** → **Create new user**

3. Fill in:
   - **Email:** your-email@example.com (use your real email)
   - **Password:** create a strong password (save it somewhere safe!)
   - ✓ Check **Auto Confirm User**

4. Click **Create user**

5. Now make yourself an admin:
   - Go to **SQL Editor** → **New Query**
   - Run this SQL (replace with YOUR email):
   
   ```sql
   update public.profiles 
   set role = 'admin' 
   where email = 'your-email@example.com';
   ```
   
   - Click **Run**

✅ **Done!** You're now an admin.

---

### Step 3: Deploy to Vercel

Since you already connected GitHub to Vercel:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

2. Add these variables:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://ktfxnbtmuwsqdszciwvg.supabase.co`
   - Environment: ✓ Production, ✓ Preview, ✓ Development

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZnhuYnRtdXdzcWRzemNpd3ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDQ3ODEsImV4cCI6MjEwNzcyMDc4MX0.UREkrwlR8-PAl6FunVqIlBXDatgtsMq1KBx_IKSqS68`
   - Environment: ✓ Production, ✓ Preview, ✓ Development

3. Click **Save**

4. Go to **Deployments** → Find latest deployment → Click **⋮** → **Redeploy**

✅ **Done!** Your site is now connected to Supabase.

---

### Step 4: Test Your Setup

1. Visit your Vercel site (e.g., `https://your-project.vercel.app`)

2. Go to `/admin/login`

3. Login with your admin email and password

4. Try these actions:
   - Add a new product with image upload
   - Check if it appears on homepage
   - Create a banner
   - Update store settings

✅ **Everything works!**

---

## 🎨 How to Use the Admin Dashboard

### Login
- Go to `your-domain.com/admin/login`
- Use your admin email/password

### Add Products
1. **Products** → **Add product**
2. Fill in details:
   - Title, price, category, stock
   - Description
   - **Images:** Click **Upload** to upload from computer, OR **Add URL** to paste URLs
   - **Homepage sections:** Check which sections to show product in
3. Click **Add product**

### Manage Orders
1. **Orders** → Click 👁 to view details
2. Update status: Pending → Confirmed → Processing → Shipped → Delivered
3. Click **Update**

### Manage Banners
1. **Banners** → **Add banner**
2. Upload image or paste URL
3. Add title, subtitle, link
4. Toggle visibility with 👁 icon

### Store Settings
1. **Settings**
2. Update store name, contact info, social links
3. Edit SEO title/description
4. Click **Save changes**

---

## 🖼️ Image Upload

### Direct Upload (Recommended)
- Click **Upload** button in product form
- Select images from computer
- Stored in Supabase Storage bucket: `product-images`
- Public URLs generated automatically

### Manual URLs
- Click **Add URL** button
- Paste image URL from anywhere
- Works without Supabase configured

---

## 🔧 Troubleshooting

### "Supabase not configured" warning
- Check `.env.local` file exists with correct values
- In Vercel, check environment variables are set
- Redeploy after adding env vars

### Can't upload images
- Verify SQL schema ran successfully (check storage bucket exists)
- Check your user has admin role: `select * from profiles where email = 'your-email';`
- Check browser console (F12) for errors

### Can't login
- Verify user exists in Supabase Authentication
- Check user has admin role in profiles table
- Ensure email is confirmed

### Products not showing
- Check products have sections assigned
- Go to Admin → Products → Edit → Check "Homepage sections"

---

## 📊 Database Tables Created

- `profiles` - User accounts and roles
- `products` - Product catalog
- `product_images` - Multiple images per product
- `product_sections` - Homepage section assignments
- `categories` - Product categories
- `sections` - Homepage sections (Best deals, K-Beauty, Your pick, For you)
- `orders` - Customer orders
- `order_items` - Items in each order
- `banners` - Homepage banners
- `store_settings` - Global store configuration

All tables have Row Level Security (RLS) enabled.

---

## 🔐 Security Notes

✅ **Safe:**
- Anon key is public (designed for frontend use)
- RLS policies protect your data
- Only admins can modify products/orders

❌ **Never do:**
- Share service_role key (it bypasses all security)
- Commit `.env.local` to Git (it's in .gitignore)
- Use same password everywhere

---

## 📞 Need Help?

1. Check Supabase logs: Dashboard → Logs
2. Check Vercel logs: Dashboard → Functions
3. Open browser console (F12) for frontend errors
4. Verify all environment variables are set correctly

---

## 🎉 You're All Set!

Your Meili Beauty Shop is now fully connected to Supabase:
- ✅ Database with all tables
- ✅ Authentication for admin login
- ✅ Storage for image uploads
- ✅ Homepage sections management
- ✅ Multi-image product support
- ✅ Order management
- ✅ Store settings

**Start managing your store at `/admin`** ✨
