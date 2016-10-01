const webpack = require('webpack');
const Autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = env => {
  const addPlugin = (add, plugin) => add ? plugin : undefined;
  const ifProd = plugin => addPlugin(env.prod, plugin);
  const ifDev = plugin => addPlugin(env.dev, plugin);
  const removeEmpty = array => array.filter(p => !!p);

  return {
    entry: {
      app: path.join(__dirname, './src/'),
    },
    output: {
      filename: 'morph.js',
      path: path.join(__dirname, './lib/'),
      publicPath: '/',
    },
    devtool: env.prod ? 'hidden-source-map' : 'eval-source-map',
    devServer: {
  		contentBase: path.join(__dirname, './src/'),
  		hot: true,
  	},
    module: {
      loaders: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            cacheDirectory: true,
          },
        },
        {
          test: /\.scss$/,
          loaders:
            env.dev || env.test
            ? [
              'style',
              'css?minimize&-autoprefixer',
              'postcss',
              'sass',
            ]
            : ExtractTextPlugin.extract({ fallbackLoader: 'style', loader: 'css?minimize&-autoprefixer!postcss!sass' }),
        },
      ],
    },
    plugins: removeEmpty([
      // both development and production enviroments
      new webpack.optimize.OccurrenceOrderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './src/index.html'),
        filename: 'index.html',
        inject: 'body',
      }),
      // development enviroment only
      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifDev(new webpack.NoErrorsPlugin()),
      // production enviroment only
      ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new ExtractTextPlugin({
        allChunks: true,
        filename: '[name].[contenthash].css',
      })),
      ifProd(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          'screw_ie8': true,
          'warnings': false,
          'unused': true,
          'dead_code': true,
          'drop_console': true,
        },
        output: {
          comments: false,
        },
        sourceMap: false,
      })),
      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {
          context: __dirname,
          postcss: [Autoprefixer({ browsers: ['last 3 versions'] })]
        }
      })),
    ]),
  };
};
