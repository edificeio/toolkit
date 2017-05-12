/// <reference types="core-js" />
import { mixCasts, mixCast } from '../minicast';
import { Http, HttpResponse } from '../http.interface';
export interface CrudApi {
    create?: string | (() => string);
    sync?: string | (() => string);
    update?: string | (() => string);
    delete?: string | (() => string);
}
export declare abstract class AbstractCrud<T> {
    protected api: CrudApi;
    protected model: T | T[];
    protected initialCast: mixCast | Function;
    protected childrenCasts: mixCasts;
    protected customMixin: (payload: any) => void;
    protected abstract http: Http;
    constructor(api: CrudApi, model: T | T[], initialCast?: mixCast | Function, childrenCasts?: mixCasts, customMixin?: (payload: any) => void);
    protected parseApi(api: string | (() => string), parameters?: {}): string;
    private defaultMixin(payload);
    create(item?: T, opts?: {}): Promise<HttpResponse>;
    sync(opts?: {}): Promise<HttpResponse>;
    update(item?: T, opts?: {}): Promise<HttpResponse>;
    delete(item?: T, opts?: {}): Promise<HttpResponse>;
}
