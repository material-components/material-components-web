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
