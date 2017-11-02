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

const path = require('path');
const express = require('express');
const GitHubApi = require('github');
const app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use(require('body-parser').json());

const handleStartScreenshotRequest = (pullRequest, res) => {
  const args = [
    '--pr', pullRequest.number,
    '--author', pullRequest.user.login,
    '--remote-url', pullRequest.head.repo.clone_url,
    '--remote-branch', pullRequest.head.ref,
  ];

  const writeln = (json) => {
    res.write(JSON.stringify(json) + '\n');
  };

  console.log(`${new Date()} - Request: ${args}`);

  const spawn = require('child_process').spawn('/scripts/run-screenshot-test.sh', args, {
    stdio: 'pipe',
    shell: true,
  });
  spawn.stdout.on('data', (data) => {
    writeln({stdout: data.toString()});
    if (data.toString().indexOf('webpack: Compiled successfully.') > -1) {
      writeln({demo_server_status: 'running'});
    }
  });
  spawn.stderr.on('data', (data) => {
    writeln({stderr: data.toString()});
  });
  spawn.on('close', (code) => {
    res.end();
  });
};

app.all('/webhook/github', (req, res) => {
  handleStartScreenshotRequest(req.body.pull_request, res);
});

app.post('/github/pr', (req, res) => {
  const github = new GitHubApi();
  github.pullRequests.get({
    owner: 'material-components',
    repo: 'material-components-web',
    number: req.body.pr_number,
  }).then((response) => {
    handleStartScreenshotRequest(response.data, res);
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
