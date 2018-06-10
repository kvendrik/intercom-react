const path = require('path');
const {TsConfigPathsPlugin} = require('awesome-typescript-loader');
const package = require('./package.json');

const PATHS = {
  component: `${__dirname}/Intercom`,
  build: `${__dirname}/build`,
  basename: '/',
};

module.exports = {
  mode: process.env.PRODUCTION ? 'production' : 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    [package.name]: ['babel-polyfill', PATHS.component],
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
  output: {
    path: PATHS.build,
    filename: '[name].js',
    publicPath: PATHS.basename,
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg|otf)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          publicPath: PATHS.basename,
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
