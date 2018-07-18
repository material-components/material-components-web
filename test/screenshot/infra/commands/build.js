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

const chokidar = require('chokidar');
const debounce = require('debounce');

const CleanCommand = require('./clean');
const Cli = require('../lib/cli');
const Index = require('./index');
const Logger = require('../lib/logger');
const ProcessManager = require('../lib/process-manager');
const Proto = require('./proto');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

const logger = new Logger(__filename);
const processManager = new ProcessManager();

module.exports = {
  async runAsync() {
    // Travis sometimes forgets to emit this
    logger.foldEnd('install.npm');

    const shouldBuild = await this.shouldBuild_();
    const shouldWatch = await this.shouldWatch_();

    if (!shouldBuild) {
      return;
    }

    await CleanCommand.runAsync();

    logger.foldStart('screenshot.build', 'Compiling source files');

    this.buildProtoFiles_(shouldWatch);
    this.buildHtmlFiles_(shouldWatch);

    if (shouldWatch) {
      processManager.spawnChildProcess('npm', ['run', 'screenshot:webpack', '--', '--watch']);
    } else {
      processManager.spawnChildProcessSync('npm', ['run', 'screenshot:webpack']);
    }

    logger.foldEnd('screenshot.build');
  },

  /**
   * @param {boolean} shouldWatch
   * @private
   */
  buildProtoFiles_(shouldWatch) {
    const compile = debounce(() => Proto.runAsync(), 1000);
    if (!shouldWatch) {
      compile();
      return;
    }

    const watcher = chokidar.watch('**/*.proto', {
      cwd: TEST_DIR_RELATIVE_PATH,
      awaitWriteFinish: true,
    });

    /* eslint-disable no-unused-vars */
    watcher.on('add', (filePath) => compile());
    watcher.on('change', (filePath) => compile());
    /* eslint-enable no-unused-vars */
  },

  /**
   * @param {boolean} shouldWatch
   * @private
   */
  buildHtmlFiles_(shouldWatch) {
    const compile = debounce(() => Index.runAsync(), 1000);
    if (!shouldWatch) {
      compile();
      return;
    }

    const watcher = chokidar.watch('**/*.html', {
      cwd: TEST_DIR_RELATIVE_PATH,
      awaitWriteFinish: true,
      ignored: ['**/report/report.html', '**/index.html'],
    });

    /* eslint-disable no-unused-vars */
    watcher.on('add', (filePath) => compile());
    watcher.on('unlink', (filePath) => compile());
    /* eslint-enable no-unused-vars */
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
