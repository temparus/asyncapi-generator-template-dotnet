import { File } from '@asyncapi/generator-react-sdk';

// Import custom components from file
import CSharpFile from '../components/csFile';
import StringEnum from '../components/stringEnum';
import { getStringEnumName } from '../helpers/dataTypeNames';
import { getNamespace } from '../helpers/namespace';
import { normalizeName } from '../helpers/normalizeNames';

export default function ({ asyncapi, params }) {
  const namespace = getNamespace(params);

  return [
    ...processChannelParameters(asyncapi, params.copyright, namespace),
    ...processMessageProperties(asyncapi, params.copyright, namespace),
  ];
}

function processSchema(
  name,
  prefix,
  schema,
  description,
  copyright,
  namespace
) {
  const filePath = 'Messaging/';

  let finalName;

  let content;
  let usingNamespaces = [];
  if (schema.type() === 'string' && schema.enum()) {
    finalName = getStringEnumName(name, prefix, schema);
    usingNamespaces = [
      'System.ComponentModel',
      'EscapeEngineers.EscapeEngine.Utils',
    ];
    content = (
      <StringEnum
        name={finalName}
        description={description}
        values={schema.enum()}
        copyright={copyright}
        namespace={namespace}
      />
    );
  }

  if (content) {
    return (
      <File name={`${filePath}/${finalName}.cs`}>
        <CSharpFile
          copyright={copyright}
          namespace={namespace}
          usingNamespaces={usingNamespaces}
        >
          {content}
        </CSharpFile>
      </File>
    );
  }

  return null;
}

function processChannelParameters(asyncapi, copyright, namespace) {
  const channels = asyncapi.channels();

  const items = [];

  Object.entries(channels).forEach(([, channel]) => {
    const prefix = normalizeName(channel.ext('x-name'));
    if (channel.hasParameters()) {
      Object.entries(channel.parameters()).forEach(([, parameter]) => {
        const name = normalizeName(parameter.ext('x-parser-schema-id'));
        const schema = parameter.schema();

        const result = processSchema(
          name,
          prefix,
          schema,
          parameter.description(),
          copyright,
          namespace
        );

        if (result) items.push(result);
      });
    }
  });

  return items;
}

function processMessageProperties(asyncapi, copyright, namespace) {
  const messages = asyncapi.allMessages();

  const items = [];

  Array.from(messages).forEach(([messageName, message]) => {
    const payload = message.payload();
    const properties = payload.properties();
    const prefix = normalizeName(messageName);

    Object.entries(properties).forEach(([propertyName, property]) => {
      const result = processSchema(
        propertyName,
        prefix,
        property,
        property.description(),
        copyright,
        namespace
      );

      if (result) items.push(result);
    });
  });

  return items;
}
