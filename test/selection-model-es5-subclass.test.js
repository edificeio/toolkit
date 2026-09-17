const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Selection, Model } = require('../dist/index.js');

// Reproduces the exact downlevel-emit pattern `tsc --target es5` produces for
// `class Sub extends Base {}` in every consumer app still targeting ES5 (the
// whole legacy gulp/webpack-stream family). Calling a native ES2015 class via
// this pattern (`_super.call(this, args)`, no `new`) throws
// `TypeError: Class constructor ... cannot be invoked without 'new'` — this
// broke silently on 11 already-open migration PRs before any build or test
// caught it, because esbuild's bundle target (es2015, required to make axios
// itself digestible by the 2016-era webpack) turned Selection/Model into real
// classes, which tsc's ES5 downlevel emit cannot construct this way.
var __extends = (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

test('an ES5-downlevel subclass of Selection can be instantiated (not just typed)', () => {
    var Purses = (function (_super) {
        __extends(Purses, _super);
        function Purses() {
            return _super.call(this, []) || this;
        }
        return Purses;
    })(Selection);

    assert.doesNotThrow(() => new Purses());
});

test('an ES5-downlevel subclass of Model can be instantiated (not just typed)', () => {
    var Website = (function (_super) {
        __extends(Website, _super);
        function Website(api) {
            return _super.call(this, api) || this;
        }
        return Website;
    })(Model);

    var w;
    assert.doesNotThrow(() => { w = new Website('/website/api'); });
    assert.strictEqual(typeof w.http.get, 'function', 'Model subclass must inherit the http bridge, not raw axios');
});
