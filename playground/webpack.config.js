const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../webpack.config.js');

const PLAYGROUND_PATH = __dirname;

config.devServer = {
  contentBase: PLAYGROUND_PATH,
  port: 9000,
  compress: true,
  historyApiFallback: {
    rewrites: [{from: /^\/[^\.]+$/, to: '/index.html'}],
  },
};
config.entry.playground = PLAYGROUND_PATH;
config.plugins.push(
  new HtmlWebpackPlugin({
    template: `${PLAYGROUND_PATH}/index-template.html`,
  }),
);

module.exports = config;
