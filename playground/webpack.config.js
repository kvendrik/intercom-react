/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {TsConfigPathsPlugin} = require('awesome-typescript-loader');
const path = require('path');

const PLAYGROUND_PATH = __dirname;
const BASENAME = '/';

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: PLAYGROUND_PATH,
    port: 9000,
    host: '0.0.0.0',
    compress: true,
    historyApiFallback: {
      rewrites: [{from: /^\/[^.]+$/, to: '/index.html'}],
    },
  },
  devtool: 'cheap-module-eval-source-map',
  entry: {
    playground: PLAYGROUND_PATH,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve('./node_modules')],
    plugins: [
      new TsConfigPathsPlugin({
        configFileName: path.resolve(`./tsconfig.json`),
        compiler: 'typescript',
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${PLAYGROUND_PATH}/index-template.html`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg|otf)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          publicPath: BASENAME,
        },
      },
      {
        test: /\.scss$/,
        loader: [
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              namedExport: true,
              modules: true,
              importLoaders: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [],
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /(node_modules)/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015'],
          plugins: [
            'transform-decorators-legacy',
            'transform-object-rest-spread',
          ],
        },
      },
    ],
  },
};
