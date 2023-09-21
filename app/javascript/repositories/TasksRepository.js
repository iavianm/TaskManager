import FetchHelper from 'utils/fetchHelper';
import routes from '../routes';

export default {
  index(params) {
    const path = routes.apiV1TasksPath();
    return FetchHelper.get(path, params);
  },

  show(id) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.get(path);
  },

  update(id, task = {}) {
    const path = routes.apiV1TaskPath(id);
    const body = {
      task: { ...task },
    };

    return FetchHelper.put(path, body);
  },

  create(task = {}) {
    const path = routes.apiV1TasksPath();
    return FetchHelper.post(path, task);
  },

  destroy(id) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.delete(path);
  },
};
