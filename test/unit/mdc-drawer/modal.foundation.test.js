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

import td from 'testdouble';
import MDCModalDrawerFoundation from '../../../packages/mdc-drawer/modal/foundation';

suite('MDCModalDrawerFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCModalDrawerFoundation.defaultAdapter);
  const foundation = new MDCModalDrawerFoundation(mockAdapter);
  const MockFoundationCtor = td.constructor(MDCModalDrawerFoundation);
  const mockFoundation = new MockFoundationCtor();

  return {foundation, mockAdapter, mockFoundation};
};

test('#opened traps the focus when drawer finishes animating open', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.opened();
  td.verify(mockAdapter.trapFocus(), {times: 1});
});

test('#closed untraps the focus when drawer finishes animating close', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.closed();
  td.verify(mockAdapter.releaseFocus(), {times: 1});
});

test('#handleScrimClick closes the drawer', () => {
  const {foundation} = setupTest();
  foundation.handleScrimClick();
  td.verify(foundation.close(), {times: 1});
});
