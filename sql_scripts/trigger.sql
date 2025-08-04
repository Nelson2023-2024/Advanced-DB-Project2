
CREATE TABLE IF NOT EXISTS inventory (
    stock_code VARCHAR(20) PRIMARY KEY,
    stock_level INTEGER
);

CREATE OR REPLACE FUNCTION update_inventory()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventory
    SET stock_level = stock_level - NEW.quantity
    WHERE stock_code = NEW.stock_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reduce_stock_trigger
AFTER INSERT ON online_retail_data
FOR EACH ROW
EXECUTE FUNCTION update_inventory();
