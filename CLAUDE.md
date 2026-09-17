# entcore-toolkit

Shared AngularJS infra library (`Provider`, `Autosave`, `Eventer`, `Selection`, CRUD helpers, and an `http` bridge), consumed by legacy frontend apps, most on a webpack from 2016 (bundled inside `webpack-stream`, independent of whatever webpack version is declared).

## Structure

- `src/` — TypeScript source, entry point `src/index.ts`.
- `dist/` — generated output, not committed: one `.js` per module (compiled by `tsc`, see Build) plus `http.js` (bundled by `esbuild`, contains axios), plus one `.d.ts` per module.
- `index.js` / `index.d.ts` — thin re-exports of `dist/index`, the actual npm package entry points (`main`/`types` in `package.json`).
- `test/` — runtime tests (`node:test`, native runner, no framework).
- `typecheck/` — type-only checks, compiled with `tsc --noEmit`, never executed. Keep this separate from `test/`: `node --test`'s default discovery will otherwise try to run a `.ts` file here as JS and fail.

## Build & test

- `npm run build` (`gulp build`): **only `http.ts` goes through `esbuild`** (`--bundle --platform=browser --target=es2015`, outputs `dist/http.js`), which inlines and transpiles axios down to the highest syntax the consumer apps' 2016-era webpack can still parse. **Everything else** (`Selection`, `Model`, `Provider`, `Mix`, `crud/*`, `Autosave`, `Eventer`) is compiled by `gulp-typescript`/`tsc` at `target: es5`, emitting real `.js` (same as before `2.0.0-dev.0`) — this matters because esbuild only emits native ES2015 `class` syntax for anything at or above that target, which a `tsc --target es5` consumer subclassing it (the whole legacy fleet) cannot construct (`TypeError: Class constructor ... cannot be invoked without 'new'`, runtime-only, invisible to build/type-check). Do not widen esbuild's `entryPoints` back to `src/index.ts` without re-reading `CHANGELOG.md`'s `2.0.0` "Fixed" entry — that regression already shipped once (`2.0.0-dev.0` through `.dev.2`) and broke 11 downstream migration PRs silently. `provider.ts`/`autosaver.ts`/`crud/collection.ts`/`crud/crud.ts`/`crud/model.ts` import `http` from `./http` (the bridge), never `axios` directly — that's required for the split to hold (otherwise their un-bundled axios import would break the same 2016-era webpack the bundling exists to satisfy). See `CHANGELOG.md` and `axios-cve-audit.md` (external doc, not in this repo) for how the `es2015` ceiling and the axios-fetch-adapter stub in `gulpfile.js` were determined empirically.
- `npm test`: `node --test` (runtime tests against the real built `dist/index.js`, not source) `&& npm run test:types` (`tsc --noEmit` against `typecheck/`). Both must pass before publishing — there was no test suite at all before the `http` bridge work; keep building on `node:test`, don't introduce a new framework without a reason.
- No import goes deeper than the package root (`from "entcore-toolkit"`) on any known consumer — safe to keep per-module files in `dist/` (restored by the split above) as long as nothing outside this repo imports them directly; recheck that assumption before relying on it further.

## Conventions

- **Code comments in English.** Documentation files (`README.md`, `CHANGELOG.md`) are in French — that's the established convention for this repo, keep it that way.
- Version scheme: `X.Y.Z`, prereleases published from `dev` as `X.Y.0-dev.N` (e.g. `1.4.0-dev.0`, `2.0.0-dev.0`).
- A **major** bump is required for any change that alters runtime or build behavior (not just a minor/patch) — consumer apps pin with `^1.x`-style ranges, so only a major version avoids being picked up silently by an app that hasn't explicitly migrated.
- Target branch is `dev` (not `develop-enabling` or any other historical name).

## CI / publish

Publish runs on Jenkins via `build.sh` (`init`/`build`/`publish`), which shells out to `docker-compose run ... node ...`. `docker-compose.yml` must stay in Compose **v2** syntax (`services:` at the root, `network_mode` instead of `net`) — the CLI on the Jenkins agent validates it against the v2/v3 JSON schema and fails the whole pipeline on the old v1 top-level-service format.
