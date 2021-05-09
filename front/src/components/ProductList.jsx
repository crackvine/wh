import PropTypes from 'prop-types';

import Product from './Product';

const ProductList = ({ products }) => {
  const onSale = (id) => {
    console.log('sale for product of ID ', id);
  };

  return (
    <ul>
      <span>PRODUCT LIST</span>
      {
        products && products.length
          ? products.map((product) => <Product key={product.id} product={product} onSale={onSale} />)
          : <li>0 products</li>
      }
    </ul>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      stock: PropTypes.number,
    }),
  ),
};

ProductList.defaultProps = {
  products: [],
};

export default ProductList;
