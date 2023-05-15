import _ from 'lodash'

export const splitAndReplace = (str) => {
  const parts = str.split('_');
  const lastPart = parts.pop();
  const firstPart = parts.join('_');

  return [firstPart, lastPart];
}
  
  
export const endsWithList = (str) => {
  return str.endsWith('_list');
}

export const removeListSuffix = (str) => {
  const suffix = '_list';

  if (str.endsWith(suffix)) {
      return str.slice(0, -suffix.length);
  }

  return str;
}

export const findErrMessage = (obj) => {
  let result = [];
  if (_.isArray(obj)) {
    obj.forEach(item => {
      result = result.concat(findErrMessage(item));
    });
  } else if (_.isObject(obj)) {
    _.forIn(obj, (value, key) => {
      if ((key === 'message' && value !== 'Request failed with status code 400') || (key === 'error'  && _.isString(value))) {
        result.push(value);
      } else {
        result = result.concat(findErrMessage(value));
      }
    });
  }
  return result.join('\n');
}