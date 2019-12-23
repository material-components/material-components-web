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

/**
 * @license
 * Copyright 2017 Google Inc.
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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import {MDCSelectIconFoundation} from '../../../packages/mdc-select/icon/foundation';
import {strings} from '../../../packages/mdc-select/icon/constants';

suite('MDCSelectIconFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCSelectIconFoundation.strings, strings);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSelectIconFoundation, [
    'getAttr', 'setAttr', 'removeAttr', 'setContent', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'notifyIconAction',
  ]);
});

const setupTest = () => setupFoundationTest(MDCSelectIconFoundation);

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('keydown', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('keydown', td.matchers.isA(Function)));
});

test('#setDisabled sets icon tabindex to -1 and removes role when set to true if icon initially had a tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr('tabindex')).thenReturn('1');
  foundation.init();

  foundation.setDisabled(true);
  td.verify(mockAdapter.setAttr('tabindex', '-1'));
  td.verify(mockAdapter.removeAttr('role'));
});

test('#setDisabled does not change icon tabindex or role when set to true if icon initially had no tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr('tabindex')).thenReturn(null);
  foundation.init();

  foundation.setDisabled(true);
  td.verify(mockAdapter.setAttr('tabindex', td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.removeAttr('role'), {times: 0});
});

test('#setDisabled restores icon tabindex and role when set to false if icon initially had a tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  const expectedTabIndex = '1';
  td.when(mockAdapter.getAttr('tabindex')).thenReturn(expectedTabIndex);
  foundation.init();

  foundation.setDisabled(false);
  td.verify(mockAdapter.setAttr('tabindex', expectedTabIndex));
  td.verify(mockAdapter.setAttr('role', strings.ICON_ROLE));
});

test('#setDisabled does not change icon tabindex or role when set to false if icon initially had no tabindex', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr('tabindex')).thenReturn(null);
  foundation.init();

  foundation.setDisabled(false);
  td.verify(mockAdapter.setAttr('tabindex', td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.setAttr('role', td.matchers.isA(String)), {times: 0});
});

test('#setAriaLabel updates the aria-label', () => {
  const {foundation, mockAdapter} = setupTest();
  const ariaLabel = 'Test label';
  foundation.init();

  foundation.setAriaLabel(ariaLabel);
  td.verify(mockAdapter.setAttr('aria-label', ariaLabel));
});

test('#setContent updates the text content', () => {
  const {foundation, mockAdapter} = setupTest();
  const content = 'test';
  foundation.init();

  foundation.setContent(content);
  td.verify(mockAdapter.setContent(content));
});

test('on click notifies custom icon event', () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = new CustomEvent('click');
  let click;

  td.when(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function))).thenDo((evtType, handler) => {
    click = handler;
  });

  foundation.init();
  click(evt);
  td.verify(mockAdapter.notifyIconAction());
});
