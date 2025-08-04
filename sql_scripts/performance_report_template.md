
# Performance Analysis Report

## Query: Total Sales between Two Dates

### SQL Used:
```sql
SELECT SUM(quantity * unit_price)
FROM online_retail_data
WHERE invoice_date BETWEEN '2020-01-01' AND '2020-12-31';
```

### Without Stored Procedure:
```sql
EXPLAIN ANALYZE ...
```

### With Stored Procedure:
```sql
SELECT get_total_sales('2020-01-01', '2020-12-31');
EXPLAIN ANALYZE ...
```

### Observations:
- Execution time before: ...
- Execution time after: ...
- Indexing impact: ...

## Trigger Test (Inventory):
Insert a row and verify inventory update:
```sql
SELECT * FROM inventory WHERE stock_code = 'XYZ';
```
