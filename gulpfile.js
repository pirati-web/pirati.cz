// Include gulp
var gulp = require('gulp');

// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var b = 'bower_components'
var libs = [
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

// Default Task
gulp.task('default', ['scripts']);
