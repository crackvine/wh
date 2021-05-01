require('dotenv').config();

const config = require('./config');
const getLogger = require('./logger');
const getDb = require('./db');
const api = require('./api');

const start = async () => {
  const logger = getLogger(config);

  try {
    logger.debug('bringing up api...');
    const db = await getDb({ config, logger });
    api({ config, logger, db });
  } catch (error) {
    logger.error(error);
  }
};

start();
