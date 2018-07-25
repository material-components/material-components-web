/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const BuildCommand = require('./build');
const Controller = require('../lib/controller');
const GitHubApi = require('../lib/github-api');
const Logger = require('../lib/logger');
const {ExitCode} = require('../lib/constants');

module.exports = {
  async runAsync() {
    await BuildCommand.runAsync();
    const controller = new Controller();
    const gitHubApi = new GitHubApi();
    const logger = new Logger(__filename);

    /** @type {!mdc.proto.ReportData} */
    const reportData = await controller.initForCapture();

    const {isTestable, prNumber} = controller.checkIsTestable(reportData);
    if (!isTestable) {
      logger.warn(`PR #${prNumber} does not contain any testable source file changes.`);
      logger.warn('Skipping screenshot tests.');
      return ExitCode.OK;
    }

    await gitHubApi.setPullRequestStatus(reportData);

    try {
      await controller.uploadAllAssets(reportData);
      await controller.captureAllPages(reportData);
      await controller.compareAllScreenshots(reportData);
      await controller.generateReportPage(reportData);
      await gitHubApi.setPullRequestStatus(reportData);
    } catch (err) {
      await gitHubApi.setPullRequestError();
      throw err;
    }

    return await controller.getTestExitCode(reportData);
  },
};
