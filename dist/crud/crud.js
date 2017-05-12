"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var axios_1 = require("axios");
var abstract_crud_1 = require("./abstract.crud");
var Crud = (function (_super) {
    __extends(Crud, _super);
    function Crud() {
        var _this = _super.apply(this, arguments) || this;
        _this.http = axios_1.default;
        return _this;
    }
    return Crud;
}(abstract_crud_1.AbstractCrud));
exports.Crud = Crud;
