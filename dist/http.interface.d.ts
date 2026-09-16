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
    get<T = any>(url: string, opts?: Object): Promise<HttpResponse<T>>;
    post<T = any>(url: string, data: Object, opts?: Object): Promise<HttpResponse<T>>;
    postFile<T = any>(url: string, data: FormData, opts?: Object): Promise<HttpResponse<T>>;
    put<T = any>(url: string, data?: Object, opts?: Object): Promise<HttpResponse<T>>;
    putFile<T = any>(url: string, data: FormData, opts?: Object): Promise<HttpResponse<T>>;
    delete<T = any>(url: string, opts?: Object): Promise<HttpResponse<T>>;
}
