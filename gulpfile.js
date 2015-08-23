var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  serve = require('gulp-serve'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  inject = require('gulp-inject'),
  imagemin = require('gulp-imagemin');

gulp.task('default', function (callback) {
  runSequence('clean:dev',
    'copy:dev',
    'index:dev',
    'serve:dev',
    callback
  );
});

gulp.task('compile',function(callback){
    runSequence('clean:prod',
      'copy:prod',
      'concat:scripts',
      'concat:styles',
      'index:prod',
      callback
    );
});

gulp.task('imagemin', ['clean'], function() {
  gulp.src(['./src/images/**/*'], {cwd: './src'})
    .pipe(imagemin())
    .pipe(gulp.dest('./build/images/'));
});

gulp.task('serve:dev', serve('build'));
gulp.task('serve:prod', serve('bin'));

gulp.task('clean:dev',function(){
    return gulp.src('./build/').pipe(clean());
});

gulp.task('clean:prod',function(){
  return gulp.src('./bin/').pipe(clean());
});

gulp.task('copy:dev', function () {
  return gulp.src(['./src/**/*'])
    .pipe(gulp.dest('./build'));
});

gulp.task('copy:prod', function () {
  return gulp.src(['./build/**/*', '!./build/css/**/*', '!./build/js/**/*'])
    .pipe(gulp.dest('./bin'));
});

gulp.task('concat:scripts', function(){
  return gulp.src(['./build/**/*.js'])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./bin/js'));
});

gulp.task('concat:styles', function(){
  return gulp.src(['./build/**/*.css'])
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./bin/css'));
});

gulp.task('index:dev', function () {
  return gulp.src('./build/index.html')
    .pipe(inject(gulp.src(['./build/**/*.css', './build/**/*.js'], {read: false}), {ignorePath: 'build', addRootSlash: false}))
    .pipe(gulp.dest('./build'));
});

gulp.task('index:prod', function () {
  return gulp.src('./bin/index.html')
    .pipe(inject(gulp.src(['./bin/**/*.css', './bin/**/*.js'], {read: false}), {ignorePath: 'bin', addRootSlash: false}))
    .pipe(gulp.dest('./bin'));
});