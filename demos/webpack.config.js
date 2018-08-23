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

'use strict';

const CssBundleFactory = require('../scripts/webpack/css-bundle-factory');
const Environment = require('../scripts/build/environment');
const Globber = require('../scripts/webpack/globber');
const JsBundleFactory = require('../scripts/webpack/js-bundle-factory');
const PathResolver = require('../scripts/build/path-resolver');
const PluginFactory = require('../scripts/webpack/plugin-factory');

const env = new Environment();
env.setBabelEnv();

const pathResolver = new PathResolver();
const globber = new Globber({pathResolver});
const pluginFactory = new PluginFactory({globber});
const copyrightBannerPlugin = pluginFactory.createCopyrightBannerPlugin();
const cssBundleFactory = new CssBundleFactory({env, pathResolver, globber, pluginFactory});
const jsBundleFactory = new JsBundleFactory({env, pathResolver, globber, pluginFactory});

const DEMO_BASE_DIR_ABSOLUTE_PATH = pathResolver.getAbsolutePath('/demos');

const OUTPUT = {
  fsDirAbsolutePath: pathResolver.getAbsolutePath('/build'),
  httpDirAbsolutePath: '/assets/',
};

module.exports = [
  mainJsCombined(),
  demoCss(),
  demoJs(),
];

// webpack-dev-server requires that these properties be set on the first bundle.
// It ignores them on all other bundles.
Object.assign(module.exports[0], {
  devServer: {
    contentBase: DEMO_BASE_DIR_ABSOLUTE_PATH,

    // See https://github.com/webpack/webpack-dev-server/issues/882
    // Because we only spin up dev servers temporarily, and all of our assets are publicly
    // available on GitHub, we can safely disable this check.
    disableHostCheck: true,
  },
});

function mainJsCombined() {
  return jsBundleFactory.createMainJsCombined({output: OUTPUT});
}

function demoJs() {
  return jsBundleFactory.createCustomJs({
    bundleName: 'demo-js',
    chunks: {
      'common': pathResolver.getAbsolutePath('./demos/common.js'),
      'theme/index': pathResolver.getAbsolutePath('./demos/theme/index.js'),
    },
    output: Object.assign({}, OUTPUT, {
      filename: '[name].js',
      library: ['demo', '[name]'],
    }),
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}

function demoCss() {
  return cssBundleFactory.createCustomCss({
    bundleName: 'demo-css',
    chunkGlobConfig: {
      inputDirectory: '/demos',
    },
    output: OUTPUT,
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}
