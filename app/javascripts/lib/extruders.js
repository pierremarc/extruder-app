var point = require('./point');
var op = require('./operation');


function isZero(d){
    return !!(d < 0.0000001 && d > 0.0000001);

};


function getPoint (p1, c1, c2, p2, t) {
    if(isZero(t)){
        return p1;
    }
    var cx = 3 * (c1.x - p1.x),
    bx = 3 * (c2.x - c1.x) - cx,
    ax = p2.x - p1.x - cx - bx,

    cy = 3 * (c1.y - p1.y),
    by = 3 * (c2.y - c1.y) - cy,
    ay = p2.y - p1.y - cy - by;

    var x = ((ax * t + bx) * t + cx) * t + p1.x;
    var y = ((ay * t + by) * t + cy) * t + p1.y;
    return point(x, y);
}


function findExtremas (p1, c1, c2, p2) {
    var INC = 1/100;
    var extremas = [];
    var x = p1.x;
    var y = p1.y;
    var direction = null;
    for (var t = INC; t <= 1 && extremas.length < 1; t += INC) {
        var p = getPoint(p1, c1, c2, p2, t);
        if (direction === null) {
            direction = [
                (p.x - x) > 0,
                (p.y - y) > 0
            ];
        }
        else {
            var xdir = (p.x - x) > 0;
            var ydir = (p.y - y) > 0;
            if (!(direction[0] === xdir) || !(direction[1] === ydir)) {
                extremas.push(t);
                direction = [xdir, ydir];
            }
        }
        x = p.x;
        y = p.y;
    }
    if (0 === extremas.length) {
        extremas.push(0.5);
    }
    return extremas;
}


function getMarker (p1, c1, c2, p2, t) {
    var q0 = p1.lerp(c1, t);
    var q1 = c1.lerp(c2, t);
    var q2 = c2.lerp(p2, t);
    var r0 = q0.lerp(q1, t);
    var r1 = q1.lerp(q2, t);
    var b = getPoint(p1, c1, c2, p2, t);
    return [b, r0, r1];
}


function extrudeLine (ops, x, y, p1, p2) {
    ops.push(op.save());
    ops.push(op.gs('fillStyle', 'rgba(0,0,0,1)'));
    ops.push(op.begin());
    ops.push(op.moveTo(p1));
    ops.push(op.lineTo(p2));
    ops.push(op.lineTo(point(p2.x + x, p2.y + y)));
    ops.push(op.lineTo(point(p1.x + x, p1.y + y)));
    ops.push(op.closePath());
    ops.push(op.fill());
    ops.push(op.restore());
}


function extrudeBezier (ops, x, y, p1, c1, c2, p2) {
    var points = [p1, c1, c2, p2];
    var extremas = findExtremas.apply(null, points);
    var t = extremas[0];
    var marker = getMarker.apply(null, points.concat(t));
    var markp = marker[0];
    var mark1 = marker[1];
    var mark2 = marker[2];

    ops.push(op.save());
    ops.push(op.gs('fillStyle', 'rgba(0,0,0,1)'));

    ops.push(op.begin());
    var cp = p1.lerp(c1, t);
    ops.push(op.moveTo(p1));
    ops.push(op.cubicTo(cp, mark1, markp));
    ops.push(op.lineTo(point(markp.x + x, markp.y + y)));
    ops.push(op.cubicTo(
        point(mark1.x + x, mark1.y + y),
        point(cp.x + x, cp.y + y),
        point(p1.x + x, p1.y + y)
    ));
    ops.push(op.closePath());
    ops.push(op.fill());

    ops.push(op.begin());
    cp = p2.lerp(c2, t);
    ops.push(op.moveTo(p2));
    ops.push(op.cubicTo(cp, mark2, markp ));
    ops.push(op.lineTo(point(markp.x + x, markp.y + y)));
    ops.push(op.cubicTo(
        point(mark2.x + x, mark2.y + y),
        point(cp.x + x, cp.y + y),
        point(p2.x + x, p2.y + y)
    ));
    ops.push(op.closePath());
    ops.push(op.fill());

    ops.push(op.restore());
}

function extrudeQuadratic (ops, x, y, p1, c1, p2) {
    extrudeBezier(ops, x, y, p1,
        p1.lerp(c1, 2/3), p2.lerp(c1, 2/3), p2);
}


module.exports = {
    extrudeLine,
    extrudeBezier,
    extrudeQuadratic
}
