/*!
 * EJS
 * Copyright(c) 2012 TJ Holowaychuk <tj#vision-media.ca>
 * MIT Licensed
 */
var fs = require('fs');
var path = require('path');
var basename = path.basename;
var dirname = path.dirname;
var extname = path.extname;
var join = path.join;
var filters = exports.filters = require('./filters');
function filtered(js) {
    return js.substr(1).split('|').reduce(function (js, filter) {
        var parts = filter.split(':'), name = parts.shift(), args = parts.shift() || '';
        if (args)
            args = ', ' + args;
        return 'filters.' + name + '(' + js + args + ')';
    });
}
;
function rethrow(err, str, filename, lineno) {
    var lines = str.split('\n'), start = Math.max(lineno - 3, 0), end = Math.min(lines.length, lineno + 3);
    var context = lines.slice(start, end).map(function (line, i) {
        var curr = i + start + 1;
        return (curr == lineno ? ' >> ' : '    ')
            + curr
            + '| '
            + line;
    }).join('\n');
    err.path = filename;
    err.message = (filename || 'ejs') + ':'
        + lineno + '\n'
        + context + '\n\n'
        + err.message;
    throw err;
}
var parse = exports.parse = function (str, options) {
    if (Buffer.isBuffer(str))
        str = str.toString();
    options = options || {};
    var open = options.open || exports.open || '<%', close = options.close || exports.close || '%>', beforeBuf = options.beforeBuf || exports.beforeBuf || '', filename = options.filename, reXmlEq = options.reXmlEq, buf = [];
    buf.push('var buf = [];');
    buf.push(beforeBuf);
    buf.push(';buf.push(new Buffer(\'');
    var lineno = 1;
    var consumeEOL = false;
    for (var i = 0, len = str.length; i < len; ++i) {
        if (str.slice(i, open.length + i) == open) {
            i += open.length;
            var pixEq = str.substr(i, 1);
            var prefix, postfix, line = lineno;
            if (pixEq === "=" || pixEq === "-" || pixEq === "~" || pixEq === "#") {
                prefix = "'));buf.push(new Buffer(String(";
                postfix = ")));buf.push(new Buffer('";
                ++i;
            }
            else {
                prefix = "'));";
                postfix = ";buf.push(new Buffer('";
            }
            var end = str.indexOf(close, i), js = str.substring(i, end), start = i, include = null, n = 0;
            if ('-' == js[js.length - 1]) {
                js = js.substring(0, js.length - 2);
                consumeEOL = true;
            }
            while (~(n = js.indexOf("\n", n)))
                n++, lineno++;
            if (js.substr(0, 1) == ':')
                js = filtered(js);
            if (js) {
                if (js.lastIndexOf('//') > js.lastIndexOf('\n'))
                    js += '\n';
                if (reXmlEq !== undefined && (pixEq === "=" || pixEq === "-" || pixEq === "~" || pixEq === "#"))
                    js = reXmlEq(pixEq, js);
                buf.push(prefix, js, postfix);
            }
            i += end - start + close.length - 1;
        }
        else if (str.substr(i, 1) == "\\") {
            buf.push("\\\\");
        }
        else if (str.substr(i, 1) == "'") {
            buf.push("\\'");
        }
        else if (str.substr(i, 1) == "\r") {
            buf.push(" ");
        }
        else if (str.substr(i, 1) == "\n") {
            if (consumeEOL) {
                consumeEOL = false;
            }
            else {
                buf.push("\\n");
                lineno++;
            }
        }
        else {
            buf.push(str.substr(i, 1));
        }
    }
    buf.push("'));");
    buf.push("buf=Buffer.concat(buf);return buf;");
    return buf.join('');
};
function resolveInclude(name, filename) {
    var path = join(dirname(filename), name);
    var ext = extname(name);
    if (!ext)
        path += '.ejs';
    return path;
}
//# sourceMappingURL=ejs.js.map