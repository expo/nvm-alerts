'use strict';

let gulp = require('gulp');
let babel = require('gulp-babel');
let sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', 'build');
});

gulp.task('default', ['build']);
