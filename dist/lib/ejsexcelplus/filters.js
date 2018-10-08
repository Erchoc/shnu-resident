/*!
 * EJS - Filters
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */
exports.first = function (obj) {
    return obj[0];
};
exports.last = function (obj) {
    return obj[obj.length - 1];
};
exports.capitalize = function (str) {
    str = String(str);
    return str[0].toUpperCase() + str.substr(1, str.length);
};
exports.downcase = function (str) {
    return String(str).toLowerCase();
};
exports.upcase = function (str) {
    return String(str).toUpperCase();
};
exports.sort = function (obj) {
    return Object.create(obj).sort();
};
exports.sort_by = function (obj, prop) {
    return Object.create(obj).sort(function (a, b) {
        a = a[prop], b = b[prop];
        if (a > b)
            return 1;
        if (a < b)
            return -1;
        return 0;
    });
};
exports.size = exports.length = function (obj) {
    return obj.length;
};
exports.plus = function (a, b) {
    return Number(a) + Number(b);
};
exports.minus = function (a, b) {
    return Number(a) - Number(b);
};
exports.times = function (a, b) {
    return Number(a) * Number(b);
};
exports.divided_by = function (a, b) {
    return Number(a) / Number(b);
};
exports.join = function (obj, str) {
    return obj.join(str || ', ');
};
exports.truncate = function (str, len) {
    str = String(str);
    return str.substr(0, len);
};
exports.truncate_words = function (str, n) {
    var str = String(str), words = str.split(/ +/);
    return words.slice(0, n).join(' ');
};
exports.replace = function (str, pattern, substitution) {
    return String(str).replace(pattern, substitution || '');
};
exports.prepend = function (obj, val) {
    return Array.isArray(obj)
        ? [val].concat(obj)
        : val + obj;
};
exports.append = function (obj, val) {
    return Array.isArray(obj)
        ? obj.concat(val)
        : obj + val;
};
exports.map = function (arr, prop) {
    return arr.map(function (obj) {
        return obj[prop];
    });
};
exports.reverse = function (obj) {
    return Array.isArray(obj)
        ? obj.reverse()
        : String(obj).split('').reverse().join('');
};
exports.get = function (obj, prop) {
    return obj[prop];
};
exports.json = function (obj) {
    return JSON.stringify(obj);
};
//# sourceMappingURL=filters.js.map