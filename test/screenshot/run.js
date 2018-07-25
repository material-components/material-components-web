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
    process.exit(ExitCode.UNSUPPORTED_CLI_COMMAND);
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
        process.exit(exitCode);
      }
    },
    (err) => {
      console.error('\n\n' + CliColor.bold.red('ERROR:'), formatError(err));
      process.exit(ExitCode.UNKNOWN_ERROR);
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
process.on('unhandledRejection', (error) => {
  const message = [
    'UnhandledPromiseRejectionWarning: Unhandled promise rejection.',
    'This error originated either by throwing inside of an async function without a catch block,',
    'or by rejecting a promise which was not handled with .catch().',
  ].join(' ');
  console.error('\n');
  console.error(message);
  console.error(error);
  process.exit(ExitCode.UNHANDLED_PROMISE_REJECTION);
});

runAsync();
