"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var axios_1 = require("axios");
var abstract_collection_1 = require("./abstract.collection");
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection(api, initialCast, childrenCasts) {
        var _this = _super.call(this, api, initialCast, childrenCasts) || this;
        _this.http = axios_1.default;
        return _this;
    }
    return Collection;
}(abstract_collection_1.AbstractCollection));
exports.Collection = Collection;
