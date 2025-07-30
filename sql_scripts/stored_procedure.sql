
CREATE OR REPLACE FUNCTION get_total_sales(start_date DATE, end_date DATE)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (
        SELECT SUM(quantity * unit_price)
        FROM online_retail_data
        WHERE invoice_date BETWEEN start_date AND end_date
    );
END;
$$ LANGUAGE plpgsql;
