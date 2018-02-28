/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const path = require('path');

const CssBundleFactory = require('./scripts/webpack/css-bundle-factory');
const Environment = require('./scripts/build/environment');
const Globber = require('./scripts/webpack/globber');
const PathResolver = require('./scripts/build/path-resolver');
const PluginFactory = require('./scripts/webpack/plugin-factory');

const env = new Environment();
env.setBabelEnv();

const pathResolver = new PathResolver();
const globber = new Globber({pathResolver});
const pluginFactory = new PluginFactory({globber});
const cssBundleFactory = new CssBundleFactory({env, pathResolver, globber, pluginFactory});

const OUT_DIR_ABS = path.resolve('./build');
const DEMO_ASSET_DIR_REL = '/assets/'; // Used by webpack-dev-server

const copyrightBannerPlugin = pluginFactory.createCopyrightBannerPlugin();

module.exports = [{
  name: 'js-all',
  entry: path.resolve('./packages/material-components-web/index.js'),
  output: {
    path: OUT_DIR_ABS,
    publicPath: DEMO_ASSET_DIR_REL,
    filename: 'material-components-web.' + (env.isProd() ? 'min.' : '') + 'js',
    libraryTarget: 'umd',
    library: 'mdc',
  },
  // See https://github.com/webpack/webpack-dev-server/issues/882
  // Because we only spin up dev servers temporarily, and all of our assets are publicly
  // available on GitHub, we can safely disable this check.
  devServer: {
    disableHostCheck: true,
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    }],
  },
  plugins: [
    copyrightBannerPlugin,
  ],
}];

if (!env.isDev()) {
  module.exports.push({
    name: 'js-components',
    entry: {
      animation: [path.resolve('./packages/mdc-animation/index.js')],
      autoInit: [path.resolve('./packages/mdc-auto-init/index.js')],
      base: [path.resolve('./packages/mdc-base/index.js')],
      checkbox: [path.resolve('./packages/mdc-checkbox/index.js')],
      chips: [path.resolve('./packages/mdc-chips/index.js')],
      dialog: [path.resolve('./packages/mdc-dialog/index.js')],
      drawer: [path.resolve('./packages/mdc-drawer/index.js')],
      formField: [path.resolve('./packages/mdc-form-field/index.js')],
      gridList: [path.resolve('./packages/mdc-grid-list/index.js')],
      iconToggle: [path.resolve('./packages/mdc-icon-toggle/index.js')],
      lineRipple: [path.resolve('./packages/mdc-line-ripple/index.js')],
      linearProgress: [path.resolve('./packages/mdc-linear-progress/index.js')],
      menu: [path.resolve('./packages/mdc-menu/index.js')],
      radio: [path.resolve('./packages/mdc-radio/index.js')],
      ripple: [path.resolve('./packages/mdc-ripple/index.js')],
      select: [path.resolve('./packages/mdc-select/index.js')],
      selectionControl: [path.resolve('./packages/mdc-selection-control/index.js')],
      slider: [path.resolve('./packages/mdc-slider/index.js')],
      snackbar: [path.resolve('./packages/mdc-snackbar/index.js')],
      tabs: [path.resolve('./packages/mdc-tabs/index.js')],
      textfield: [path.resolve('./packages/mdc-textfield/index.js')],
      toolbar: [path.resolve('./packages/mdc-toolbar/index.js')],
      topAppBar: [path.resolve('./packages/mdc-top-app-bar/index.js')],
    },
    output: {
      path: OUT_DIR_ABS,
      publicPath: DEMO_ASSET_DIR_REL,
      filename: 'mdc.[name].' + (env.isProd() ? 'min.' : '') + 'js',
      libraryTarget: 'umd',
      library: ['mdc', '[name]'],
    },
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      }],
    },
    plugins: [
      copyrightBannerPlugin,
    ],
  });

  module.exports.push(cssBundleFactory.createMainCssCombined({
    output: {
      fsDirAbsolutePath: OUT_DIR_ABS,
      httpDirAbsolutePath: DEMO_ASSET_DIR_REL,
    },
  }));

  module.exports.push(cssBundleFactory.createMainCssALaCarte({
    output: {
      fsDirAbsolutePath: OUT_DIR_ABS,
      httpDirAbsolutePath: DEMO_ASSET_DIR_REL,
    },
  }));
}

if (env.isDev()) {
  module.exports.push(cssBundleFactory.createCustomCss({
    bundleName: 'demo-css',
    chunkGlobConfig: {
      inputDirectory: '/demos',
    },
    output: {
      fsDirAbsolutePath: OUT_DIR_ABS,
      httpDirAbsolutePath: DEMO_ASSET_DIR_REL,
    },
    plugins: [
      copyrightBannerPlugin,
    ],
  }));

  module.exports.push({
    name: 'demo-js',
    entry: {
      'common': [path.resolve('./demos/common.js')],
      'theme/index': [path.resolve('./demos/theme/index.js')],
    },
    output: {
      path: OUT_DIR_ABS,
      publicPath: DEMO_ASSET_DIR_REL,
      filename: '[name].js',
      libraryTarget: 'umd',
      library: ['demo', '[name]'],
    },
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      }],
    },
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}
