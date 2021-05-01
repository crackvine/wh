module.exports = {
  PORT: process.env.PORT || 4000,
  HOST: process.env.HOST || '0.0.0.0',
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASS: process.env.POSTGRES_PASS || 'postgres',
  DATABASE_NAME: process.env.DATABASE_NAME || 'warehouse',
  PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME || 'products',
  INVENTORY_TABLE_NAME: process.env.INVENTORY_TABLE_NAME || 'inventory',
  DEBUG: true,
};
