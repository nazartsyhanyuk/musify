export const parseHash = (urlString = ''): any => {
  return urlString.split('&').reduce((res, el) => {
    const [key, value] = el.split('=');
    res[key] = value;
    return res;
  }, {});
};

export const createQueryString = (params = {}) => {
  const keys = Object.keys(params);
  if (!keys.length) {
    return '';
  }

  return keys.map(param => `${param}=${params[param]}`).join('&');
};

export const isEqual = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a.prototype !== b.prototype) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => isEqual(a[k], b[k]));
};

export const toCamelCase = str => {
  const s = str && str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

export const  mapApiResponse = response => {
  return response.reduce((acc, dataElement) => ({...acc, ...dataElement}), {});
};

export const parseArtists = artists => artists && artists.reduce((acc, {name, uri}) => {
  const id = uri.match(/[^:]+$/)[0];
  return [...acc, {name, id}];
}, []);

