
var point = require('./point');

const OP_BEGIN = 'b';
const OP_MOVE = 'm';
const OP_LINE = 'l';
const OP_CUBIC = 'c';
const OP_QUADRATIC = 'q';
const OP_CLOSE = 'z';
const OP_SET = 's';
const OP_STROKE = 'S';
const OP_FILL = 'F';
const OP_SAVE = 'SA';
const OP_RESTORE = 'R'


function begin () {
    return [OP_BEGIN];
}

function moveTo (pt) {
    return [OP_MOVE, pt.coordinates()];
}

function lineTo (pt) {
    return [OP_LINE, pt.coordinates()];
}

function cubicTo (c1, c2, pt) {
    return [
        OP_CUBIC,
        c1.coordinates(),
        c2.coordinates(),
        pt.coordinates()
    ];
}

function quadraticTo (c1, pt) {
    return [
        OP_QUADRATIC,
        c1.coordinates(),
        pt.coordinates()
    ];
}

function closePath (pt) {
    return [OP_CLOSE];
}


function gs (k, v) {
    return [OP_SET, k, v];
}

function stroke () {
    return [OP_STROKE];
}

function fill () {
    return [OP_FILL];
}

function save () {
    return [OP_SAVE];
}

function restore () {
    return [OP_RESTORE];
}


function renderBegin (ctx) {
    ctx.begin();
}

function renderMoveTo (ctx, op) {
    var p = point(op[1]);
    ctx.moveTo(p);
}

function renderLineTo (ctx, op) {
    var p = point(op[1]);
    ctx.lineTo(p);
}

function renderCubicTo (ctx, op) {
    var c1 = point(op[1]);
    var c2 = point(op[2]);
    var p = point(op[3]);
    ctx.cubicTo(c1, c2, p);
}

function renderQuadraticTo (ctx, op) {
    var c1 = point(op[1]);
    var p = point(op[2]);
    ctx.quadraticTo(c1, p);
}

function renderClosePath (ctx) {
    ctx.closePath();
}

function renderGS (ctx, op) {
    ctx.set(op[1], op[2]);
}

function renderStroke (ctx) {
    ctx.stroke();
}

function renderFill (ctx) {
    ctx.fill();
}

function renderSave (ctx) {
    ctx.save();
}

function renderRestore (ctx) {
    ctx.restore();
}

function render (ctx, operations) {
    for (var i = 0; i < operations.length; i++) {
        var op = operations[i];
        var op_code = op[0];

        if (OP_BEGIN === op_code) {
            renderBegin(ctx);
        }
        else if (OP_MOVE === op_code) {
            renderMoveTo(ctx, op);
        }
        else if (OP_LINE === op_code) {
            renderLineTo(ctx, op);
        }
        else if (OP_CUBIC === op_code) {
            renderCubicTo(ctx, op);
        }
        else if (OP_QUADRATIC === op_code) {
            renderQuadraticTo(ctx, op);
        }
        else if (OP_CLOSE === op_code) {
            renderClosePath(ctx, op);
        }
        else if (OP_SET === op_code) {
            renderGS(ctx, op);
        }
        else if (OP_STROKE === op_code) {
            renderStroke(ctx, op);
        }
        else if (OP_FILL === op_code) {
            renderFill(ctx, op);
        }
        else if (OP_SAVE === op_code) {
            renderSave(ctx);
        }
        else if (OP_RESTORE === op_code) {
            renderRestore(ctx);
        }
    }
}



module.exports = {
    begin,
    moveTo,
    lineTo,
    cubicTo,
    quadraticTo,
    closePath,
    gs,
    stroke,
    fill,
    save,
    restore,
    render
}
