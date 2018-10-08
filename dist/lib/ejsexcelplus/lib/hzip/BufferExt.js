exports.replaceBuf = function (begin, end, buf, buf2) {
    if (buf2 === undefined || buf2 === null) {
        buf2 = Buffer.allocUnsafe(0);
    }
    return Buffer.concat([buf.slice(0, begin), buf2, buf.slice(end)]);
};
//# sourceMappingURL=BufferExt.js.map