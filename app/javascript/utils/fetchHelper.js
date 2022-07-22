import axios from 'axios';
import qs from 'qs';

import { toCamelCase, toSnakeCase } from './keysConverter';

function authenticityToken() {
  const token = document.querySelector('meta[name="csrf-token"]');
  return token ? token.content : null;
}

function headers() {
  return {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'X-CSRF-Token': authenticityToken(),
    'X-Requested-With': 'XMLHttpRequest',
  };
}

axios.defaults.headers.post = headers();
axios.defaults.headers.put = headers();
axios.defaults.headers.delete = headers();
axios.interceptors.response.use(null, (error) => {
  if (error.response.status === 422) {
    const {
      response: { data: errors },
    } = error;
    return Promise.reject(toCamelCase(errors.errors));
  }

  if (error.response.status === 500) {
    return Promise.reject(new Error('Something went wrong, please retry again'));
  }

  return Promise.reject(error);
});

export default {
  get(url, params = {}) {
    return axios
      .get(url, {
        params: toSnakeCase(params),
        paramsSerializer: (parameters) => qs.stringify(parameters, { encode: false }),
      })
      .then(toCamelCase);
  },

  post(url, json) {
    const body = toSnakeCase(json);

    return axios.post(url, body).then(toCamelCase);
  },

  put(url, json) {
    const body = toSnakeCase(json);

    return axios.put(url, body).then(toCamelCase);
  },

  delete(url, json) {
    return axios
      .delete(url, {
        data: toSnakeCase(json),
      })
      .then(toCamelCase);
  },
};
