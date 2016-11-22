/// <reference types="core-js" />
import { AbstractCrud, CrudApi } from './abstract.crud';
import { Mixable, mixCasts } from '../minicast';
export declare abstract class AbstractModel<T> extends AbstractCrud<T> implements Mixable {
    constructor(api: CrudApi, childrenCasts?: mixCasts);
    mixin(data: Object): void;
}
