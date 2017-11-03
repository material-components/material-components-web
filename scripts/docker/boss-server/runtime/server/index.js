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

function writelnCommon(res, ...json) {
  const currentDate = new Date();
  res.write(JSON.stringify(Object.assign({}, ...json, {
    timestamp: {
      milliseconds: currentDate.getTime(),
      iso8601: currentDate.toJSON(),
    },
  })) + '\n');
}

let nextRequestId = 0;
const requestQueue = [];

const getQueuePosition = (id) => {
  for (let i = 0; i < requestQueue.length; i++) {
    if (requestQueue[i].id === id) {
      return i;
    }
  }
  return -1;
};

const enqueueStartScreenshotRequest = (pullRequest, res) => {
  const id = nextRequestId++;

  let destroyed = false;

  const writeln = (json) => {
    if (destroyed) {
      return;
    }
    writelnCommon(res, json, {
      queue: {
        index: getQueuePosition(id),
        length: requestQueue.length,
      },
    });
  };

  const interval = setInterval(() => screenshotRequest.tickle(), 5000);
  const screenshotRequest = {
    id,
    tickle: () => writeln({eventType: 'keepalive'}),
    handle: () => handleStartScreenshotRequest(pullRequest, res),
    destroy: () => {
      destroyed = true;
      clearInterval(interval);
      writeln({eventType: 'requestFinish'});
      res.end();
    },
  };

  requestQueue.push(screenshotRequest);
  requestQueue[0].tickle();

  console.log(`Enqueue request at position ${getQueuePosition(id)}`);

  if (getQueuePosition(id) === 0) {
    executeNextStartScreenshotRequest();
  }
};

const executeNextStartScreenshotRequest = () => {
  const request = requestQueue[0];
  if (request) {
    request.handle();
  }
};

const handleStartScreenshotRequest = (pullRequest, res) => {
  const args = [
    '--pr', pullRequest.number,
    '--author', pullRequest.user.login,
    '--remote-url', pullRequest.head.repo.clone_url,
    '--remote-branch', pullRequest.head.ref,
  ];

  console.log(`${new Date()} - Handle request (${requestQueue.length} in queue): ${args}`);

  const writeln = (json) => {
    writelnCommon(res, json);
  };

  const stdioToString = (buffer) => {
    // eslint-disable no-multi-spaces
    const sanitized = buffer.toString()
      .replace(/\n$/, '')            // strip trailing newline
      .replace(/\u0008+\s*/gu, ' ')  // replace backspace characters with a space
      .replace(/ {2,}/g, ' ')        // replace multiple spaces with one
    ;
    // eslint-enable no-multi-spaces
    return /^\s*$/.test(sanitized) ? '' : sanitized;
  };

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

    const lines = stdoutStr.split(/[\n\r\f]+/g);
    for (const line of lines) {
      if (line.indexOf('webpack: Compiled successfully.') > -1) {
        writeln({demoServerBuildPercentage: 100});
      } else if (line.indexOf('Connecting to the CrossBrowserTesting remote server') > -1) {
        // TODO: Figure out why this `if` condition (or something inside it) mysteriously fails to match at least one
        // browser per request.
        const browserMatch = /requesting browser \[([^\]]+)]/.exec(line);

        let browserDescription;
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
      } else if (line.indexOf('Test PASSED') > -1 || line.indexOf('Test FAILED') > -1) {
        const regex = /\[([^\]]+)] - Test (PASSED|FAILED)/gi;
        const browserMatches = line.match(regex);
        if (!browserMatches) {
          throw new Error('ERROR(acdvorak): This should never happen (1)');
        }

        for (const browserMatchStr of browserMatches) {
          const browserMatch = regex.exec(browserMatchStr);
          const browserDescription = browserMatch[1];
          const testResult = browserMatch[2];

          const browser = browserMap[browserDescription];
          if (!browser) {
            throw new Error('ERROR(acdvorak): This should never happen (2)');
          }

          browser.endTime = Date.now();
          browser.testResult = testResult;

          writeln({
            eventType: 'browserFinish',
            browser,
            browserList,
          });
        }
      } else if (line.indexOf('Quitting driver') > -1) {
        const regex = /\[([^\]]+)] - Quitting driver/gi;
        const browserMatches = line.match(regex);
        if (!browserMatches) {
          throw new Error('ERROR(acdvorak): This should never happen (3)');
        }

        for (const browserMatchStr of browserMatches) {
          const browserMatch = regex.exec(browserMatchStr);
          const browserDescription = browserMatch[1];

          const browser = browserMap[browserDescription];
          if (!browser) {
            throw new Error('ERROR(acdvorak): This should never happen (4)');
          }

          // We've already sent this to the user; ignore
          if (browser.testResult) {
            return;
          }

          browser.endTime = Date.now();
          browser.testResult = 'ERRORED';

          writeln({
            eventType: 'browserFinish',
            browser,
            browserList,
          });
        }
      } else if (line.indexOf('Installing node modules') > -1) {
        writeln({
          installNodeModulePercentage: 1,
        });
      } else if (/Successfully bootstrapped \d+ packages/.test(line)) {
        writeln({
          installNodeModulePercentage: 100,
        });
      } else if (line.indexOf('Shutting down demo server') > -1) {
        writeln({
          eventType: 'shuttingDownDemoServer',
        });
      }
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
    requestQueue.shift().destroy();
    executeNextStartScreenshotRequest();
  });
};

app.all('/webhook/github', (req, res) => {
  enqueueStartScreenshotRequest(req.body.pull_request, res);
});

app.post('/github/pr', (req, res) => {
  const github = new GitHubApi();
  github.pullRequests.get({
    owner: 'material-components',
    repo: 'material-components-web',
    number: req.body.pr_number,
  }).then((response) => {
    enqueueStartScreenshotRequest(response.data, res);
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
