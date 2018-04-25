/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
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

import bel from 'bel';
import {assert} from 'chai';

import {
  MDCTabScroller,
  MDCTabScrollerFoundation,
} from '../../../packages/mdc-tab-scroller';

const getFixture = () => bel`
  <div class="mdc-tab-scroller">
    <div class="mdc-tab-scroller__content"></div>
  </div>
`;

suite('MDCTabScroller - RTL Scroll Direction');

test('attachTo returns an MDCTabScroller instance', () => {
  assert.isTrue(MDCTabScroller.attachTo(getFixture()) instanceof MDCTabScroller);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCTabScroller(root);
  const content = root.querySelector(MDCTabScrollerFoundation.strings.CONTENT_SELECTOR);
  root.style.setProperty('width', '100px');
  root.style.setProperty('height', '10px');
  root.style.setProperty('overflow-x', 'scroll');
  content.style.setProperty('width', '10000px');
  content.style.setProperty('height', '10px');
  return {component, root};
}

const isIEorEdge = /msie|trident|edge/i.test(window.navigator.userAgent)
  && !!( document.uniqueID
  || window.MSInputMethodContext);

const isFirefox = /firefox/i.test(window.navigator.userAgent);
const isSafari_ = /safari/i.test(window.navigator.userAgent);
const isChrome_ = /chrome/i.test(window.navigator.userAgent);
const isSafari = isSafari_ && !isChrome_;
const isChrome = isSafari_ && isChrome_;

if (isIEorEdge) {
  test(`#foundation_.computeRTLScrollDirection_ returns ${MDCTabScrollerFoundation.strings.RTL_REVERSE} in IE/Edge`,
    () => {
      const {component, root} = setupTest();
      document.body.appendChild(root);
      assert.deepEqual(
        component.getDefaultFoundation().computeRTLScrollDirection_(),
        MDCTabScrollerFoundation.strings.RTL_REVERSE
      );
      document.body.removeChild(root);
    }
  );
}

if (isSafari) {
  test(`#foundation_.computeRTLScrollDirection_ returns ${MDCTabScrollerFoundation.strings.RTL_NEGATIVE} in Safari`,
    () => {
      const {component, root} = setupTest();
      document.body.appendChild(root);
      assert.deepEqual(
        component.getDefaultFoundation().computeRTLScrollDirection_(),
        MDCTabScrollerFoundation.strings.RTL_REVERSE
      );
      document.body.removeChild(root);
    }
  );
}

if (isFirefox) {
  test(`#foundation_.computeRTLScrollDirection_ returns ${MDCTabScrollerFoundation.strings.RTL_NEGATIVE} in Firefox`,
    () => {
      const {component, root} = setupTest();
      document.body.appendChild(root);
      assert.deepEqual(
        component.getDefaultFoundation().computeRTLScrollDirection_(),
        MDCTabScrollerFoundation.strings.RTL_REVERSE
      );
      document.body.removeChild(root);
    }
  );
}

if (isChrome) {
  test(`#foundation_.computeRTLScrollDirection_ returns ${MDCTabScrollerFoundation.strings.RTL_DEFAULT} in Chrome`,
    () => {
      const {component, root} = setupTest();
      document.body.appendChild(root);
      assert.deepEqual(
        component.getDefaultFoundation().computeRTLScrollDirection_(),
        MDCTabScrollerFoundation.strings.RTL_DEFAULT
      );
      document.body.removeChild(root);
    }
  );
}
