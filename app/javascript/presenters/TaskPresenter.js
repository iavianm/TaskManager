import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';

export default new PropTypesPresenter({
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  author: PropTypes.shape(),
  assignee: PropTypes.shape(),
  imageUrl: PropTypes.string,
  state: PropTypes.string,
  expired_at: PropTypes.string,
  transitions: PropTypes.arrayOf(PropTypes.object),
});
