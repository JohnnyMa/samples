var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * http://webpack.github.io/docs/configuration.html
 * http://www.pro-react.com/materials/appendixA/
 * http://webpack.github.io/docs/list-of-tutorials.html
 */
module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    publicPath: 'assets/js',
    filename: 'build.js?t=[hash]'
  },
  resolve: {
    root: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules')
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    // http://webpack.github.io/docs/loader-conventions.html
    // http://webpack.github.io/docs/list-of-loaders.html
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      // http://webpack.github.io/docs/stylesheets.html
      { test: /\.css$/,
        loader: 'style!css'
      },
      { test: /\.csv$/, loader: 'dsv-loader' },
      { test: /\.css.raw$/, loader: 'css-to-string!css' }
    ]
  },
  postcss: [
    require('autoprefixer')
  ],
  // http://webpack.github.io/docs/list-of-plugins.html
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html.template'),
      filename: '../../index.html',
      assetsUrl: 'assets'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      comments: false
    }),
    new webpack.BannerPlugin('Copyright')
  ]
};