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
const LocalStorage = require('../lib/local-storage');
const {ExitCode} = require('../lib/constants');

class ProcessManager {
  constructor() {
    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();
  }

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
   * @param {string} pidFilePath
   * @param {string=} commandName
   * @param {string=} argumentPattern Regular expression
   * @return {!Promise<?string>}
   */
  async getRunningPid(pidFilePath, commandName = undefined, argumentPattern = undefined) {
    /** @type {string} */
    const pid = await this.localStorage_.readTextFile(pidFilePath).then((content) => content.trim(), () => null);
    if (!pid) {
      return null;
    }

    return new Promise((resolve, reject) => {
      ps.lookup(
        {
          pid,
          command: commandName,
          arguments: argumentPattern, // Regular expression
        },
        /**
         * @param {?*} err
         * @param {?Array<!PsNodeProcess>} procs
         */
        /* eslint-disable no-unused-vars */
        (err, procs) => {
          if (err) {
            return reject(err);
          }

          // Process is still running
          if (procs.find((proc) => proc.pid === pid)) {
            return resolve(pid);
          }

          return resolve(null);
        }
      );
    });
  }

  /**
   * @param {string} pidFilePath
   * @param {number|string} pid
   * @return {!Promise<void>}
   */
  async setRunningPid(pidFilePath, pid) {
    await this.localStorage_.writeTextFile(pidFilePath, String(pid));
  }

  /**
   * @param {string} pidFilePath
   */
  deletePidFileSync(pidFilePath) {
    this.localStorage_.deleteSync(pidFilePath);
  }
}

module.exports = ProcessManager;
