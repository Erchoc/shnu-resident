var SaxJs = require('../../sax-js');
SaxJs.MAX_BUFFER_LENGTH = Infinity;
var fs = require('fs');
var obj = {};
var currentObject = {};
var ancestors = [];
var currentElementName = null;
var options = {};
function startElement(name, attrs) {
    currentElementName = name;
    if (options.coerce) {
        Object.keys(attrs).forEach(function (key) {
            attrs[key] = coerce(attrs[key]);
        });
    }
    if (!(name in currentObject)) {
        currentObject[name] = attrs;
    }
    else if (!(currentObject[name] instanceof Array)) {
        var newArray = [currentObject[name]];
        newArray.push(attrs);
        currentObject[name] = newArray;
    }
    else {
        currentObject[name].push(attrs);
    }
    ancestors.push(currentObject);
    if (currentObject[name] instanceof Array) {
        currentObject = currentObject[name][currentObject[name].length - 1];
    }
    else {
        currentObject = currentObject[name];
    }
}
function text(data) {
    if (options.trim) {
        data = data.trim();
    }
    if (options.sanitize) {
        if (options.sanitizeFn !== undefined) {
            data = options.sanitizeFn(data);
        }
        else {
            data = sanitize(data);
        }
    }
    currentObject['$t'] = coerce((currentObject['$t'] || '') + data);
}
function endElement(name) {
    if (currentElementName !== name) {
        delete currentObject['$t'];
    }
    var ancestor = ancestors.pop();
    if (!options.reversible) {
        if ((Object.keys(currentObject).length == 1) && ('$t' in currentObject)) {
            if (ancestor[name] instanceof Array) {
                ancestor[name].push(ancestor[name].pop()['$t']);
            }
            else {
                ancestor[name] = currentObject['$t'];
            }
        }
    }
    currentObject = ancestor;
}
function coerce(value) {
    if (!options.coerce) {
        return value;
    }
    var num = Number(value);
    if (!isNaN(num)) {
        return num;
    }
    var _value = value.toLowerCase();
    if (_value == 'true' || _value == 'yes') {
        return true;
    }
    if (_value == 'false' || _value == 'no') {
        return false;
    }
    return value;
}
function sanitize(value) {
    if (typeof value !== 'string') {
        return value;
    }
    value = value.replace(new RegExp("&", "gm"), "&amp;")
        .replace(new RegExp("<", "gm"), "&lt;")
        .replace(new RegExp(">", "gm"), "&gt;");
    return value;
}
module.exports = function (xml, _options) {
    if (_options === undefined)
        _options = {};
    if (Buffer.isBuffer(xml))
        xml = xml.toString();
    startElement = _options.startElement || startElement;
    endElement = _options.endElement || endElement;
    var parser = new SaxJs.parser(true);
    parser.onopentag = function (node) {
        startElement(node.name, node.attributes);
    };
    parser.ontext = text;
    parser.onclosetag = endElement;
    obj = currentObject = {};
    ancestors = [];
    currentElementName = null;
    options = {
        object: true, reversible: true, coerce: false, trim: false, sanitize: false
    };
    for (var opt in _options) {
        options[opt] = _options[opt];
    }
    parser.write(xml).close();
    if (options.object) {
        return obj;
    }
    var json = JSON.stringify(obj);
    json = json.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    return json;
};
module.exports.startElement = startElement;
module.exports.endElement = endElement;
//# sourceMappingURL=xml2json.js.map