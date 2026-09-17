var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var typescript = require('typescript');
var esbuild = require('esbuild');

var tsProjectOptions = {
    typescript: typescript,
    target: "es5",
    module: "commonjs",
    moduleResolution: "node",
    sourceMap: true,
    declaration: true,
    mapRoot: "./",
    typeRoots: [
        "./node_modules/@types"
    ],
    types: ["core-js"],
    lib: [
        "es2018",
        "dom"
    ]
};

function compileDts(){
    var tsResult = gulp.src('./src/**/*.ts')
        .pipe(ts(tsProjectOptions));

    return tsResult.dts.pipe(gulp.dest('./dist'));
}

// SPIKE: everything except http.ts is compiled by tsc at ES5, exactly like
// before US1 (see git history of this file pre-#22) — this is what makes
// Selection/Model/Provider/Mix/crud/* real ES5-downlevel-compatible
// constructor functions again, instead of esbuild's native ES2015 classes
// which cannot be called via the `_super.call(this, args)` pattern that
// tsc emits for `extends` at target es5 (TypeError: Class constructor ...
// cannot be invoked without 'new'). Only http.ts (which needs axios bundled
// in) still goes through esbuild.
function compileJs(){
    var tsResult = gulp.src(['./src/**/*.ts', '!./src/http.ts'])
        .pipe(ts(tsProjectOptions));

    return tsResult.js.pipe(gulp.dest('./dist'));
}

// axios statically imports its fetch adapter (lib/adapters/adapters.js), even
// though the default adapter priority ['xhr', 'http', 'fetch'] (lib/defaults/index.js)
// means XHR always wins in a real browser: the fetch adapter is dead code for
// every known consumer. It's also the only place axios uses an ASYNC GENERATOR
// (lib/helpers/trackStream.js, for streaming response bodies), which some
// downstream Babel pipelines (e.g. entcore/admin's Angular CLI build, targeting
// IE11) cannot downlevel: Cannot find module '@babel/runtime/helpers/regeneratorValues'.
// Stubbing the import out removes that async generator entirely, with no
// behavior change for any consumer. See axios-cve-audit.md section 14.
var stubFetchAdapter = {
    name: 'stub-fetch-adapter',
    setup: function(build){
        build.onResolve({ filter: /^\.\/fetch\.js$/ }, function(args){
            if (args.importer.indexOf('axios') !== -1) {
                return { path: args.path, namespace: 'stub-fetch-adapter' };
            }
        });
        build.onLoad({ filter: /.*/, namespace: 'stub-fetch-adapter' }, function(){
            return {
                contents: 'export function getFetch() { return undefined; }',
                loader: 'js'
            };
        });
    }
};

// Bundles and transpiles ONLY http.ts (and axios) down to ES2015: the apps
// consuming this package build with a webpack from 2016 that cannot parse
// axios's own modern syntax (object spread, async methods). ES2015 is the
// lowest target esbuild can emit without erroring on let/class; see
// axios-cve-audit.md section 14 for how this target was determined.
// SPIKE: entry point narrowed from src/index.ts to src/http.ts — everything
// else (Selection/Model/Provider/Mix/crud/*) doesn't need axios bundled in
// and must NOT go through esbuild's class emission, see compileJs above.
function bundleJs(){
    return esbuild.build({
        entryPoints: ['./src/http.ts'],
        bundle: true,
        platform: 'browser',
        target: 'es2015',
        format: 'cjs',
        sourcemap: true,
        plugins: [stubFetchAdapter],
        outfile: './dist/http.js'
    });
}

gulp.task('clean', function () {
    return gulp.src(['./dist'], { read: false, allowEmpty: true })
       .pipe(clean());
});

gulp.task('compile', gulp.series('clean', gulp.parallel(compileDts, compileJs, bundleJs)));

gulp.task('build', gulp.series('compile'));
