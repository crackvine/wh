const { Client } = require('pg');
const config = require('../config');
const logger = require('../src/logger')(config);

const runMigration = async () => {
  logger.info(`connecting to postgres DB at ${config.POSTGRES_HOST}:${config.POSTGRES_PORT}...`);

  const connectionData = {
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASS,
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    database: 'postgres',
  };

  let client;
  try {
    client = new Client(connectionData);
    await client.connect();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  logger.info('connected to postgres maintenance db');
  try {
    const createDbResult = await client.query(`CREATE DATABASE ${config.DATABASE_NAME}`);
    logger.debug(JSON.stringify(createDbResult, null, 2));
    logger.info(`database ${config.DATABASE_NAME} created`);
  } catch (error) {
    logger.error(error);
  }

  // TODO: include tables migrations

  await client.end();
};

runMigration();
