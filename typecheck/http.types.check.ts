// This file is never executed (no runtime for types).
// It's compiled with `tsc --noEmit` to prove that HttpError/HttpRequestConfig/
// HttpPromise genuinely cover the patterns found across the fleet (34 apps + CGI),
// before offering them as a word-for-word replacement for axios's types in US3.
import { http, Http, HttpResponse, HttpError, HttpRequestConfig, HttpPromise } from '../src/index';

// Real pattern (edt/snipplets/init_data.ts): AxiosResponse<SchoolYear> -> HttpResponse<SchoolYear>
interface SchoolYear { id: string; label: string }
async function schoolYearPattern(): Promise<void> {
    const schoolYearRes: HttpResponse<SchoolYear> = await http.get('/viescolaire/settings/periode/schoolyear');
    console.log(schoolYearRes.data.label);
}

// Real pattern (competences/DefaultEnseignement.ts): Promise<AxiosResponse<T[]>> -> Promise<HttpResponse<T[]>>
interface ITeachingResponse { id: string }
async function getAll(): Promise<HttpResponse<ITeachingResponse[]>> {
    return http.get('/competences/enseignements');
}

// Real pattern (presences/incidents, presences/massmailing, ...): catch((err: AxiosError) => ...)
function catchPattern(): Promise<void> {
    return http.get('/some/route').then(() => {}).catch((err: HttpError) => {
        console.error(err.message);
        return Promise.reject(err);
    });
}

// Real pattern (zimbra-connector/mail.ts): catch((e: AxiosError<any>) => e.response.status / e.response.data)
function catchWithResponsePattern(): Promise<void> {
    return http.get('/some/route').then(() => {}).catch((e: HttpError<any>) => {
        if (e.response && e.response.status === 413) {
            console.log(e.response.data);
        }
    });
}

// Real pattern (Massmailing.ts, visa.ts): const config: AxiosRequestConfig = { responseType, headers }
function requestConfigPattern(): HttpPromise {
    const config: HttpRequestConfig = {
        responseType: 'arraybuffer',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        }
    };
    return http.get('/some/route', config);
}

// Real pattern (gar-connector/app.ts, zimbra-connector/model/http.ts): (config?: AxiosRequestConfig) => ...
async function wrapperPattern(url: string, config?: HttpRequestConfig): Promise<HttpResponse> {
    return http.get(url, config);
}

export const _typeCheckOnly = { schoolYearPattern, getAll, catchPattern, catchWithResponsePattern, requestConfigPattern, wrapperPattern };
