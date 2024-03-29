"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.TypedArray = exports.Mix = void 0;
function mapToArray(map) {
    var result = [];
    map.forEach(function (item) {
        result.push(item);
    });
    return result;
}
var Mix = /** @class */ (function () {
    function Mix() {
    }
    Mix.extend = function (obj, mixin, casts) {
        var _loop_1 = function () {
            var value = mixin[property];
            if (casts && casts[property] && value) {
                var castItem = casts[property];
                var cast_1;
                if (castItem instanceof Function) {
                    cast_1 = {
                        type: castItem,
                        deps: []
                    };
                }
                else {
                    cast_1 = {
                        type: castItem.type,
                        single: castItem.single,
                        deps: castItem.deps ? castItem.deps : []
                    };
                }
                var doCast_1 = function (v) {
                    var _a;
                    var instance = new ((_a = cast_1.type).bind.apply(_a, __spreadArray([void 0], cast_1.deps, false)))();
                    if (instance.mixin)
                        instance.mixin(v);
                    else
                        Mix.extend(instance, v);
                    return instance;
                };
                if (value instanceof Array && cast_1.single) {
                    obj[property] = [];
                    value.forEach(function (v) {
                        obj[property].push(doCast_1(v));
                    });
                }
                else {
                    obj[property] = doCast_1(value);
                }
            }
            else if (!value || typeof value !== 'object' || value instanceof Array) {
                obj[property] = value;
            }
            else {
                if (obj[property] instanceof TypedArray) {
                    obj[property].load(value);
                }
                else {
                    if (!obj[property]) {
                        obj[property] = {};
                    }
                    this_1.extend(obj[property], value);
                }
            }
        };
        var this_1 = this;
        for (var property in mixin) {
            _loop_1();
        }
        if (obj && obj.fromJSON) {
            obj.fromJSON(mixin);
        }
    };
    Mix.castAs = function (className, obj, params) {
        if (params === void 0) { params = {}; }
        var newObj = new className(params);
        this.extend(newObj, obj);
        return newObj;
    };
    Mix.castArrayAs = function (className, arr, params) {
        if (params === void 0) { params = {}; }
        var newArr = [];
        arr.forEach(function (item) {
            newArr.push(Mix.castAs(className, item, params));
        });
        return newArr;
    };
    return Mix;
}());
exports.Mix = Mix;
var TypedArray = /** @class */ (function (_super) {
    __extends(TypedArray, _super);
    function TypedArray(className, mixin) {
        if (mixin === void 0) { mixin = {}; }
        var _this = _super.call(this) || this;
        _this.className = className;
        _this.mixin = mixin;
        return _this;
    }
    TypedArray.prototype.push = function () {
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        items.forEach(function (item) {
            if (!(item instanceof _this.className)) {
                item = Mix.castAs(_this.className, item);
            }
            for (var prop in _this.mixin) {
                item[prop] = _this.mixin[prop];
            }
            Array.prototype.push.call(_this, item);
        });
        return this.length;
    };
    TypedArray.prototype.load = function (data) {
        var _this = this;
        data.forEach(function (item) {
            _this.push(item);
        });
    };
    TypedArray.prototype.asArray = function () {
        return mapToArray(this);
    };
    TypedArray.prototype.toJSON = function () {
        return mapToArray(this);
    };
    return TypedArray;
}(Array));
exports.TypedArray = TypedArray;
