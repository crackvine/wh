CREATE OR REPLACE VIEW products_stock AS
SELECT
	products_x_articles.product_id AS product_id,
	MIN(inventory.stock / products_x_articles.article_count) AS stock -- division tuncates results so no need for FLOOR()
FROM products_x_articles
LEFT JOIN inventory ON products_x_articles.article_id = inventory.id
GROUP BY products_x_articles.product_id;
