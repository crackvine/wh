const supertest = require('supertest');

const config = require('./config');
const getLogger = require('../src/logger');
const getDb = require('../src/db');
const validator = require('../src/validator');
const api = require('../src/api');

const logger = getLogger(config);

const articlesOneJson = require('./fixtures/mockInventoryOne.json');
const expectedArticlesOne = require('./fixtures/expectedArticlesOne.json');
const productsOneJson = require('./fixtures/mockProductsOne.json');
const expectedProductsOne = require('./fixtures/expectedProductsOne.json');
const productsTwoJson = require('./fixtures/mockProductsTwo.json');
const expectedProductsTwo = require('./fixtures/expectedProductsTwo.json');
const expectedArticlesThree = require('./fixtures/expectedArticlesThree.json');

describe('[Integrations tests]', () => {
  let request;
  let db;

  beforeAll(async () => {
    db = await getDb({ config, logger });
    const app = api({
      config,
      logger,
      db,
      validator,
    });
    request = supertest(app);
  });

  test('should provision sample articles', async () => {
    await request.post('/articles').send(articlesOneJson).expect(200);
    const inserted = await request.get('/articles');
    expect(inserted.body).toStrictEqual(expectedArticlesOne);
  });

  test('invalid inventory json should generate a validation error', async () => {
    await request.post('/articles').send({ inv: 'xxx' }).expect(400);
  });

  test('should provision sample products', async () => {
    await request.post('/products').send(productsOneJson).expect(200);
    const inserted = await request.get('/products');
    expect(inserted.body).toStrictEqual(expectedProductsOne);
  });

  test('invalid products json should generate a validation error', async () => {
    await request.post('/products').send({ inv: 'xxx' }).expect(400);
  });

  test('a product sale should reduce inventory as expected', async () => {
    await request.post('/articles').send(articlesOneJson).expect(200);
    const insertedArticles = await request.get('/articles');
    expect(insertedArticles.body).toStrictEqual(expectedArticlesOne);
    await request.post('/products').send(productsTwoJson).expect(200);
    const insertedProducts = await request.get('/products');
    expect(insertedProducts.body).toStrictEqual(expectedProductsTwo);
    await request.patch('/products/3/sale');
    const productsAfterSale = await request.get('/products');
    expect(productsAfterSale.body[2].stock).toBe(0);
    const articlesAfterSale = await request.get('/articles');
    expect(articlesAfterSale.body).toStrictEqual(expectedArticlesThree);
  });

  afterAll(async () => {
    db.endConnection();
  });
});
