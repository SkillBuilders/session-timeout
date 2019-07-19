(function() {
"use strict";

  const path = require('path');
  const rename = require('gulp-rename');
  const gulp = require('gulp');
  const concat = require('gulp-concat');
  const uglify = require('gulp-uglify');
  const sourcemaps = require('gulp-sourcemaps');
  const del = require('del');

  const config = {
    masterFileName : 'apex-session-timeout',
    paths : {
      outputdir:'dist',
      builddir:'build',
      scripts: 'src/js/**/*.js',
      plsql: 'src/plsql/**/*.{sql,pks,pkb}'
    }
  };

  gulp.task('clean', function () {
    return del([config.paths.builddir]);
  });

  gulp.task('scripts', ['clean'], function () {
    return gulp.src(config.paths.scripts)
      .pipe(gulp.dest(path.join(config.paths.outputdir, 'js')))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({suffix:'.min'}))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(path.join(config.paths.outputdir, 'js')));
  });

  gulp.task('plsql',function(){
    return gulp.src(config.paths.plsql)
      .pipe(gulp.dest(path.join(config.paths.outputdir, 'plsql')))
  });

  gulp.task('watch', function () {
    gulp.watch(config.paths.scripts, ['scripts']);
  });

  gulp.task('default', ['plsql','watch','scripts']);
})();
