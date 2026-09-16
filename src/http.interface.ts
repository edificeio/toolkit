export interface HttpResponse<T = any> {
    data: T,
    status: number,
    statusText: string,
    headers: {},
    config: {}
}

// Extends Error (not just an ad hoc shape): the ~37 real usages across the
// fleet only ever catch this error and read .message and/or .response(.data) —
// never .code/.request/.config, verified exhaustively.
export interface HttpError<T = any> extends Error {
    response?: HttpResponse<T>
}

// Covers only the fields actually used across the fleet (responseType,
// headers) — deliberately not a copy of axios's full config shape.
export interface HttpRequestConfig {
    headers?: { [key: string]: string },
    responseType?: string
}

export type HttpPromise<T = any> = Promise<HttpResponse<T>>

export interface Http {
    get(url: string, opts?: Object) : Promise<HttpResponse>
    post(url: string, data: Object, opts?:Object) : Promise<HttpResponse>
    postFile(url: string, data: FormData, opts?: Object) : Promise<HttpResponse>
    put(url: string, data?: Object, opts?: Object) : Promise<HttpResponse>
    putFile(url: string, data: FormData, opts?: Object) : Promise<HttpResponse>
    delete(url: string, opts?: Object) : Promise<HttpResponse>
}