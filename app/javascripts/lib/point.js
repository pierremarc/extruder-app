

function Point (x, y) {
    Object.defineProperty(this, 'x', {value: x});
    Object.defineProperty(this, 'y', {value: y});
}

Point.prototype.plus = function (p) {
    return (new Point(this.x + p.x, this.y + p.y));
};

Point.prototype.minus = function (p) {
    return (new Point(this.x - p.x, this.y - p.y));
};

Point.prototype.mul = function (p) {
    return (new Point(this.x * p.x, this.y * p.y));
};

Point.prototype.div = function (p) {
    return (new Point(this.x / p.x, this.y / p.y));
};

Point.prototype.lerp = function (p, t) {
    var rx = this.x + (p.x - this.x) * t;
    var ry = this.y + (p.y - this.y) * t;
    return (new Point(rx, ry));
};

Point.prototype.coordinates = function () {
    return [this.x, this.y];
};

function point (x, y) {
    if (Array.isArray(x)) {
        y = x[1];
        x = x[0];
    }
    return new Point(x,y);
}


module.exports = exports = point;
