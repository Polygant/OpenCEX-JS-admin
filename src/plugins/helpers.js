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