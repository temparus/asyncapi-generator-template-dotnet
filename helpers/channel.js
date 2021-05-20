import { normalizeMessageName } from './normalizeNames';

export function getMessageType(operation) {
  // Restriction: Only one message allowed!
  const message = operation.message(0);

  if (message.payload.type === 'null') return 'void';
  return normalizeMessageName(message.name());
}

export function getMqttBinding(operation) {
  if (operation.hasBinding('mqtt')) {
    return operation.binding('mqtt');
  }
  return getDefaultMqttBinding();
}

export function getDefaultMqttBinding() {
  return { qos: 2, retain: false, bindingVersion: '0.1.0' };
}
