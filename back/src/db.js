const { Client } = require('pg');

const db = async ({ config, logger }) => {
  logger.debug(`connecting to postgres database at ${config.POSTGRES_HOST}:${config.POSTGRES_PORT}...`);

  // eslint-disable-next-line max-len
  const connectionString = `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASS}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.DATABASE_NAME}`;

  let client;
  try {
    client = new Client({ connectionString });
    await client.connect();
    logger.info('connected to database');
  } catch (error) {
    logger.error(error.stack);
    throw new Error('failed to connect to database');
  }

  const health = async () => {
    try {
      logger.debug('db:health called');
      const timeResult = await client.query('SELECT NOW() as now');
      const tablesResult = await client.query(`SELECT *
        FROM pg_catalog.pg_tables
        WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`);
      logger.debug(`db:health results: ${JSON.stringify([timeResult, tablesResult])}`);
      return {
        status: 'ok', time: timeResult.rows[0].now, tables: tablesResult.rows.map((row) => row),
      };
    } catch (error) {
      logger.error(error.stack);
      return { status: 'error', details: error.message };
    }
  };

  const getProducts = async () => {
    logger.debug('db:getProducts called');
    try {
      const results = await client.query(
        `SELECT id, name, stock
          FROM products
          LEFT JOIN products_stock ON products.id = products_stock.product_id`,
      );
      logger.debug('db:getProducts results:');
      logger.debug(results.rows);
      return results.rows;
    } catch (error) {
      logger.error(error.stack);
      return { status: 'error', details: error.message };
    }
  };

  const getProductById = async (id) => {
    logger.debug(`db:getProductById called with id ${id}`);
    try {
      const results = await client.query(
        `SELECT id, name, stock
          FROM products
          LEFT JOIN products_stock ON products.id = products_stock.product_id
          WHERE products.id=$1`,
        [id],
      );
      logger.debug('db:getProductById results:');
      logger.debug(results.rows);
      return results.rows;
    } catch (error) {
      logger.error(error.stack);
      return { status: 'error', details: error.message };
    }
  };

  const upsertProducts = async (products) => {
    logger.debug('db:upsertProducts called with: ');
    logger.debug(products);
    try {
      const dbOps1 = products.map((product) => client.query(
        `INSERT INTO products(name) VALUES ($1)
          ON CONFLICT (name) DO UPDATE SET name=$1 RETURNING id, name`,
        [product.name],
      ));
      const resultsOps1 = await Promise.all(dbOps1);
      logger.debug(resultsOps1.map((res) => res?.rows));

      const productIds = resultsOps1.map((res) => res.rows[0].id);

      const dbOps2 = products.map((product, i) => product.contain_articles.map((article) => client.query(
        `INSERT INTO products_x_articles (product_id, article_id, article_count) VALUES ($1, $2, $3)
          ON CONFLICT (product_id, article_id)
          DO UPDATE SET article_count=$3 RETURNING product_id, article_id, article_count`,
        [productIds[i], +article.art_id, +article.amount_of],
      )));
      const resultsOps2 = await Promise.all(dbOps2.flat());
      logger.debug(resultsOps2.map((res) => res?.rows));

      return resultsOps1.map((res) => res?.rows);
    } catch (error) {
      logger.error(error);
      return { status: 'error', details: error.message };
    }
  };

  const sellProductById = async (id) => {
    logger.debug(`db:sellProductById called with id ${id}`);
    try {
      await client.query('BEGIN');
      await client.query('LOCK TABLE inventory IN ACCESS EXCLUSIVE MODE');

      const inStockResult = await client.query(
        'SELECT COUNT(*) AS in_stock FROM products_stock WHERE product_id=$1 AND stock > 0', [id],
      );
      logger.debug(`Product ${id} in stock? :`);
      logger.debug(!!+inStockResult.rows[0].in_stock);
      if (!+inStockResult.rows[0].in_stock) {
        throw new Error('Product is not in stock');
      }

      const articlesResult = await client.query(
        'SELECT article_id, article_count FROM products_x_articles WHERE product_id=$1', [id],
      );
      logger.debug(`Article for product ${id}:`);
      logger.debug(articlesResult.rows);

      const dbOps = articlesResult.rows.map((article) => client.query(
        'UPDATE inventory SET stock = stock-$1 WHERE id=$2 RETURNING id, stock',
        [article.article_count, article.article_id],
      ));
      const resultsOps = await Promise.all(dbOps);
      logger.debug(`Articles count after product ${id} sale:`);
      logger.debug(resultsOps.rows);

      await client.query('COMMIT');
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        logger.error(rollbackError.stack);
        return { status: 'rollback error', details: error.message };
      }
      logger.error(error.stack);
      return { status: 'error', details: error.message };
    }
    return true;
  };

  const upsertArticles = async (articles) => {
    logger.debug('db:upsertArticles called with: ');
    logger.debug(articles);
    try {
      const dbOps = articles.map((article) => client.query(
        `INSERT INTO inventory (id, name, stock) VALUES ($1, $2, $3)
          ON CONFLICT (id) DO UPDATE SET name=$2, stock=$3 RETURNING id, name, stock`,
        [+article.art_id, article.name, +article.stock],
      ));
      const results = await Promise.all(dbOps);

      logger.debug('db:upsertArticles results:');
      logger.debug(results.map((res) => res?.rows));

      return results.map((res) => res?.rows);
    } catch (error) {
      logger.error(error.stack);
      return { status: 'error', details: error.message };
    }
  };

  const getArticles = async () => {
    logger.debug('db:getArticles called');
    try {
      const results = await client.query('SELECT * FROM inventory');
      logger.debug('db:getArticles results:');
      logger.debug(results.rows);
      return results.rows;
    } catch (error) {
      logger.error(error.stack);
      return { status: 'error', details: error.message };
    }
  };

  const getArticleById = async (id) => {
    logger.debug(`db:getArticleById called with id ${id}`);
    try {
      const results = await client.query('SELECT * FROM inventory WHERE id=$1', [id]);
      logger.debug('db:getArticleById results:');
      logger.debug(results.rows);
      return results.rows;
    } catch (error) {
      logger.error(error.stack);
      return { status: 'error', details: error.message };
    }
  };

  return {
    health,
    upsertArticles,
    getArticles,
    getArticleById,
    getProducts,
    getProductById,
    upsertProducts,
    sellProductById,
  };
};

module.exports = db;
