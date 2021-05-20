import {
  IndentationTypes,
  withIndendation,
} from '@asyncapi/generator-react-sdk';
import { normalizeName } from '../helpers/normalizeNames';

export default function StringEnum({ name, values, description }) {
  const properties = values.map(
    value =>
      `public static readonly ${name} ${normalizeName(
        value
      )} = Create("${value}");`
  );

  let summary = '';
  if (description) {
    summary = `/// <summary>
///   ${description}
/// </summary>\n`;
  }

  return `${summary}/// <completionlist cref="${name}"/>
[TypeConverter(typeof(StringEnumTypeConverter<${name}>))]
public sealed class ${name} : StringEnum<${name}>
{
${withIndendation(properties.join('\n\n'), 4, IndentationTypes.SPACES)}
}`;
}
