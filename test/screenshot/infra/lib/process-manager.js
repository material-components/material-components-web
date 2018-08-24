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
