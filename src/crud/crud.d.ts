import { Http } from '../http.interface';
import { AbstractCrud } from './abstract.crud';
export declare class Crud<T> extends AbstractCrud<T> {
    protected http: Http;
}
