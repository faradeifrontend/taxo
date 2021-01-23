var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var concatCss     = require('gulp-concat-css');
var htmlmin       = require('gulp-html-minifier');
var cleanCSS      = require('gulp-clean-css');
var del           =  require('del');
var uglify        = require('gulp-uglify');

// Static Server + watching scss/html files

gulp.task('serve', function() {
    browserSync.init({
        server: "src/"
    });

    gulp.watch('src/sass/**/*.scss', gulp.parallel('sass'));
    gulp.watch('src/*.html').on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
    .pipe(concatCss('main.css'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});


// minify html / css

gulp.task('minifycss', () => {
  return gulp.src('./src/css/*.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('./dist/css/'));
});

gulp.task('minifyhtml', () => {
  return gulp.src('src/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist'));
});

// move img

gulp.task('moveimage', function(){
  return gulp.src('src/img/**/*')
  .pipe(gulp.dest('./dist/img/'));
 });

// move fonts

gulp.task('fonts', function() {
    gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/')) // Переместим шрифты в build
});

// gulp-uglify

gulp.task('js', function(){
   return gulp.src('src/js/*.js')
   .pipe(uglify())
   .pipe(gulp.dest('./dist/js/'));
 });


// clean build

gulp.task('clean', function() {
  return del.sync(['dist/**', '!dist', '!dist/img/**'], { 
})
   });

// Build project

gulp.task('build', gulp.parallel('clean', 'minifyhtml', 'minifycss', 'fonts', 'js'));
gulp.task('default', gulp.parallel('serve', 'sass'));



