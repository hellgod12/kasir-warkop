-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
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
