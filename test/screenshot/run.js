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

const Cli = require('./infra/lib/cli');
const CliColor = require('./infra/lib/logger').colors;
const Duration = require('./infra/lib/duration');
const {ExitCode} = require('./infra/lib/constants');
const {formatError} = require('./infra/lib/stacktrace');

const COMMANDS = {
  get approve() {
    return require('./infra/commands/approve');
  },
  get build() {
    return require('./infra/commands/build');
  },
  get clean() {
    return require('./infra/commands/clean');
  },
  get demo() {
    return require('./infra/commands/demo');
  },
  get index() {
    return require('./infra/commands/index');
  },
  get proto() {
    return require('./infra/commands/proto');
  },
  get serve() {
    return require('./infra/commands/serve');
  },
  get test() {
    return require('./infra/commands/test');
  },
};

async function runAsync() {
  const cli = new Cli();
  const CmdClass = COMMANDS[cli.command];

  if (!CmdClass) {
    console.error(`Error: Unknown command: '${cli.command}'`);
    exit(ExitCode.UNSUPPORTED_CLI_COMMAND);
    return;
  }

  const cmd = new CmdClass();
  const isOnline = await cli.checkIsOnline();
  if (!isOnline) {
    console.log('Offline mode!');
  }

  cmd.runAsync().then(
    (exitCode = ExitCode.OK) => {
      if (exitCode !== ExitCode.OK) {
        exit(exitCode);
      }
    },
    (err) => {
      console.error('\n\n' + CliColor.bold.red('ERROR:'), formatError(err));
      exit(ExitCode.UNKNOWN_ERROR);
    }
  );
}

const startTimeMs = new Date();

// TODO(acdvorak): Create a centralized class to manage global exit handlers
process.on('exit', () => {
  const elapsedTimeHuman = Duration.elapsed(startTimeMs, new Date()).toHumanShort();
  console.log(`\nRun time: ${elapsedTimeHuman}\n`);
});

// TODO(acdvorak): Create a centralized class to manage global exit handlers
process.on('unhandledRejection', (err) => {
  const message = [
    'UnhandledPromiseRejectionWarning: Unhandled promise rejection.',
    'This error originated either by throwing inside of an async function without a catch block,',
    'or by rejecting a promise which was not handled with .catch().',
  ].join(' ');
  console.error('\n');
  console.error(message);
  console.error(formatError(err));
  exit(ExitCode.UNHANDLED_PROMISE_REJECTION);
});

function exit(code) {
  process.exitCode = code;
}

runAsync();
