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

/**
 * @fileoverview Creates Webpack bundle config objects to compile Sass files to CSS.
 */

'use strict';

const autoprefixer = require('autoprefixer');

module.exports = class {
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
        'mdc.button': getAbsolutePath('/packages/mdc-button/mdc-button.scss'),
        'mdc.card': getAbsolutePath('/packages/mdc-card/mdc-card.scss'),
        'mdc.checkbox': getAbsolutePath('/packages/mdc-checkbox/mdc-checkbox.scss'),
        'mdc.chips': getAbsolutePath('/packages/mdc-chips/mdc-chips.scss'),
        'mdc.dialog': getAbsolutePath('/packages/mdc-dialog/mdc-dialog.scss'),
        'mdc.drawer': getAbsolutePath('/packages/mdc-drawer/mdc-drawer.scss'),
        'mdc.elevation': getAbsolutePath('/packages/mdc-elevation/mdc-elevation.scss'),
        'mdc.fab': getAbsolutePath('/packages/mdc-fab/mdc-fab.scss'),
        'mdc.floating-label': getAbsolutePath('/packages/mdc-floating-label/mdc-floating-label.scss'),
        'mdc.form-field': getAbsolutePath('/packages/mdc-form-field/mdc-form-field.scss'),
        'mdc.grid-list': getAbsolutePath('/packages/mdc-grid-list/mdc-grid-list.scss'),
        'mdc.icon-toggle': getAbsolutePath('/packages/mdc-icon-toggle/mdc-icon-toggle.scss'),
        'mdc.image-list': getAbsolutePath('/packages/mdc-image-list/mdc-image-list.scss'),
        'mdc.layout-grid': getAbsolutePath('/packages/mdc-layout-grid/mdc-layout-grid.scss'),
        'mdc.line-ripple': getAbsolutePath('/packages/mdc-line-ripple/mdc-line-ripple.scss'),
        'mdc.linear-progress': getAbsolutePath('/packages/mdc-linear-progress/mdc-linear-progress.scss'),
        'mdc.list': getAbsolutePath('/packages/mdc-list/mdc-list.scss'),
        'mdc.menu': getAbsolutePath('/packages/mdc-menu/mdc-menu.scss'),
        'mdc.notched-outline': getAbsolutePath('/packages/mdc-notched-outline/mdc-notched-outline.scss'),
        'mdc.radio': getAbsolutePath('/packages/mdc-radio/mdc-radio.scss'),
        'mdc.ripple': getAbsolutePath('/packages/mdc-ripple/mdc-ripple.scss'),
        'mdc.select': getAbsolutePath('/packages/mdc-select/mdc-select.scss'),
        'mdc.slider': getAbsolutePath('/packages/mdc-slider/mdc-slider.scss'),
        'mdc.snackbar': getAbsolutePath('/packages/mdc-snackbar/mdc-snackbar.scss'),
        'mdc.switch': getAbsolutePath('/packages/mdc-switch/mdc-switch.scss'),
        'mdc.tab': getAbsolutePath('/packages/mdc-tab/mdc-tab.scss'),
        'mdc.tabs': getAbsolutePath('/packages/mdc-tabs/mdc-tabs.scss'),
        'mdc.textfield': getAbsolutePath('/packages/mdc-textfield/mdc-text-field.scss'),
        'mdc.theme': getAbsolutePath('/packages/mdc-theme/mdc-theme.scss'),
        'mdc.toolbar': getAbsolutePath('/packages/mdc-toolbar/mdc-toolbar.scss'),
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

  createCssLoader_(extractTextPlugin) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return extractTextPlugin.extract({
      use: [
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
            plugins: () => [this.autoprefixerLib_({grid: false})],
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [getAbsolutePath('/packages/material-components-web/node_modules')],
          },
        },
      ],
    });
  }
};
