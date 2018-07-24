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

const path = require('path');

const LocalStorage = require('../lib/local-storage');
const {TEST_DIR_RELATIVE_PATH} = require('../lib/constants');

// TODO(acdvorak): Clean up this entire file. It's gross.
class IndexCommand {
  /**
   * @return {!Promise<number|undefined>} Process exit code. If no exit code is returned, `0` is assumed.
   */
  async runAsync() {
    const localStorage = new LocalStorage();

    const fakeReportHtmlFilePath = path.join(TEST_DIR_RELATIVE_PATH, 'report/report.html');
    const fakeReportJsonFilePath = path.join(TEST_DIR_RELATIVE_PATH, 'report/report.json');

    await localStorage.writeTextFile(fakeReportHtmlFilePath, '');
    await localStorage.writeTextFile(fakeReportJsonFilePath, '{}');

    async function walkDir(parentDirPath, depth = 0) {
      const parentDirName = path.basename(parentDirPath);

      const realChildDirNames = localStorage.globDirs('*', parentDirPath)
        .map((dirName) => dirName.replace(new RegExp('/+$'), ''));

      const nonHtmlFileNames = localStorage.globFiles('*', parentDirPath)
        .filter((name) => !name.endsWith('.html'));

      const deepHtmlFileNames = localStorage.globFiles('**/*.html', parentDirPath)
        .filter((name) => path.basename(name) !== 'index.html');

      for (const dirName of realChildDirNames) {
        await walkDir(path.join(parentDirPath, dirName), depth + 1);
      }

      const printableChildDirNames = depth === 0 ? [...realChildDirNames] : ['..', ...realChildDirNames];
      const dirLinks = printableChildDirNames.map((childDirName) => {
        return `
<li class="index-file-item"><a href="./${childDirName}/index.html" class="index-file-link">${childDirName}/</a></li>
`;
      });

      const htmlFileLinks = deepHtmlFileNames.map((deepHtmlFileName) => {
        const fileNameMarkup = deepHtmlFileName.split(path.sep).map((part) => {
          if (/^mdc-.+$/.test(part) || /\.html$/.test(part)) {
            return `<b>${part}</b>`;
          }
          return part;
        }).join(path.sep);
        return `
<li class="index-file-item"><a href="./${deepHtmlFileName}" class="index-file-link">${fileNameMarkup}</a></li>
`;
      });

      const otherFileLinks = nonHtmlFileNames.map((nonHtmlFileName) => {
        return `
<li class="index-file-item"><a href="./${nonHtmlFileName}" class="index-file-link">${nonHtmlFileName}</a></li>
`;
      });

      const linkMarkup = [dirLinks, htmlFileLinks, otherFileLinks]
        .filter((links) => links.length > 0)
        .map((links) => `<ol class="index-file-list">${links.join('\n')}</ol>`)
        .join('\n<hr>\n')
      ;

      const html = `
<!doctype html>
<html>
  <head>
    <title>${parentDirName}</title>
    <style>
      body {
        font-family: "Roboto Mono", Consolas, monospace;
        font-size: .8rem;
        padding: 2em;
        margin: 0;
      }
      
      .index-main {
        display: inline-block;
      }
      
      .index-file-list {
        margin-top: 0;
      }

      .index-file-list,
      .index-file-item {
        list-style: none;
        padding-left: 0;
      }
      
      .index-file-link {
        display: block;
        padding: 4px;
      }
      
      .index-file-link:hover {
        background-color: #eee;
      }
    </style>
  </head>
  <body>
    <main class="index-main">
      ${linkMarkup}
    </main>
  </body>
</html>
      `;

      await localStorage.writeTextFile(path.join(parentDirPath, 'index.html'), html);
    }

    await walkDir(path.join(TEST_DIR_RELATIVE_PATH));

    await localStorage.delete([fakeReportHtmlFilePath, fakeReportJsonFilePath]);
  }
}

module.exports = IndexCommand;
