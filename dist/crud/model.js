var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import http from 'axios';
import { AbstractModel } from './abstract.model';
export var Model = (function (_super) {
    __extends(Model, _super);
    function Model(api, childrenCasts) {
        var _this = _super.call(this, api, childrenCasts) || this;
        _this.http = http;
        return _this;
    }
    return Model;
}(AbstractModel));
//# sourceMappingURL=model.js.map