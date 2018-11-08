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

const detectPort = require('detect-port');
const express = require('express');
const serveIndex = require('serve-index');

const Cli = require('../lib/cli');
const CliColor = require('../lib/logger').colors;
const {ExitCode} = require('../lib/constants');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

class ServeCommand {
  /**
   * @return {!Promise<number|undefined>} Process exit code. If no exit code is returned, `0` is assumed.
   */
  async runAsync() {
    const cli = new Cli();
    const {port} = cli;

    if (await detectPort(port) !== port) {
      console.error(`Error: HTTP port ${port} is already in use!`);
      process.exit(ExitCode.HTTP_PORT_ALREADY_IN_USE);
    }

    const app = express();

    app.use('/', express.static(TEST_DIR_RELATIVE_PATH), serveIndex(TEST_DIR_RELATIVE_PATH));

    app.listen(port, () => {
      const urlPlain = `http://localhost:${port}/`;
      const urlColor = CliColor.bold.underline(urlPlain);
      const noticePlain = `Local development server running on ${urlPlain}`;
      const noticeColor = `Local development server running on ${urlColor}`;
      const borderColor = CliColor.green(''.padStart(noticePlain.length, '='));
      console.log((`
${borderColor}
${noticeColor}
${borderColor}
`));
    });
  }
}

module.exports = ServeCommand;
