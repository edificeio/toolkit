"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var eventer_1 = require("./eventer");
var minicast_1 = require("./minicast");
var axios_1 = require("axios");
/*
 * Tool to manage a single list provider used by multiple objects (to avoid multiple call to a same path)
 * Usage :
 * let provider = new Provider<T>(path, MyClass);
 * function a(){
 *    //get data from provider
 *    let data = await provider.data();
 * }
 *
 * function b(){
 *    let data = await provider.data();
 *    //get data when a refresh happens
 *    provider.on('refresh', (newData) => data = newData));
 * }
 *
 * //force provider refresh (after data invalidation)
 * setTimeout(() => provider.refresh(), 50000);
 *
 * a();
 * b();
*/
var Provider = (function () {
    function Provider(path, className) {
        this.path = path;
        this.className = className;
        this._data = [];
        this.eventer = new eventer_1.Eventer();
    }
    Provider.prototype.data = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.isSynced && !this.syncing))
                            return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sync()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.syncing)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.syncDone()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, this._data];
                }
            });
        });
    };
    Provider.prototype.syncDone = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.eventer.once('sync', function () { return resolve(); });
                    })];
            });
        });
    };
    Provider.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.syncing = true;
                        return [4 /*yield*/, axios_1.default.get(this.path)];
                    case 1:
                        response = _a.sent();
                        this._data = minicast_1.Mix.castArrayAs(this.className, response.data);
                        this.isSynced = true;
                        this.eventer.trigger('sync');
                        this.syncing = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    Provider.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isSynced = false;
                        return [4 /*yield*/, this.sync()];
                    case 1:
                        _a.sent();
                        this.eventer.trigger('refresh');
                        return [2 /*return*/];
                }
            });
        });
    };
    Provider.prototype.push = function (data) {
        this._data.push(data);
    };
    Provider.prototype.remove = function (data) {
        var index = this._data.indexOf(data);
        if (index === -1)
            return;
        this._data.splice(index, 1);
    };
    return Provider;
}());
exports.Provider = Provider;
