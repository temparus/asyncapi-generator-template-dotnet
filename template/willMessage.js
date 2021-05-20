import {
  File,
  IndentationTypes,
  withIndendation,
} from '@asyncapi/generator-react-sdk';

// Import custom components from file
import CSharpFile from '../components/csFile';
import CSharpClass from '../components/csClass';
import { normalizeChannelName, normalizeName } from '../helpers/normalizeNames';
import { getNamespace } from '../helpers/namespace';
import { getMessageType } from '../helpers/channel';

export default function ({ asyncapi, params }) {
  const namespace = getNamespace(params);
  const channels = asyncapi.channels();
  const willChannelItem = Object.entries(channels).find(([, channel]) =>
    channel.ext('x-willMessage')
  );

  if (!willChannelItem) {
    return null;
  }

  const [, willChannel] = willChannelItem;

  return (
    <File name={`Messaging/WillMessage.cs`}>
      <WillMessageFile
        channel={willChannel}
        copyright={params.copyright}
        namespace={namespace}
      />
    </File>
  );
}

function WillMessageFile({ channel, copyright, namespace }) {
  const properties = channel.ext('x-willMessage');
  const messageType = getMessageType(channel.publish());

  return (
    <CSharpFile
      copyright={copyright}
      namespace={namespace}
      usingNamespaces={['EscapeEngineers.EscapeEngine.Messaging']}
    >
      <CSharpClass className="WillMessage" inheritance="IWillMessage">
        {`public ITopic Topic => ${normalizeChannelName(
          channel.ext(`x-name`)
        )}.CreateForPublish();\n\n`}
        {`public IMessage Message => new ${messageType}
{
${withIndendation(
  Object.entries(properties)
    .map(([name, value]) => `${normalizeName(name)} = ${JSON.stringify(value)}`)
    .join(`,\n`),
  4,
  IndentationTypes.SPACES
)}
};`}
      </CSharpClass>
    </CSharpFile>
  );
}
