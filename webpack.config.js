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

const os = require('os');
const path = require('path');

const fsx = require('fs-extra');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const OUT_DIR_ABS = path.resolve('./build');
const DEMO_ASSET_DIR_REL = '/assets/'; // Used by webpack-dev-server and MDC_BUILD_STATIC_DEMO_ASSETS

const IS_DEV = process.env.MDC_ENV === 'development';
const IS_PROD = process.env.MDC_ENV === 'production';

const WRAP_CSS_IN_JS = process.env.MDC_WRAP_CSS_IN_JS === 'true' && IS_DEV;
// Source maps break extract-text-webpack-plugin, so they need to be disabled when WRAP_CSS_IN_JS is set to false.
const GENERATE_SOURCE_MAPS =
    process.env.MDC_GENERATE_SOURCE_MAPS === 'true' ||
    (process.env.MDC_GENERATE_SOURCE_MAPS !== 'false' && IS_DEV && WRAP_CSS_IN_JS);
const BUILD_STATIC_DEMO_ASSETS = process.env.MDC_BUILD_STATIC_DEMO_ASSETS === 'true';

const SASS_DEVTOOL = GENERATE_SOURCE_MAPS ? 'source-map' : false;
const JS_DEVTOOL = 'source-map';

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
      sourceMap: GENERATE_SOURCE_MAPS,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: GENERATE_SOURCE_MAPS,
      plugins: () => [require('autoprefixer')({grid: false})],
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: GENERATE_SOURCE_MAPS,
      includePaths: glob.sync('packages/*/node_modules').map((d) => path.join(__dirname, d)),
    },
  },
];

// In development, stylesheets are emitted as JS files to facilitate hot module replacement.
// In all other cases, ExtractTextPlugin is used to generate the final CSS, so these files are
// given a dummy ".js-entry" extension.
const CSS_JS_FILENAME_OUTPUT_PATTERN = `[name]${IS_PROD ? '.min' : ''}.css${IS_DEV ? '.js' : '.js-entry'}`;
const CSS_FILENAME_OUTPUT_PATTERN = `[name]${IS_PROD ? '.min' : ''}.css`;

const createCssLoaderConfig = () =>
  WRAP_CSS_IN_JS ?
    [{loader: 'style-loader'}].concat(CSS_LOADER_CONFIG) :
    ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: CSS_LOADER_CONFIG,
    });

const createCssExtractTextPlugin = () => new ExtractTextPlugin(CSS_FILENAME_OUTPUT_PATTERN);

class PostCompilePlugin {
  constructor(fn) {
    this.fn = fn;
  }

  apply(compiler) {
    compiler.plugin('done', (stats) => this.fn(stats));
  }
}

const createStaticDemoPlugin = () => {
  return new PostCompilePlugin(() => {
    if (!BUILD_STATIC_DEMO_ASSETS || !fsx.existsSync(OUT_DIR_ABS)) {
      return;
    }

    const demosDirAbs = path.resolve('./demos');
    const tmpDirAbs = fsx.mkdtempSync(path.join(os.tmpdir(), 'mdc-web-demo-output-'));

    const copyOptions = {
      filter: (src) => {
        return !/\.(scss|css.js)$/.test(src);
      },
    };

    fsx.copySync(demosDirAbs, tmpDirAbs, copyOptions);
    fsx.copySync(OUT_DIR_ABS, path.join(tmpDirAbs, DEMO_ASSET_DIR_REL), copyOptions);

    if (!WRAP_CSS_IN_JS) {
      glob.sync(path.join(tmpDirAbs, '**/*.html'))
        .forEach((absPath) => {
          const oldHtml = fsx.readFileSync(absPath, {encoding: 'utf8'});
          const newHtml = oldHtml.replace(
            /<script src="([^"]+\.css)\.js"><\/script>/ig,
            '<link rel="stylesheet" href="$1">');
          fsx.writeFileSync(absPath, newHtml, {encoding: 'utf8'});
        });
    }

    // The `npm run build` command emits JS/CSS files directly to the $REPO/build/ directory (for distribution via npm).
    // The `npm run build:demo` command, however, outputs _all_ static demo files (including HTML and images).
    // Because the demo site expects JS/CSS files to be in /assets/, we need to reorganize the output folders to combine
    // $REPO/demos/ and $REPO/build/ such that the demo site's import paths don't need to change.
    fsx.removeSync(OUT_DIR_ABS);
    fsx.moveSync(tmpDirAbs, OUT_DIR_ABS);
  });
};

module.exports = [{
  name: 'js-all',
  entry: path.resolve('./packages/material-components-web/index.js'),
  output: {
    path: OUT_DIR_ABS,
    publicPath: DEMO_ASSET_DIR_REL,
    filename: 'material-components-web.' + (IS_PROD ? 'min.' : '') + 'js',
    libraryTarget: 'umd',
    library: 'mdc',
  },
  // See https://github.com/webpack/webpack-dev-server/issues/882
  // Because we only spin up dev servers temporarily, and all of our assets are publicly
  // available on GitHub, we can safely disable this check.
  devServer: {
    disableHostCheck: true,
  },
  devtool: JS_DEVTOOL,
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
}];

if (!IS_DEV) {
  module.exports.push({
    name: 'js-components',
    entry: {
      animation: [path.resolve('./packages/mdc-animation/index.js')],
      autoInit: [path.resolve('./packages/mdc-auto-init/index.js')],
      base: [path.resolve('./packages/mdc-base/index.js')],
      lineRipple: [path.resolve('./packages/mdc-line-ripple/index.js')],
      checkbox: [path.resolve('./packages/mdc-checkbox/index.js')],
      chips: [path.resolve('./packages/mdc-chips/index.js')],
      dialog: [path.resolve('./packages/mdc-dialog/index.js')],
      drawer: [path.resolve('./packages/mdc-drawer/index.js')],
      formField: [path.resolve('./packages/mdc-form-field/index.js')],
      gridList: [path.resolve('./packages/mdc-grid-list/index.js')],
      iconToggle: [path.resolve('./packages/mdc-icon-toggle/index.js')],
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
    },
    output: {
      path: OUT_DIR_ABS,
      publicPath: DEMO_ASSET_DIR_REL,
      filename: 'mdc.[name].' + (IS_PROD ? 'min.' : '') + 'js',
      libraryTarget: 'umd',
      library: ['mdc', '[name]'],
    },
    devtool: JS_DEVTOOL,
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
      'mdc.button': path.resolve('./packages/mdc-button/mdc-button.scss'),
      'mdc.line-ripple': path.resolve('./packages/mdc-line-ripple/mdc-line-ripple.scss'),
      'mdc.card': path.resolve('./packages/mdc-card/mdc-card.scss'),
      'mdc.checkbox': path.resolve('./packages/mdc-checkbox/mdc-checkbox.scss'),
      'mdc.chips': path.resolve('./packages/mdc-chips/mdc-chips.scss'),
      'mdc.dialog': path.resolve('./packages/mdc-dialog/mdc-dialog.scss'),
      'mdc.drawer': path.resolve('./packages/mdc-drawer/mdc-drawer.scss'),
      'mdc.elevation': path.resolve('./packages/mdc-elevation/mdc-elevation.scss'),
      'mdc.fab': path.resolve('./packages/mdc-fab/mdc-fab.scss'),
      'mdc.form-field': path.resolve('./packages/mdc-form-field/mdc-form-field.scss'),
      'mdc.grid-list': path.resolve('./packages/mdc-grid-list/mdc-grid-list.scss'),
      'mdc.icon-toggle': path.resolve('./packages/mdc-icon-toggle/mdc-icon-toggle.scss'),
      'mdc.layout-grid': path.resolve('./packages/mdc-layout-grid/mdc-layout-grid.scss'),
      'mdc.linear-progress': path.resolve('./packages/mdc-linear-progress/mdc-linear-progress.scss'),
      'mdc.list': path.resolve('./packages/mdc-list/mdc-list.scss'),
      'mdc.menu': path.resolve('./packages/mdc-menu/mdc-menu.scss'),
      'mdc.radio': path.resolve('./packages/mdc-radio/mdc-radio.scss'),
      'mdc.ripple': path.resolve('./packages/mdc-ripple/mdc-ripple.scss'),
      'mdc.select': path.resolve('./packages/mdc-select/mdc-select.scss'),
      'mdc.slider': path.resolve('./packages/mdc-slider/mdc-slider.scss'),
      'mdc.snackbar': path.resolve('./packages/mdc-snackbar/mdc-snackbar.scss'),
      'mdc.switch': path.resolve('./packages/mdc-switch/mdc-switch.scss'),
      'mdc.tabs': path.resolve('./packages/mdc-tabs/mdc-tabs.scss'),
      'mdc.textfield': path.resolve('./packages/mdc-textfield/mdc-text-field.scss'),
      'mdc.theme': path.resolve('./packages/mdc-theme/mdc-theme.scss'),
      'mdc.toolbar': path.resolve('./packages/mdc-toolbar/mdc-toolbar.scss'),
      'mdc.typography': path.resolve('./packages/mdc-typography/mdc-typography.scss'),
    },
    output: {
      path: OUT_DIR_ABS,
      publicPath: DEMO_ASSET_DIR_REL,
      filename: CSS_JS_FILENAME_OUTPUT_PATTERN,
    },
    devtool: SASS_DEVTOOL,
    module: {
      rules: [{
        test: /\.scss$/,
        use: createCssLoaderConfig(),
      }],
    },
    plugins: [
      createCssExtractTextPlugin(),
      createBannerPlugin(),
    ],
  });
}

if (IS_DEV) {
  const demoStyleEntry = {};
  glob.sync('demos/**/*.scss').forEach((relativeFilePath) => {
    const filename = path.basename(relativeFilePath);

    // Ignore import-only Sass files.
    if (filename.charAt(0) === '_') {
      return;
    }

    // The Webpack entry key for each Sass file is the relative path of the file with its leading "demo/" and trailing
    // ".scss" affixes removed.
    // E.g., "demos/foo/bar.scss" becomes {"foo/bar": "/absolute/path/to/demos/foo/bar.scss"}.
    const entryName = relativeFilePath.replace(new RegExp('^demos/|\\.scss$', 'g'), '');
    demoStyleEntry[entryName] = path.resolve(relativeFilePath);
  });

  module.exports.push({
    name: 'demo-css',
    entry: demoStyleEntry,
    output: {
      path: OUT_DIR_ABS,
      publicPath: DEMO_ASSET_DIR_REL,
      filename: CSS_JS_FILENAME_OUTPUT_PATTERN,
    },
    devtool: SASS_DEVTOOL,
    module: {
      rules: [{
        test: /\.scss$/,
        use: createCssLoaderConfig(),
      }],
    },
    plugins: [
      createCssExtractTextPlugin(),
      createBannerPlugin(),
      createStaticDemoPlugin(),
    ],
  });

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
    devtool: JS_DEVTOOL,
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
  });
}
