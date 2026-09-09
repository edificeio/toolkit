# À propos de toolkit
    
* Licence : [AGPL v3](http://www.gnu.org/licenses/agpl.txt) - Copyright Edifice
* Financeur(s) : Edifice
* Développeur(s) : Edifice
* Description : bibliothèque de composants AngularJS.

## `http` — bridge commun

`entcore-toolkit` expose un export `http` (voir `src/http.ts`), qui implémente l'interface `Http` déjà définie par la lib (`get`/`post`/`postFile`/`put`/`putFile`/`delete`, toutes retournant `Promise<HttpResponse>`). Les apps qui importent axios directement peuvent migrer vers ce point d'entrée unique plutôt que de garder leur propre dépendance :

```ts
import { http } from 'entcore-toolkit';

http.get('/some/route').then(response => ...);
http.post('/some/route', data).then(response => ...);
http.postFile('/some/route', formData).then(response => ...);
```

**`http` n'est pas un simple réexport d'axios** : c'est un objet conforme à l'interface `Http`, dont l'implémentation interne s'appuie aujourd'hui sur axios (bundlé et transpilé par la lib, voir `CHANGELOG.md`), mais dont la forme publique ne dépend pas d'axios. Remplacer axios par une autre implémentation (par ex. `fetch` natif) plus tard ne demandera de changer que `src/http.ts` — aucune app consommatrice n'aura à changer son code.

### Types : remplacer les imports axios

`entcore-toolkit` expose aussi des types indépendants d'axios, pour les apps qui typaient leurs appels avec les types d'axios :

```ts
import { HttpResponse, HttpError, HttpRequestConfig, HttpPromise } from 'entcore-toolkit';
```

| Import axios à remplacer | Équivalent `entcore-toolkit` |
| --- | --- |
| `AxiosResponse<T>` | `HttpResponse<T>` |
| `AxiosError<T>` | `HttpError<T>` (étend `Error`, avec `response?: HttpResponse<T>`) |
| `AxiosRequestConfig` | `HttpRequestConfig` (`headers?`, `responseType?`) |
| `AxiosPromise<T>` | `HttpPromise<T>` (alias de `Promise<HttpResponse<T>>`) |

Ces types couvrent les usages réellement observés sur le parc (154+ fichiers) : catch d'erreur (`.message`, `.response`, `.response.data`), config d'appel (`headers`, `responseType`), et les quelques usages génériques (`AxiosResponse<SchoolYear>`, `AxiosError<any>`). Remplacer un import axios par son équivalent est un renommage direct — voir `typecheck/http.types.check.ts` (vérifié par `npm run test:types`, sans exécution runtime — ce sont des types, pas du code) pour des exemples calqués sur des patterns réels du parc.

