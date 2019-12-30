require('babel-polyfill');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
let autoprefixer = require("gulp-autoprefixer")
var htmlmin = require('gulp-htmlmin'); //页面压缩
var babel = require("gulp-babel");
var minifyCss = require("gulp-clean-css")
var $ = require('gulp-load-plugins')();
gulp.task('serve', function() {
    $.connect.server({
        port: 8013,
        root: 'build/css3_project',
        livereload: true //启动自动加载
    });
});
//es6转义
gulp.task("babeljs", function() {
    gulp.src('./build/css3_project/js/*.js')
        .pipe(babel())
        .pipe(babel({
            plugins: ['transform-runtime']        // babel-plugin-transform-runtime 在这里使用;
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/css3_project/dist'))
});

gulp.task('css', function() {
    gulp.src('./src/css3_project/less/*.less')
        .pipe($.less())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./build/css3_project/css'))
        .pipe($.cleanCss())
        .pipe($.rename(function(file) {
            file.basename += '.min';
        }))
        .pipe(gulp.dest('./build/css3_project/css'))
})

gulp.task("sass", function() {
    gulp.src('./src/css3_project/sass/*.scss')
        .pipe($.sass())
        // 浏览器前缀补全
        .pipe(autoprefixer({
            browsers: ["last 3 versions"],
            cascade: false
        }))
        // .pipe($.rename(function(file) {
        //     file.basename += '.min';
        // }))
        // css压缩
        // .pipe(minifyCss({
        //     keepSpecialComments: "*"
        // }))
        .pipe(gulp.dest('./build/css3_project/css'))
        // .pipe(reload({stream: true}))
})

gulp.task('inject', function() {
    var target = gulp.src('./src/css3_project/*.html'); //要被js.css插入的文件
    var sources = gulp.src(['./build/css3_project/*.js', './build/css3_project/css/*.css']);
    return target.pipe($.inject(sources, {
        ignorePath: 'build/',
        addRootSlash: false
    }))
        .pipe(gulp.dest('./build/css3_project'));
});

gulp.task('html', function() {
    gulp.src('./src/css3_project/*.html')
        .pipe(gulp.dest('./build/css3_project'))
        .pipe($.connect.reload()) //强制浏览器自动刷新
});
//压缩html文件
gulp.task('minify', function() {
    return gulp.src('./src/css3_project/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./build/css3_project/'));
});

gulp.task('watch', function() {
    gulp.watch('./src/css3_project/*.html', ['html']);
    // gulp.watch('./src/css3_project/less/*.less', ['css']);
    gulp.watch('./src/css3_project/sass/*.scss', ['sass']);
    //gulp.watch("./src/css3_project®/js/*.js", ['babeljs'])
});
//依赖的任务
gulp.task('default', ['serve', 'watch']);