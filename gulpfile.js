var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var pixrem = require('pixrem');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var browserSync = require('browser-sync').create();
var del = require('del');
var handlebars = require('gulp-compile-handlebars');
var path = require("path");
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');

gulp.task('concat', function() {
    return gulp.src(['assets/js/main.js', 'assets/js/util.js', 'assets/js/animations.js'])
        .pipe(concat('s.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', ['concat'], function(cb) {
    pump([
            gulp.src('dist/s.js'),
            uglify(),
            gulp.dest('dist'),
            browserSync.stream({
                once: true
            })
        ],
        cb
    );
});

gulp.task('sass', function() {
    return gulp.src('assets/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(rename('a.css'))
        .pipe(gulp.dest('dist/'));
});


gulp.task('copyfavicon', function() {
    return gulp.src('assets/favicon/*')
        .pipe(gulp.dest('dist/f/'));
});

gulp.task('postcss:dev', ['sass'], function() {
    var processors = [
        pixrem(),
        autoprefixer({
            browsers: ['last 3 versions']
        })
    ];

    return gulp.src('dist/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream({
            match: "**/*.css"
        }));
});

gulp.task('postcss:prod', ['sass'], function() {
    var processors = [
        pixrem(),
        autoprefixer({
            browsers: ['last 3 versions']
        }),
        cssnano({
            safe: true
        })
    ];

    return gulp.src('dist/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch(['source/**/*.html', 'partials/**/*.html'], ['handlebars']);
    gulp.watch(['assets/sass/*.scss'], ['sass', 'postcss:dev']);
    gulp.watch(['assets/js/*.js'], ['concat']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('handlebars', function() {
    var options = {
        batch: ['partials']
    };

    var files = [
        ['source/index.html', 'dist/index.html']
    ];

    files.forEach(function(filePair) {
        var src = filePair[0];
        var dist = filePair[1];
        var distDir = path.dirname(dist);
        var distFileName = path.basename(dist);

        gulp.src(src)
            .pipe(handlebars({}, options))
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                sortAttributes: true,
                sortClassName: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                removeRedundantAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseBooleanAttributes: true
            }))
            .pipe(rename(distFileName))
            .pipe(gulp.dest(distDir))
            .pipe(browserSync.stream());
    });
});

gulp.task('default', ['handlebars', 'concat', 'copyfavicon', 'postcss:prod', 'browserSync', 'watch']);
gulp.task('prod', ['handlebars', 'uglify', 'copyfavicon', 'postcss:prod']);
