import {
  IndentationTypes,
  withIndendation,
} from '@asyncapi/generator-react-sdk';

export default function CSharpClass({
  className,
  inheritance,
  description,
  isStatic,
  childrenContent,
}) {
  let inheritanceString;
  if (Array.isArray(inheritance) && inheritance.length > 0) {
    inheritanceString = inheritance.join(', ');
  } else if (typeof inheritance === 'string' || inheritance instanceof String) {
    inheritanceString = inheritance;
  }

  let summary = '';
  if (description) {
    summary = `/// <summary>
///   ${description}
/// </summary>\n`;
  }

  return `${summary}public ${isStatic ? 'static ' : ''}class ${className}${
    inheritanceString ? ` : ${inheritanceString}` : ''
  }
{
${withIndendation(childrenContent, 4, IndentationTypes.SPACES)}
}`;
}
