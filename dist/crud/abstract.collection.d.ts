/// <reference types="core-js" />
import { AbstractCrud, CrudApi } from './abstract.crud';
import { Mixable, mixCasts, mixCast } from '../minicast';
export declare abstract class AbstractCollection<T> extends AbstractCrud<T> implements Mixable {
    data: T[];
    constructor(api: CrudApi, initialCast?: mixCast | Function, childrenCasts?: mixCasts);
    mixin(data: Array<any>): void;
}
