var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync').create();  // 静态服务器
var reload = browserSync.reload;
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var gulpScss = require('gulp-sass');   // 编译sass文件
var $ = require('gulp-load-plugins')();
var path = require('path');
// 目标文件夹
var PATH = 'D:\\pandora\\xsinsurance\\';


// 图片压缩
gulp.task('image', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(PATH+'dist/images'));
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
       .pipe(gulp.dest(PATH+'dist/css'));
});

// js压缩,检测
gulp.task('js', function () {
    gulp.src(['app/js/**/*.js'])
        .pipe($.jshint.reporter('default'))
        .pipe($.uglify())
        .pipe(gulp.dest(PATH+'dist/js'))
});
gulp.task('lint', function () {
    gulp.src('gulpfile.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

// 复制html
gulp.task('html', function () {
   gulp.src('app/*.html')
       .pipe(gulp.dest(PATH+'dist/'))
});

// 复制font
gulp.task('font', function () {
    gulp.src('app/font/*')
    .pipe(gulp.dest(PATH+'dist/font/'))
})


/*gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });
});*/
// 自动刷新
gulp.task('serve', function () {
    browserSync.init({
        browser:'chrome',
        serveStatic:['./app'],
        // 代理服务器
        proxy:'192.168.1.69:8080',
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
       .pipe(gulp.dest(PATH+'dist/'));
});


// clean
gulp.task('clean', function (cb) {
   del([PATH+'dist/**/*'],cb);
});

gulp.task('default',['scss-compile','serve','watch']);

gulp.task('build',['image','js','html','font','scss-compile','css','serve','watch']);

module.exports = gulp;
