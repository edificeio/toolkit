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

// Generic per-call (defaulting to `any`, so every pre-existing non-generic call
// site keeps compiling unchanged): mirrors axios's own `get<T>(url)` signature,
// needed by entcore/admin which types its calls this way rather than casting
// the destructured `data`.
export interface Http {
    get<T = any>(url: string, opts?: Object) : Promise<HttpResponse<T>>
    post<T = any>(url: string, data: Object, opts?:Object) : Promise<HttpResponse<T>>
    postFile<T = any>(url: string, data: FormData, opts?: Object) : Promise<HttpResponse<T>>
    put<T = any>(url: string, data?: Object, opts?: Object) : Promise<HttpResponse<T>>
    putFile<T = any>(url: string, data: FormData, opts?: Object) : Promise<HttpResponse<T>>
    delete<T = any>(url: string, opts?: Object) : Promise<HttpResponse<T>>
}