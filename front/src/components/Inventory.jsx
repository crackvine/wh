import PropTypes from 'prop-types';

import Article from './Article';

const Inventory = ({ articles }) => (
  <ul>
    <span>INVENTORY</span>
    {
      articles && articles.length
        ? articles.map((article) => <Article key={article.id} article={article} />)
        : <li>inventory empty</li>
    }
  </ul>
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
