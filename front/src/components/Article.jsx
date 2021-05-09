import PropTypes from 'prop-types';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Build } from '@material-ui/icons';

const Article = ({ article: { id, name, stock } }) => {
  const primaryText = `${name} - stock: ${stock}`;
  const secondaryText = `id: ${id}`;
  return (
    <ListItem>
      <ListItemIcon><Build /></ListItemIcon>
      <ListItemText primary={primaryText} secondary={secondaryText} />
    </ListItem>
  );
};

Article.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    stock: PropTypes.number,
  }),
};

Article.defaultProps = {
  article: {
    id: null,
    name: '',
    stock: 0,
  },
};

export default Article;
