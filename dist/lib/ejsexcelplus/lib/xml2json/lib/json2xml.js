var chars = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>'
};
module.exports = function toXml(json, xml, j2xOp) {
    var xml = xml || '';
    if (json instanceof Buffer) {
        json = json.toString();
    }
    var obj = null;
    if (typeof (json) == 'string') {
        try {
            obj = JSON.parse(json);
        }
        catch (e) {
            throw new Error("The JSON structure is invalid");
        }
    }
    else {
        obj = json;
    }
    if (obj === undefined || obj === null)
        return xml;
    var keys = Object.keys(obj);
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var key = keys[i];
        if (typeof (obj[key]) == 'string') {
            val = obj[key];
            if (key == '$t') {
                if (j2xOp !== undefined && j2xOp.reSanitize === true) {
                    for (kc in chars)
                        val = val.replace(new RegExp(kc, "gm"), chars[kc]);
                }
                xml += val;
            }
            else {
                xml = xml.replace(/>$/, '');
                xml += ' ' + key + '="' + val + '">';
            }
        }
    }
    for (var i = 0; i < len; i++) {
        var key = keys[i];
        if (Array.isArray(obj[key])) {
            var elems = obj[key];
            var l = elems.length;
            for (var j = 0; j < l; j++) {
                xml += '<' + key + '>';
                xml = toXml(elems[j], xml, j2xOp);
                xml += '</' + key + '>';
            }
        }
        else if (typeof (obj[key]) == 'object') {
            xml += '<' + key + '>';
            xml = toXml(obj[key], xml, j2xOp);
            xml += '</' + key + '>';
        }
    }
    return xml;
};
//# sourceMappingURL=json2xml.js.map