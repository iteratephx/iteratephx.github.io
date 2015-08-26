var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  serve = require('gulp-serve'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  inject = require('gulp-inject'),
  imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-minify-css'),
  minifyHTML = require('gulp-minify-html'),
  inline = require('gulp-inline'),
  sitespeedio = require('gulp-sitespeedio');


//-------------------------------------------------------------------
// PERFORMANCE TASKS
//-------------------------------------------------------------------
gulp.task('analyze', function (callback) {
  runSequence('clean:performance',
    'sitespeedio',
    callback
  )
});

gulp.task('sitespeedio', sitespeedio({
    urls: ['http://localhost:3000'],
    depth: 1,
    connection: 'cable',
    resultBaseDir: 'performance',
    verbose: true,
    html: true
  }
));

gulp.task('clean:performance', function () {
  return gulp.src('./performance/').pipe(clean());
});

//-------------------------------------------------------------------
// BUILD TASKS
//-------------------------------------------------------------------
gulp.task('default', function (callback) {
  runSequence('clean',
    'copy',
    'scripts',
    'styles',
    'imagemin',
    'inject',
    'inline',
    'html',
    'serve',
    callback
  );
});

gulp.task('clean', function () {
  return gulp.src('./bin/').pipe(clean());
});

gulp.task('copy', function () {
  return gulp.src(['./src/**/*', '!./src/css/**/*', '!./src/js/**/*'])
    .pipe(gulp.dest('./bin'));
});

gulp.task('scripts', function () {
  return gulp.src([
      './src/js/jquery-2.1.4.min.js',
      './src/js/bootstrap.js',
      './src/js/*.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./bin/js'));
});

gulp.task('styles', function () {
  return gulp.src([
      './src/css/bootstrap.css',
      './src/css/bootstrap-responsive.css',
      './src/css/*.css'
    ])
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./bin/css'));
});

gulp.task('html',function(){
    return gulp.src(['./bin/*.html'])
      .pipe(minifyHTML())
      .pipe(gulp.dest('./bin/'));
});

gulp.task('imagemin', function () {
  return gulp.src('./src/images/**/*')
    .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest('./bin/images/'));
});

gulp.task('inline',function(){
    return gulp.src('./bin/index.html')
      .pipe(inline({base:'bin/'}))
      .pipe(gulp.dest('./bin/'));
});

gulp.task('inject', function () {
  return gulp.src('./bin/index.html')
    .pipe(inject(gulp.src(['./bin/**/*.css', './bin/**/*.js'], {read: false}), {ignorePath: 'bin', addRootSlash: false}))
    .pipe(gulp.dest('./bin'));
});

gulp.task('serve', serve('bin'));