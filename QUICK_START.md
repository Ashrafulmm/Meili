# ⚡ Quick Start - Meili Beauty Shop

## Your Supabase Credentials ✅

```
URL: https://ktfxnbtmuwsqdszciwvg.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Both are already configured in `.env.local`

---

## 🎯 3-Step Setup

### 1️⃣ Run SQL Schema
```
1. Go to: https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new
2. Copy ALL content from: supabase-schema.sql
3. Paste → Click Run
```

### 2️⃣ Create Admin User
```
1. Authentication → Users → Add user
2. Enter email + password
3. ✓ Auto Confirm User
4. Run SQL: update public.profiles set role = 'admin' where email = 'YOUR_EMAIL';
```

### 3️⃣ Set Vercel Env Variables
```
Add to Vercel → Settings → Environment Variables:

VITE_SUPABASE_URL = https://ktfxnbtmuwsqdszciwvg.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Then Redeploy!
```

---

## ✅ Test It

1. Visit `your-domain.com/admin/login`
2. Login with your credentials
3. Add a product with image upload
4. Check homepage - it should appear!

---

## 📚 Full Guide

Read **SETUP_GUIDE.md** for detailed instructions.

---

## 🎉 What's Working

✅ Supabase Database (products, orders, categories, banners)  
✅ Supabase Auth (admin login)  
✅ Supabase Storage (image uploads)  
✅ Homepage Sections (Best deals, K-Beauty, Your pick, For you)  
✅ Multi-Image Products  
✅ Order Management  
✅ Live Search  

**Start managing at `/admin`** ✨
