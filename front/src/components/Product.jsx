import PropTypes from 'prop-types';
import {
  Button, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';

const Product = ({ product: { id, name, stock }, handleSellOne }) => {
  const primaryText = `${name} - stock: ${stock}`;
  const secondaryText = `id: ${id}`;
  return (
    <ListItem>
      <ListItemIcon><ShoppingCart /></ListItemIcon>
      <ListItemText primary={primaryText} secondary={secondaryText} />
      <Button variant="contained" color="primary" type="button" onClick={() => handleSellOne(id)}>
        sell one
      </Button>
    </ListItem>
  );
};

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    stock: PropTypes.number,
  }),
  handleSellOne: PropTypes.func.isRequired,
};

Product.defaultProps = {
  product: {
    id: null,
    name: '',
    stock: 0,
  },
};

export default Product;
