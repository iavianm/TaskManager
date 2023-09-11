import FetchHelper from '../utils/fetchHelper';
import { apiV1TaskPath, apiV1TasksPath } from '../routes/ApiRoutes';

export default {
  index(params) {
    const path = apiV1TasksPath();
    return FetchHelper.get(path, params);
  },

  show(id) {
    const path = apiV1TaskPath(id);
    return FetchHelper.get(path);
  },

  update(id, task = {}) {
    const path = apiV1TaskPath(id);
    const body = {
      task: { ...task, id },
    };

    return FetchHelper.put(path, body);
  },

  create(task = {}) {
    const path = apiV1TasksPath();
    return FetchHelper.post(path, task);
  },

  destroy(id) {
    const path = apiV1TaskPath(id);
    return FetchHelper.delete(path);
  },
};
