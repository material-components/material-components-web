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

  const stdioToString = (buffer) => {
    // eslint-disable no-multi-spaces
    return buffer.toString()
      .replace(/\n$/, '')
      .replace(/\u0008+\s*/gu, ' ')  // replace backspace characters with a space
      .replace(/\s{2,}/g, ' ')       // replace multiple spaces with one
    ;
    // eslint-enable no-multi-spaces
  };

  console.log(`${new Date()} - Request: ${args}`);

  const browserList = [];
  const browserMap = {};
  let unknownBrowserCount = 0;

  const spawn = require('child_process').spawn('/scripts/run-screenshot-test.sh', args, {
    stdio: 'pipe',
    shell: true,
  });

  spawn.stdout.on('data', (buffer) => {
    const stdoutStr = stdioToString(buffer);
    if (!stdoutStr) {
      return;
    }

    writeln({stdout: stdoutStr});

    if (stdoutStr.indexOf('webpack: Compiled successfully.') > -1) {
      writeln({demoServerBuildPercentage: 100});
    } else if (stdoutStr.indexOf('Connecting to the CrossBrowserTesting remote server') > -1) {
      const browserMatch = /requesting browser \[([^\]]+)]/.exec(stdoutStr);

      let browserDescription = 'UNKNOWN BROWSER';
      if (browserMatch) {
        browserDescription = browserMatch[1];
      } else {
        browserDescription = `UNKNOWN BROWSER #${unknownBrowserCount++}`;
      }

      const browser = {
        description: browserDescription,
        startTime: Date.now(),
      };
      browserMap[browserDescription] = browser;
      browserList.push(browser);

      writeln({
        eventType: 'browserStart',
        browser,
        browserList,
      });
    } else if (stdoutStr.indexOf('Test PASSED') > -1 || stdoutStr.indexOf('Test FAILED') > -1) {
      const browserMatch = /\[([^\]]+)] - Test (PASSED|FAILED)/.exec(stdoutStr);
      if (!browserMatch) {
        const errorMessage = `ERROR: Unable to parse browser name from stdout: "${stdoutStr}"`;
        console.error(errorMessage);
        writeln({
          eventType: 'error',
          errorMessage,
        });
        return;
      }

      const browserDescription = browserMatch[1];
      const testResult = browserMatch[2];
      const browser = browserMap[browserDescription];
      browser.endTime = Date.now();
      browser.testResult = testResult;

      writeln({
        eventType: 'browserFinish',
        browser,
        browserList,
      });
    }
  });

  spawn.stderr.on('data', (buffer) => {
    const stderrStr = stdioToString(buffer);
    if (!stderrStr) {
      return;
    }

    writeln({stderr: stderrStr});

    const webpackBuildPercentageMatch = /^\s*(\d+)% \[\d+] /.exec(stderrStr);
    if (webpackBuildPercentageMatch) {
      const webpackBuildPercentage = parseInt(webpackBuildPercentageMatch[1]);
      writeln({demoServerBuildPercentage: webpackBuildPercentage});
    }
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
