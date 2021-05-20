import React from 'react';
import { File } from '@asyncapi/generator-react-sdk';

// Import custom components from file
import CSharpFile from '../components/csFile';
import CSharpClass from '../components/csClass';
import { normalizeMessageName } from '../helpers/normalizeNames';
import Property from '../components/property';
import { getNamespace } from '../helpers/namespace';

export default function ({ asyncapi, params }) {
  const messages = asyncapi.allMessages();
  const namespace = getNamespace(params);

  return Array.from(messages).map(([messageName, message]) => {
    const name = normalizeMessageName(messageName);

    if (message.payload().type() === 'object') {
      return (
        <File key={name} name={`Messaging/${name}.cs`}>
          <MessageFile
            messageName={name}
            message={message}
            copyright={params.copyright}
            namespace={namespace}
          />
        </File>
      );
    }
    return null;
  });
}

function MessageFile({ messageName, message, copyright, namespace }) {
  const payload = message.payload();
  const properties = payload.properties();
  const propertiesCount = Object.entries(properties).length;

  return (
    <CSharpFile
      copyright={copyright}
      namespace={namespace}
      usingNamespaces={['EscapeEngineers.EscapeEngine.Messaging']}
    >
      <CSharpClass
        className={messageName}
        description={message.summary()}
        inheritance="IMessage"
      >
        {Object.entries(properties).map(([propertyName, property], index) => {
          return (
            <React.Fragment key={propertyName}>
              <Property
                name={propertyName}
                prefix={messageName}
                schema={property}
              />
              {index < propertiesCount - 1 && `\n\n`}
            </React.Fragment>
          );
        })}
      </CSharpClass>
    </CSharpFile>
  );
}
