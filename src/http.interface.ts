export interface HttpResponse<T = any> {
    data: T,
    status: number,
    statusText: string,
    headers: {},
    config: {}
}

// Étend Error (pas juste une forme ad hoc) : les ~37 usages réels sur le parc
// ne font que catcher cette erreur et lire .message et/ou .response(.data) —
// jamais .code/.request/.config, vérifié exhaustivement.
export interface HttpError<T = any> extends Error {
    response?: HttpResponse<T>
}

// Couvre les seuls champs réellement utilisés sur le parc (responseType,
// headers) — volontairement pas une copie de la config axios complète.
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