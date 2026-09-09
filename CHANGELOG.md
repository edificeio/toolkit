# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), le versionnage suit [Semantic Versioning](https://semver.org/lang/fr/).

## [2.0.0] - Non publié

### ⚠️ Breaking changes

- **Structure de `dist/` changée** : `dist/` ne contient plus un fichier `.js` par module (`autosaver.js`, `provider.js`, `eventer.js`...) mais un unique `dist/index.js` bundlé. Tout import profond du type `entcore-toolkit/dist/autosaver` cesse de fonctionner — seul l'import depuis la racine du paquet (`from "entcore-toolkit"`) reste supporté. Vérifié sans casse sur 35 apps consommatrices connues.
- **Dépendances retirées** : `lodash`, `core-js`, `merge2`, `@types/node` ne sont plus déclarés (ils n'étaient jamais utilisés dans le code source de la lib). Si votre app importait l'une de ces libs sans la déclarer elle-même, en comptant implicitement sur le hoisting npm via `entcore-toolkit`, vous devrez désormais la déclarer explicitement dans votre propre `package.json` (erreur attendue : `Cannot find module`).
- **`axios` n'est plus une dépendance runtime** : il est désormais entièrement bundlé et transpilé à l'intérieur de `dist/index.js` (voir ci-dessous), et n'a donc plus besoin d'être installé pour les consommateurs. Si votre app importait axios via cette lib sans le déclarer elle-même (peu probable, non observé), déclarez-le directement.
- **Version majeure du compilateur TypeScript** : `typescript` reste en `peerDependencies` (compatibilité de types), mais n'est plus tiré automatiquement comme `dependency` — déclarez-le vous-même si vous en dépendiez implicitement (aucun cas observé sur le parc connu).

### Security

- Bump `axios` `^0.15.2` → `^1.20.0`. Corrige CVE-2020-28168 (SSRF via bypass du proxy sur redirection), CVE-2021-3749 (ReDoS dans `trim()`), CVE-2023-45857 (fuite du cookie XSRF-TOKEN vers un tiers), ainsi qu'un ensemble d'advisories plus récentes (SSRF via bypass `NO_PROXY`, prototype pollution en cascade, DoS par allocation de ressources, fuite du header `Proxy-Authorization` sur redirection...).

### Changed

- Le pipeline de build bundle et transpile désormais axios (et le reste du graphe de modules) via [`esbuild`](https://esbuild.github.io/) (`--bundle --platform=browser --target=es2015`), au lieu de laisser axios en `require()` externe. Cible `es2015` : c'est la syntaxe la plus haute que le webpack de 2016 utilisé par les apps consommatrices (embarqué dans `webpack-stream`, indépendamment de leur propre version de webpack déclarée) sait encore parser — la syntaxe moderne d'axios (spread d'objet, méthodes `async`, générateurs async) y est réécrite via des helpers plutôt que laissée native.
- `gulp-typescript`/`tsc` ne sert plus qu'à générer les déclarations de types (`.d.ts`) ; l'émission du JavaScript est entièrement déléguée à esbuild.

### Removed

- `lodash`, `core-js`, `merge2` : dépendances mortes (jamais importées dans `src/`).
- `@types/node` : jamais chargé pendant la compilation (le compilateur restreint explicitement les types inclus à `core-js`).
- `rollup`, `rollup-plugin-typescript`, `rollup-plugin-uglify`, `uglify-js` et leur fichier de configuration `config/rollup.bundle.config.js` : pipeline de build orphelin, plus invoqué par aucun script depuis le passage à `gulp-typescript`.
- `config/tsconfig.compile.json` : configuration compagnon du pipeline rollup ci-dessus, également orpheline.

## [1.4.0] et versions antérieures

Non documentées rétroactivement dans ce fichier.
