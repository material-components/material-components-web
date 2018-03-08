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
 * Factory for Webpack plugins. Allows us to more easily mock and test our config generator code.
 */

'use strict';

const CopyrightBannerPlugin = require('./copyright-banner-plugin');
const CssCleanupPlugin = require('./css-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = class {
  constructor({globber} = {}) {
    this.globber_ = globber;
  }

  createCopyrightBannerPlugin({
    projectName = 'Material Components for the Web',
    authorName = 'Google Inc.',
    licenseName = 'Apache-2.0',
  } = {}) {
    return new CopyrightBannerPlugin({projectName, authorName, licenseName});
  }

  createCssCleanupPlugin({cleanupDirRelativePath} = {}) {
    return new CssCleanupPlugin({
      cleanupDirRelativePath,
      globber: this.globber_,
    });
  }

  createCssExtractorPlugin(outputFilenamePattern) {
    return new ExtractTextPlugin(outputFilenamePattern);
  }
};
