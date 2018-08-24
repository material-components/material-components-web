/**
 * @license
 * Copyright 2016 Google Inc.
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

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCPersistentDrawerFoundation from '../../../packages/mdc-drawer/persistent/foundation';
import {cssClasses, strings} from '../../../packages/mdc-drawer/persistent/constants';

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCPersistentDrawerFoundation);
  td.when(mockAdapter.hasClass('mdc-drawer--persistent')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  return {foundation, mockAdapter};
}

suite('MDCPersistentDrawerFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCPersistentDrawerFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCPersistentDrawerFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCPersistentDrawerFoundation, [
    'addClass', 'removeClass', 'hasClass', 'hasNecessaryDom', 'registerInteractionHandler',
    'deregisterInteractionHandler', 'registerDrawerInteractionHandler', 'deregisterDrawerInteractionHandler',
    'registerTransitionEndHandler', 'deregisterTransitionEndHandler', 'registerDocumentKeydownHandler',
    'deregisterDocumentKeydownHandler', 'setTranslateX', 'getFocusableElements',
    'saveElementTabState', 'restoreElementTabState', 'makeElementUntabbable',
    'notifyOpen', 'notifyClose', 'isRtl', 'getDrawerWidth', 'isDrawer',
  ]);
});

test('#isRootTransitioningEventTarget_ returns true if the element is the drawer element', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  const fakeEl = 'fake element';
  td.when(mockAdapter.isDrawer(fakeEl)).thenReturn(true);
  assert.isTrue(foundation.isRootTransitioningEventTarget_(fakeEl));
});
