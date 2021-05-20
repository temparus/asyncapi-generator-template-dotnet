import { Text, File } from '@asyncapi/generator-react-sdk';

// Import custom components from file
import CSharpFile from '../components/csFile';
import CSharpClass from '../components/csClass';
import { normalizeName } from '../helpers/normalizeNames';
import { getNamespace } from '../helpers/namespace';
import { getOwnDeviceId } from '../helpers/ownDeviceId';

export default function ({ asyncapi, params }) {
  const servers = asyncapi.servers();
  const clientId = getOwnDeviceId(asyncapi, params);
  const namespace = getNamespace(params, ['MqttBrokerInfo']);

  return Object.entries(servers).map(([serverName, server]) => {
    const name = `${normalizeName(serverName)}MqttBrokerInfo`;
    return (
      <File name={`Messaging/MqttBrokerInfo/${name}.cs`}>
        <ServerFile
          serverName={name}
          server={server}
          clientId={clientId}
          copyright={params.copyright}
          namespace={namespace}
        />
      </File>
    );
  });
}

function ServerFile({ serverName, server, clientId, copyright, namespace }) {
  const url = server.url();
  const [address, port] = url.split(':', 2);
  return (
    <CSharpFile
      copyright={copyright}
      namespace={namespace}
      usingNamespaces={['System', 'EscapeEngineers.EscapeEngine.Messaging']}
    >
      <CSharpClass
        className={serverName}
        description={server.description()}
        inheritance="IMqttBrokerInfo"
      >
        <Text>{`public string Address => "${address}";\n`}</Text>
        <Text>{`public int Port => ${port};\n`}</Text>
        <Text>{`public string ClientId => "${clientId}";\n`}</Text>
        <Text>{`public TimeSpan ReconnectDelay => TimeSpan.FromSeconds(5);`}</Text>
      </CSharpClass>
    </CSharpFile>
  );
}
