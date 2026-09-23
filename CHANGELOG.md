# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), le versionnage suit [Semantic Versioning](https://semver.org/lang/fr/).

## [2.0.0] - Non publié

### Fixed

- **`peerDependencies.typescript` desserré (`4.6.4` exact → `>=2.0.0`)** : cette contrainte exacte, jamais une plage depuis l'origine du projet (vérifié par `git log`), casse la résolution `npm` stricte (pas `yarn`, qui se contente d'avertir) dès qu'un repo consommateur a une version de `typescript` différente de `4.6.4` — dans un sens (`edt`/`timeline-generator` : `2.4.1`, trop ancien) ou dans l'autre (`scrapbook` : `4.8.3`, trop récent). Découvert lors du rebase des PRs de migration US3/ENABLING-1202 sur `2.0.0-dev.3`, sur un pipeline Jenkins qui invoque `npm` en plus de `yarn` (`npm rm --no-save entcore` dans `edt`, `npm install` direct dans `scrapbook`). Vérifié sans risque réel : le parc consommateur connu va de `typescript@2.4.1` à `^4.8.3` (relevé sur les 28 repos migrés), et ces versions compilent déjà toutes correctement contre les `.d.ts` publiés (builds réels déjà passés en `yarn`, qui ignore ce peer) — la contrainte exacte n'a jamais reflété une incompatibilité réelle, juste la version utilisée en interne pour générer les déclarations.

- **`Selection`/`Model`/`Provider`/`Collection`/`Crud` (et leurs classes abstraites) rendus à nouveau instanciables par une sous-classe compilée en ES5** : depuis `2.0.0-dev.0`, tout le graphe de modules (axios inclus) était bundlé par esbuild à la cible `es2015`, ce qui émet ces classes comme de vraies classes ES2015 natives. Or `tsc --target es5` (la cible de la quasi-totalité du parc consommateur, famille legacy gulp/webpack-stream) émet `extends` sous la forme `_super.call(this, args)` — appeler une classe native ainsi lève `TypeError: Class constructor ... cannot be invoked without 'new'`, au runtime uniquement (invisible à la compilation, et souvent invisible aux tests si leur pipeline jest ne cible pas es5 comme le vrai build). Découvert pendant la migration US3/ENABLING-1202 de `lystore` (`Purses extends Selection`), puis confirmé sur `Model` également (`Website extends Model` dans `pages`, entre autres) — 11 PRs de migration déjà ouvertes étaient concernées avant que ce correctif ne soit publié. **Fix** : seul `http.ts` (qui a réellement besoin d'axios) passe désormais par esbuild (`--target=es2015`, bundle réduit à `dist/http.js`) ; tout le reste (`Selection`, `Model`, `Provider`, `Mix`, `crud/*`, `Autosave`, `Eventer`) redevient compilé par `tsc` à `target: es5` — exactement l'émission utilisée avant `2.0.0-dev.0`, restaurée à l'identique. `provider.ts`/`autosaver.ts`/`crud/collection.ts`/`crud/crud.ts`/`crud/model.ts` important `axios` directement (en contournant le bridge `http.ts` d'US2) ont été reroutés vers `http` — c'était nécessaire pour permettre ce découpage sans réintroduire le problème d'origine (axios non transpilé pour le vieux webpack) sur ces classes. Vérifié par un test dédié (`test/selection-model-es5-subclass.test.js`, reproduisant exactement le pattern de downlevel de `tsc`) et par un test d'acceptation réel sur `lystore` (le test qui avait révélé le bug passe désormais, suite complète verte, `gulp build`/webpack 1.15 toujours propre).

### ⚠️ Breaking changes

- **Structure de `dist/` changée** : `dist/` ne contient plus un fichier `.js` unique bundlé pour tout le graphe, mais un fichier par module (`selection.js`, `provider.js`, `crud/*.js`...) compilés par `tsc`, plus `http.js` (bundlé par esbuild, contient axios). Tout import profond du type `entcore-toolkit/dist/autosaver` cesse de fonctionner — seul l'import depuis la racine du paquet (`from "entcore-toolkit"`) reste supporté. Vérifié sans casse sur 35 apps consommatrices connues.
- **Dépendances retirées** : `lodash`, `core-js`, `merge2`, `@types/node` ne sont plus déclarés (ils n'étaient jamais utilisés dans le code source de la lib). Si votre app importait l'une de ces libs sans la déclarer elle-même, en comptant implicitement sur le hoisting npm via `entcore-toolkit`, vous devrez désormais la déclarer explicitement dans votre propre `package.json` (erreur attendue : `Cannot find module`).
- **`axios` n'est plus une dépendance runtime** : il est désormais entièrement bundlé et transpilé à l'intérieur de `dist/index.js` (voir ci-dessous), et n'a donc plus besoin d'être installé pour les consommateurs. Si votre app importait axios via cette lib sans le déclarer elle-même (peu probable, non observé), déclarez-le directement.
- **Version majeure du compilateur TypeScript** : `typescript` reste en `peerDependencies` (compatibilité de types), mais n'est plus tiré automatiquement comme `dependency` — déclarez-le vous-même si vous en dépendiez implicitement (aucun cas observé sur le parc connu).

### Security

- Bump `axios` `^0.15.2` → `^1.20.0`. Corrige CVE-2020-28168 (SSRF via bypass du proxy sur redirection), CVE-2021-3749 (ReDoS dans `trim()`), CVE-2023-45857 (fuite du cookie XSRF-TOKEN vers un tiers), ainsi qu'un ensemble d'advisories plus récentes (SSRF via bypass `NO_PROXY`, prototype pollution en cascade, DoS par allocation de ressources, fuite du header `Proxy-Authorization` sur redirection...).

### Added

- Export `http` : implémente l'interface `Http` déjà définie par la lib (`get`/`post`/`postFile`/`put`/`putFile`/`delete`, toutes `Promise<HttpResponse>`), backée par axios en interne uniquement. Permet aux apps qui importent axios directement de migrer vers ce point d'entrée unique sans dépendre de la forme d'axios — un futur remplacement d'axios (par `fetch` natif par exemple) ne changera que l'implémentation interne, jamais le code des apps consommatrices.
- Types `HttpError`, `HttpRequestConfig`, `HttpPromise`, et `HttpResponse` devenu générique (`HttpResponse<T = any>`, rétrocompatible) : équivalents indépendants d'axios aux types `AxiosError`/`AxiosRequestConfig`/`AxiosPromise`/`AxiosResponse<T>`, pour que les apps qui typaient leurs appels avec les types d'axios puissent migrer sans perdre leurs annotations de type ni recréer de dépendance à axios.
- `Http.get`/`post`/`postFile`/`put`/`putFile`/`delete` acceptent désormais un paramètre de type générique (`get<T = any>(url): Promise<HttpResponse<T>>`, comme axios), pour les apps qui typaient leurs appels ainsi (`http.get<Foo>(url)`) plutôt que de caster la réponse déstructurée. Rétrocompatible (défaut `any`, aucun changement pour un appel existant sans paramètre de type) — découvert lors de la migration d'`entcore/admin` (US3/ENABLING-1202), purement additif côté `dist/index.js` (seuls les `.d.ts` changent, vérifié par diff).

### Changed

- Le pipeline de build bundle et transpile désormais axios (et le reste du graphe de modules) via [`esbuild`](https://esbuild.github.io/) (`--bundle --platform=browser --target=es2015`), au lieu de laisser axios en `require()` externe. Cible `es2015` : c'est la syntaxe la plus haute que le webpack de 2016 utilisé par les apps consommatrices (embarqué dans `webpack-stream`, indépendamment de leur propre version de webpack déclarée) sait encore parser — la syntaxe moderne d'axios (spread d'objet, méthodes `async`, générateurs async) y est réécrite via des helpers plutôt que laissée native. **IE11 n'est pas supporté** (le bundle contient de la syntaxe ES2015 native — classes, arrow functions, `let`/`const` — non redescendue) : décision produit assumée, hors périmètre.
- `gulp-typescript`/`tsc` ne sert plus qu'à générer les déclarations de types (`.d.ts`) ; l'émission du JavaScript est entièrement déléguée à esbuild.
- L'adaptateur `fetch` d'axios (jamais sélectionné en pratique — l'ordre de priorité par défaut `['xhr', 'http', 'fetch']` fait toujours gagner XHR dans un navigateur réel) est stubé au moment du bundling : ~26 Ko de code mort en moins, et surtout retire le seul générateur async natif du bundle, nécessaire pour rester compatible avec des pipelines Babel en aval (ex. builds Angular CLI) qui ne savent pas toujours downleveler ce cas précis.

### Removed

- `lodash`, `core-js`, `merge2` : dépendances mortes (jamais importées dans `src/`).
- `@types/node` : jamais chargé pendant la compilation (le compilateur restreint explicitement les types inclus à `core-js`).
- `rollup`, `rollup-plugin-typescript`, `rollup-plugin-uglify`, `uglify-js` et leur fichier de configuration `config/rollup.bundle.config.js` : pipeline de build orphelin, plus invoqué par aucun script depuis le passage à `gulp-typescript`.
- `config/tsconfig.compile.json` : configuration compagnon du pipeline rollup ci-dessus, également orpheline.

## [1.4.0] et versions antérieures

Non documentées rétroactivement dans ce fichier.
