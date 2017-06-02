'use strict';

var gulp = require('gulp'),
    webpack = require("webpack"),
    gutil = require("gulp-util"),
    sass = require('gulp-sass'),
    del = require("del"),
    autoprefixer = require('gulp-autoprefixer'),
    WebpackDevServer = require('webpack-dev-server'),
    Server = require('karma').Server,
    config = require('./webpack.config'),
    webkackProd = require('./webpack.config.production.js'),
    gulpif = require("gulp-if"),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css'),
    dev = process.env.NODE_ENV !== 'production',
    flow = require('gulp-flowtype'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    babel = require('gulp-babel'),
    sourcemapReporter = require('jshint-sourcemap-reporter'),
    webpackConfig = require("./webpack.config.js");

var clientSrcDir = "scripts", flowDest = "tmp_build_flow";

var startServer = function() {
    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true
    }).listen(3000, 'localhost', function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:3000');
    });
};

gulp.task('flow:babel', function(cb) {
    gulp.src(clientSrcDir + '/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({stage: 0, blacklist: ['flow']}))
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(flowDest))
    .on('end', cb);
});

gulp.task('flow', ['flow:babel'], function() {
    gulp.src(flowDest + '/**/*.js')
    .pipe(flow({
        all: false,
        weak: false,
        killFlow: false,
        beep: true,
        abort: false,
        reporter: {
            reporter: function(errors) {
                return sourcemapReporter.reporter(errors, {sourceRoot: '/' + clientSrcDir + '/'});
            }
        }
    }));
});

gulp.task('flow:watch', function() {
    gulp.watch(clientSrcDir + '/**/*.js', ['flow']);
});

gulp.task('testonce', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false,
        autoWatch: true
    }, done).start();
});

gulp.task('default', ['sass'], function() {
    gulp.watch('styles/scss/*.scss', ['sass']);
    startServer();
});

gulp.task('sass', function () {
    gulp.src('./styles/scss/*.scss')
    .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulpif(dev, sourcemaps.write()))
        .on('error', function (err) {
            gutil.log(err.message);
        })
        .pipe(gulp.dest('styles'));
});

var webpackDevConfig = Object.create(webpackConfig);
webpackDevConfig.devtool = "sourcemap";
webpackDevConfig.debug = true;
var devCompiler = webpack(webpackDevConfig);
var prodCompiler = webpack(webkackProd);

gulp.task("prod", ["clean"], function(callback) {
    console.log('building prod...');
    gulp.src('index.html').pipe(gulp.dest('www'));
    gulp.src('styles/**').pipe(gulp.dest('www/styles/'));
    prodCompiler.run(function(err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack:build-prod", err);
        }
        gutil.log("[webpack:build-prod]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack", function(callback) {
    devCompiler.run(function(err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack:build-dev", err);
        }
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("clean", function(cb) {
    console.log('cleaning www...');
    del(['./www'], cb);
});

