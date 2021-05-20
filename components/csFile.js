import {
  IndentationTypes,
  withIndendation,
} from '@asyncapi/generator-react-sdk';

export default function CSharpClass({
  copyright,
  usingNamespaces = [],
  namespace,
  childrenContent,
}) {
  return `// ${copyright}
//
// WARNING! This is a generated file and must not be changed manually!

${usingNamespaces.map(namespace => `using ${namespace};`).join('\n')}

namespace ${namespace}
{
${withIndendation(childrenContent, 4, IndentationTypes.SPACES)}
}
`;
}
