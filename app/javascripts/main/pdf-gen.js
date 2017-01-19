
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Context = require('../lib/ctx-pdf');
const op = require('../lib/operation');

module.exports = exports = function gen (ops) {
    const doc = new PDFDocument();
    const ctx = new Context(doc);

    doc.pipe(fs.createWriteStream('output.pdf'));
    op.render(ctx, ops);
    doc.end();
};
