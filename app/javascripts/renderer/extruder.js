
var electron = require('electron');
var opentype = require('opentype.js');
var point = require('../lib/point');
var Context = require('../lib/ctx-canvas');
var extruders = require('../lib/extruders');
var op = require('../lib/operation');

var extrudeLine = extruders.extrudeLine;
var extrudeBezier = extruders.extrudeBezier;
var extrudeQuadratic = extruders.extrudeQuadratic;


function extrude (text, fontData) {
    var canvas = document.createElement('canvas');
    var download = document.createElement('div');
    canvas.width = 1200;
    canvas.height = 760;
    document.body.appendChild(canvas);

    var ctx = new Context(canvas);
    var x = 1;
    var y = 1;

    function render (font) {
        var ops = [];
        ctx.ctx.clearRect(0, 0, canvas.width, canvas.height);
        var paths = font.getPaths(text, 100, 500, 164);


        paths.forEach(function (path) {
            var commands = path.commands;
            var currentPosition = point(0, 0);
            var firstMove = point(0, 0);
            for (var i = 0; i < commands.length; i++) {
                var cmd = commands[i];
                switch (cmd.type) {
                    case 'M':
                    currentPosition = point(cmd.x, cmd.y);
                    firstMove = point(cmd.x, cmd.y);
                    break;

                    case 'L':
                    extrudeLine(ops, x, y, currentPosition, point(cmd.x, cmd.y));
                    currentPosition = point(cmd.x, cmd.y);
                    break;

                    case 'C':
                    var c1 = point(cmd.x1, cmd.y1);
                    var c2 = point(cmd.x2, cmd.y2);
                    var p2 = point(cmd.x, cmd.y);
                    extrudeBezier(ops, x, y, currentPosition, c1, c2, p2);
                    currentPosition = p2;
                    break;

                    case 'Q':
                    var c1 = point(cmd.x1, cmd.y1);
                    var p2 = point(cmd.x, cmd.y);
                    extrudeQuadratic(ops, x, y, currentPosition, c1, p2);
                    currentPosition = p2;
                    break;

                    case 'Z':
                    extrudeLine(ops, x, y, currentPosition, firstMove);
                    currentPosition = firstMove;
                }
            }

        });

        ops.push(op.save());
        ops.push(op.gs('fillStyle', 'white'));
        ops.push(op.gs('strokeStyle', 'white'));
        ops.push(op.gs('lineWidth', 1));
        paths.forEach(function (path) {
            ops.push(op.begin());
            var commands = path.commands;
            var currentPosition = point(0, 0);
            var firstMove = point(0, 0);
            for (var i = 0; i < commands.length; i++) {
                var cmd = commands[i];
                switch (cmd.type) {
                    case 'M':
                    ops.push(op.moveTo(point(cmd.x, cmd.y)));
                    break;

                    case 'L':
                    ops.push(op.lineTo(point(cmd.x, cmd.y)));
                    break;

                    case 'C':
                    var c1 = point(cmd.x1, cmd.y1);
                    var c2 = point(cmd.x2, cmd.y2);
                    var p2 = point(cmd.x, cmd.y);
                    ops.push(op.cubicTo(c1, c2, p2));
                    break;

                    case 'Q':
                    var c1 = point(cmd.x1, cmd.y1);
                    var p2 = point(cmd.x, cmd.y);
                    ops.push(op.quadraticTo(c1, p2));
                    break;

                    case 'Z':
                    ops.push(op.closePath());
                }
            }
            ops.push(op.fill());
            ops.push(op.stroke());
        });
        ops.push(op.restore());
        return ops;
    }

    var font = opentype.parse(fontData);
    if (font.supported) {
        render(font);
        var isMoving = false;
        var startPos = null;
        var startOffset = null;

        var startMoving = function (e) {
            isMoving = true;
            startPos = point(e.clientX, e.clientY);
        };

        var stopMoving = function (e) {
            isMoving = false;
            var move = point(e.clientX, e.clientY).minus(startPos);
            x += move.x;
            y += move.y;
            render(font);
        };

        var updateDrawing = function (e) {
            if (isMoving) {
                var move = point(e.clientX, e.clientY).minus(startPos);
                var initialX = x;
                var initialY = y;
                var ops;
                x += move.x;
                y += move.y;
                ops = render(font);
                x = initialX;
                y = initialY;
                op.render(ctx, ops);
            }
        };
        canvas.addEventListener('mousedown', startMoving, false);
        canvas.addEventListener('mouseup', stopMoving, false);
        canvas.addEventListener('mousemove', updateDrawing, false);

        download.value = 'Generate!';
        document.body.appendChild(download);
        download.addEventListener('click', () => {
            electron.ipcRenderer.send('generate:pdf', render(font));
        });
    }



};


function main () {
    var finput = document.createElement('input');
    finput.type = 'file';
    var tinput = document.createElement('input');
    tinput.type = 'text';
    var submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'start';
    document.body.appendChild(finput);
    finput.addEventListener('change', (e) => {
        var file = finput.files[0];
        var reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            document.body.removeChild(finput);
            document.body.appendChild(tinput);
            document.body.appendChild(submit)
            submit.addEventListener('click', () => {
                var text = tinput.value;
                document.body.removeChild(tinput);
                document.body.removeChild(submit);

                extrude(text, reader.result);
            });

        });
        reader.readAsArrayBuffer(file);
    })
}

module.exports = exports = main;
