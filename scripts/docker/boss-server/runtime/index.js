/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const app = express();

app.use(require('body-parser').json());

app.all('/webhook/github', (req, res) => {
  const spawn = require('child_process').spawnSync('/scripts/run-screenshot-test.sh', [
    '--pr', req.body.pull_request.number,
    '--author', req.body.pull_request.user.login,
    '--remote-url', req.body.pull_request.head.repo.clone_url,
    '--remote-branch', req.body.pull_request.head.ref,
  ], {shell: true});
  const stdout = (spawn.stdout || '').toString().trim();
  const stderr = (spawn.stderr || '').toString().trim();

  res.send({
    method: req.method,
    stdout,
    stderr,
    status: spawn.status,
    envPairs: spawn.envPairs,
    options: spawn.options,
    args: spawn.args,
    file: spawn.file,
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
