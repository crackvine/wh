import PropTypes from 'prop-types';
import { Typography, List, ListItem } from '@material-ui/core';

import Product from './Product';

const ProductList = ({ products, handleSellOne }) => (
  <>
    <Typography variant="h6" align="center">PRODUCT LIST</Typography>
    <List>
      {
        products && products.length
          ? products.map((product) => <Product key={product.id} product={product} handleSellOne={handleSellOne} />)
          : <ListItem>0 products</ListItem>
      }
    </List>
  </>
);

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      stock: PropTypes.number,
    }),
  ),
  handleSellOne: PropTypes.func.isRequired,
};

ProductList.defaultProps = {
  products: [],
};

export default ProductList;
