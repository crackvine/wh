const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// TODO: include validation for post endpoints incoming JSON files

const api = ({ config, logger, db }) => {
  const app = express();

  app.use(helmet());
  app.use(express.json());

  app.use(cors({
    origin: config.CORS_ALLOWED_SOURCE,
  }));

  app.get('/', (req, res) => {
    res.send('Hello');
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
      res.status(results.length ? 200 : 404).send(results);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  app.patch('/products/:id/sale', async (req, res) => {
    const { id } = req.params;
    // TODO check in stock
    try {
      const results = await db.sellProductById(id);
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
      res.status(results.length ? 200 : 404).send(results);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  });

  return app;
  // app.listen(config.PORT, config.HOST);
  // logger.info(`server listening on ${config.HOST}:${config.PORT}`);
};

module.exports = api;
