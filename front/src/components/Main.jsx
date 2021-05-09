import { useState, useEffect } from 'react';
import {
  Container,
  CircularProgress,
  Grid,
  Divider,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import config from '../config';
import warehouseService from '../services/warehouseService';

import ProductList from './ProductList';
import Inventory from './Inventory';
import ProvisionItemsForm from './ProvisionItemsForm';

const Main = () => {
  const [articles, setArticles] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, severity: 'info', message: null });

  const getItems = async () => {
    setIsLoading(true);

    const getArticlesResponse = await warehouseService.getInventory();
    if (getArticlesResponse.success) {
      setArticles(getArticlesResponse.data);
    } else {
      setNotification({ show: true, severity: 'error', message: getArticlesResponse.error });
    }

    const getProductsResponse = await warehouseService.getProductList();
    if (getProductsResponse.success) {
      setProducts(getProductsResponse.data);
    } else {
      setNotification({ show: true, severity: 'error', message: getProductsResponse.error });
    }

    setIsLoading(false);
  };

  const handleProvision = async (payload) => {
    if (payload[config.payloadInventoryField]) { // payload contains articles
      const result = await warehouseService.provisionInventory(payload);

      if (result.success) {
        setNotification({ show: true, severity: 'info', message: 'articles provisioned!' });
      } else {
        setNotification({ show: true, severity: 'error', message: result.error });
      }
    } else if (payload[config.payloadProductsField]) { // payload contains products
      const result = await warehouseService.provisionProducts(payload);

      if (result.success) {
        setNotification({ show: true, success: 'info', message: 'products provisioned!' });
      } else {
        setNotification({ show: true, severity: 'error', message: result.error });
      }
    } else {
      setNotification({
        show: true,
        severity: 'error',
        message: 'could not identify type of data contained in the file',
      });
    }
    getItems();
  };

  const handleSellOne = async (id) => {
    const result = await warehouseService.sellProduct(id);
    if (result.success) {
      setNotification({ show: true, severity: 'success', message: `one of product ${id} sold` });
    } else {
      setNotification({ show: true, severity: 'error', message: result.error });
    }
    getItems();
  };

  useEffect(() => {
    console.log('fetching');
    getItems();
  }, []);

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} border={1}>
          <ProductList products={products} handleSellOne={handleSellOne} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Inventory articles={articles} />
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={2}>
        <Grid item md={12} style={{ marginBottom: '2em' }}>
          <ProvisionItemsForm handleProvision={handleProvision} />
        </Grid>
      </Grid>
      <Divider />
      {isLoading
        ? <Container align="center" maxWidth="sm"><CircularProgress color="secondary" /></Container>
        : notification.show
            && (
              <Alert
                severity={notification.severity}
                onClose={() => { setNotification({ show: false, severity: 'info', message: null }); }}
              >{ notification.message }
              </Alert>
            )}
    </Container>
  );
};

export default Main;
