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

const Cli = require('./lib/cli');
const Duration = require('./lib/duration');
const {ExitCode} = require('./lib/constants');

const COMMAND_MAP = {
  async approve() {
    return require('./commands/approve').runAsync();
  },

  async build() {
    return require('./commands/build').runAsync();
  },

  async clean() {
    return require('./commands/clean').runAsync();
  },

  async demo() {
    return require('./commands/demo').runAsync();
  },

  async proto() {
    return require('./commands/proto').runAsync();
  },

  async serve() {
    return require('./commands/serve').runAsync();
  },

  async test() {
    return require('./commands/test').runAsync();
  },
};

async function run() {
  const cli = new Cli();
  const cmd = COMMAND_MAP[cli.command];

  if (cmd) {
    const isOnline = await cli.isOnline();
    if (!isOnline) {
      console.log('Offline mode!');
    }

    cmd()
      .then(
        (exitCode = 0) => {
          process.exit(exitCode);
        },
        (err) => {
          console.error(err);
          process.exit(ExitCode.UNKNOWN_ERROR);
        });
  } else {
    console.error(`Error: Unknown command: '${cli.command}'`);
    process.exit(ExitCode.UNSUPPORTED_CLI_COMMAND);
  }
}

const startTimeMs = new Date();

process.on('exit', () => {
  const elapsedTimeHuman = Duration.elapsed(startTimeMs, new Date()).toHumanShort();
  console.log(`\nRun time: ${elapsedTimeHuman}\n`);
});

process.on('unhandledRejection', (error) => {
  const message = [
    'UnhandledPromiseRejectionWarning: Unhandled promise rejection.',
    'This error originated either by throwing inside of an async function without a catch block,',
    'or by rejecting a promise which was not handled with .catch().',
  ].join(' ');
  console.error(message);
  console.error(error);
  process.exit(ExitCode.UNHANDLED_PROMISE_REJECTION);
});

run();
