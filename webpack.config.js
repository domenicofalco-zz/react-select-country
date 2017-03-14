const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, './'),
  entry: {
    main: ['./dev/modernizr-custom', './dev/custom-polyfill', './dev/selectCountry.js']
  },
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: 'bundle.[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, './dev'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { modules: false }],
              ['react']
            ]
          }
        }]
      }
    ]
  }
}

module.exports = config
