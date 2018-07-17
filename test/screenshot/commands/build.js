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

const CleanCommand = require('./clean');
const Cli = require('../lib/cli');
const Logger = require('../lib/logger');
const ProcessManager = require('../lib/process-manager');

const logger = new Logger(__filename);
const processManager = new ProcessManager();

module.exports = {
  async runAsync() {
    // Travis sometimes forgets to emit this
    logger.foldEnd('install.npm');

    const webpackArgs = [];
    const shouldBuild = await this.shouldBuild_();
    const shouldWatch = await this.shouldWatch_();

    if (!shouldBuild) {
      return;
    }

    if (shouldWatch) {
      webpackArgs.push('--watch');
    }

    await CleanCommand.runAsync();

    logger.foldStart('screenshot.build', 'Compiling source files');
    processManager.spawnChildProcessSync('npm', ['run', 'screenshot:proto']);
    processManager.spawnChildProcessSync('npm', ['run', 'screenshot:webpack', '--', ...webpackArgs]);
    logger.foldEnd('screenshot.build');
  },

  /**
   * @return {!Promise<boolean>}
   * @private
   */
  async shouldBuild_() {
    const cli = new Cli();
    if (cli.skipBuild) {
      console.error('Skipping build step');
      return false;
    }

    const pid = await this.getExistingProcessId_();
    if (pid) {
      console.log(`Build is already running (pid ${pid})`);
      return false;
    }

    return true;
  },

  /**
   * @return {!Promise<boolean>}
   * @private
   */
  async shouldWatch_() {
    const cli = new Cli();
    return cli.watch;
  },

  /**
   * TODO(acvdorak): Store PID in local text file instead of scanning through running processes
   * @return {!Promise<?number>}
   * @private
   */
  async getExistingProcessId_() {
    /** @type {!Array<!PsNodeProcess>} */
    const allProcs = await processManager.getRunningProcessesInPwdAsync('node', 'build');
    const buildProcs = allProcs.filter((proc) => {
      const [script, command] = proc.arguments;
      return (
        script.endsWith('/run.js') &&
        command === 'build'
      );
    });

    return buildProcs.length > 0 ? buildProcs[0].pid : null;
  },
};
