(function () {
    'use strict';

    var gulp        = require('gulp'),
        del         = require('del'),
        rollup      = require('gulp-rollup'),
        sourcemaps  = require('gulp-sourcemaps'),
        sass        = require('gulp-sass'),
        plugins     = require('gulp-load-plugins')(),
        gsync       = require('gulp-sync'),
        sync        = gsync(gulp).sync;
    
    /*
     * Move fonts over from src to dist folder
     */
    gulp.task('fonts', function() {
        return gulp.src('src/fonts/**/*')
            .pipe(gulp.dest('dist/fonts'))
    });

    /*
     * Clean out the distribution folder
     */
    gulp.task('clean', function() {
        return del.sync('dist').then(function(cb) {
            return cache.clearAll(cb);
        });
    });

    gulp.task('clean:dist', function() {
        return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
    });

    /*
     * Minify any css files and autoprefix
     */
    gulp.task('mincss', function () {
        gulp.src('src/css/*.css')
            .pipe(cssmin())
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(plugins.autoprefixer())
            .pipe(gulp.dest('dist'));
    });

    /*
     * Export sass to css and autoprefix (sourcemaps included)
     */
    gulp.task('sass', function () {
        return gulp.src('src/sass/app.scss')
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(plugins.autoprefixer())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/css'));
    });

    /*
     * Export sass to css and minify (sourcemaps included)
     */
    gulp.task('minsass', function () {
        return gulp.src('src/sass/app.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/css'));
    });

    /*
     * Export sass to css and minify (sourcemaps included)
     */
    gulp.task('scripts', function() {
        return gulp.src('src/js/*.js') // multiple with order - ['src/js/plugins/*.js', 'src/js/*.js']
            .pipe(sourcemaps.init())
            .pipe(plugins.concat('main.js'))
            .pipe(plugins.uglify())
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/js'));
    });

    /*
     * Javascript 3s6 bundler with rollup (sourcemaps included)
     */
    gulp.task('rollup', function() {
        gulp.src('./src/**/*.js')
            .pipe(sourcemaps.init())
            // transform the files here. 
            .pipe(rollup({
                entry: './src/js/main.js'
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./dist/js'));
    });

    /*
     * Takes any images in our defined source and compresses them using the gulp-imagemin plugin.The gulp-cache plugin * which will ensure only new or changed images get compressed.
     */
    gulp.task('images', function() {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
    });

    /*
     * watch all the files in the src folder (can be customized for each project)
     */
     gulp.task('watch', function() {
        gulp.watch("./src/**/*", [ 'default' ]);
    });

    /*
     * Final Build script to create the whole project
     */
    gulp.task('build', sync([
        'clean:dist',
        [
            'minsass',
            'scripts',
            'images',
            'watch'
        ],
    ]));

    // Default Task
    gulp.task('default', [
        'minsass',
        'scripts',
        'images',
        'watch'
    ]);
})();