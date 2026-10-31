-- FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION generate_order_number(p_branch_id UUID, p_date DATE)
RETURNS VARCHAR AS $$
DECLARE
    v_branch_code VARCHAR(10);
    v_date_str VARCHAR(10);
    v_seq INTEGER;
    v_order_number VARCHAR(50);
BEGIN
    SELECT UPPER(SUBSTRING(name, 1, 3)) INTO v_branch_code 
    FROM branches WHERE id = p_branch_id;
    
    v_date_str := TO_CHAR(p_date, 'YYYYMMDD');
    
    SELECT COALESCE(COUNT(*), 0) + 1 INTO v_seq
    FROM orders 
    WHERE branch_id = p_branch_id 
    AND DATE(created_at) = p_date;
    
    v_order_number := 'WKP-' || v_branch_code || '-' || v_date_str || '-' || LPAD(v_seq::TEXT, 4, '0');
    
    RETURN v_order_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products 
        SET stock = stock - NEW.quantity
        WHERE id = NEW.product_id;
        
        INSERT INTO stock_adjustments (
            product_id, branch_id, adjustment_type, 
            quantity_before, quantity_after, quantity_changed, 
            reason, adjusted_by, reference_id, reference_type
        )
        SELECT 
            NEW.product_id, 
            p.branch_id,
            'remove',
            p.stock,
            p.stock - NEW.quantity,
            -NEW.quantity,
            'Order sale',
            (SELECT cashier_id FROM orders WHERE id = NEW.order_id),
            NEW.order_id,
            'order'
        FROM products p
        WHERE p.id = NEW.product_id;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_stock ON order_items;
CREATE TRIGGER trigger_update_stock
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();
