/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import * as dom from '../../../demos/dom.js';
import * as pony from '../../../demos/ponyfill.js';

demoReady((root, mdc) => {
  // Prevent default navigation behavior on all <a href="#"> links
  root.addEventListener('click', (evt) => {
    if (pony.closest(evt.target, 'a[href^="#"]')) {
      evt.preventDefault();
    }
  });

  dom.getAll('.mdc-button', root).forEach((el) => {
    mdc.ripple.MDCRipple.attachTo(el);
  });
});
