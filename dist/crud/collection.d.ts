/// <reference types="core-js" />
import { AbstractCollection } from './abstract.collection';
import { CrudApi } from './abstract.crud';
import { mixCasts, mixCast } from '../minicast';
import { Http } from '../http.interface';
export declare class Collection<T> extends AbstractCollection<T> {
    protected http: Http;
    constructor(api: CrudApi, initialCast?: mixCast | Function, childrenCasts?: mixCasts);
}
