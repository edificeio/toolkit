import { AbstractModel } from './abstract.model';
import { CrudApi } from './abstract.crud';
import { Http } from '../http.interface';
import { mixCasts } from '../minicast';
export declare class Model<T> extends AbstractModel<T> {
    protected http: Http;
    constructor(api: CrudApi, childrenCasts?: mixCasts);
}
