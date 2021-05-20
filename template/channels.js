import { File } from '@asyncapi/generator-react-sdk';

// Import custom components from file
import CSharpFile from '../components/csFile';
import CSharpClass from '../components/csClass';
import { normalizeChannelName } from '../helpers/normalizeNames';
import qosLevel from '../helpers/qosLevel';
import { getNamespace } from '../helpers/namespace';
import { getMessageType, getMqttBinding } from '../helpers/channel';

export default function ({ asyncapi, params }) {
  const channels = asyncapi.channels();
  const namespace = getNamespace(params);

  return Object.entries(channels).map(([channelName, channel]) => {
    const name = normalizeChannelName(channel.ext(`x-name`));
    return (
      <File name={`Messaging/${name}.cs`}>
        <TopicFile
          name={name}
          channelName={channelName}
          channel={channel}
          copyright={params.copyright}
          namespace={namespace}
        />
      </File>
    );
  });
}

function TopicFile({ name, channelName, channel, copyright, namespace }) {
  const parameterType = channel.hasParameters()
    ? `${name}TopicParameters`
    : 'NoTopicParameters';
  const methods = [];

  if (channel.hasPublish()) {
    const operation = channel.publish();
    const messageType = getMessageType(operation);
    const mqttBinding = getMqttBinding(operation);
    methods.push(`public static PublishTopic<${parameterType}, ${messageType}> CreateForPublish()
{
    return new PublishTopic<${parameterType}, ${messageType}>(
        "${channelName}", ${mqttBinding.retain ? 'true' : 'false'}, ${
      qosLevel[mqttBinding.qos]
    }, typeof(${name})
    );
}`);
  }

  if (channel.hasSubscribe()) {
    const operation = channel.subscribe();
    const messageType = getMessageType(operation);
    const mqttBinding = getMqttBinding(operation);
    methods.push(`public static SubscribeTopic<${parameterType}, ${messageType}> CreateForSubscribe()
{
    return new SubscribeTopic<${parameterType}, ${messageType}>(
        "${channelName}", ${mqttBinding.retain ? 'true' : 'false'}, ${
      qosLevel[mqttBinding.qos]
    }, typeof(${name})
    );
}`);
  }

  return (
    <CSharpFile
      copyright={copyright}
      namespace={namespace}
      usingNamespaces={['EscapeEngineers.EscapeEngine.Messaging']}
    >
      <CSharpClass
        className={name}
        description={channel.description()}
        isStatic
      >
        {methods.join(`\n\n`)}
      </CSharpClass>
    </CSharpFile>
  );
}
