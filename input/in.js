"use strict";

function _await(value, then, direct) {

    console.log(value);

    if (direct) {
        return then ? then(value) : value;
    }if (!value || !value.then) {

        value = Promise.resolve(value);
        
    }return then ? value.then(then) : value;
}
var test = _async(function () {
    console.log("lol");
    return _await();
});

function _async(f) {
    return function () {
        for (var args = [], i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        return Promise.resolve(f.apply(this, args));
    };
}
test();
