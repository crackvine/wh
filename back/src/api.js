const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const api = ({
  config,
  logger,
  db,
  validator,
}) => {
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

    if (validator.validateProducts(req.body)) {
      try {
        const results = await db.upsertProducts(req.body.products);
        res.send(results);
      } catch (error) {
        logger.error(error);
        res.status(500).send(error);
      }
    } else {
      res.status(400).end(`products json failed validation: ${JSON.stringify(validator.validateProducts.errors)}`);
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

    if (validator.validateInventory(req.body)) {
      try {
        const results = await db.upsertArticles(req.body.inventory);
        res.send(results);
      } catch (error) {
        logger.error(error);
        res.status(500).send(error);
      }
    } else {
      res.status(400).end(`inventory json failed validation: ${JSON.stringify(validator.validateInventory.errors)}`);
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
};

module.exports = api;
