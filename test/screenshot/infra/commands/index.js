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
    <meta charset="utf-8">
    <title>${parentDirName}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
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

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-118996389-2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-118996389-2');
    </script>
  </head>
  <body>
    <main class="index-main">
      ${linkMarkup}
    </main>
  </body>
</html>
      `.trim();

      await localStorage.writeTextFile(path.join(parentDirPath, 'index.html'), html);
    }

    await walkDir(path.join(TEST_DIR_RELATIVE_PATH));

    await localStorage.delete([fakeReportHtmlFilePath, fakeReportJsonFilePath]);
  }
}

module.exports = IndexCommand;
