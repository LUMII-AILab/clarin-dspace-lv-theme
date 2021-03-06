var path = require('path');
var merge = require('webpack-merge');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (src, globals, generateStyleSheetFile) {
  return {
    rules: [
      {
        test: /\.less$/,
        use: [
          // We need style-loader in loaders to inject styles into angular-lindat.js
          // but we also need lindat.css itself
          generateStyleSheetFile ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {plugins: [require('autoprefixer')]}
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'public/img/[name].[ext]',
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.eot$/,
        use: 'url-loader?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
      },
      {
        test: /\.svg$/,
        use: 'url-loader?limit=10000&mimetype=image/svg+xml&prefix=fonts'
      },
      {
        test: /\.ttf$/,
        use: 'url-loader?limit=10000&mimetype=application/octet-stream&prefix=fonts'
      },
      {
        test: /\.html$/,
        use: [
          'html-loader?-attrs',
          {
            loader: 'swig-loader',
            options: merge({raw: true}, globals)
          }
        ]
      },
      {
        // for refbox, in theory it should be possible to use swig loader
        test: /\.template$/,
        use: ['mustache-loader']
      },
      // add @ngInject to js files in src/angular
      {
        test: /\.js$/,
        include: path.join(src, 'angular'),
        use: ['ng-annotate-loader']
      }
    ]
  }
};
