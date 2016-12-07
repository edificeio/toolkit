"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var axios_1 = require("axios");
var abstract_model_1 = require("./abstract.model");
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(api, childrenCasts) {
        var _this = _super.call(this, api, childrenCasts) || this;
        _this.http = axios_1.default;
        return _this;
    }
    return Model;
}(abstract_model_1.AbstractModel));
exports.Model = Model;
