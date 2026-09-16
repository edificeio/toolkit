import axios from 'axios';
import { Http, HttpResponse } from './http.interface';

// `Http` implementation kept internal to this module: consuming apps depend
// on the `Http` interface, never on axios directly. Replacing axios (with
// `fetch` for example) will only require changing this file.
export const http: Http = {
    get(url: string, opts?: Object): Promise<HttpResponse> {
        return axios.get(url, opts);
    },
    post(url: string, data: Object, opts?: Object): Promise<HttpResponse> {
        return axios.post(url, data, opts);
    },
    postFile(url: string, data: FormData, opts?: Object): Promise<HttpResponse> {
        return axios.post(url, data, opts);
    },
    put(url: string, data?: Object, opts?: Object): Promise<HttpResponse> {
        return axios.put(url, data, opts);
    },
    putFile(url: string, data: FormData, opts?: Object): Promise<HttpResponse> {
        return axios.put(url, data, opts);
    },
    delete(url: string, opts?: Object): Promise<HttpResponse> {
        return axios.delete(url, opts);
    }
};
