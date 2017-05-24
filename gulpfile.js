// Include gulp
var gulp = require('gulp');

// Include plugins
const concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      run = require('gulp-run');

const b = 'bower_components';
const libsjs = [
  b + '/jquery/dist/jquery.js',
  b + '/jquery-ui/jquery-ui.min.js',
  /* TODO: replace: */
  /*b + '/jquery-ui/ui/core.js',
  b + '/jquery-ui/ui/widget.js',
  b + '/jquery-ui/ui/position.js',
  b + '/jquery-ui/ui/widgets/menu.js',
  b + '/jquery-ui/ui/widgets/autocomplete.js',*/
  b + '/foundation-sites/dist/foundation.js',
  b + '/motion-ui/dist/motion-ui.js',
  b + '/handlebars/handlebars.js',
  b + '/raphael/raphael.js'
];
const c = '_includes/js/'
const customjs = [
  c + 'custom.js',
  c + 'kalkulacka.js',
  c + 'ga.js',
  c + 'tw.js',
  c + 'fb.js'
];

// Concatenate & Minify JS
gulp.task('scripts-libs', function() {
    return gulp.src(libsjs)
      .pipe(concat('common-libs.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('assets/js'));
});

gulp.task('scripts-custom', function() {
    return gulp.src(customjs)
      .pipe(concat('custom.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('assets/js'));
});

gulp.task('scripts', ['scripts-libs', 'scripts-custom']);

// Deploy css
gulp.task('styles', function() {
    return gulp.src([b + '/foundation-sites/scss/'])
      .pipe(gulp.dest('_sass/foundation'));
});

// Runs Jekyll build
gulp.task('build', ['scripts', 'styles'], function() {
  var shellCommand = 'bundle exec jekyll build';

  return gulp.src('.')
    .pipe(run(shellCommand));
});

// Default Task
gulp.task('default', ['scripts', 'styles']);
