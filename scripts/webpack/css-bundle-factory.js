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
 * @fileoverview Creates Webpack bundle config objects to compile Sass files to CSS.
 */

'use strict';

const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class CssBundleFactory {
  constructor({
    env,
    pathResolver,
    globber,
    pluginFactory,
    autoprefixerLib = autoprefixer,
  } = {}) {
    /** @type {!Environment} */
    this.env_ = env;

    /** @type {!PathResolver} */
    this.pathResolver_ = pathResolver;

    /** @type {!Globber} */
    this.globber_ = globber;

    /** @type {!PluginFactory} */
    this.pluginFactory_ = pluginFactory;

    /** @type {function(opts: ...*=)} */
    this.autoprefixerLib_ = autoprefixerLib;
  }

  createCustomCss(
    {
      bundleName,
      chunks,
      chunkGlobConfig: {
        inputDirectory = null,
        filePathPattern = '**/*.scss',
      } = {},
      output: {
        fsDirAbsolutePath = undefined, // Required for building the npm distribution and writing output files to disk
        httpDirAbsolutePath = undefined, // Required for running the demo server
        filenamePattern = this.env_.isProd() ? '[name].min.css' : '[name].css',
      },
      plugins = [],
    }) {
    chunks = chunks || this.globber_.getChunks({inputDirectory, filePathPattern});

    const fsCleanupPlugins = [];

    if (fsDirAbsolutePath) {
      fsCleanupPlugins.push(this.pluginFactory_.createCssCleanupPlugin({
        cleanupDirRelativePath: fsDirAbsolutePath,
      }));
    }

    const cssExtractorPlugin = this.pluginFactory_.createCssExtractorPlugin(filenamePattern);

    return {
      name: bundleName,
      entry: chunks,
      output: {
        path: fsDirAbsolutePath,
        publicPath: httpDirAbsolutePath,
        filename: `${filenamePattern}.js`, // Webpack 3.x emits CSS wrapped in a JS file (cssExtractorPlugin unwraps it)
      },
      devtool: 'source-map',
      module: {
        rules: [{
          test: /\.scss$/,
          use: this.createCssLoader_(cssExtractorPlugin),
        }],
      },
      optimization: {
        minimize: this.env_.isProd(),
      },
      plugins: [
        cssExtractorPlugin,
        ...fsCleanupPlugins,
        ...plugins,
      ],
    };
  }

  createMainCssCombined(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomCss({
      bundleName: 'main-css-combined',
      chunks: {
        'material-components-web': getAbsolutePath('/packages/material-components-web/material-components-web.scss'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
    });
  }

  createMainCssALaCarte(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomCss({
      bundleName: 'main-css-a-la-carte',
      chunks: {
        'mdc.banner': getAbsolutePath('/packages/mdc-banner/styles.scss'),
        'mdc.button': getAbsolutePath('/packages/mdc-button/mdc-button.scss'),
        'mdc.card': getAbsolutePath('/packages/mdc-card/mdc-card.scss'),
        'mdc.checkbox': getAbsolutePath('/packages/mdc-checkbox/mdc-checkbox.scss'),
        'mdc.chips': getAbsolutePath('/packages/mdc-chips/deprecated/mdc-chips.scss'),
        'mdc.circular-progress': getAbsolutePath('/packages/mdc-circular-progress/mdc-circular-progress.scss'),
        'mdc.data-table': getAbsolutePath('/packages/mdc-data-table/mdc-data-table.scss'),
        'mdc.dialog': getAbsolutePath('/packages/mdc-dialog/mdc-dialog.scss'),
        'mdc.drawer': getAbsolutePath('/packages/mdc-drawer/mdc-drawer.scss'),
        'mdc.elevation': getAbsolutePath('/packages/mdc-elevation/mdc-elevation.scss'),
        'mdc.fab': getAbsolutePath('/packages/mdc-fab/mdc-fab.scss'),
        'mdc.floating-label': getAbsolutePath('/packages/mdc-floating-label/mdc-floating-label.scss'),
        'mdc.form-field': getAbsolutePath('/packages/mdc-form-field/mdc-form-field.scss'),
        'mdc.icon-button': getAbsolutePath('/packages/mdc-icon-button/mdc-icon-button.scss'),
        'mdc.image-list': getAbsolutePath('/packages/mdc-image-list/mdc-image-list.scss'),
        'mdc.layout-grid': getAbsolutePath('/packages/mdc-layout-grid/mdc-layout-grid.scss'),
        'mdc.line-ripple': getAbsolutePath('/packages/mdc-line-ripple/mdc-line-ripple.scss'),
        'mdc.linear-progress': getAbsolutePath('/packages/mdc-linear-progress/mdc-linear-progress.scss'),
        'mdc.list': getAbsolutePath('/packages/mdc-list/mdc-list.scss'),
        'mdc.menu': getAbsolutePath('/packages/mdc-menu/mdc-menu.scss'),
        'mdc.menu-surface': getAbsolutePath('/packages/mdc-menu-surface/mdc-menu-surface.scss'),
        'mdc.notched-outline': getAbsolutePath('/packages/mdc-notched-outline/mdc-notched-outline.scss'),
        'mdc.radio': getAbsolutePath('/packages/mdc-radio/mdc-radio.scss'),
        'mdc.ripple': getAbsolutePath('/packages/mdc-ripple/mdc-ripple.scss'),
        'mdc.segmented-button': getAbsolutePath('/packages/mdc-segmented-button/styles.scss'),
        'mdc.select': getAbsolutePath('/packages/mdc-select/mdc-select.scss'),
        'mdc.slider': getAbsolutePath('/packages/mdc-slider/styles.scss'),
        'mdc.snackbar': getAbsolutePath('/packages/mdc-snackbar/mdc-snackbar.scss'),
        'mdc.switch': getAbsolutePath('/packages/mdc-switch/deprecated/mdc-switch.scss'),
        'mdc.tab': getAbsolutePath('/packages/mdc-tab/mdc-tab.scss'),
        'mdc.tab-bar': getAbsolutePath('/packages/mdc-tab-bar/mdc-tab-bar.scss'),
        'mdc.tab-indicator': getAbsolutePath('/packages/mdc-tab-indicator/mdc-tab-indicator.scss'),
        'mdc.tab-scroller': getAbsolutePath('/packages/mdc-tab-scroller/mdc-tab-scroller.scss'),
        'mdc.textfield': getAbsolutePath('/packages/mdc-textfield/mdc-text-field.scss'),
        'mdc.theme': getAbsolutePath('/packages/mdc-theme/mdc-theme.scss'),
        'mdc.tooltip': getAbsolutePath('/packages/mdc-tooltip/styles.scss'),
        'mdc.top-app-bar': getAbsolutePath('/packages/mdc-top-app-bar/mdc-top-app-bar.scss'),
        'mdc.typography': getAbsolutePath('/packages/mdc-typography/mdc-typography.scss'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
    });
  }

  createCssLoader_() {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: () => [this.autoprefixerLib_()],
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: [getAbsolutePath('/packages/material-components-web/node_modules')],
          implementation: require('sass'),
          fiber: require('fibers'),
        },
      },
    ];
  }
}

module.exports = CssBundleFactory;
