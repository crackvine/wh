const Ajv = require('ajv');

const ajv = new Ajv();

const productsSchema = {
  type: 'object',
  properties: {
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          contain_articles: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                art_id: { type: ['integer', 'string'] },
                amount_of: { type: ['integer', 'string'] },
              },
              required: ['art_id', 'amount_of'],
            },
          },
        },
        required: ['name', 'contain_articles'],
      },
    },
  },
  required: ['products'],
};

const inventorySchema = {
  type: 'object',
  properties: {
    inventory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          art_id: { type: ['integer', 'string'] },
          name: { type: 'string' },
          stock: { type: ['integer', 'string'] },
        },
        required: ['art_id', 'name', 'stock'],
      },
    },
  },
  required: ['inventory'],
};

const validateProducts = ajv.compile(productsSchema);
const validateInventory = ajv.compile(inventorySchema);

module.exports = { validateProducts, validateInventory };
