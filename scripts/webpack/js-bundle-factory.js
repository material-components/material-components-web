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
const TerserPlugin = require('terser-webpack-plugin');

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
        moduleName: {root, amd},
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

    const terserOptions = {
      terserOptions: {
        output: {
          comments: false, // Removes repeated @license comments and other code comments.
        },
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
        // Webpack does not allow us to set custom placeholders, so we need to use a function here to
        // manually replace `[name]` with a camel-cased variant. e.g. `auto-init.js` should become `autoInit.js`.
        // Unfortunately we cannot set the chunk names directly to a camel-cased variant because that would
        // break the AMD module names then (which should match the NPM package names. e.g. `@material/auto-init`).
        filename: ({chunk: {name}}) => filenamePattern.replace(/\[name]/g, toCamelCase(name)),
        libraryTarget: 'umd',
        library: {
          root,
          amd,
        },
        umdNamedDefine: true,
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
        minimizer: [new TerserPlugin({terserOptions})],
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
        moduleName: {
          amd: 'material-components-web',
          root: ['mdc'],
        },
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
        'animation': getAbsolutePath('/packages/mdc-animation/index.ts'),
        'auto-init': getAbsolutePath('/packages/mdc-auto-init/index.ts'),
        'banner': getAbsolutePath('/packages/mdc-banner/index.ts'),
        'base': getAbsolutePath('/packages/mdc-base/index.ts'),
        'checkbox': getAbsolutePath('/packages/mdc-checkbox/index.ts'),
        'chips': getAbsolutePath('/packages/mdc-chips/index.ts'),
        'circular-progress': getAbsolutePath('packages/mdc-circular-progress/index.ts'),
        'data-table': getAbsolutePath('/packages/mdc-data-table/index.ts'),
        'dialog': getAbsolutePath('/packages/mdc-dialog/index.ts'),
        'dom': getAbsolutePath('/packages/mdc-dom/index.ts'),
        'drawer': getAbsolutePath('/packages/mdc-drawer/index.ts'),
        'floating-label': getAbsolutePath('/packages/mdc-floating-label/index.ts'),
        'form-field': getAbsolutePath('/packages/mdc-form-field/index.ts'),
        'icon-button': getAbsolutePath('/packages/mdc-icon-button/index.ts'),
        'list': getAbsolutePath('/packages/mdc-list/index.ts'),
        'line-ripple': getAbsolutePath('/packages/mdc-line-ripple/index.ts'),
        'linear-progress': getAbsolutePath('/packages/mdc-linear-progress/index.ts'),
        'menu': getAbsolutePath('/packages/mdc-menu/index.ts'),
        'menu-surface': getAbsolutePath('/packages/mdc-menu-surface/index.ts'),
        'notched-outline': getAbsolutePath('/packages/mdc-notched-outline/index.ts'),
        'radio': getAbsolutePath('/packages/mdc-radio/index.ts'),
        'ripple': getAbsolutePath('/packages/mdc-ripple/index.ts'),
        'segmented-button': getAbsolutePath('/packages/mdc-segmented-button/index.ts'),
        'select': getAbsolutePath('/packages/mdc-select/index.ts'),
        'slider': getAbsolutePath('/packages/mdc-slider/index.ts'),
        'snackbar': getAbsolutePath('/packages/mdc-snackbar/index.ts'),
        'switch': getAbsolutePath('/packages/mdc-switch/index.ts'),
        'tab': getAbsolutePath('/packages/mdc-tab/index.ts'),
        'tab-bar': getAbsolutePath('/packages/mdc-tab-bar/index.ts'),
        'tab-indicator': getAbsolutePath('/packages/mdc-tab-indicator/index.ts'),
        'tab-scroller': getAbsolutePath('/packages/mdc-tab-scroller/index.ts'),
        'textfield': getAbsolutePath('/packages/mdc-textfield/index.ts'),
        'tooltip': getAbsolutePath('/packages/mdc-tooltip/index.ts'),
        'top-app-bar': getAbsolutePath('/packages/mdc-top-app-bar/index.ts'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'mdc.[name].min.js' : 'mdc.[name].js',
        moduleName: {
          amd: '@material/[name]',
          root: ['mdc', '[name]'],
        },
      },
      plugins,
    });
  }
}

/**
 * @param {string} dashedName A dash-separated package name. E.g., "mdc-linear-progress".
 * @return {string} dashedName converted to camelCase. E.g., "mdcLinearProgress".
 */
function toCamelCase(dashedName) {
  return dashedName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

module.exports = JsBundleFactory;
