var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var typescript = require('typescript');
var merge = require('merge2');

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
    return gulp.src(['./dist'], { read: false, allowEmpty: true })
       .pipe(clean());
});

gulp.task('compile', gulp.series('clean', function(){
     return compileTs();
}));

gulp.task('build', gulp.series('compile'));
