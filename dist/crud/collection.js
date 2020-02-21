var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import http from 'axios';
import { AbstractCollection } from './abstract.collection';
export var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection(api, initialCast, childrenCasts) {
        var _this = _super.call(this, api, initialCast, childrenCasts) || this;
        _this.http = http;
        return _this;
    }
    return Collection;
}(AbstractCollection));
//# sourceMappingURL=collection.js.map