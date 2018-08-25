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

import {assert} from 'chai';
import bel from 'bel';
import td from 'testdouble';

import MDCDismissibleDrawerFoundation from '../../../packages/mdc-drawer/dismissible/foundation';
import {strings, cssClasses} from '../../../packages/mdc-drawer/constants';
import {verifyDefaultAdapter} from '../helpers/foundation';

suite('MDCDismissibleDrawerFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCDismissibleDrawerFoundation.defaultAdapter);
  const foundation = new MDCDismissibleDrawerFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

test('exports strings', () => {
  assert.isTrue('strings' in MDCDismissibleDrawerFoundation);
  assert.deepEqual(MDCDismissibleDrawerFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.isTrue('cssClasses' in MDCDismissibleDrawerFoundation);
  assert.deepEqual(MDCDismissibleDrawerFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCDismissibleDrawerFoundation, [
    'hasClass', 'addClass', 'removeClass', 'elementHasClass', 'computeBoundingRect', 'saveFocus', 'restoreFocus',
    'focusActiveNavigationItem', 'notifyClose', 'notifyOpen', 'trapFocus', 'releaseFocus',
  ]);
});

test('#open does nothing if drawer is already open', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.open();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#open does nothing if drawer is already opening', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPENING)).thenReturn(true);
  foundation.open();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#open does nothing if drawer is closing', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CLOSING)).thenReturn(true);
  foundation.open();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#open adds appropriate classes and saves focus', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.open();
  td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 1});
  td.verify(mockAdapter.saveFocus(), {times: 1});
});

test('#close does nothing if drawer is already closed', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);
  foundation.close();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#close does nothing if drawer is opening', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPENING)).thenReturn(true);
  foundation.close();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#close does nothing if drawer is closing', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CLOSING)).thenReturn(true);
  foundation.close();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#close adds appropriate classes', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.close();

  td.verify(mockAdapter.addClass(cssClasses.CLOSING), {times: 1});
});

test(`#isOpen returns true when it has ${cssClasses.OPEN} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  assert.isTrue(foundation.isOpen());
});

test(`#isOpen returns false when it lacks ${cssClasses.OPEN} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);
  assert.isFalse(foundation.isOpen());
});

test(`#isOpening returns true when it has ${cssClasses.OPENING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPENING)).thenReturn(true);
  assert.isTrue(foundation.isOpening());
});

test(`#isOpening returns false when it lacks ${cssClasses.OPENING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPENING)).thenReturn(false);
  assert.isFalse(foundation.isOpening());
});

test(`#isClosing returns true when it has ${cssClasses.CLOSING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CLOSING)).thenReturn(true);
  assert.isTrue(foundation.isClosing());
});

test(`#isClosing returns false when it lacks ${cssClasses.CLOSING} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.CLOSING)).thenReturn(false);
  assert.isFalse(foundation.isClosing());
});

test('#handleKeydown does nothing when event key is not the escape key', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.handleKeydown({key: 'Shift'});

  td.verify(mockAdapter.addClass(cssClasses.CLOSING), {times: 0});
});

test('#handleKeydown does nothing when event keyCode is not 27', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.handleKeydown({keyCode: 11});

  td.verify(mockAdapter.addClass(cssClasses.CLOSING), {times: 0});
});

test('#handleKeydown calls close when event key is the escape key', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.handleKeydown({key: 'Escape'});

  td.verify(mockAdapter.addClass(cssClasses.CLOSING), {times: 1});
});

test('#handleKeydown calls close when event keyCode is 27', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.handleKeydown({keyCode: 27});

  td.verify(mockAdapter.addClass(cssClasses.CLOSING), {times: 1});
});

test('#handleTransitionEnd removes all animating classes', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEventTarget = bel`<div class="foo">bar</div>`;
  td.when(mockAdapter.elementHasClass(mockEventTarget, cssClasses.ROOT)).thenReturn(true);
  foundation.handleTransitionEnd({target: mockEventTarget});
  td.verify(mockAdapter.removeClass(cssClasses.ANIMATE), {times: 1});
  td.verify(mockAdapter.removeClass(cssClasses.OPENING), {times: 1});
  td.verify(mockAdapter.removeClass(cssClasses.CLOSING), {times: 1});
});

test('#handleTransitionEnd removes open class after closing, restores the focus and calls notifyClose', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEventTarget = bel`<div>root</div>`;
  td.when(mockAdapter.elementHasClass(mockEventTarget, cssClasses.ROOT)).thenReturn(true);
  td.when(foundation.isClosing()).thenReturn(true);

  foundation.handleTransitionEnd({target: mockEventTarget});
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 1});
  td.verify(mockAdapter.restoreFocus(), {times: 1});
  td.verify(mockAdapter.notifyClose(), {times: 1});
});

test(`#handleTransitionEnd doesn\'t remove open class after opening,
    focuses on active navigation item and calls notifyOpen`, () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEventTarget = bel`<div>root</div>`;
  td.when(mockAdapter.elementHasClass(mockEventTarget, cssClasses.ROOT)).thenReturn(true);
  td.when(foundation.isClosing()).thenReturn(false);

  foundation.handleTransitionEnd({target: mockEventTarget});
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.focusActiveNavigationItem(), {times: 1});
  td.verify(mockAdapter.notifyOpen(), {times: 1});
});

test('#handleTransitionEnd doesn\'t do anything if event is not triggered by root element', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEventTarget = bel`<div>child</div>`;
  td.when(mockAdapter.elementHasClass(mockEventTarget, cssClasses.ROOT)).thenReturn(false);

  foundation.handleTransitionEnd({target: mockEventTarget});
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.ANIMATE), {times: 0});
  td.verify(mockAdapter.notifyOpen(), {times: 0});
  td.verify(mockAdapter.notifyClose(), {times: 0});
});

test('#handleTransitionEnd doesn\'t do anything if event is emitted with a non-element target', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleTransitionEnd({target: {}});
  td.verify(mockAdapter.elementHasClass(td.matchers.anything(), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.ANIMATE), {times: 0});
  td.verify(mockAdapter.notifyOpen(), {times: 0});
  td.verify(mockAdapter.notifyClose(), {times: 0});
});
