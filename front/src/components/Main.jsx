import { useState, useEffect } from 'react';
import warehouseService from '../services/warehouseService';

import ProductList from './ProductList';
import Inventory from './Inventory';

const Main = () => {
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getItems = async () => {
      const getArticlesResponse = await warehouseService.getInventory();
      if (getArticlesResponse.success) {
        setArticles(getArticlesResponse.data);
      } else {
        alert(getArticlesResponse.error);
      }
      const getProductsResponse = await warehouseService.getProductList();
      if (getProductsResponse.success) {
        setProducts(getProductsResponse.data);
      } else {
        alert(getProductsResponse.error);
      }
    };

    getItems();
  }, []);

  return (
    <div>
      <ProductList products={products} />
      <Inventory articles={articles} />
    </div>
  );
};

export default Main;
