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
const IndexCommand = require('./index');
const Logger = require('../lib/logger');
const ProcessManager = require('../lib/process-manager');
const ProtoCommand = require('./proto');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

class BuildCommand {
  constructor() {
    this.logger_ = new Logger(__filename);
    this.processManager_ = new ProcessManager();

    this.cleanCommand_ = new CleanCommand();
    this.indexCommand_ = new IndexCommand();
    this.protoCommand_ = new ProtoCommand();
  }

  /**
   * @return {!Promise<number|undefined>} Process exit code. If no exit code is returned, `0` is assumed.
   */
  async runAsync() {
    // Travis sometimes forgets to emit this
    this.logger_.foldEnd('install.npm');

    const shouldBuild = await this.shouldBuild_();
    const shouldWatch = await this.shouldWatch_();

    if (!shouldBuild) {
      return;
    }

    await this.cleanCommand_.runAsync();

    this.logger_.foldStart('screenshot.build', 'Compiling source files');

    this.buildProtoFiles_(shouldWatch);
    this.buildHtmlFiles_(shouldWatch);

    if (shouldWatch) {
      this.processManager_.spawnChildProcess('npm', ['run', 'screenshot:webpack', '--', '--watch']);
    } else {
      this.processManager_.spawnChildProcessSync('npm', ['run', 'screenshot:webpack']);
    }

    this.logger_.foldEnd('screenshot.build');
  }

  /**
   * @param {boolean} shouldWatch
   * @private
   */
  buildProtoFiles_(shouldWatch) {
    const buildRightNow = () => this.protoCommand_.runAsync();
    const buildDelayed = debounce(buildRightNow, 1000);

    if (!shouldWatch) {
      buildRightNow();
      return;
    }

    const watcher = chokidar.watch('**/*.proto', {
      cwd: TEST_DIR_RELATIVE_PATH,
      awaitWriteFinish: true,
    });

    watcher.on('add', buildDelayed);
    watcher.on('change', buildDelayed);
  }

  /**
   * @param {boolean} shouldWatch
   * @private
   */
  buildHtmlFiles_(shouldWatch) {
    const buildRightNow = () => this.indexCommand_.runAsync();
    const buildDelayed = debounce(buildRightNow, 1000);

    if (!shouldWatch) {
      buildRightNow();
      return;
    }

    const watcher = chokidar.watch('**/*.html', {
      cwd: TEST_DIR_RELATIVE_PATH,
      awaitWriteFinish: true,
      ignored: ['**/report/report.html', '**/index.html'],
    });

    watcher.on('add', buildDelayed);
    watcher.on('unlink', buildDelayed);
  }

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
  }

  /**
   * @return {!Promise<boolean>}
   * @private
   */
  async shouldWatch_() {
    const cli = new Cli();
    return cli.watch;
  }

  /**
   * TODO(acvdorak): Store PID in local text file instead of scanning through running processes
   * @return {!Promise<?number>}
   * @private
   */
  async getExistingProcessId_() {
    /** @type {!Array<!PsNodeProcess>} */
    const allProcs = await this.processManager_.getRunningProcessesInPwdAsync('node', 'build');
    const buildProcs = allProcs.filter((proc) => {
      const [script, command] = proc.arguments;
      return (
        script.endsWith('/run.js') &&
        command === 'build'
      );
    });

    return buildProcs.length > 0 ? buildProcs[0].pid : null;
  }
}

module.exports = BuildCommand;
