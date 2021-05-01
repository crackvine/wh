CREATE TABLE IF NOT EXISTS products_x_articles (
    product_id INT NOT NULL,
    article_id INT NOT NULL,
    article_count INT NOT NULL,
    PRIMARY KEY (product_id, article_id),
    CONSTRAINT fk_product
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    CONSTRAINT fk_article
      FOREIGN KEY (article_id) REFERENCES inventory(id) ON DELETE SET NULL
);