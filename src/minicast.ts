function mapToArray(map) {
    var result = [];

    map.forEach(function (item) {
        result.push(item);
    });
    return result;
}

export class Mix {
    static extend(obj, mixin) {
        for (var property in mixin) {
            if (typeof mixin[property] !== 'object') {
                obj[property] = mixin[property];
            }
            else {
                if (obj[property] instanceof TypedArray) {
                    obj[property].load(mixin[property]);
                }
                else {
                    if (!obj[property]) {
                        obj[property] = {};
                    }
                    this.extend(obj[property], mixin[property]);
                }
            }
        }
    }

    static castAs(className, obj, params: any = {}) {
        var temp = {};
        temp['constr'] = className;
        var newObj = new temp['constr'](params);
        this.extend(newObj, obj);
        return newObj;
    }

    static castArrayAs(className, arr: Array<any>, params: any[] = []) {
        var newArr = [];
        arr.forEach((item) => {
            newArr.push(
                Mix.castAs(className, item, params)
            );
        });
        return newArr;
    }
}

export class TypedArray<T> extends Array {
    className: any;
    private mixin: any;

    constructor(className: any, mixin: any = {}) {
        super();
        this.className = className;
        this.mixin = mixin;
    }

    push(...items: any[]): number {
        items.forEach((item) => {
            if (!(item instanceof this.className)) {
                item = Mix.castAs(this.className, item);
            }
            for (var prop in this.mixin) {
                item[prop] = this.mixin[prop]
            }

            Array.prototype.push.call(this, item);
        });
        
        return this.length;
    }

    load(data) {
        data.forEach((item) => {
            this.push(item);
        });
    }

    asArray() {
        return mapToArray(this);
    }

    toJSON() {
        return mapToArray(this);
    }
}