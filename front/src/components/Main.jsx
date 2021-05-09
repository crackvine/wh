import { useState, useEffect } from 'react';
import warehouseService from '../services/warehouseService';

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
      <h1>MAIN</h1>
      <ul>
        { articles && articles.map((article) => <li>{article.name}</li>) }
      </ul>
      <ul>
        { products && products.map((product) => <li>{product.name}</li>) }
      </ul>
    </div>
  );
};

export default Main;
