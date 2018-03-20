/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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

const CssBundleFactory = require('../../scripts/webpack/css-bundle-factory');
const Environment = require('../../scripts/build/environment');
const Globber = require('../../scripts/webpack/globber');
const JsBundleFactory = require('../../scripts/webpack/js-bundle-factory');
const PathResolver = require('../../scripts/build/path-resolver');
const PluginFactory = require('../../scripts/webpack/plugin-factory');
const StaticServer = require('../../scripts/build/static-server');

const env = new Environment();
env.setBabelEnv();

const pathResolver = new PathResolver();
const globber = new Globber({pathResolver});
const pluginFactory = new PluginFactory({globber});
const copyrightBannerPlugin = pluginFactory.createCopyrightBannerPlugin();
const cssBundleFactory = new CssBundleFactory({env, pathResolver, globber, pluginFactory});
const jsBundleFactory = new JsBundleFactory({env, pathResolver, globber, pluginFactory});
const staticServer = new StaticServer({pathResolver});

const MAIN_OUTPUT = {
  fsDirAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/out/main'),
};

const TEST_OUTPUT = {
  fsDirAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/out/test'),
};

module.exports = [
  mainJsCombined(),
  mainCssALaCarte(),
  testJs(),
  testCss(),
];

if (env.isDev()) {
  staticServer.run({
    relativeDirectoryPaths: ['/demos', '/test'],
    directoryListing: {
      fileExtensions: ['.html'],
      stylesheetAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/directory.css'),
    },
  });
}

function mainJsCombined() {
  return jsBundleFactory.createMainJsCombined({output: MAIN_OUTPUT});
}

function mainCssALaCarte() {
  return cssBundleFactory.createMainCssALaCarte({output: MAIN_OUTPUT});
}

function testJs() {
  return jsBundleFactory.createCustomJs({
    bundleName: 'screenshot-test-js',
    chunkGlobConfig: {
      inputDirectory: '/test/screenshot',
      filePathPattern: '**/*.test.js',
    },
    output: Object.assign({}, TEST_OUTPUT, {
      filename: '[name].js',
      library: ['demo', '[name]'],
    }),
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}

function testCss() {
  return cssBundleFactory.createCustomCss({
    bundleName: 'screenshot-test-css',
    chunkGlobConfig: {
      inputDirectory: '/test/screenshot',
      filePathPattern: '**/*.test.scss',
    },
    output: TEST_OUTPUT,
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}
