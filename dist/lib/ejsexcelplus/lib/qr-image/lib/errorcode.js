"use strict";
var GF256_BASE = 285;
var EXP_TABLE = [1];
var LOG_TABLE = [];
for (var i = 1; i < 256; i++) {
    var n = EXP_TABLE[i - 1] << 1;
    if (n > 255)
        n = n ^ GF256_BASE;
    EXP_TABLE[i] = n;
}
for (var i = 0; i < 255; i++) {
    LOG_TABLE[EXP_TABLE[i]] = i;
}
function exp(k) {
    while (k < 0)
        k += 255;
    while (k > 255)
        k -= 255;
    return EXP_TABLE[k];
}
function log(k) {
    if (k < 1 || k > 255) {
        throw Error('Bad log(' + k + ')');
    }
    return LOG_TABLE[k];
}
var POLYNOMIALS = [
    [0],
    [0, 0],
    [0, 25, 1],
];
function generatorPolynomial(num) {
    if (POLYNOMIALS[num]) {
        return POLYNOMIALS[num];
    }
    var prev = generatorPolynomial(num - 1);
    var res = [];
    res[0] = prev[0];
    for (var i = 1; i <= num; i++) {
        res[i] = log(exp(prev[i]) ^ exp(prev[i - 1] + num - 1));
    }
    POLYNOMIALS[num] = res;
    return res;
}
module.exports = function calculate_ec(msg, ec_len) {
    msg = [].slice.call(msg);
    var poly = generatorPolynomial(ec_len);
    for (var i = 0; i < ec_len; i++)
        msg.push(0);
    while (msg.length > ec_len) {
        if (!msg[0]) {
            msg.shift();
            continue;
        }
        var log_k = log(msg[0]);
        for (var i = 0; i <= ec_len; i++) {
            msg[i] = msg[i] ^ exp(poly[i] + log_k);
        }
        msg.shift();
    }
    return Buffer(msg);
};
//# sourceMappingURL=errorcode.js.map