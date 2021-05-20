var fs = require('fs');
var path = require('path');

const prepareFolders = generator => {
  const targetDir = generator.targetDir;
  const folders = ['Messaging', 'Messaging/MqttBrokerInfo'];

  folders.forEach(folder => {
    const folderPath = path.join(targetDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
};

module.exports = { 'generate:before': prepareFolders };
