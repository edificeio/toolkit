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

