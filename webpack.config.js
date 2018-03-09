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

const CssBundleFactory = require('./scripts/webpack/css-bundle-factory');
const Environment = require('./scripts/build/environment');
const Globber = require('./scripts/webpack/globber');
const JsBundleFactory = require('./scripts/webpack/js-bundle-factory');
const PathResolver = require('./scripts/build/path-resolver');
const PluginFactory = require('./scripts/webpack/plugin-factory');

const env = new Environment();
env.setBabelEnv();

const pathResolver = new PathResolver();
const globber = new Globber({pathResolver});
const pluginFactory = new PluginFactory({globber});
const cssBundleFactory = new CssBundleFactory({env, pathResolver, globber, pluginFactory});
const jsBundleFactory = new JsBundleFactory({env, pathResolver, globber, pluginFactory});

const OUT_DIR_ABS = pathResolver.getAbsolutePath('./build');
const DEMO_ASSET_DIR_REL = '/assets/'; // Used by webpack-dev-server

const copyrightBannerPlugin = pluginFactory.createCopyrightBannerPlugin();

module.exports = [];

module.exports.push(jsBundleFactory.createMainJsCombined({
  output: {
    fsDirAbsolutePath: OUT_DIR_ABS,
    httpDirAbsolutePath: DEMO_ASSET_DIR_REL,
  },
}));

if (!env.isDev()) {
  module.exports.push(jsBundleFactory.createMainJsALaCarte({
    output: {
      fsDirAbsolutePath: OUT_DIR_ABS,
      httpDirAbsolutePath: DEMO_ASSET_DIR_REL,
    },
  }));

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

  module.exports.push(jsBundleFactory.createCustomJs({
    bundleName: 'demo-js',
    chunks: {
      'common': pathResolver.getAbsolutePath('./demos/common.js'),
      'theme/index': pathResolver.getAbsolutePath('./demos/theme/index.js'),
    },
    output: {
      fsDirAbsolutePath: OUT_DIR_ABS,
      httpDirAbsolutePath: DEMO_ASSET_DIR_REL,
      filename: '[name].js',
      library: ['demo', '[name]'],
    },
    plugins: [
      copyrightBannerPlugin,
    ],
  }));
}
