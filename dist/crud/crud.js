var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import http from 'axios';
import { AbstractCrud } from './abstract.crud';
export var Crud = (function (_super) {
    __extends(Crud, _super);
    function Crud() {
        var _this = _super.apply(this, arguments) || this;
        _this.http = http;
        return _this;
    }
    return Crud;
}(AbstractCrud));
//# sourceMappingURL=crud.js.map