-- Seed Data untuk Admin Default
-- Email: admin@warkop.com
-- Password: admin123

-- Insert default branch (cabang pertama)
INSERT INTO branches (id, name, address, phone, is_active)
VALUES (
    uuid_generate_v4(),
    'Cabang Utama',
    'Jl. Contoh No. 123',
    '081234567890',
    true
);

-- Note: Untuk membuat admin, Anda perlu:
-- 1. Buat user di Supabase Dashboard: Authentication > Users > Add User
-- 2. Email: admin@warkop.com
-- 3. Password: admin123
-- 4. Auto Confirm User: Yes
-- 5. Setelah user dibuat, jalankan SQL ini di SQL Editor:

-- INSERT INTO profiles (id, email, full_name, role, branch_id, is_active)
-- VALUES (
--     (SELECT id FROM auth.users WHERE email = 'admin@warkop.com'),
--     'admin@warkop.com',
--     'Super Admin',
--     'super_admin',
--     (SELECT id FROM branches WHERE name = 'Cabang Utama'),
--     true
-- );
