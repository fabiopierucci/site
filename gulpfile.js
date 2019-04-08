// const fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
const gutil = require('gulp-util');
const postcss = require('gulp-postcss');
// const rename = require('gulp-rename');
// const merge = require('merge-stream');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();

const SOURCE_DIR = './frontend';
const DIST_DIR = './src';

gulp.task('less', function() {
    return gulp
        .src(`${SOURCE_DIR}/css/main.less`)
        .pipe(
            less().on('error', function(err) {
                var displayErr = gutil.colors.red(err);
                gutil.log(displayErr);
                gutil.beep();
                this.emit('end');
            })
        )
        .pipe(
            postcss([autoprefixer({browsers: ['last 2 version', 'Safari 8']})])
        )
        .pipe(gulp.dest(`${DIST_DIR}/css/`))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    var b = browserify({
        entries: [`${SOURCE_DIR}/js/main.js`],
    }).transform('babelify', {presets: ['es2015', 'react']}).transform('envify');

    return b
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(`${DIST_DIR}/js/`));
});

gulp.task('images', function() {
    return gulp
        .src(`${SOURCE_DIR}/images/**/*`)
        .pipe(gulp.dest(`${DIST_DIR}/images/`));
});

gulp.task('fonts', function() {
    return gulp
        .src(`${SOURCE_DIR}/fonts/**/*`)
        .pipe(gulp.dest(`${DIST_DIR}/fonts/`));
});
gulp.task("webfonts", function() {
	return gulp
		.src(`${SOURCE_DIR}/webfonts/**/*`)
		.pipe(gulp.dest(`${DIST_DIR}/webfonts/`));
});

gulp.task('browser-sync', function() {
    // browserSync.init({
    //     proxy: 'localhost:3000',
    // });
    browserSync.init({
        server: {
            baseDir: './',
        },
    });
});

gulp.task('js-watch', ['js'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('watcher', function() {
    gulp.watch(`${SOURCE_DIR}/css/**/*.less`, ['less']);
    gulp.watch(`${SOURCE_DIR}/js/**/*.js`, ['js-watch']);
});

gulp.task('build', ['less', 'js', 'js-watch', 'fonts', 'webfonts', 'images']);
gulp.task('watch', ['build', 'browser-sync', 'watcher']);
