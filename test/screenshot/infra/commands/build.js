/**
 * @license
 * Copyright 2018 Google Inc.
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

const chokidar = require('chokidar');
const debounce = require('debounce');

const CleanCommand = require('./clean');
const Cli = require('../lib/cli');
const CliColor = require('../lib/logger').colors;
const IndexCommand = require('./index');
const Logger = require('../lib/logger');
const ProcessManager = require('../lib/process-manager');
const ProtoCommand = require('./proto');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

class BuildCommand {
  constructor() {
    this.logger_ = new Logger();
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

    await this.buildProtoFiles_(shouldWatch);
    await this.buildHtmlFiles_(shouldWatch);

    if (shouldWatch) {
      this.processManager_.spawnChildProcess('npm', ['run', 'screenshot:webpack', '--', '--watch']);
    } else {
      this.processManager_.spawnChildProcessSync('npm', ['run', 'screenshot:webpack']);
    }

    this.logger_.foldEnd('screenshot.build');

    if (!shouldWatch) {
      this.logger_.log('');
      this.logger_.log('');
      this.logger_.log(CliColor.bold.green('✨✨✨ Aww yiss - MDC Web build succeeded! ✨✨✨'));
      this.logger_.log('');
    }
  }

  /**
   * @param {boolean} shouldWatch
   * @private
   */
  async buildProtoFiles_(shouldWatch) {
    const buildRightNow = async () => this.protoCommand_.runAsync(shouldWatch);
    const buildDelayed = debounce(buildRightNow, 1000);

    if (!shouldWatch) {
      await buildRightNow();
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
  async buildHtmlFiles_(shouldWatch) {
    const buildRightNow = async () => this.indexCommand_.runAsync();
    const buildDelayed = debounce(buildRightNow, 1000);

    if (!shouldWatch) {
      await buildRightNow();
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
      console.error(CliColor.magenta('Skipping build step.'));
      console.error('');
      return false;
    }

    const pid = await this.getExistingProcessId_();
    if (pid) {
      console.log(CliColor.bold(`Build is already running (pid ${pid}).`));
      console.log('');
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
