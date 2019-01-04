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
      extensions = ['.ts', '.js', '.json'],
      chunkGlobConfig: {
        inputDirectory = null,
        filePathPattern = '**/*.js',
      } = {},
      output: {
        fsDirAbsolutePath = undefined, // Required for building the npm distribution and writing output files to disk
        httpDirAbsolutePath = undefined, // Required for running the demo server
        filenamePattern = this.env_.isProd() ? '[name].min.js' : '[name].js',
        library,
      },
      plugins = [],
    }) {
    chunks = chunks || this.globber_.getChunks({inputDirectory, filePathPattern});

    return {
      name: bundleName,
      entry: chunks,
      output: {
        path: fsDirAbsolutePath,
        publicPath: httpDirAbsolutePath,
        filename: filenamePattern,
        libraryTarget: 'umd',
        library,
      },
      resolve: {
        extensions,
      },
      devtool: 'source-map',
      module: {
        rules: [{
          test: /\.ts$/,
          loader: 'ts-loader',
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }],
      },
      plugins: [
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
      chunks: getAbsolutePath('/packages/material-components-web/index.js'),
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'material-components-web.min.js' : 'material-components-web.js',
        library: 'mdc',
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
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
        animation: getAbsolutePath('/packages/mdc-animation/index.js'),
        autoInit: getAbsolutePath('/packages/mdc-auto-init/index.js'),
        base: getAbsolutePath('/packages/mdc-base/index.js'),
        checkbox: getAbsolutePath('/packages/mdc-checkbox/index.js'),
        chips: getAbsolutePath('/packages/mdc-chips/index.js'),
        dialog: getAbsolutePath('/packages/mdc-dialog/index.js'),
        dom: getAbsolutePath('/packages/mdc-dom/index.js'),
        drawer: getAbsolutePath('/packages/mdc-drawer/index.js'),
        floatingLabel: getAbsolutePath('/packages/mdc-floating-label/index.js'),
        formField: getAbsolutePath('/packages/mdc-form-field/index.js'),
        gridList: getAbsolutePath('/packages/mdc-grid-list/index.js'),
        iconButton: getAbsolutePath('/packages/mdc-icon-button/index.js'),
        iconToggle: getAbsolutePath('/packages/mdc-icon-toggle/index.js'),
        list: getAbsolutePath('/packages/mdc-list/index.js'),
        lineRipple: getAbsolutePath('/packages/mdc-line-ripple/index.js'),
        linearProgress: getAbsolutePath('/packages/mdc-linear-progress/index.js'),
        menu: getAbsolutePath('/packages/mdc-menu/index.js'),
        menuSurface: getAbsolutePath('/packages/mdc-menu-surface/index.js'),
        notchedOutline: getAbsolutePath('/packages/mdc-notched-outline/index.js'),
        radio: getAbsolutePath('/packages/mdc-radio/index.js'),
        ripple: getAbsolutePath('/packages/mdc-ripple/index.js'),
        select: getAbsolutePath('/packages/mdc-select/index.js'),
        selectionControl: getAbsolutePath('/packages/mdc-selection-control/index.js'),
        slider: getAbsolutePath('/packages/mdc-slider/index.js'),
        snackbar: getAbsolutePath('/packages/mdc-snackbar/index.js'),
        switch: getAbsolutePath('/packages/mdc-switch/index.js'),
        tab: getAbsolutePath('/packages/mdc-tab/index.js'),
        tabBar: getAbsolutePath('/packages/mdc-tab-bar/index.js'),
        tabIndicator: getAbsolutePath('/packages/mdc-tab-indicator/index.js'),
        tabScroller: getAbsolutePath('/packages/mdc-tab-scroller/index.js'),
        tabs: getAbsolutePath('/packages/mdc-tabs/index.js'),
        textfield: getAbsolutePath('/packages/mdc-textfield/index.js'),
        toolbar: getAbsolutePath('/packages/mdc-toolbar/index.js'),
        topAppBar: getAbsolutePath('/packages/mdc-top-app-bar/index.js'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'mdc.[name].min.js' : 'mdc.[name].js',
        library: ['mdc', '[name]'],
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
    });
  }
}

module.exports = JsBundleFactory;
