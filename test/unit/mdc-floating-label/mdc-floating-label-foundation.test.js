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

import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCFloatingLabelFoundation from '../../../packages/mdc-floating-label/foundation';

const {cssClasses} = MDCFloatingLabelFoundation;

const setupTest = () => setupFoundationTest(MDCFloatingLabelFoundation);

suite('MDCFloatingLabelFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCFloatingLabelFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCFloatingLabelFoundation, [
    'addClass', 'removeClass', 'getWidth',
    'registerInteractionHandler', 'deregisterInteractionHandler',
  ]);
});

test('#init should register animationend event listener', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.registerInteractionHandler('animationend', td.matchers.isA(Function)));
});

test('#destroy should deregister animationend event listener', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInteractionHandler('animationend', td.matchers.isA(Function)));
});

test('#getWidth returns the width of the label element scaled by 75%', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 100;
  td.when(mockAdapter.getWidth()).thenReturn(width);
  assert.equal(foundation.getWidth(), width);
});

test('#float called with shouldFloat is true, floats the label', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.float(true);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#float called with shouldFloat is false, de-floats the label', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.float(false);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#shake called with shouldShake is true, should add shake class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.shake(true);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_SHAKE));
});

test('#shake called with shouldShake is false, should remove shake class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.shake(false);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_SHAKE));
});

test('#float called with shouldFloat is false, should remove shake class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.float(false);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_SHAKE));
});

test('#handleShakeAnimationEnd_ should remove LABEL_SHAKE class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleShakeAnimationEnd_();
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_SHAKE));
});

test(`on animationend removes ${cssClasses.LABEL_SHAKE} class`, () => {
  const {foundation, mockAdapter} = setupFoundationTest(MDCFloatingLabelFoundation);
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  foundation.init();
  handlers.animationend();
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_SHAKE));
});
