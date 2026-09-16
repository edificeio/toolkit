import axios from 'axios';
import { Http, HttpResponse } from './http.interface';

// `Http` implementation kept internal to this module: consuming apps depend
// on the `Http` interface, never on axios directly. Replacing axios (with
// `fetch` for example) will only require changing this file.
export const http: Http = {
    get<T = any>(url: string, opts?: Object): Promise<HttpResponse<T>> {
        return axios.get(url, opts);
    },
    post<T = any>(url: string, data: Object, opts?: Object): Promise<HttpResponse<T>> {
        return axios.post(url, data, opts);
    },
    postFile<T = any>(url: string, data: FormData, opts?: Object): Promise<HttpResponse<T>> {
        return axios.post(url, data, opts);
    },
    put<T = any>(url: string, data?: Object, opts?: Object): Promise<HttpResponse<T>> {
        return axios.put(url, data, opts);
    },
    putFile<T = any>(url: string, data: FormData, opts?: Object): Promise<HttpResponse<T>> {
        return axios.put(url, data, opts);
    },
    delete<T = any>(url: string, opts?: Object): Promise<HttpResponse<T>> {
        return axios.delete(url, opts);
    }
};
