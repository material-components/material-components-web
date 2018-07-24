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

const glob = require('glob');
const path = require('path');

const ProcessManager = require('../lib/process-manager');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

class ProtoCommand {
  /**
   * @return {!Promise<number|undefined>} Process exit code. If no exit code is returned, `0` is assumed.
   */
  async runAsync() {
    const processManager = new ProcessManager();
    const protoFilePaths = glob.sync(path.join(TEST_DIR_RELATIVE_PATH, '**/*.proto'));

    const cmd = 'pbjs';
    const args = ['--target=static-module', '--wrap=commonjs', '--keep-case'];

    for (const protoFilePath of protoFilePaths) {
      const jsFilePath = protoFilePath.replace(/.proto$/, '.pb.js');
      processManager.spawnChildProcessSync(cmd, args.concat(`--out=${jsFilePath}`, protoFilePath));
    }
  }
}

module.exports = ProtoCommand;
