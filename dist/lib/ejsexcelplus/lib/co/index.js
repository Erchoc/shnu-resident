(function () {
    var slice = Array.prototype.slice;
    if (typeof module !== "undefined" && module.exports)
        module.exports = co;
    else if (typeof window !== "undefined")
        window.co = co;
    else
        this.co = co;
    co.wrap = function (fn) {
        return function () {
            return co.call(this, fn.apply(this, arguments));
        };
    };
    function co(gen) {
        var ctx = this;
        var err = undefined;
        try {
            if (typeof gen === 'function')
                gen = gen.call(this);
        }
        catch (er) {
            err = er;
        }
        if (!isGenerator(gen)) {
            if (err === undefined)
                return gen;
            throw err;
        }
        return onFulfilled()["catch"](function (err) {
            if (!err.is_out && err.stack)
                console.error(err.stack);
            err.is_out = true;
            throw err;
        });
        function onFulfilled(res) {
            var ret;
            try {
                ret = gen.next(res);
            }
            catch (e) {
                return Promise.reject(e);
            }
            return next(ret);
        }
        function onRejected(err) {
            var ret;
            try {
                ret = gen["throw"](err);
            }
            catch (e) {
                return Promise.reject(e);
            }
            return next(ret);
        }
        function next(ret) {
            if (ret.done)
                return Promise.resolve(ret.value);
            var value = toPromise.call(ctx, ret.value);
            if (value && isPromise(value))
                return value.then(onFulfilled, onRejected);
            return onFulfilled(ret.value);
        }
    }
    function toPromise(obj) {
        if (!obj)
            return obj;
        if (isPromise(obj))
            return obj;
        if (isGeneratorFunction(obj) || isGenerator(obj))
            return co.call(this, obj);
        if ('function' == typeof obj)
            return thunkToPromise.call(this, obj);
        if (Array.isArray(obj))
            return arrayToPromise.call(this, obj);
        if (isObject(obj))
            return objectToPromise.call(this, obj);
        return obj;
    }
    co.toPromise = toPromise;
    function thunkToPromise(fn) {
        var ctx = this;
        return new Promise(function (resolve, reject) {
            fn.call(ctx, function (err, res) {
                if (err)
                    return reject(err);
                if (arguments.length > 2)
                    res = slice.call(arguments, 1);
                resolve(res);
            });
        });
    }
    function arrayToPromise(obj) {
        return Promise.all(obj.map(toPromise, this));
    }
    function objectToPromise(obj) {
        var results = new obj.constructor();
        var keys = Object.keys(obj);
        var promises = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var promise = toPromise.call(this, obj[key]);
            if (promise && isPromise(promise))
                defer(promise, key);
            else
                results[key] = obj[key];
        }
        return Promise.all(promises).then(function () {
            return results;
        });
        function defer(promise, key) {
            results[key] = undefined;
            promises.push(promise.then(function (res) {
                results[key] = res;
            }));
        }
    }
    function isPromise(obj) {
        return obj && 'function' == typeof obj.then;
    }
    co.isPromise = isPromise;
    function isGenerator(obj) {
        return obj && 'function' == typeof obj.next && 'function' == typeof obj["throw"];
    }
    co.isGenerator = isGenerator;
    co.isAsync = function (obj) {
        return isPromise(obj) || isGenerator(obj);
    };
    function isGeneratorFunction(obj) {
        var constructor = obj.constructor;
        return constructor && 'GeneratorFunction' == constructor.name;
    }
    co.isGeneratorFunction = isGeneratorFunction;
    function isObject(val) {
        return Object == val.constructor;
    }
}).call();
//# sourceMappingURL=index.js.map