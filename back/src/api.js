const express = require('express');
const helmet = require('helmet');

// TODO: include validation for post endpoints incoming jsons

const api = ({ config, logger, db }) => {
  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.get('/status', async (req, res) => {
    try {
      const dbStatus = await db.health();
      // TODO: include os.freemem and os.loadavg
      res.send(dbStatus);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  app.post('/products', async (req, res) => {
    logger.debug('incoming products: ');
    logger.debug(req.body);
    try {
      const results = await db.upsertProducts(req.body.products);
      res.send(results);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  app.get('/products', async (req, res) => {
    try {
      const results = await db.getProducts();
      res.send(results);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const results = await db.getProductById(id);
      res.send(results);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  app.post('/articles', async (req, res) => {
    logger.debug('incoming articles: ');
    logger.debug(req.body);
    try {
      const results = await db.upsertArticles(req.body.inventory);
      res.send(results);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  app.get('/articles', async (req, res) => {
    try {
      const results = await db.getArticles();
      res.send(results);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  app.get('/articles/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const results = await db.getArticleById(id);
      res.send(results);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  app.listen(config.PORT, config.HOST);
  logger.info(`server listening on ${config.HOST}:${config.PORT}`);
};

module.exports = api;
