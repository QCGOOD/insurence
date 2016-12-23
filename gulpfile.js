var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync').create();  // 静态服务器
var reload = browserSync.reload;
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var gulpScss = require('gulp-sass');   // 编译sass文件
var $ = require('gulp-load-plugins')();

// 图片压缩
gulp.task('image', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
});

// 编译sass文件
gulp.task('scss-compile', function () {
   gulp.src('app/css/**/*.scss')
       .pipe(gulpScss().on('error',gulpScss.logError))
       .pipe(gulp.dest('app/css'));
});

gulp.task('scss-watch', function () {
    gulp.watch('app/**/*.scss',['scss-compile']);
});

// css压缩，自动添加前缀
gulp.task('css', function () {
   gulp.src('app/css/**/*')
       .pipe($.autoprefixer())
       .pipe($.minifyCss())
       .pipe(gulp.dest('dist/css'));
});

// js压缩,检测
gulp.task('js', function () {
    gulp.src(['app/js/**/*.js'])
        .pipe($.jshint.reporter('default'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
});
gulp.task('lint', function () {
    gulp.src('gulpfile.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

// 复制html
gulp.task('html', function () {
   gulp.src('app/**/*.html')
       .pipe(gulp.dest('dist/'))
});


// 自动刷新
gulp.task('serve', function () {
    browserSync.init({
        server:{baseDir:'./app'},
        browser:'chrome'
    });
});

// watch
gulp.task('watch', function () {
    gulp.watch(['app/**/*.scss'],['scss-compile']);
    gulp.watch(['app/**/*'],reload);
});

// css,js重命名
gulp.task('rename', function () {
   gulp.src(['!dist/**/*min.js','!dist/**/*min.css','dist/**/*.css','dist/**/*.js'])
       .pipe($.rename({suffix:'.min'}))
       .pipe(gulp.dest('dist/'));
});


// clean
gulp.task('clean', function (cb) {
   del(['dist/**/*'],cb);
});

gulp.task('default',['image','js','scss-compile','css','serve','watch']);

module.exports = gulp;