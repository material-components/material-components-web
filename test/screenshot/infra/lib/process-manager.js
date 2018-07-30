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

const childProcess = require('child_process');
const ps = require('ps-node');
const {ExitCode} = require('../lib/constants');

class ProcessManager {
  /**
   * @param {string} cmd
   * @param {!Array<string>} args
   * @param {!ChildProcessSpawnOptions=} opts
   * @return {!ChildProcess}
   */
  spawnChildProcess(cmd, args, opts = {}) {
    /** @type {!ChildProcessSpawnOptions} */
    const defaultOpts = {
      stdio: 'inherit',
      shell: true,
      windowsHide: true,
    };

    /** @type {!ChildProcessSpawnOptions} */
    const mergedOpts = Object.assign({}, defaultOpts, opts);

    console.log(`${cmd} ${args.join(' ')}`);

    return childProcess.spawn(cmd, args, mergedOpts);
  }

  /**
   * @param {string} cmd
   * @param {!Array<string>} args
   * @param {!ChildProcessSpawnOptions=} opts
   * @param {boolean=} isWatching
   * @return {!SpawnSyncReturns}
   */
  spawnChildProcessSync(cmd, args, opts = {}, isWatching = false) {
    /** @type {!ChildProcessSpawnOptions} */
    const defaultOpts = {
      stdio: 'inherit',
      shell: true,
      windowsHide: true,
    };

    /** @type {!ChildProcessSpawnOptions} */
    const mergedOpts = Object.assign({}, defaultOpts, opts);

    console.log(`${cmd} ${args.join(' ')}`);

    const result = childProcess.spawnSync(cmd, args, mergedOpts);
    if (result.status !== ExitCode.OK) {
      const message = `${cmd} process exited with code ${result.status}`;
      if (isWatching) {
        console.error(message);
      } else {
        throw new Error(message);
      }
    }
    return result;
  }

  /**
   * @param {string} commandName
   * @param {string} argumentPattern Regular expression
   * @return {!Promise<!Array<!PsNodeProcess>>}
   */
  async getRunningProcessesInPwdAsync(commandName, argumentPattern) {
    return new Promise((resolve, reject) => {
      ps.lookup(
        {
          command: commandName,
          arguments: argumentPattern, // Regular expression
        },
        /**
         * @param {?*} err
         * @param {?Array<!PsNodeProcess>} unfiltered
         */
        (err, unfiltered) => {
          if (err) {
            reject(err);
            return;
          }

          unfiltered.forEach((proc) => {
            proc.pid = Number(proc.pid);
            proc.ppid = Number(proc.ppid);
          });

          const filtered = unfiltered.filter((proc) => {
            const [script] = proc['arguments'];
            return (
              proc.pid !== process.pid &&
              script.startsWith(process.env.PWD)
            );
          });

          resolve(filtered);
        });
    });
  }
}

module.exports = ProcessManager;
