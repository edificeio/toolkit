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
        outfile: './dist/index.js'
    });
}

gulp.task('clean', function () {
    return gulp.src(['./dist'], { read: false, allowEmpty: true })
       .pipe(clean());
});

gulp.task('compile', gulp.series('clean', gulp.parallel(compileDts, bundleJs)));

gulp.task('build', gulp.series('compile'));
