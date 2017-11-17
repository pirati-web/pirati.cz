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
  c + 'fb.js',
  c + 'piwik.js'
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
gulp.task('styles-foundation', function() {
    return gulp.src([b + '/foundation-sites/scss/*/*'])
      .pipe(gulp.dest('_sass/foundation'));
});

gulp.task('styles-jquery-ui', function() {
    return gulp.src([b + '/jquery-ui/themes/base/jquery-ui.css'])
      .pipe(rename({extname: '.scss'}))
      .pipe(gulp.dest('_sass/'));
});

gulp.task('styles-font-awesome-css', function() {
    return gulp.src([b + '/font-awesome/scss/*'])
      .pipe(gulp.dest('_sass/font-awesome'));
});

gulp.task('styles-font-awesome-font', function() {
    return gulp.src([b + '/font-awesome/fonts/*'])
      .pipe(gulp.dest('assets/fonts'));
});

gulp.task('styles', ['styles-font-awesome-font', 'styles-font-awesome-css', 'styles-foundation', 'styles-jquery-ui']);

// Runs Jekyll build
gulp.task('build', ['scripts', 'styles'], function() {
  var shellCommand = 'bundle exec jekyll build';

  return gulp.src('.')
    .pipe(run(shellCommand));
});

// Default Task
gulp.task('default', ['scripts', 'styles']);
