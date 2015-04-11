var RewirePlugin = require("rewire-webpack");
var path = require('path');
module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            'test_index.js'
        ],
        frameworks: ['mocha', 'chai', 'sinon'],
        preprocessors: {
            'test_index.js': ['webpack']
        },
        reporters: ['dots', 'coverage'],
        singleRun: true,
        webpack: {
            module: {
                preLoaders: [
                    {
                        test: /\.js$/,
                        include: path.resolve('scripts/'),
                        exclude: [
                            path.resolve('node_modules/')
                        ],
                        loader: 'babel?stage=0'
                    },
                    {
                        test: /\.js$/,
                        include: path.resolve('scripts/'),
                        loader: 'isparta?{babel: {stage: 0}}'
                    }
                ]
            },
            watch: true,
            plugins: [
                new RewirePlugin()
            ]
        },
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        }
    });
};
