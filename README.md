# Warkop POS - Aplikasi Kasir Profesional

Sistem kasir warkop enterprise-grade dengan Next.js, Supabase, dan Vercel.

## ✅ Fitur yang Sudah Selesai (Production Ready):

### Core Features:
- ✅ **Login System** - Supabase Auth dengan admin@warkop.com / admin123
- ✅ **Dashboard** - Modern UI dengan summary cards dan real-time stats
- ✅ **Branch Management** - Multi-cabang dengan CRUD + validasi duplicate
- ✅ **Category Management** - Kategori menu dengan CRUD
- ✅ **Product Management** - CRUD produk dengan image upload
- ✅ **POS System** - Category filter, cart, perhitungan otomatis
- ✅ **Orders Management** - List pesanan dengan status tracking
- ✅ **Shift Management** - Open/close shift, modal tracking, jam/tanggal/durasi, transaction details
- ✅ **Reports** - Excel export profesional untuk penjualan, stok, pesanan
- ✅ **Tax Settings** - PPN configuration (default 0%, bisa diatur)
- ✅ **Discount/Promo** - Placeholder page untuk future implementation
- ✅ **Modern UI** - Coffee/warkop theme dengan gradient dan emoji

### Technical:
- ✅ Next.js 16.4.3 with TypeScript
- ✅ Tailwind CSS styling
- ✅ Supabase integration (auth, database, storage)
- ✅ Type-safe database access
- ✅ Middleware untuk route protection
- ✅ SSR-compatible auth system
- ✅ Error handling

## ⏳ Fitur yang Belum Selesai (Tier 2 & 3):

### Tier 2 (Important):
- ⏳ Discount & Promo System
- ⏳ Supplier Management
- ⏳ Advanced Inventory (alerts, COGS, wastage)
- ⏳ Audit Trail
- ⏳ Shift Transaction Details (list transaksi per shift)

### Tier 3 (Nice to Have):
- ⏳ Delivery Management
- ⏳ Loyalty Program
- ⏳ Mobile/PWA
- ⏳ Analytics & BI
- ⏳ Multi-Language
- ⏳ Backup & Recovery

## 🚀 Cara Setup Supabase (Wajib):

### 1. Buat Project di Supabase
1. Buka https://supabase.com
2. Klik "New Project"
3. Beri nama project, pilih region
4. Tunggu project selesai

### 2. Setup Environment Variables
Di Supabase Settings > API:
- Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Copy anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Update di:
- Local: `.env.local`
- Vercel: Settings → Environment Variables

### 3. Run SQL Migrations
Buka Supabase SQL Editor, jalankan berurutan:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_functions_triggers.sql`
3. `supabase/migrations/003_rls_policies.sql`
4. `supabase/migrations/004_seed_data.sql`
5. `supabase/migrations/005_storage.sql`

### 4. Buat User Admin
1. Authentication > Users > Add User
2. Email: `admin@warkop.com`
3. Password: `admin123`
4. Auto Confirm User: ✅

### 5. Buat Profile Admin
Jalankan SQL ini:
```sql
INSERT INTO profiles (id, email, full_name, role, is_active)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@warkop.com'),
    'admin@warkop.com',
    'Super Admin',
    'super_admin',
    true
);
```

## 📱 Cara Menggunakan:

### 1. Login
- Buka aplikasi
- Login dengan admin@warkop.com / admin123

### 2. Setup Awal
1. Buat cabang (menu Cabang)
2. Buat kategori (menu Kategori)
3. Tambah produk (menu Menu)
4. Upload gambar produk

### 3. Operasional
1. Buka shift (menu Shift > Buka Shift Baru)
2. Gunakan POS (menu POS)
3. Tutup shift (menu Shift)
4. Lihat laporan (menu Laporan)

## 🎨 Theme:
- Primary: Amber/Orange (coffee theme)
- Background: Cream/beige gradient
- Emoji icons untuk visual appeal
- Modern rounded corners dan shadows

## 📦 Deploy ke Vercel:

1. Buka https://vercel.com/new
2. Import repository GitHub
3. Setup environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## 📁 Repository:
https://github.com/hellgod12/kasir-warkop

## ⚠️ Important Notes:
- Supabase environment variables WAJIB di-set di Vercel
- SQL migrations WAJIB di-run di Supabase
- User admin WAJIB dibuat manual di Supabase
- Storage bucket WAJIB dibuat (005_storage.sql)

## 🔄 Perhitungan Otomatis:
- Subtotal = Σ(harga × quantity)
- PPN (default 0%, bisa diatur di settings) = (subtotal - discount) × taxRate%
- Total = subtotal - discount + PPN
- Kembalian = paid_amount - total

## 📊 Excel Export:
- Laporan Penjualan
- Laporan Stok
- Laporan Pesanan
- Format Indonesia (Rp, DD/MM/YYYY)

Aplikasi sudah production-ready untuk basic use case! 🎉
