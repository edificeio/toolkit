"use strict";
var Selection = (function () {
    function Selection(arr) {
        this.arr = arr;
        this.selectedElements = [];
    }
    Object.defineProperty(Selection.prototype, "all", {
        get: function () {
            return this.arr;
        },
        set: function (all) {
            this.arr = all;
        },
        enumerable: true,
        configurable: true
    });
    Selection.prototype.filter = function (filter) {
        return this.arr.filter(filter);
    };
    Selection.prototype.push = function (item) {
        this.arr.push(item);
    };
    Selection.prototype.addRange = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            this.all.push(arr[i]);
        }
    };
    Object.defineProperty(Selection.prototype, "colLength", {
        get: function () {
            return this.arr.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "length", {
        get: function () {
            return this.selected.length;
        },
        enumerable: true,
        configurable: true
    });
    Selection.prototype.forEach = function (func) {
        this.arr.forEach(func);
    };
    Selection.prototype.selectAll = function () {
        for (var i = 0; i < this.arr.length; i++) {
            this.arr[i].selected = true;
        }
    };
    Selection.prototype.select = function (filter) {
        for (var i = 0; i < this.arr.length; i++) {
            this.arr[i].selected = filter(this.arr[i]);
        }
    };
    Selection.prototype.deselect = function (filter) {
        for (var i = 0; i < this.arr.length; i++) {
            this.arr[i].selected = !filter(this.arr[i]);
        }
    };
    Selection.prototype.deselectAll = function () {
        for (var i = 0; i < this.arr.length; i++) {
            this.arr[i].selected = false;
        }
    };
    Selection.prototype.removeSelection = function () {
        var newArr = [];
        for (var i = 0; i < this.arr.length; i++) {
            if (!this.arr[i].selected) {
                newArr.push(this.arr[i]);
            }
        }
        this.arr.splice(0, this.arr.length);
        for (var i = 0; i < newArr.length; i++) {
            this.arr.push(newArr[i]);
        }
    };
    Selection.prototype.updateSelected = function () {
        for (var i = 0; i < this.arr.length; i++) {
            var index = this.selectedElements.indexOf(this.arr[i]);
            if (this.arr[i].selected && index === -1) {
                this.selectedElements.push(this.arr[i]);
            }
            else if (!this.arr[i].selected && index !== -1) {
                this.selectedElements.splice(index, 1);
            }
        }
        for (var i = 0; i < this.selectedElements.length; i++) {
            var index = this.arr.indexOf(this.selectedElements[i]);
            if (index === -1) {
                this.selectedElements.splice(index, 1);
            }
        }
    };
    Object.defineProperty(Selection.prototype, "selected", {
        // a specific array is maintained to avoid references breaking all the time
        get: function () {
            this.updateSelected();
            return this.selectedElements;
        },
        enumerable: true,
        configurable: true
    });
    return Selection;
}());
exports.Selection = Selection;
