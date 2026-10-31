# Warkop POS - Aplikasi Kasir Profesional

Sistem kasir warkop enterprise-grade dengan Next.js, Supabase, dan Vercel.

## Status Development

### ✅ Sudah Selesai:
- Next.js project setup
- Supabase integration (client, server, server-action)
- Auth system dengan login (admin@warkop.com / admin123)
- Cart calculation otomatis (subtotal, tax, discount, total, kembalian)
- Database schema lengkap (30+ tabel)
- Login page
- Dashboard dengan sidebar
- Branch management
- Category management
- Product form dengan upload gambar
- Menu list
- POS dengan category filter dan perhitungan otomatis
- Orders list

### ⏳ Belum Selesai (Enterprise Features):
- Shift kasir
- Tax management (PPN, PPh23)
- Discount & promo
- Supplier management
- Advanced inventory
- Audit trail
- Mobile app (PWA)
- Analytics & BI
- Multi-language
- Backup & recovery
- Excel export untuk laporan
- Layanan antar
- Program loyalitas

## Cara Setup Supabase (Wajib Dilakukan Sebelum Menggunakan)

### 1. Buat Project di Supabase

1. Buka https://supabase.com
2. Klik "New Project"
3. Pilih organisasi (atau buat baru)
4. Pilih nama project (misal: warkop-pos)
5. Pilih region terdekat (misal: Singapore)
7. Wait untuk project selesai dibuat

### 2. Setup Environment Variables

Copy URL dan API keys dari Supabase:

Buka `Settings > API` di Supabase dashboard:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role key → `SUPABASE_SERVICE_ROLE_KEY`

Update file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_ID=your-project-id
```

### 3. Run Database Migrations

Buka Supabase SQL Editor, jalankan SQL dari file berikut secara berurutan:

1. Buka file `supabase/migrations/001_initial_schema.sql`
2. Copy semua SQL
3. Paste di Supabase SQL Editor
4. Klik "Run"

Ulangi untuk:
- `supabase/migrations/002_functions_triggers.sql`
- `supabase/migrations/003_rls_policies.sql`

### 4. Buat User Admin

1. Buka Supabase Dashboard
2. Masuk ke Authentication > Users
3. Klik "Add User"
4. Email: `admin@warkop.com`
5. Password: `admin123`
6. Auto Confirm User: ✅
7. Klik "Create User"

### 5. Buat Profile Admin

Setelah user dibuat, jalankan SQL ini di SQL Editor:

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

### 6. Buat Cabang Pertama

1. Buka aplikasi di http://localhost:3000
2. Login dengan admin@warkop.com / admin123
3. Masuk ke menu "Cabang"
4. Tambah cabang pertama (misal: "Cabang Utama")

### 7. Setup Kategori

1. Masuk ke menu "Kategori"
2. Tambah minimal 1 kategori (misal: "Minuman", "Makanan", "Minuman")

### 8. Tambah Produk

1. Masuk ke menu "Menu"
2. Klik "Tambah Produk"
3. Isi form:
   - Nama produk
   - Kategori
   - Harga
   - Stok
   - Gambar (opsional)
4. Simpan

### 9. Mulai Gunakan POS

1. Masuk ke menu "POS"
2. Pilih produk dan tambahkan ke keranjang
3. Perhitungan otomatis akan terjadi
4. Bayar dan selesaikan pesanan

## Cara Menjalankan Aplikasi

### Development:
```bash
npm run dev
```
Buka http://localhost:3000

### Production (Vercel):
```bash
npm run build
npm start
```

## Fitur Core yang Bisa Digunakan Sekarang:

1. ✅ Login dengan admin@warkop.com / admin123
2. ✅ Dashboard dengan navigasi sidebar
3. ✅ Multi-cabang management
4. ✅ Category management
5. ✅ Product management dengan form simple
6. ✅ POS dengan:
   - Category filter
   - Cart system
   - Perhitungan otomatis (subtotal, PPN 11%, total, kembalian)
   - Order creation ke database
7. ✅ Orders list untuk melihat riwayat pesanan

## Fitur yang Akan Datang (Enterprise Features):

Berikut adalah fitur-fitur enterprise-grade yang sudah di-desain di database schema tapi belum diimplement di frontend:

- **Shift Kasir**: Opening/closing shift, modal awal, hitung uang kasir, discrepancy reporting
- **Tax Management**: PPN 11%, PPh23, tax invoice
- **Discount & Promo**: Discount per item/transaction, promo harian, voucher codes, buy X get Y
- **Supplier Management**: Database supplier, purchase order, supplier performance
- **Advanced Inventory**: Minimum stock alerts, auto-reorder, COGS tracking, wastage tracking
- **Audit Trail**: Log semua changes, financial audit trail
- **Mobile App (PWA)**: Mobile POS untuk waiter, customer self-ordering
- **Analytics & BI**: Profit margin, customer segmentation, sales forecasting, menu engineering
- **Multi-Language**: Bahasa Indonesia & English
- **Backup & Recovery**: Automated backup, backup export, restore
- **Excel Export**: 4 jenis laporan (Penjualan, Stok, Pesanan, Konsolidasi)
- **Layanan Antar**: Status tracking dengan timeline
- **Program Loyalitas**: Poin sistem dengan tier

## Troubleshooting

### Login tidak berhasil:
- Pastikan Supabase environment variables sudah di-set
- Pastikan user admin sudah dibuat di Supabase
- Pastikan profile admin sudah dibuat dengan SQL insert

### Tidak bisa tambah produk:
- Pastikan cabang sudah dibuat dulu
- Pastikan kategori sudah dibuat dulu
- Check browser console untuk error

### POS error saat checkout:
- Pastikan branch_id dan cashier_id tersedia di profile user
- Check browser console untuk error database
- Pastikan RLS policies sudah di-setup

## File Structure Penting

```
app/
  auth/
    login/page.tsx          - Login page
    actions.ts              - Auth server actions
  dashboard/
    page.tsx               - Dashboard home
    layout.tsx             - Dashboard layout dengan sidebar
    branches/
      page.tsx           - Branch management
    menu/
      page.tsx           - Menu list
      new/page.tsx         - Tambah produk
      categories/
        page.tsx       - Category management
    orders/
      page.tsx           - Orders list
      new/page.tsx         - POS
components/
  layout/
    Sidebar.tsx           - Sidebar navigation
lib/
  supabase/
    client.ts             - Client-side Supabase
    server.ts             - Server-side Supabase
    server-action.ts      - Server action Supabase
  auth/
    auth-helpers.ts        - Auth helper functions
    auth-context.tsx       - Auth context provider
  calculations/
    cart.ts               - Cart calculation logic
types/
  supabase.ts            - Database types
  database.ts            - Custom type extensions
supabase/
  migrations/
    001_initial_schema.sql - Database schema
    002_functions_triggers.sql - Functions & triggers
    003_rls_policies.sql     - RLS policies
    004_seed_data.sql       - Seed data
```

## Credit

Dibuat dengan Devin AI - Enterprise-grade POS System untuk Warkop
