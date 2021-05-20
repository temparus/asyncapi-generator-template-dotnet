import { normalizeName } from './normalizeNames';

export const getStringEnumName = (name, prefix, schema) => {
  const xName = schema.ext('x-name');

  if (xName) {
    return normalizeName(xName);
  }
  return `${normalizeName(prefix)}${normalizeName(name)}`;
};
