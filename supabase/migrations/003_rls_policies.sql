-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories
CREATE POLICY "Super admin full access categories" ON categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Authenticated users can insert categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON categories
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read categories" ON categories
    FOR SELECT USING (auth.role() = 'authenticated');
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wastage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reorder_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sales_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Branches
CREATE POLICY "Super admin full access branches" ON branches
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin cabang read own branch" ON branches
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'admin_cabang' 
        AND id = (SELECT branch_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Authenticated users can insert branches" ON branches
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update branches" ON branches
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete branches" ON branches
    FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for Profiles
CREATE POLICY "Super admin full access profiles" ON profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin cabang read own branch profiles" ON profiles
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'admin_cabang' 
        AND branch_id = (SELECT branch_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Authenticated users can insert profiles" ON profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update profiles" ON profiles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for Products
CREATE POLICY "Super admin full access products" ON products
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin cabang full access own branch products" ON products
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin_cabang' 
        AND branch_id = (SELECT branch_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Kasir read own branch products" ON products
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'kasir' 
        AND branch_id = (SELECT branch_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Authenticated users can insert products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for Orders
CREATE POLICY "Super admin full access orders" ON orders
    FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin cabang full access own branch orders" ON orders
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin_cabang' 
        AND branch_id = (SELECT branch_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Kasir read/write own branch orders" ON orders
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'kasir' 
        AND branch_id = (SELECT branch_id FROM profiles WHERE id = auth.uid())
    );
