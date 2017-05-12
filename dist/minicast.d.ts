/// <reference types="core-js" />
export declare type mixCast = {
    type: Function;
    deps?: Array<any>;
    single?: boolean;
};
export declare type mixCasts = {
    [key: string]: mixCast | Function;
};
export interface Mixable {
    mixin(data: any): any;
}
export declare class Mix {
    static extend(obj: any, mixin: any, casts?: mixCasts): void;
    static castAs(className: any, obj: any, params?: any): any;
    static castArrayAs(className: any, arr: Array<any>, params?: any): any[];
}
export declare class TypedArray<T> extends Array {
    className: any;
    private mixin;
    constructor(className: any, mixin?: any);
    push(...items: any[]): number;
    load(data: any): void;
    asArray(): any[];
    toJSON(): any[];
}
