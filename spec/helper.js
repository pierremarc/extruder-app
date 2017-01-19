var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', 'Extruder-darwin-x64', 'Extruder.app', 'Contents', 'MacOS', 'Extruder');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', 'Extruder-linux-x64', 'Extruder');
      default:
        throw 'Unsupported platform';
    }
  }
};
