import { File } from '@asyncapi/generator-react-sdk';

// Import custom components from file
import CSharpFile from '../components/csFile';
import CSharpClass from '../components/csClass';
import { normalizeName } from '../helpers/normalizeNames';
import Property from '../components/property';
import { getNamespace } from '../helpers/namespace';

export default function ({ asyncapi, params }) {
  const channels = asyncapi.channels();
  const namespace = getNamespace(params);

  return Object.entries(channels).map(([, channel]) => {
    const name = normalizeName(channel.ext(`x-name`));
    return (
      channel.hasParameters() && (
        <File name={`Messaging/${name}TopicParameters.cs`}>
          <TopicParametersFile
            name={name}
            channel={channel}
            copyright={params.copyright}
            namespace={namespace}
          />
        </File>
      )
    );
  });
}

function TopicParametersFile({ name, channel, copyright, namespace }) {
  return (
    <CSharpFile copyright={copyright} namespace={namespace}>
      <CSharpClass className={`${name}TopicParameters`}>
        {Object.entries(channel.parameters()).map(([, parameter]) => {
          return (
            <Property
              name={parameter.ext('x-parser-schema-id')}
              prefix={name}
              schema={parameter.schema()}
            />
          );
        })}
      </CSharpClass>
    </CSharpFile>
  );
}
