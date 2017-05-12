"use strict";
var axios_1 = require("axios");
var autosaved = [];
var loopStarted = false;
var token;
var loop = function () {
    autosaved.forEach(function (item) {
        if (item._backup !== JSON.stringify(item.model)) {
            if (item.fn) {
                item.fn();
            }
            else {
                axios_1.default[item.method](item.path, item.model);
            }
            item._backup = JSON.stringify(item.model);
        }
    });
    loopStarted = true;
    token = setTimeout(loop, 500);
};
var Autosave = (function () {
    function Autosave() {
    }
    Autosave.watch = function (path, model, method) {
        if (method === void 0) { method = 'put'; }
        if (autosaved.findIndex(function (e) { return e.model === model && e.path === path; }) !== -1) {
            return;
        }
        var autosave;
        if (typeof path === 'string') {
            autosave = {
                model: model,
                path: path,
                method: method
            };
        }
        else {
            autosave = {
                model: model,
                fn: path,
                method: method
            };
        }
        autosaved.push(autosave);
        if (!loopStarted) {
            loop();
        }
    };
    Autosave.unwatch = function (model) {
        var index = autosaved.findIndex(function (e) { return e.model === model; });
        autosaved.splice(index, 1);
        if (autosaved.length === 0) {
            this.unwatchAll();
        }
    };
    Autosave.unwatchAll = function () {
        autosaved = [];
        clearTimeout(token);
        loopStarted = false;
    };
    return Autosave;
}());
exports.Autosave = Autosave;
