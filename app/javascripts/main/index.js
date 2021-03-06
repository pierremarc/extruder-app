var electron, path, json;

path = require('path');
json = require('../../package.json');
electron = require('electron');

const pdfGen = require('./pdf-gen');

electron.app.on('ready', function() {
    var window;

    window = new electron.BrowserWindow({
        title: json.name,
        width: json.settings.width,
        height: json.settings.height
    });

    window.loadURL('file://' + path.join(__dirname, '..', '..') + '/index.html');

    window.webContents.on('did-finish-load', function(){
        window.webContents.send('loaded', {
            appName: json.name,
            electronVersion: process.versions.electron,
            nodeVersion: process.versions.node,
            chromiumVersion: process.versions.chrome
        });
    });

    window.on('closed', function() {
        window = null;
    });

    window.on('generate:pdf', (ops) => {
        pdfGen(ops);
    });

});
