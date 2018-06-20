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
const CliArgParser = require('../lib/cli-arg-parser');
const childProcess = require('child_process');
const ps = require('ps-node');

module.exports = {
  async runAsync() {
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

    childProcess.spawnSync('npm', ['run', 'screenshot:webpack', '--', ...webpackArgs], {shell: true, stdio: 'inherit'});
  },

  /**
   * @return {!Promise<boolean>}
   * @private
   */
  async shouldBuild_() {
    const cliArgs = new CliArgParser();
    if (cliArgs.skipBuild) {
      console.error('Skipping build step');
      return false;
    }

    const pid = await this.getExistingProcessId_();
    if (pid) {
      console.error(`Build is already running (pid ${pid})`);
      return false;
    }

    return true;
  },

  /**
   * @return {!Promise<boolean>}
   * @private
   */
  async shouldWatch_() {
    const cliArgs = new CliArgParser();
    return cliArgs.watch;
  },

  /**
   * @return {!Promise<?number>}
   * @private
   */
  async getExistingProcessId_() {
    return new Promise((resolve, reject) => {
      ps.lookup(
        {
          command: 'node',
          arguments: 'build', // Regular expression
        },
        (err, resultList) => {
          if (err) {
            reject(err);
            return;
          }

          resultList.forEach((proc) => {
            proc.pid = Number(proc.pid);
          });

          const existingBuildProcesses = resultList.filter((proc) => {
            const [script, command] = proc['arguments'];
            return (
              proc.pid !== process.pid &&
              script.startsWith(process.env.PWD) &&
              script.endsWith('/run.js') &&
              command === 'build'
            );
          });

          if (existingBuildProcesses.length > 0) {
            resolve(existingBuildProcesses[0].pid);
          } else {
            resolve(null);
          }
        });
    });
  },
};
