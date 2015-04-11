var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server',
        './scripts/index'
    ],
    devtool: 'sourcemap',
    output: {
        path: __dirname,
        filename: 'bundle.js',
        publicPath: '/scripts/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['react-hot', 'babel?stage=0']}
        ]
    }
};
