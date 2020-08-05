/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @fileoverview Creates Webpack bundle config objects to compile ES2015 JavaScript to ES5.
 */

'use strict';

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

class JsBundleFactory {
  constructor({
    env,
    pathResolver,
    globber,
    pluginFactory,
  } = {}) {
    /** @type {!Environment} */
    this.env_ = env;

    /** @type {!PathResolver} */
    this.pathResolver_ = pathResolver;

    /** @type {!Globber} */
    this.globber_ = globber;

    /** @type {!PluginFactory} */
    this.pluginFactory_ = pluginFactory;
  }

  createCustomJs(
    {
      bundleName,
      chunks,
      extensions = ['.ts', '.js'],
      chunkGlobConfig: {
        inputDirectory = null,
        filePathPattern = '**/*.js',
      } = {},
      output: {
        fsDirAbsolutePath = undefined, // Required for building the npm distribution and writing output files to disk
        httpDirAbsolutePath = undefined, // Required for running the demo server
        filenamePattern = this.env_.isProd() ? '[name].min.js' : '[name].js',
        library,
        globalObject = 'this',
      },
      plugins = [],
      tsConfigFilePath = path.resolve(__dirname, '../../tsconfig.json'),
    }) {
    chunks = chunks || this.globber_.getChunks({inputDirectory, filePathPattern});

    const babelLoader = {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    };

    const uglifyOptions = {
      output: {
        comments: false, // Removes repeated @license comments and other code comments.
      },
      sourceMap: true,
    };

    const commonPlugins = [
      this.pluginFactory_.createCopyrightBannerPlugin(),
    ];

    return {
      name: bundleName,
      entry: chunks,
      output: {
        path: fsDirAbsolutePath,
        publicPath: httpDirAbsolutePath,
        filename: filenamePattern,
        libraryTarget: 'umd',
        library,
        globalObject,
      },
      resolve: {extensions},
      devtool: 'source-map',
      module: {
        rules: [{
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            babelLoader,
            {
              loader: 'ts-loader',
              options: {configFile: tsConfigFilePath},
            },
          ],
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [babelLoader],
        }],
      },
      optimization: {
        minimize: this.env_.isProd(),
        minimizer: [new UglifyJSPlugin({uglifyOptions})],
      },
      plugins: [
        ...commonPlugins,
        ...plugins,
      ],
    };
  }

  createMainJsCombined(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomJs({
      bundleName: 'main-js-combined',
      chunks: getAbsolutePath('/packages/material-components-web/index.ts'),
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'material-components-web.min.js' : 'material-components-web.js',
        library: 'mdc',
      },
      plugins,
    });
  }

  createMainJsALaCarte(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomJs({
      bundleName: 'main-js-a-la-carte',
      chunks: {
        animation: getAbsolutePath('/packages/mdc-animation/index.ts'),
        autoInit: getAbsolutePath('/packages/mdc-auto-init/index.ts'),
        banner: getAbsolutePath('/packages/mdc-banner/index.ts'),
        base: getAbsolutePath('/packages/mdc-base/index.ts'),
        checkbox: getAbsolutePath('/packages/mdc-checkbox/index.ts'),
        chips: getAbsolutePath('/packages/mdc-chips/index.ts'),
        circularProgress: getAbsolutePath('packages/mdc-circular-progress/index.ts'),
        dataTable: getAbsolutePath('/packages/mdc-data-table/index.ts'),
        dialog: getAbsolutePath('/packages/mdc-dialog/index.ts'),
        dom: getAbsolutePath('/packages/mdc-dom/index.ts'),
        drawer: getAbsolutePath('/packages/mdc-drawer/index.ts'),
        floatingLabel: getAbsolutePath('/packages/mdc-floating-label/index.ts'),
        formField: getAbsolutePath('/packages/mdc-form-field/index.ts'),
        iconButton: getAbsolutePath('/packages/mdc-icon-button/index.ts'),
        list: getAbsolutePath('/packages/mdc-list/index.ts'),
        lineRipple: getAbsolutePath('/packages/mdc-line-ripple/index.ts'),
        linearProgress: getAbsolutePath('/packages/mdc-linear-progress/index.ts'),
        menu: getAbsolutePath('/packages/mdc-menu/index.ts'),
        menuSurface: getAbsolutePath('/packages/mdc-menu-surface/index.ts'),
        notchedOutline: getAbsolutePath('/packages/mdc-notched-outline/index.ts'),
        radio: getAbsolutePath('/packages/mdc-radio/index.ts'),
        ripple: getAbsolutePath('/packages/mdc-ripple/index.ts'),
	      segmentedButton: getAbsolutePath('/packages/mdc-segmented-button/index.ts'),
        select: getAbsolutePath('/packages/mdc-select/index.ts'),
        slider: getAbsolutePath('/packages/mdc-slider/index.ts'),
        snackbar: getAbsolutePath('/packages/mdc-snackbar/index.ts'),
        switch: getAbsolutePath('/packages/mdc-switch/index.ts'),
        tab: getAbsolutePath('/packages/mdc-tab/index.ts'),
        tabBar: getAbsolutePath('/packages/mdc-tab-bar/index.ts'),
        tabIndicator: getAbsolutePath('/packages/mdc-tab-indicator/index.ts'),
        tabScroller: getAbsolutePath('/packages/mdc-tab-scroller/index.ts'),
        textfield: getAbsolutePath('/packages/mdc-textfield/index.ts'),
        tooltip: getAbsolutePath('/packages/mdc-tooltip/index.ts'),
        topAppBar: getAbsolutePath('/packages/mdc-top-app-bar/index.ts'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'mdc.[name].min.js' : 'mdc.[name].js',
        library: ['mdc', '[name]'],
      },
      plugins,
    });
  }
}

module.exports = JsBundleFactory;
