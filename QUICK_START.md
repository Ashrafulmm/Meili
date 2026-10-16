# 🚀 Quick Start - Meili Beauty Shop

## ⚠️ IMMEDIATE ACTION REQUIRED

**You exposed sensitive credentials. Do this NOW:**

1. **Revoke Vercel Blob token** in Vercel Dashboard → Settings → Blob → Regenerate
2. **Get correct Supabase anon key** from Supabase Dashboard → Settings → API (it's a long JWT starting with `eyJ...`)

---

## 📋 4-Step Setup

### 1️⃣ Run Database Schema
```
Supabase Dashboard → SQL Editor → New Query
Copy ALL content from: supabase-schema.sql
Paste → Run
```

### 2️⃣ Create Admin User
```
Supabase Dashboard → Authentication → Users → Add user
Email: your-email@example.com
Password: (create strong password)
✓ Auto Confirm User

Then run this SQL:
update public.profiles set role = 'admin' 
where email = 'your-email@example.com';
```

### 3️⃣ Set Vercel Environment Variables
```
Vercel Dashboard → Settings → Environment Variables

Add these (check all environments):

VITE_SUPABASE_URL = https://ktfxnbtmuwsqdszciwvg.supabase.co
VITE_SUPABASE_ANON_KEY = (paste FULL anon key from Supabase)
```

### 4️⃣ Redeploy
```
Vercel Dashboard → Deployments → Latest deployment → ⋮ → Redeploy
```

---

## ✅ Test Your Setup

1. Visit `your-domain.com/admin/login`
2. Login with your admin email/password
3. Try adding a product with image upload
4. Check if it appears on homepage

---

## 📚 Need Help?

Read the full guide: **SETUP_GUIDE.md**

---

## 🔐 Security Checklist

- [ ] Revoked exposed Vercel Blob token
- [ ] Using correct Supabase anon key (long JWT)
- [ ] Set environment variables in Vercel (not in code)
- [ ] Never commit `.env` files
- [ ] Enabled 2FA on Supabase and Vercel
- [ ] Using strong admin password

---

## 🎯 What's Connected

✅ **Supabase Database** - Products, orders, categories, banners, settings  
✅ **Supabase Auth** - Admin login/logout  
✅ **Supabase Storage** - Image uploads (product-images bucket)  
✅ **Homepage Sections** - Best deals, K-Beauty, Your pick, For you  
✅ **Multi-Image Products** - Upload multiple photos per product  
✅ **Order Management** - Status updates, customer details  
✅ **Live Search** - Real-time product search  
✅ **Responsive Design** - Mobile-friendly  

---

## 💡 Quick Tips

**Add Product:**
- Admin → Products → Add product
- Upload images OR paste URLs
- Check homepage sections to show it
- Save

**Process Order:**
- Admin → Orders → Click 👁 to view
- Update status: Pending → Confirmed → Processing → Shipped → Delivered

**Change Store Info:**
- Admin → Settings
- Update name, phone, email, address
- Save changes

---

**You're all set! Start managing your store at `/admin`** ✨
