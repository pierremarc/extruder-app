
var extruder = require('./extruder');
var elecron = require('electron');

function main (e, data) {
    extruder();
}

/*
function(event, data) {
  document.getElementById('title').innerHTML = data.appName + ' App';
  document.getElementById('details').innerHTML = 'built with Electron v' + data.electronVersion;
  document.getElementById('versions').innerHTML = 'running on Node v' + data.nodeVersion + ' and Chromium v' + data.chromiumVersion;
}
 */

elecron.ipcRenderer.on('loaded' , main);
