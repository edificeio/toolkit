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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractModel = void 0;
var abstract_crud_1 = require("./abstract.crud");
var minicast_1 = require("../minicast");
var AbstractModel = /** @class */ (function (_super) {
    __extends(AbstractModel, _super);
    function AbstractModel(api, childrenCasts) {
        var _this = _super.call(this, api, null, null, childrenCasts) || this;
        _this.model = _this;
        _this.customMixin = _this.mixin;
        return _this;
    }
    AbstractModel.prototype.mixin = function (data) {
        if (!data || !(data instanceof Object)) {
            throw "[Crud][Collection] An Object payload is expected.";
        }
        minicast_1.Mix.extend(this, data, this.childrenCasts);
    };
    return AbstractModel;
}(abstract_crud_1.AbstractCrud));
exports.AbstractModel = AbstractModel;
