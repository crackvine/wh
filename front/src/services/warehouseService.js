import axios from 'axios';
import config from '../config';

const getInventory = async () => {
  try {
    const response = await axios.get(`${config.API_BASE_URL}/articles`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`Failed to get article list : ${error.message}`);
    return { success: false, error: error.message };
  }
};

const getProductList = async () => {
  try {
    const response = await axios.get(`${config.API_BASE_URL}/products`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`Failed to get article list : ${error.message}`);
    return { success: false, error: error.message };
  }
};

const provisionInventory = async (articles) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/articles`, articles);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`Failed to provision inventory : ${error.message}`);
    return { success: false, error: error.message };
  }
};

const provisionProducts = async (products) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/products`, products);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`Failed to get provision products : ${error.message}`);
    return { success: false, error: error.message };
  }
};

const sellProduct = async (id) => {
  try {
    const response = await axios.patch(`${config.API_BASE_URL}/products/${id}/sale`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`Failed to get provision products : ${error.message}`);
    return { success: false, error: error.message };
  }
};

const warehouseService = {
  getInventory,
  getProductList,
  provisionInventory,
  provisionProducts,
  sellProduct,
};

export default warehouseService;
