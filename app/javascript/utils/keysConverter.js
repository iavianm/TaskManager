import humps from 'humps';

export const toSnakeCase = (obj) => humps.decamelizeKeys(obj);
export const toCamelCase = (obj) => humps.camelizeKeys(obj);
