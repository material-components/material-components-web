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
