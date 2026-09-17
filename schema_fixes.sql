-- a) products.search_text GENERATED column
ALTER TABLE products DROP COLUMN search_text;
ALTER TABLE products ADD COLUMN search_text text GENERATED ALWAYS AS (name || ' ' || coalesce(short_description, '')) STORED;

-- The old index is dropped when the column is dropped, so we create it on the new column
CREATE INDEX products_search_text_idx ON products USING GIN (to_tsvector('english', search_text));

-- b) orders, order_items, cart_items basic policies
-- For orders
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- For order_items
CREATE POLICY "Users can insert order items for their orders" ON order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- For cart_items
CREATE POLICY "Users can manage their own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- c) products.updated_at BEFORE UPDATE trigger
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
