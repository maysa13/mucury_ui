const gulp = require('gulp');
const stripDebug = require('gulp-strip-debug');

gulp.task('strip-debug', () =>
  gulp.src('./build/static/js/**.js') // input file path
    .pipe(stripDebug()) // execute gulp-strip-debug
    .pipe(gulp.dest('./build/static/js/')) // output file path 
);