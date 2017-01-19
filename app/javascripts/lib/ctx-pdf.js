

function ContextPDF (doc) {
    Object.defineProperty(this, 'ctx', {
        value: doc
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
    // TODO
};

ContextPDF.prototype.moveTo = function (p) {
    this.ctx.moveTo(p.x, p.y);
};

ContextPDF.prototype.lineTo = function (p) {
    this.ctx.lineTo(p.x, p.y);
};

ContextPDF.prototype.cubicTo = function (c1, c2, p) {
    this.ctx.bezierCurveTo(c1.x, c1.y,
                           c2.x, c2.y,
                           p.x, p.y);
};

ContextPDF.prototype.quadraticTo = function (c1, p) {
    this.ctx.quadraticCurveTo(c1.x, c1.y, p.x, p.y);
};

ContextPDF.prototype.closePath = function () {
    this.ctx.closePath();
};

ContextPDF.prototype.set = function (k, v) {
    if ('strokeStyle' === k) {
        this.ctx.strokeColor(v);
    }
    else if ('fillStyle' === k) {
        this.ctx.fillColor(v);
    }
    else {
        try {
            this.ctx[k](v);
        }
        catch (err) {
            // pass
        }
    }
};

ContextPDF.prototype.stroke = function () {
    this.ctx.stroke();
};

ContextPDF.prototype.fill = function () {
    this.ctx.fill();
};


module.exports = ContextPDF;
