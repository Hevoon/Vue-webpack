const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');
const isdev = process.env.NODE_ENV === 'development';
const config = {
    target: 'web',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'vue-style-loader', 'css-loader']
        },
            {
                test: /\.vue$/,
                loader: ['vue-loader']
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|svg|png|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 500,
                        name: '[name]-w.[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isdev ? '"development"' : '"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HtmlPlugin()
    ]
};

if (isdev) {
    config.module.rules.push({
        test: /\.styl$/,
        use: [
            'style-loader', 'vue-style-loader', 'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    },);
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: '8080',
        host: '0.0.0.0',
        overlay: {
            errors: true,
        },
        hot: true,
        inline: true,
        contentBase: './dist'
    };
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    )
} else {
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    };
    config.output.filename = '[name].[chunkhash:8].js'//hash作用到了vendor.js上，chunkhash相当于用了另一个节点
    config.module.rules.push({
        test: /\.styl$/,
        use: ExtractPlugin.extract({
            fallback: ['style-loader', 'vue-style-loader'],
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                'stylus-loader'
            ]
        })
    });
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        })//生成的webapck文件单独打包出去，新模块加入时给一个id，
    )

}
module.exports = config;