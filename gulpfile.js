var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('typescript');
var rollup = require('rollup-stream');
var merge = require('merge2');

console.log("Building with TS version " + typescript.version);
console.log("TS version sould be > 2.1.1");

function compileTs(){
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

    return merge([
        tsResult.dts.pipe(gulp.dest('./dist')),
        tsResult.js.pipe(gulp.dest('./dist'))
    ]);
}

gulp.task('clean', function () {
    return gulp.src(['./dist'], { read: false })
       .pipe(clean());
});

gulp.task('compile', ['clean'], function(){
     return compileTs();
});

gulp.task('build', ['compile'], () => {
});
