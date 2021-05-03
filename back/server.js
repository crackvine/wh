require('dotenv').config();

const config = require('./config');
const getLogger = require('./src/logger');
const getDb = require('./src/db');
const api = require('./src/api');

const start = async () => {
  const logger = getLogger(config);

  try {
    logger.debug('bringing up api...');
    const db = await getDb({ config, logger });
    const app = api({ config, logger, db });
    app.listen(config.PORT, config.HOST);
    logger.info(`server listening on ${config.HOST}:${config.PORT}`);
  } catch (error) {
    logger.error(error);
  }
};

start();
