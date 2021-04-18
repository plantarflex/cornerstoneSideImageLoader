const TerserPlugin = require('terser-webpack-plugin')
const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },  
};
