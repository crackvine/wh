import { useState, useEffect } from 'react';

import config from '../config';
import warehouseService from '../services/warehouseService';

import ProductList from './ProductList';
import Inventory from './Inventory';
import ProvisionItemsForm from './ProvisionItemsForm';

const Main = () => {
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);
  const [provisioned, setProvisioned] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getItems = async () => {
    setIsLoading(true);

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

    setIsLoading(false);
  };

  const handleProvision = async (payload) => {
    setIsLoading(true);

    if (payload[config.payloadInventoryField]) { // payload contains articles
      const result = await warehouseService.provisionInventory(payload);

      if (result.success) {
        alert('articles provisioned!');
        setProvisioned(result);
      } else {
        alert(`failed to provision articles: ${result.error}`);
      }
    } else if (payload[config.payloadProductsField]) { // payload contains products
      const result = await warehouseService.provisionProducts(payload);

      if (result.success) {
        alert('products provisioned!');
        setProvisioned(result);
      } else {
        alert(`failed to provision products: ${result.error}`);
      }
    } else {
      alert('could not identify type of data contained in the file');
    }

    setIsLoading(false);
  };

  const onSellOne = (id) => {
    console.log('sell one of product ID ', id);
  };

  useEffect(() => {
    getItems();
  }, [provisioned]);

  return (
    isLoading
      ? <div>...loading...</div>
      : (
        <>
          <ProductList products={products} onSellOne={onSellOne} />
          <Inventory articles={articles} />
          <ProvisionItemsForm handleProvision={handleProvision} />
        </>
      )
  );
};

export default Main;
