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

const env = new Environment();
env.setBabelEnv();

const pathResolver = new PathResolver();
const globber = new Globber({pathResolver});
const pluginFactory = new PluginFactory({globber});
const copyrightBannerPlugin = pluginFactory.createCopyrightBannerPlugin();
const cssBundleFactory = new CssBundleFactory({env, pathResolver, globber, pluginFactory});
const jsBundleFactory = new JsBundleFactory({env, pathResolver, globber, pluginFactory});

module.exports = [
  mainCssALaCarte(),
  mainJsCombined(),
  specCss(),
  specJs(),
  reportCss(),
  reportJs(),
];

function mainCssALaCarte() {
  return cssBundleFactory.createMainCssALaCarte({
    output: {
      fsDirAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/out'),
      httpDirAbsolutePath: '/out/',
    },
  });
}

function mainJsCombined() {
  return jsBundleFactory.createMainJsCombined({
    output: {
      fsDirAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/out'),
      httpDirAbsolutePath: '/out/',
    },
  });
}

function specCss() {
  return cssBundleFactory.createCustomCss({
    bundleName: 'screenshot-test-css',
    chunkGlobConfig: {
      inputDirectory: '/test/screenshot/spec',
    },
    output: {
      fsDirAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/out/spec'),
      httpDirAbsolutePath: '/out/spec/',
    },
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}

function specJs() {
  return jsBundleFactory.createCustomJs({
    bundleName: 'screenshot-test-js',
    chunkGlobConfig: {
      inputDirectory: '/test/screenshot/spec',
    },
    output: {
      fsDirAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/out/spec'),
      httpDirAbsolutePath: '/out/spec/',
    },
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}

function reportCss() {
  return cssBundleFactory.createCustomCss({
    bundleName: 'screenshot-report-css',
    chunkGlobConfig: {
      inputDirectory: '/test/screenshot/report',
    },
    output: {
      fsDirAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/out/report'),
      httpDirAbsolutePath: '/out/report/',
    },
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}

function reportJs() {
  return jsBundleFactory.createCustomJs({
    bundleName: 'screenshot-report-js',
    chunkGlobConfig: {
      inputDirectory: '/test/screenshot/report',
    },
    output: {
      fsDirAbsolutePath: pathResolver.getAbsolutePath('/test/screenshot/out/report'),
      httpDirAbsolutePath: '/out/report/',
    },
    plugins: [
      copyrightBannerPlugin,
    ],
  });
}
