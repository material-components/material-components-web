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

const OUTPUT = {
  fsDirAbsolutePath: pathResolver.getAbsolutePath('./build'),
};

module.exports = [
  jsBundleFactory.createMainJsCombined({output: OUTPUT}),
  jsBundleFactory.createMainJsALaCarte({output: OUTPUT}),
  cssBundleFactory.createMainCssCombined({output: OUTPUT}),
  cssBundleFactory.createMainCssALaCarte({output: OUTPUT}),
];
