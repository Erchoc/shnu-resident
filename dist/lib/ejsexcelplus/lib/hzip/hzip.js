var fs = require("fs");
var crc = require("./crc32");
var zlib = require("zlib");
var BufferExt = require("./BufferExt");
var Hzip = function (buffer) {
    var t = this;
    t.buffer = buffer;
    t.getEntries();
};
Hzip.prototype.getEntries = function () {
    var t = this;
    var buffer = t.buffer;
    var entries = t.entries = [];
    var entries0102 = t.entries0102 = [];
    var tmp = 0;
    while (true) {
        if (tmp > buffer.length)
            break;
        if (buffer[tmp] !== 0x50 || buffer[tmp + 1] !== 0x4B) {
            tmp++;
            continue;
        }
        if (buffer[tmp + 2] === 0x03 && buffer[tmp + 3] === 0x04) {
            var entry = {};
            tmp = t.getEntry0304(tmp, entry);
            entries.push(entry);
        }
        else if (buffer[tmp + 2] === 0x01 && buffer[tmp + 3] === 0x02) {
            var entry = {};
            tmp = t.getEntry0102(tmp, entry);
            entries0102.push(entry);
        }
        else {
            tmp++;
            continue;
        }
    }
    return t;
};
Hzip.prototype.getEntry0102 = function (tmp, entry) {
    var t = this;
    var buffer = t.buffer;
    entry.begin = tmp;
    tmp += 4;
    entry.versionMadeBy = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.unzipVersion = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.generalPurpose = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.compressionWay = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.lastModifyTime = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.lastModifyDate = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.crc32 = buffer.slice(tmp, tmp + 4);
    tmp += 4;
    entry.cfileSize = buffer.slice(tmp, tmp + 4).readInt32LE(0);
    tmp += 4;
    entry.fileSize = buffer.slice(tmp, tmp + 4).readInt32LE(0);
    tmp += 4;
    var n = entry.fileNameSize = buffer.slice(tmp, tmp + 2).readInt16LE(0);
    tmp += 2;
    var m = entry.extraFieldSize = buffer.slice(tmp, tmp + 2).readInt16LE(0);
    tmp += 2;
    var k = entry.fileCommentSize = buffer.slice(tmp, tmp + 2).readInt16LE(0);
    tmp += 2;
    var k = entry.diskNumStarts = buffer.slice(tmp, tmp + 2).readInt16LE(0);
    tmp += 2;
    entry.internalFileAttrs = buffer.slice(tmp, tmp + 2).readInt16LE(0);
    tmp += 2;
    entry.externalFileAttrs = buffer.slice(tmp, tmp + 4).readInt32LE(0);
    tmp += 4;
    entry.offsetOfHeader = buffer.slice(tmp, tmp + 4).readInt32LE(0);
    tmp += 4;
    entry.fileName = buffer.slice(tmp, tmp + n).toString();
    tmp += n;
    entry.extraField = buffer.slice(tmp, tmp + m);
    tmp += m;
    entry.fileComment = buffer.slice(tmp, tmp + k).toString();
    tmp += k;
    entry.end = tmp;
    return tmp;
};
Hzip.prototype.getEntry0304 = function (tmp, entry) {
    var t = this;
    var buffer = t.buffer;
    entry.begin = tmp;
    tmp += 4;
    entry.unzipVersion = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.generalPurpose = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.compressionWay = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.lastModifyTime = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    entry.lastModifyDate = buffer.slice(tmp, tmp + 2);
    tmp += 2;
    if (entry.generalPurpose[0] === 0x08 && entry.generalPurpose[1] === 0x08 && entry.compressionWay[0] === 0x08 && entry.compressionWay[1] === 0x00) {
        tmp += 12;
        entry.fileNameSize = buffer.slice(tmp, tmp + 4).readInt32LE(0);
        tmp += 4;
        entry.fileName = buffer.slice(tmp, tmp + entry.fileNameSize).toString();
        tmp += entry.fileNameSize;
        for (var i = tmp; i < buffer.length; i++) {
            if (buffer[i] === 0x50 && buffer[i + 1] === 0x4B && buffer[i + 2] === 0x07 && buffer[i + 3] === 0x08) {
                entry.crc32 = buffer.slice(i + 4, i + 8);
                entry.cfileSize = buffer.slice(i + 8, i + 12).readInt32LE(0);
                entry.fileSize = buffer.slice(i + 12, i + 16).readInt32LE(0);
                break;
            }
        }
        entry.cfile = buffer.slice(tmp, tmp + entry.cfileSize);
        tmp += entry.cfileSize;
        tmp += 16;
    }
    else {
        entry.crc32 = buffer.slice(tmp, tmp + 4);
        tmp += 4;
        entry.cfileSize = buffer.slice(tmp, tmp + 4).readInt32LE(0);
        tmp += 4;
        entry.fileSize = buffer.slice(tmp, tmp + 4).readInt32LE(0);
        tmp += 4;
        entry.fileNameSize = buffer.slice(tmp, tmp + 2).readInt16LE(0);
        tmp += 2;
        entry.extraFieldSize = buffer.slice(tmp, tmp + 2).readInt16LE(0);
        tmp += 2;
        entry.fileName = buffer.slice(tmp, tmp + entry.fileNameSize).toString();
        tmp += entry.fileNameSize;
        var b20a2 = buffer.slice(tmp, tmp + 2);
        var extraFieldSize = entry.extraFieldSize;
        if (extraFieldSize > 0) {
            entry.extraField = buffer.slice(tmp, tmp + extraFieldSize);
        }
        else
            extraFieldSize = 0;
        if (b20a2[0] === 0x20 && b20a2[1] === 0xA2) {
            tmp += 2;
            var tg = buffer.slice(tmp, tmp + 2).readInt16LE(0);
            tmp += 2;
            tmp += tg;
        }
        else
            tmp += extraFieldSize;
        entry.cfile = buffer.slice(tmp, tmp + entry.cfileSize);
        tmp += entry.cfileSize;
    }
    entry.end = tmp;
    return tmp;
};
Hzip.prototype.getEntry = function (fileName, type) {
    type = type || "";
    var t = this;
    var entries = t["entries" + type];
    var entry = undefined;
    for (var i = 0; i < entries.length; i++) {
        if (fileName === entries[i].fileName) {
            entry = entries[i];
            break;
        }
    }
    return entry;
};
Hzip.prototype.zip = function (fileComment, comment) {
    fileComment = fileComment || "";
    comment = comment || "";
    var t = this;
    t.getEntries();
    var entries0102 = [];
    for (var i = 0; i < t.entries.length; i++) {
        var entry = t.entries[i];
        var n = entry.fileNameSize;
        var m = 0;
        var k = fileComment.length;
        var entry0102 = Buffer.allocUnsafe(46 + n + m + k);
        entries0102.push(entry0102);
        entry0102[0] = 0x50;
        entry0102[1] = 0x4B;
        entry0102[2] = 0x01;
        entry0102[3] = 0x02;
        entry0102[4] = 0x2D;
        entry0102[5] = 0x00;
        entry0102[6] = entry.unzipVersion[0];
        entry0102[7] = entry.unzipVersion[1];
        entry0102[8] = entry.generalPurpose[0];
        entry0102[9] = entry.generalPurpose[1];
        entry0102[10] = entry.compressionWay[0];
        entry0102[11] = entry.compressionWay[1];
        entry0102[12] = entry.lastModifyDate && entry.lastModifyDate[0];
        entry0102[13] = entry.lastModifyDate && entry.lastModifyDate[1];
        entry0102[14] = entry.lastModifyDate && entry.lastModifyDate[0];
        entry0102[15] = entry.lastModifyDate && entry.lastModifyDate[1];
        entry0102[16] = entry.crc32[0];
        entry0102[17] = entry.crc32[1];
        entry0102[18] = entry.crc32[2];
        entry0102[19] = entry.crc32[3];
        entry0102.writeInt32LE(entry.cfileSize, 20);
        entry0102.writeInt32LE(entry.fileSize, 24);
        entry0102.writeInt16LE(n, 28);
        entry0102.writeInt16LE(m, 30);
        entry0102.writeInt16LE(k, 32);
        entry0102.writeInt16LE(0, 34);
        entry0102[36] = 0x00;
        entry0102[37] = 0x00;
        entry0102[38] = 0x00;
        entry0102[39] = 0x00;
        entry0102[40] = 0x00;
        entry0102[41] = 0x00;
        entry0102.writeInt32LE(entry.begin, 42);
        var fileNameBuf = Buffer.from(entry.fileName);
        for (var j = 0; j < n; j++) {
            entry0102[46 + j] = fileNameBuf[j];
        }
        var fileCommentBuf = Buffer.from(fileComment);
        for (var j = 0; j < k; j++) {
            entry0102[46 + n + m + j] = fileCommentBuf[j];
        }
    }
    var entry0506 = Buffer.allocUnsafe(22 + comment.length);
    entry0506[0] = 0x50;
    entry0506[1] = 0x4B;
    entry0506[2] = 0x05;
    entry0506[3] = 0x06;
    entry0506[4] = 0x00;
    entry0506[5] = 0x00;
    entry0506[6] = 0x00;
    entry0506[7] = 0x00;
    entry0506.writeInt16LE(entries0102.length, 8);
    entry0506.writeInt16LE(entries0102.length, 10);
    var entries0102Size = 0;
    for (var i = 0; i < entries0102.length; i++) {
        entries0102Size += entries0102[i].length;
    }
    entry0506.writeInt32LE(entries0102Size, 12);
    var entriesSize = 0;
    for (var i = 0; i < t.entries.length; i++) {
        entriesSize = entriesSize + t.entries[i].end - t.entries[i].begin;
    }
    entry0506.writeInt32LE(entriesSize, 16);
    entry0506.writeInt16LE(comment.length, 20);
    var commentBuf = Buffer.from(comment);
    for (var i = 0; i < commentBuf.length; i++) {
        entry0506[22 + i] = commentBuf[i];
    }
    var lenbuf1 = 0;
    lenbuf1 += entriesSize;
    for (var i = 0; i < entries0102.length; i++) {
        var entry0102 = entries0102[i];
        lenbuf1 += entry0102.length;
    }
    lenbuf1 += entry0506.length;
    var buffer1 = Buffer.allocUnsafe(lenbuf1);
    var targetStart = 0;
    for (var i = 0; i < t.entries.length; i++) {
        t.buffer.copy(buffer1, targetStart, t.entries[i].begin, t.entries[i].end);
        targetStart = targetStart + t.entries[i].end - t.entries[i].begin;
    }
    for (var i = 0; i < entries0102.length; i++) {
        var entry0102 = entries0102[i];
        entry0102.copy(buffer1, targetStart);
        targetStart += entry0102.length;
    }
    entry0506.copy(buffer1, targetStart);
    t.buffer = buffer1;
    t.getEntries();
};
Hzip.prototype.removeEntry = function (fileName) {
    var t = this;
    var entry = t.getEntry(fileName);
    if (entry !== undefined && entry !== null) {
        t.buffer = BufferExt.replaceBuf(entry.begin, entry.end, t.buffer);
        t.zip();
    }
};
Hzip.prototype.updateEntry = function (fileName, fileBuf, isDefRaw, callback) {
    var t = this;
    var arglen = arguments.length;
    for (var i = arglen - 1; i >= 0; i--) {
        var arg = arguments[i];
        if (typeof arg === "function") {
            callback = arg;
            break;
        }
    }
    if (typeof fileBuf === "function")
        fileBuf = undefined;
    if (typeof isDefRaw === "function")
        isDefRaw = undefined;
    if (fileBuf === undefined || fileBuf === null) {
        t.removeEntry(fileName);
        if (callback)
            callback(null, t.buffer);
        return;
    }
    if (!Buffer.isBuffer(fileBuf)) {
        fileBuf = Buffer.from(fileBuf);
    }
    t.toEntryBuf(fileName, fileBuf, isDefRaw, function (err, buf) {
        var entry = t.getEntry(fileName);
        var begin = 0;
        var end = 0;
        if (entry) {
            begin = entry.begin;
            end = entry.end;
        }
        t.buffer = BufferExt.replaceBuf(begin, end, t.buffer, buf);
        t.zip();
        if (callback)
            callback(err, t.buffer);
    });
};
Hzip.prototype.toEntryBuf = function (fileName, fileBuf, isDefRaw, callback) {
    var c32Num = crc.crc32(fileBuf);
    var fileLength = fileBuf.length;
    if (!Buffer.isBuffer(fileName))
        fileName = Buffer.from(fileName);
    var tmpFn = function (err, cfile) {
        var eb = Buffer.allocUnsafe(30 + fileName.length + cfile.length);
        eb[0] = 0x50;
        eb[1] = 0x4B;
        eb[2] = 0x03;
        eb[3] = 0x04;
        if (isDefRaw !== false) {
            eb[4] = 0x14;
            eb[5] = 0x00;
            eb[6] = 0x06;
            eb[7] = 0x00;
            eb[8] = 0x08;
            eb[9] = 0x00;
        }
        else {
            eb[4] = 0x0A;
            eb[5] = 0x00;
            eb[6] = 0x00;
            eb[7] = 0x00;
            eb[8] = 0x00;
            eb[9] = 0x00;
        }
        eb[10] = 0x00;
        eb[11] = 0x00;
        eb[12] = 0x21;
        eb[13] = 0x00;
        eb.writeInt32LE(c32Num, 14);
        eb.writeInt32LE(cfile.length, 18);
        eb.writeInt32LE(fileLength, 22);
        eb.writeInt16LE(fileName.length, 26);
        eb.writeInt16LE(0, 28);
        for (var i = 0; i < fileName.length; i++) {
            eb[i + 30] = fileName[i];
        }
        for (var i = 0; i < cfile.length; i++) {
            eb[i + 30 + fileName.length] = cfile[i];
        }
        callback(err, eb);
    };
    if (isDefRaw === false) {
        tmpFn(null, fileBuf);
    }
    else {
        zlib.deflateRaw(fileBuf, tmpFn);
    }
};
module.exports = Hzip;
//# sourceMappingURL=hzip.js.map