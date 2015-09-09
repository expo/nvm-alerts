'use strict';

let gulp = require('gulp');
let babel = require('gulp-babel');

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', 'build');
});

gulp.task('default', ['build']);
