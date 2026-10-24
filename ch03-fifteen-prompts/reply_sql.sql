WITH monthly AS (
  SELECT
    substr(o.order_date, 1, 7) AS month,
    p.name AS product_name,
    SUM(o.quantity * o.unit_price) AS revenue
  FROM orders o
  JOIN products p ON p.id = o.product_id
  WHERE o.returned = 0
    AND o.order_date >= '2026-01-01'
    AND o.order_date <  '2027-01-01'
  GROUP BY substr(o.order_date, 1, 7), p.id, p.name
),
ranked AS (
  SELECT
    month,
    product_name,
    revenue,
    ROW_NUMBER() OVER (
      PARTITION BY month
      ORDER BY revenue DESC, product_name
    ) AS rn
  FROM monthly
)
SELECT month, product_name, revenue
FROM ranked
WHERE rn <= 3
ORDER BY month, revenue DESC, product_name;
