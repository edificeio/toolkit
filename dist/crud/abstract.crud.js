"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCrud = void 0;
var minicast_1 = require("../minicast");
var AbstractCrud = /** @class */ (function () {
    function AbstractCrud(api, model, initialCast, childrenCasts, customMixin) {
        this.api = api;
        this.model = model;
        this.initialCast = initialCast;
        this.childrenCasts = childrenCasts;
        this.customMixin = customMixin;
    }
    AbstractCrud.prototype.parseApi = function (api, parameters) {
        var _this = this;
        if (typeof api === 'function') {
            api = api();
        }
        return api.split(/(:[a-zA-Z0-9_.]+)/)
            .map(function (fragment) {
            return fragment.charAt(0) === ':' ?
                parameters && parameters[fragment.substr(1)] ||
                    _this.model[fragment.substr(1)] ||
                    _this[fragment.substr(1)] ||
                    fragment :
                fragment;
        }).join('');
    };
    AbstractCrud.prototype.defaultMixin = function (payload) {
        var _this = this;
        if (payload instanceof Array && this.model instanceof Array) {
            this.model = [];
            var model_1 = this.model; //fix type inference
            payload.forEach(function (item) {
                var _a;
                var instance = {};
                if (_this.initialCast) {
                    if (_this.initialCast instanceof Function) {
                        instance = new _this.initialCast();
                    }
                    else {
                        instance = new ((_a = _this.initialCast.type).bind.apply(_a, __spreadArray([void 0], _this.initialCast.deps, false)))();
                    }
                }
                minicast_1.Mix.extend(instance, item, _this.childrenCasts);
                model_1.push(instance);
            });
        }
        else {
            minicast_1.Mix.extend(this.model, payload, this.childrenCasts);
        }
    };
    AbstractCrud.prototype.create = function (item, opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        if (!this.api.create) {
            throw '[Crud][Api] "create" route is undefined';
        }
        return this.http.post(this.parseApi(this.api.create, item), item || this.model, opts)
            .then(function (response) {
            if (_this.model instanceof Array) {
                _this.model.push(item);
            }
            return response;
        });
    };
    AbstractCrud.prototype.sync = function (opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        if (!this.api.sync) {
            throw '[Crud][Api] "sync" route is undefined';
        }
        return this.http.get(this.parseApi(this.api.sync), opts)
            .then(function (response) {
            (_this.customMixin || _this.defaultMixin).bind(_this)(response.data);
            return response;
        });
    };
    AbstractCrud.prototype.update = function (item, opts) {
        if (opts === void 0) { opts = {}; }
        if (!this.api.update) {
            throw '[Crud][Api] "update" route is undefined';
        }
        return this.http.put(this.parseApi(this.api.update, item), item || this.model, opts);
    };
    AbstractCrud.prototype.delete = function (item, opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        if (!this.api.delete) {
            throw '[Crud][Api] "delete" route is undefined';
        }
        return this.http.delete(this.parseApi(this.api.delete, item), opts)
            .then(function (response) {
            if (_this.model instanceof Array) {
                var index = _this.model.indexOf(item);
                if (index !== -1) {
                    _this.model.splice(_this.model.indexOf(item), 1);
                }
            }
            return response;
        });
    };
    return AbstractCrud;
}());
exports.AbstractCrud = AbstractCrud;
