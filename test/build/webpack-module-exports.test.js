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

/**
 * @fileoverview Ensures that our webpack config file's exports don't change unexpectedly after refactoring.
 * TODO(acdvorak): Delete this test file once we're done refactoring webpack.config.js.
 */

const assert = require('chai').assert;
const path = require('path');

const WebpackConfigLoader = require('./webpack-config-loader');
const webpackConfigLoader = new WebpackConfigLoader();

describe('webpack.config.js', () => {
  describe('MDC_ENV=""', () => {
    it('module exports should match build-config-no-env.golden.json', () => {
      const {generatedWebpackConfig, expectedWebpackConfig} = webpackConfigLoader.setupTest({
        configPath: path.join(__dirname, '../../webpack.config.js'),
        goldenPath: path.join(__dirname, './goldens/build-config-no-env.golden.json'),
        mdcEnv: '',
      });
      assert.equal(generatedWebpackConfig, expectedWebpackConfig);
    });
  });

  describe('MDC_ENV="production"', () => {
    it('module exports should match build-config-prod-env.golden.json', () => {
      const {generatedWebpackConfig, expectedWebpackConfig} = webpackConfigLoader.setupTest({
        configPath: path.join(__dirname, '../../webpack.config.js'),
        goldenPath: path.join(__dirname, './goldens/build-config-prod-env.golden.json'),
        mdcEnv: 'production',
      });
      assert.equal(generatedWebpackConfig, expectedWebpackConfig);
    });
  });

  describe('MDC_ENV="development"', () => {
    it('module exports should match build-config-dev-env.golden.json', () => {
      const {generatedWebpackConfig, expectedWebpackConfig} = webpackConfigLoader.setupTest({
        configPath: path.join(__dirname, '../../demos/webpack.config.js'),
        goldenPath: path.join(__dirname, './goldens/build-config-dev-env.golden.json'),
        mdcEnv: 'development',
      });
      assert.equal(generatedWebpackConfig, expectedWebpackConfig);
    });
  });
});
