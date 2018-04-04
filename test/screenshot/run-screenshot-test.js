/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Screenshot = require('./lib/screenshot');

/* eslint-disable max-len */
const TEST_PAGE_URLS = [
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/classes/baseline.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/classes/dense.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/container-fill-color.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/corner-radius.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/filled-accessible.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/horizontal-padding-baseline.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/horizontal-padding-dense.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/icon-color.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/ink-color.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/stroke-color.html',
  'https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/04/03/23_34_00_262/94417356/assets/mdc-button/mixins/stroke-width.html',
];
/* eslint-enable max-len */

Screenshot.captureAll(TEST_PAGE_URLS);
