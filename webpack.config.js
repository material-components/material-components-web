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
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const OUT_PATH = path.resolve('./build');
// Used with webpack-dev-server
const PUBLIC_PATH = '/assets/';
const IS_DEV = process.env.MDC_ENV === 'development';
const IS_PROD = process.env.MDC_ENV === 'production';

const banner = [
  '/*!',
  ' Material Components for the web',
  ` Copyright (c) ${new Date().getFullYear()} Google Inc.`,
  ' License: Apache-2.0',
  '*/',
].join('\n');

const createBannerPlugin = () => new webpack.BannerPlugin({
  banner: banner,
  raw: true,
  entryOnly: true,
});

const LIFECYCLE_EVENT = process.env.npm_lifecycle_event;
if (LIFECYCLE_EVENT == 'test' || LIFECYCLE_EVENT == 'test:watch') {
  process.env.BABEL_ENV = 'test';
}

const CSS_LOADER_CONFIG = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () =>[require('autoprefixer')({grid: false})],
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      includePaths: glob.sync('packages/*/node_modules').map((d) => path.join(__dirname, d)),
    },
  },
];

module.exports = [{
  name: 'js-components',
  entry: {
    animation: [path.resolve('./packages/mdc-animation/index.js')],
    autoInit: [path.resolve('./packages/mdc-auto-init/index.js')],
    base: [path.resolve('./packages/mdc-base/index.js')],
    checkbox: [path.resolve('./packages/mdc-checkbox/index.js')],
    dialog: [path.resolve('./packages/mdc-dialog/index.js')],
    drawer: [path.resolve('./packages/mdc-drawer/index.js')],
    formField: [path.resolve('./packages/mdc-form-field/index.js')],
    gridList: [path.resolve('./packages/mdc-grid-list/index.js')],
    iconToggle: [path.resolve('./packages/mdc-icon-toggle/index.js')],
    menu: [path.resolve('./packages/mdc-menu/index.js')],
    radio: [path.resolve('./packages/mdc-radio/index.js')],
    ripple: [path.resolve('./packages/mdc-ripple/index.js')],
    select: [path.resolve('./packages/mdc-select/index.js')],
    snackbar: [path.resolve('./packages/mdc-snackbar/index.js')],
    textfield: [path.resolve('./packages/mdc-textfield/index.js')],
    toolbar: [path.resolve('./packages/mdc-toolbar/index.js')],
  },
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    filename: 'mdc.[name].' + (IS_PROD ? 'min.' : '') + 'js',
    libraryTarget: 'umd',
    library: ['mdc', '[name]'],
  },
  devtool: IS_DEV ? 'source-map' : false,
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
    createBannerPlugin(),
  ],
}, {
  name: 'js-all',
  entry: path.resolve('./packages/material-components-web/index.js'),
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    filename: 'material-components-web.' + (IS_PROD ? 'min.' : '') + 'js',
    libraryTarget: 'umd',
    library: 'mdc',
  },
  devtool: IS_DEV ? 'source-map' : false,
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
    createBannerPlugin(),
  ],
}, {
  name: 'css',
  entry: {
    'material-components-web': path.resolve(
        './packages/material-components-web/material-components-web.scss'),
    'mdc.animation': path.resolve('./packages/mdc-animation/mdc-animation.scss'),
    'mdc.button': path.resolve('./packages/mdc-button/mdc-button.scss'),
    'mdc.card': path.resolve('./packages/mdc-card/mdc-card.scss'),
    'mdc.checkbox': path.resolve('./packages/mdc-checkbox/mdc-checkbox.scss'),
    'mdc.dialog': path.resolve('./packages/mdc-dialog/mdc-dialog.scss'),
    'mdc.drawer': path.resolve('./packages/mdc-drawer/mdc-drawer.scss'),
    'mdc.elevation': path.resolve('./packages/mdc-elevation/mdc-elevation.scss'),
    'mdc.fab': path.resolve('./packages/mdc-fab/mdc-fab.scss'),
    'mdc.form-field': path.resolve('./packages/mdc-form-field/mdc-form-field.scss'),
    'mdc.grid-list': path.resolve('./packages/mdc-grid-list/mdc-grid-list.scss'),
    'mdc.icon-toggle': path.resolve('./packages/mdc-icon-toggle/mdc-icon-toggle.scss'),
    'mdc.layout-grid': path.resolve('./packages/mdc-layout-grid/mdc-layout-grid.scss'),
    'mdc.list': path.resolve('./packages/mdc-list/mdc-list.scss'),
    'mdc.menu': path.resolve('./packages/mdc-menu/mdc-menu.scss'),
    'mdc.radio': path.resolve('./packages/mdc-radio/mdc-radio.scss'),
    'mdc.ripple': path.resolve('./packages/mdc-ripple/mdc-ripple.scss'),
    'mdc.select': path.resolve('./packages/mdc-select/mdc-select.scss'),
    'mdc.snackbar': path.resolve('./packages/mdc-snackbar/mdc-snackbar.scss'),
    'mdc.switch': path.resolve('./packages/mdc-switch/mdc-switch.scss'),
    'mdc.textfield': path.resolve('./packages/mdc-textfield/mdc-textfield.scss'),
    'mdc.theme': path.resolve('./packages/mdc-theme/mdc-theme.scss'),
    'mdc.toolbar': path.resolve('./packages/mdc-toolbar/mdc-toolbar.scss'),
    'mdc.typography': path.resolve('./packages/mdc-typography/mdc-typography.scss'),
  },
  output: {
    path: OUT_PATH,
    publicPath: PUBLIC_PATH,
    // In development, these are emitted as js files to facilitate hot module replacement. In
    // all other cases, ExtractTextPlugin is used to generate the final css, so this is given a
    // dummy ".css-entry" extension.
    filename: '[name].' + (IS_PROD ? 'min.' : '') + 'css' + (IS_DEV ? '.js' : '-entry'),
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [{
      test: /\.scss$/,
      use: IS_DEV ? [{loader: 'style-loader'}].concat(CSS_LOADER_CONFIG) : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: CSS_LOADER_CONFIG,
      }),
    }],
  },
  plugins: [
    new ExtractTextPlugin('[name].' + (IS_PROD ? 'min.' : '') + 'css'),
    createBannerPlugin(),
  ],
}];
