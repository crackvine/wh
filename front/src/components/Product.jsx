import PropTypes from 'prop-types';

const Product = ({ product: { id, name, stock }, onSellOne }) => (
  <li className="my-5 border-gray-300">
    [id:{id}] {name} - stock: {stock}
    <button type="button" onClick={() => onSellOne(id)}>
      sell one
    </button>
  </li>
);

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    stock: PropTypes.number,
  }),
  onSellOne: PropTypes.func.isRequired,
};

Product.defaultProps = {
  product: {
    id: null,
    name: '',
    stock: 0,
  },
};

export default Product;
