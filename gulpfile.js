// Include gulp
var gulp = require('gulp');

// Include plugins
const concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      run = require('gulp-run');

const b = 'bower_components';
const libs = [
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

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(libs)
      .pipe(concat('common-libs.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('assets/js'));
});

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
