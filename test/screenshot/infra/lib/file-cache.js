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

const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const request = require('request-promise-native');

const mdcProto = require('../proto/mdc.pb').mdc.proto;
const {TestFile} = mdcProto;

const LocalStorage = require('./local-storage');

/**
 * Downloads binary files from public URLs and saves them to a stable path in the TEMP directory for later retrieval.
 */
class FileCache {
  constructor() {
    /**
     * @type {string}
     * @private
     */
    this.tempDirPath_ = path.join(os.tmpdir(), 'mdc-web/url-cache');

    /**
     * @type {!LocalStorage}
     * @private
     */
    this.localStorage_ = new LocalStorage();
  }

  /**
   * @param {string} uri Public URI or local file path.
   * @param {?string=} encoding 'utf8' for text, or `null` for binary data.
   * @return {!Promise<!mdc.proto.TestFile>} Local copy of the file pointed to by `uri`.
   */
  async downloadUrlToDisk(uri, encoding = null) {
    mkdirp.sync(this.tempDirPath_);

    // TODO(acdvorak): Document this hack
    const fakeRelativePath = uri.replace(/.*\/spec\/mdc-/, 'spec/mdc-');

    if (await this.localStorage_.exists(uri)) {
      return TestFile.create({
        absolute_path: path.resolve(uri),
        relative_path: fakeRelativePath,
        public_url: path.resolve(uri),
      });
    }

    const fileName = this.getFilename_(uri);
    const filePath = path.resolve(this.tempDirPath_, fileName);
    if (await this.localStorage_.exists(filePath)) {
      return TestFile.create({
        absolute_path: filePath,
        relative_path: fakeRelativePath,
        public_url: uri,
      });
    }

    const buffer = await request({uri, encoding});
    await this.localStorage_.writeBinaryFile(filePath, buffer, encoding)
      .catch(async (err) => {
        console.error(`downloadUrlToDisk("${uri}"):`);
        console.error(err);
        if (await this.localStorage_.exists(filePath)) {
          await this.localStorage_.delete(filePath);
        }
      });

    return TestFile.create({
      absolute_path: filePath,
      relative_path: fakeRelativePath,
      public_url: uri,
    });
  }

  /**
   * @param {string} uri Public URI or local file path.
   * @param {?string=} encoding 'utf8' for text, or `null` for binary data.
   * @return {!Promise<!Buffer>} Buffer containing the contents of the file pointed to by `uri`.
   */
  async downloadFileToBuffer(uri, encoding = null) {
    /** @type {!mdc.proto.TestFile} */
    const file = await this.downloadUrlToDisk(uri, encoding);
    return this.localStorage_.readBinaryFile(file.absolute_path, encoding);
  }

  /**
   * @param {string} uri
   * @return {string}
   * @private
   */
  getFilename_(uri) {
    return uri
      .replace(/[^a-zA-Z0-9_.-]+/g, '_')
      .replace(/_{2,}/g, '_')
    ;
  }
}

module.exports = FileCache;
