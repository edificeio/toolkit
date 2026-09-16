export interface HttpResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: {};
    config: {};
}
export interface HttpError<T = any> extends Error {
    response?: HttpResponse<T>;
}
export interface HttpRequestConfig {
    headers?: {
        [key: string]: string;
    };
    responseType?: string;
}
export declare type HttpPromise<T = any> = Promise<HttpResponse<T>>;
export interface Http {
    get(url: string, opts?: Object): Promise<HttpResponse>;
    post(url: string, data: Object, opts?: Object): Promise<HttpResponse>;
    postFile(url: string, data: FormData, opts?: Object): Promise<HttpResponse>;
    put(url: string, data?: Object, opts?: Object): Promise<HttpResponse>;
    putFile(url: string, data: FormData, opts?: Object): Promise<HttpResponse>;
    delete(url: string, opts?: Object): Promise<HttpResponse>;
}
