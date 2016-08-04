var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // enable debug in browser
  // use 'eval-source-map' to just apply hot module reload
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    publicPath: '/',
    filename: 'app.js'
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
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
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
    new webpack.BannerPlugin('Copyright'),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html.template'),
      assetsUrl: '/dist/assets'
    })
  ],
  /*
   * http://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    colors: true,
    port: 8080,
    historyApiFallback: true,
    noInfo: true
  }
}