const path = require('path');
const yargs = require('yargs'); // use --env with webpack 2
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');


const {
  argv: { env },
} = yargs;

const libraryName = pkg.name;

let outputFile;

let mode;

if (env === 'build') {
  mode = 'production';
  outputFile = `${libraryName}.min.js`;
} else {
  mode = 'development';
  outputFile = `${libraryName}.js`;
}

const isDevelopment = mode === 'development';

const config = {
  mode,
  entry: `${__dirname}/src/index.js`,
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './lib',
    hot: true,
  },
  output: {
    filename: outputFile,
    path: path.resolve(`${__dirname}/lib`),
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.global.(s(a|c)ss)$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              camelCase: true,
              sourceMap: isDevelopment,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.global\.s(a|c)ss$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.json', '.js', '.jsx', '.scss'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
};

module.exports = config;
