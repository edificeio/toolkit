"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_crud_1 = require("./abstract.crud");
var minicast_1 = require("../minicast");
var AbstractCollection = /** @class */ (function (_super) {
    __extends(AbstractCollection, _super);
    function AbstractCollection(api, initialCast, childrenCasts) {
        var _this = _super.call(this, api, null, initialCast, childrenCasts) || this;
        _this.data = [];
        _this.model = _this.data;
        _this.customMixin = _this.mixin;
        return _this;
    }
    AbstractCollection.prototype.mixin = function (data) {
        var _this = this;
        if (!data || !(data instanceof Array)) {
            throw "[Crud][Collection] An Array payload is expected.";
        }
        this.data = [];
        data.forEach(function (item) {
            var _a;
            var instance = {};
            if (_this.initialCast) {
                if (_this.initialCast instanceof Function) {
                    instance = new _this.initialCast();
                }
                else {
                    instance = new ((_a = _this.initialCast.type).bind.apply(_a, __spreadArrays([void 0], _this.initialCast.deps)))();
                }
            }
            minicast_1.Mix.extend(instance, item, _this.childrenCasts);
            _this.data.push(instance);
        });
    };
    return AbstractCollection;
}(abstract_crud_1.AbstractCrud));
exports.AbstractCollection = AbstractCollection;
