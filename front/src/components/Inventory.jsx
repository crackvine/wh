import PropTypes from 'prop-types';
import { Typography, List, ListItem } from '@material-ui/core';

import Article from './Article';

const Inventory = ({ articles }) => (
  <>
    <Typography variant="h6" align="center">INVENTORY</Typography>
    <List>
      {
      articles && articles.length
        ? articles.map((article) => <Article key={article.id} article={article} />)
        : <ListItem>inventory empty</ListItem>
      }
    </List>
  </>
);

Inventory.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      stock: PropTypes.number,
    }),
  ),
};

Inventory.defaultProps = {
  articles: [],
};

export default Inventory;
