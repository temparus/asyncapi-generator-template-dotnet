import { getStringEnumName } from '../helpers/dataTypeNames';
import { normalizeName } from '../helpers/normalizeNames';

export default function Property({ name, prefix, schema }) {
  const finalType = getFinalType(name, prefix, schema);

  return `public ${finalType} ${normalizeName(name)} { get; set; }`;
}

function getFinalType(name, prefix, schema) {
  const type = schema.type();

  const typeMapping = { boolean: 'bool' };

  if (type === 'string' && schema.enum()) {
    return getStringEnumName(name, prefix, schema);
  } else if (type === 'array') {
    return `${getFinalType(name, prefix, schema.items())}[]`;
  } else if (typeMapping[type]) {
    return typeMapping[type];
  } else {
    return type;
  }
}
