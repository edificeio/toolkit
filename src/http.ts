import axios from 'axios';
import { Http, HttpResponse } from './http.interface';

// Implémentation `Http` interne à ce module : les apps consommatrices dépendent
// de l'interface `Http`, jamais d'axios directement. Remplacer axios (par
// `fetch` par exemple) ne demandera de changer que ce fichier.
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
