import PropTypes from 'prop-types';

const Article = ({ article: { id, name, stock } }) => (
  <li>[id:{id}] {name} - stock: {stock}</li>
);

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
