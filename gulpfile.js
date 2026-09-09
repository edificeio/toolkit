var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var typescript = require('typescript');
var esbuild = require('esbuild');

function compileDts(){
    var tsResult = gulp.src('./src/**/*.ts')
        .pipe(ts({
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
        })
    );

    return tsResult.dts.pipe(gulp.dest('./dist'));
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

// Bundles and transpiles the whole module graph (axios included) down to
// ES2015: the apps consuming this package build with a webpack from 2016
// that cannot parse axios's own modern syntax (object spread, async methods).
// ES2015 is the lowest target esbuild can emit without erroring on let/class;
// see axios-cve-audit.md section 14 for how this target was determined.
function bundleJs(){
    return esbuild.build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        platform: 'browser',
        target: 'es2015',
        format: 'cjs',
        sourcemap: true,
        plugins: [stubFetchAdapter],
        outfile: './dist/index.js'
    });
}

gulp.task('clean', function () {
    return gulp.src(['./dist'], { read: false, allowEmpty: true })
       .pipe(clean());
});

gulp.task('compile', gulp.series('clean', gulp.parallel(compileDts, bundleJs)));

gulp.task('build', gulp.series('compile'));
