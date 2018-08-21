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

/**
 * @fileoverview Utility for getting updated packages via lernaJS without spawning a child process.
 * This is achieved by utilizing lerna's internal API used for collecting packages, while duck-punching
 * lerna's progressBar and logger so that they don't emit anything. Note that there is a ticket out
 * for exposing a public API at https://github.com/lerna/lerna/issues/167.
 */

const Repository = require('lerna/lib/Repository');
const UpdatedPackagesCollector = require('lerna/lib/UpdatedPackagesCollector');
const lernaLogger = require('lerna/lib/logger');
const progressBar = require('lerna/lib/progressBar');
const lernaJson = require('../../lerna.json');

module.exports = function() {
  const repository = new Repository();
  const origInfoFn = lernaLogger.info;
  const origBarDescriptor = Object.getOwnPropertyDescriptor(progressBar, 'bar');
  const lernaCommand = {
    repository,
    getOptions: () => lernaJson.commands.publish,
  };
  const collector = new UpdatedPackagesCollector(lernaCommand);

  lernaLogger.info = () => {};
  Object.defineProperty(progressBar, 'bar', {
    get: () => null,
    set: () => {},
    enumerable: true,
    configurable: true,
  });
  const updates = collector.getUpdates();

  Object.defineProperty(progressBar, 'bar', origBarDescriptor);
  lernaLogger.info = origInfoFn;

  return updates.map((u) => u.package);
};
