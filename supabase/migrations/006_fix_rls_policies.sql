-- Update RLS Policies to allow authenticated users to insert/update/delete
-- This fixes the "new row violates row-level security policy" error

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Super admin full access branches" ON branches;
DROP POLICY IF EXISTS "Admin cabang read own branch" ON branches;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on branches" ON branches;

DROP POLICY IF EXISTS "Super admin full access profiles" ON profiles;
DROP POLICY IF EXISTS "Admin cabang read own branch profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on profiles" ON profiles;

DROP POLICY IF EXISTS "Allow all operations for authenticated users on categories" ON categories;

DROP POLICY IF EXISTS "Super admin full access products" ON products;
DROP POLICY IF EXISTS "Admin cabang full access own branch products" ON products;
DROP POLICY IF EXISTS "Kasir read own branch products" ON products;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on products" ON products;

DROP POLICY IF EXISTS "Super admin full access orders" ON orders;
DROP POLICY IF EXISTS "Admin cabang full access own branch orders" ON orders;
DROP POLICY IF EXISTS "Kasir read/write own branch orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on orders" ON orders;

DROP POLICY IF EXISTS "Allow all operations for authenticated users on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on shifts" ON shifts;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on shift_transactions" ON shift_transactions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on tax_settings" ON tax_settings;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on stock_adjustments" ON stock_adjustments;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on customers" ON customers;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on loyalty_transactions" ON loyalty_transactions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on deliveries" ON deliveries;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on discounts" ON discounts;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on promos" ON promos;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on order_discounts" ON order_discounts;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on suppliers" ON suppliers;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on purchase_orders" ON purchase_orders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on purchase_order_items" ON purchase_order_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on supplier_price_history" ON supplier_price_history;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on stock_transfers" ON stock_transfers;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on stock_transfer_items" ON stock_transfer_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on wastage_logs" ON wastage_logs;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on reorder_suggestions" ON reorder_suggestions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on tax_invoices" ON tax_invoices;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on audit_logs" ON audit_logs;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on financial_audit_trail" ON financial_audit_trail;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on security_events" ON security_events;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on daily_sales_summary" ON daily_sales_summary;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on product_performance" ON product_performance;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on staff_performance" ON staff_performance;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on customer_analytics" ON customer_analytics;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on backup_logs" ON backup_logs;

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

CREATE POLICY "Allow all operations for authenticated users on stock_adjustments" ON stock_adjustments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on customers" ON customers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on loyalty_transactions" ON loyalty_transactions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on deliveries" ON deliveries
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on discounts" ON discounts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on promos" ON promos
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on order_discounts" ON order_discounts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on suppliers" ON suppliers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on purchase_orders" ON purchase_orders
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on purchase_order_items" ON purchase_order_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on supplier_price_history" ON supplier_price_history
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on stock_transfers" ON stock_transfers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on stock_transfer_items" ON stock_transfer_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on wastage_logs" ON wastage_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on reorder_suggestions" ON reorder_suggestions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on tax_invoices" ON tax_invoices
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on audit_logs" ON audit_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on financial_audit_trail" ON financial_audit_trail
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on security_events" ON security_events
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on daily_sales_summary" ON daily_sales_summary
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on product_performance" ON product_performance
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on staff_performance" ON staff_performance
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on customer_analytics" ON customer_analytics
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on backup_logs" ON backup_logs
    FOR ALL USING (auth.role() = 'authenticated');
