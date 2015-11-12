import path from 'path';
import webpack from 'webpack';

import { ROOT_PATH, SRC_PATH, BUILD_PATH, NODE_MODULES_PATH } from '../config/projectPathConfig';
import { APP_HOST, APP_PORT, WEBPACK_HOST, WEBPACK_PORT } from '../config/serverAddressConfig';
import { JS_PATH, CSS_PATH, ASSETS_PATH } from '../config/publicFolderConfig';
import webpackConfigBase from './webpack.config.base';

export default {
  cache: true,
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${WEBPACK_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
      path.join(SRC_PATH, 'client', 'Main.js')
    ]
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].js',
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}${JS_PATH}/`
  },
  module: {
    preLoaders: webpackConfigBase.module.preLoaders,
    loaders: webpackConfigBase.module.loaders.concat([
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          stage: 0,
          env: {
            development: {
              plugins: ['react-transform'],
              extra: {
                'react-transform': {
                  transforms: [
                    {
                      transform: 'react-transform-hmr',
                      imports: ['react'],
                      locals: ['module']
                    },
                    {
                      transform: 'react-transform-catch-errors',
                      imports: ['react', 'redbox-react']
                    }
                  ]
                }
              }
            }
          }
        },
        test: /\.js|jsx$/
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'autoprefixer-loader',
          'sass-loader?outputStyle=compressed'
        ]
      }
    ])
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: webpackConfigBase.resolve
};
