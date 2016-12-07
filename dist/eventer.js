"use strict";
var Eventer = (function () {
    function Eventer() {
        this.events = new Map();
    }
    Eventer.prototype.trigger = function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (f) { return f(data); });
        }
    };
    Eventer.prototype.on = function (eventName, cb) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(cb);
    };
    Eventer.prototype.off = function (eventName, cb) {
        if (!this.events[eventName]) {
            return;
        }
        if (cb === undefined) {
            this.events[eventName] = [];
            return;
        }
        var index = this.events[eventName].indexOf(cb);
        if (index !== -1) {
            this.events[eventName].splice(index, 1);
        }
    };
    Eventer.prototype.once = function (eventName, cb) {
        var _this = this;
        var callback = function (data) {
            cb(data);
            _this.off(eventName, callback);
        };
        this.on(eventName, callback);
    };
    return Eventer;
}());
exports.Eventer = Eventer;
