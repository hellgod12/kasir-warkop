-- Update RLS Policies to allow authenticated users to insert/update/delete
-- This fixes the "new row violates row-level security policy" error

-- Drop existing policies
DROP POLICY IF EXISTS "Super admin full access branches" ON branches;
DROP POLICY IF EXISTS "Admin cabang read own branch" ON branches;
DROP POLICY IF EXISTS "Super admin full access profiles" ON profiles;
DROP POLICY IF EXISTS "Admin cabang read own branch profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Super admin full access products" ON products;
DROP POLICY IF EXISTS "Admin cabang full access own branch products" ON products;
DROP POLICY IF EXISTS "Kasir read own branch products" ON products;
DROP POLICY IF EXISTS "Super admin full access orders" ON orders;
DROP POLICY IF EXISTS "Admin cabang full access own branch orders" ON orders;
DROP POLICY IF EXISTS "Kasir read/write own branch orders" ON orders;

-- New simpler policies for development
CREATE POLICY "Allow all operations for authenticated users on branches" ON branches
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on profiles" ON profiles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on orders" ON orders
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on order_items" ON order_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on shifts" ON shifts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on shift_transactions" ON shift_transactions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on tax_settings" ON tax_settings
    FOR ALL USING (auth.role() = 'authenticated');
