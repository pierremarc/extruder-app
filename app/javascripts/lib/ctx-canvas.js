

function ContextCanvas (canvasElement) {
    Object.defineProperty(this, 'ctx', {
        value: canvasElement.getContext('2d')
    });
    Object.defineProperty(this, '_canvas', {
        value: canvasElement
    });
}


ContextCanvas.prototype.bezierCurveTo = function () {
    this.ctx.bezierCurveTo.apply(this.ctx, arguments);
};

ContextCanvas.prototype.quadraticCurveTo = function () {
    this.ctx.quadraticCurveTo.apply(this.ctx, arguments);
};

ContextCanvas.prototype.save = function () {
    this.ctx.save();
};

ContextCanvas.prototype.restore = function () {
    this.ctx.restore();
};


ContextCanvas.prototype.begin = function () {
    this.ctx.beginPath();
};

ContextCanvas.prototype.moveTo = function (p) {
    this.ctx.moveTo(p.x, p.y);
};

ContextCanvas.prototype.lineTo = function (p) {
    this.ctx.lineTo(p.x, p.y);
};

ContextCanvas.prototype.cubicTo = function (c1, c2, p) {
    this.ctx.bezierCurveTo(c1.x, c1.y,
                           c2.x, c2.y,
                           p.x, p.y);
};

ContextCanvas.prototype.quadraticTo = function (c1, p) {
    this.ctx.quadraticCurveTo(c1.x, c1.y, p.x, p.y);
};

ContextCanvas.prototype.closePath = function () {
    this.ctx.closePath();
};

ContextCanvas.prototype.set = function (k, v) {
    this.ctx[k] = v;
};

ContextCanvas.prototype.stroke = function () {
    this.ctx.stroke();
};

ContextCanvas.prototype.fill = function () {
    this.ctx.fill();
};

module.exports = ContextCanvas;
