const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = require('../config');
const logger = require('../src/logger')(config);

const runMigration = async (testsDatabase = false) => {
  logger.info(`connecting to postgres DB at ${config.POSTGRES_HOST}:${config.POSTGRES_PORT}...`);

  const connectionData = {
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASS,
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
  };

  let client;
  try {
    client = new Client({ ...connectionData, database: 'postgres' });
    await client.connect();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
  logger.info('connected to postgres maintenance database');

  const databaseName = testsDatabase ? 'warehouse_test' : config.DATABASE_NAME;
  try {
    const createDbResult = await client.query(`CREATE DATABASE ${databaseName}`);
    logger.debug(createDbResult);
    logger.info(`database ${config.DATABASE_NAME} created`);
  } catch (error) {
    logger.error(error);
  }

  await client.end();

  try {
    client = new Client({ ...connectionData, database: databaseName });
    await client.connect();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
  logger.info(`connected to database ${databaseName}`);

  const productsSql = fs.readFileSync(path.join(__dirname, 'migrations', 'products.sql'), 'utf8');
  const inventorySql = fs.readFileSync(path.join(__dirname, 'migrations', 'inventory.sql'), 'utf8');
  const productsArticlesSql = fs.readFileSync(path.join(__dirname, 'migrations', 'products_x_articles.sql'), 'utf8');
  const productsStockSql = fs.readFileSync(path.join(__dirname, 'migrations', 'products_stock.sql'), 'utf8');
  try {
    await client.query(productsSql);
    await client.query(inventorySql);
    await client.query(productsArticlesSql);
    await client.query(productsStockSql);
    logger.info('tables created');
  } catch (error) {
    logger.error(error);
  }

  await client.end();
};

runMigration();
