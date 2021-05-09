import PropTypes from 'prop-types';
import Product from './Product';

const ProductList = ({ products, onSellOne }) => (
  <ul>
    <span>PRODUCT LIST</span>
    {
      products && products.length
        ? products.map((product) => <Product key={product.id} product={product} onSellOne={onSellOne} />)
        : <li>0 products</li>
    }
  </ul>
);

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      stock: PropTypes.number,
    }),
  ),
  onSellOne: PropTypes.func.isRequired,
};

ProductList.defaultProps = {
  products: [],
};

export default ProductList;
