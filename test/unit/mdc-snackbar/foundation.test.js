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
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';

import {cssClasses, strings, numbers} from '../../../packages/mdc-snackbar/constants';
import {install as installClock} from '../helpers/clock';
import {MDCSnackbarFoundation} from '../../../packages/mdc-snackbar/foundation';

suite('MDCSnackbarFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCSnackbarFoundation.cssClasses, cssClasses);
});

test('exports strings', () => {
  assert.deepEqual(MDCSnackbarFoundation.strings, strings);
});

test('exports numbers', () => {
  assert.deepEqual(MDCSnackbarFoundation.numbers, numbers);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSnackbarFoundation, [
    'addClass', 'removeClass', 'announce', 'notifyOpening', 'notifyOpened', 'notifyClosing', 'notifyClosed',
  ]);
});

/**
 * @return {{mockAdapter: !MDCSnackbarAdapter, foundation: !MDCSnackbarFoundation}}
 */
function setupTest() {
  const adapterFoundationPair = /** @type {{mockAdapter: !MDCSnackbarAdapter, foundation: !MDCSnackbarFoundation}} */ (
    setupFoundationTest(MDCSnackbarFoundation)
  );
  adapterFoundationPair.foundation.init();
  return adapterFoundationPair;
}

test('#destroy removes all animating and open classes', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  foundation.destroy();

  td.verify(mockAdapter.removeClass(cssClasses.OPENING));
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.removeClass(cssClasses.CLOSING));
});

test('#destroy cancels all timers', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();
  foundation.close = td.func('close');

  foundation.open();
  foundation.destroy();

  // Note: #open uses a combination of rAF and setTimeout due to Firefox behavior, so we need to wait 2 ticks
  clock.runToFrame();
  clock.runToFrame();

  td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 0});
  td.reset();

  clock.runToFrame();
  td.verify(foundation.close(strings.REASON_DISMISS), {times: 0});
});

test('#open announces text to screen readers', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.announce(), {times: 1});
});

test('#open adds CSS classes after rAF', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 0});

  // Note: #open uses a combination of rAF and setTimeout due to Firefox behavior, so we need to wait 2 ticks
  clock.runToFrame();
  clock.runToFrame();
  td.verify(mockAdapter.addClass(cssClasses.OPEN));
});

test('#close removes CSS classes', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.reset();
  foundation.close();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('#close cancels rAF scheduled by open if still pending', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  td.reset();
  foundation.close();

  // Note: #open uses a combination of rAF and setTimeout due to Firefox behavior, so we need to wait 2 ticks
  clock.runToFrame();
  clock.runToFrame();
  td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 0});
});

test('#open adds the opening class to start an animation, and removes it after the animation is done', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  clock.runToFrame();
  clock.tick(100);

  td.verify(mockAdapter.addClass(cssClasses.OPENING));
  td.verify(mockAdapter.removeClass(cssClasses.OPENING), {times: 0});
  clock.tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
  td.verify(mockAdapter.removeClass(cssClasses.OPENING));
});

test('#close adds the closing class to start an animation, and removes it after the animation is done', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  clock.tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
  td.reset();
  foundation.close();

  td.verify(mockAdapter.addClass(cssClasses.CLOSING));
  td.verify(mockAdapter.removeClass(cssClasses.CLOSING), {times: 0});
  clock.tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
  td.verify(mockAdapter.removeClass(cssClasses.CLOSING));
});

test('#open emits "opening" and "opened" events', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  clock.runToFrame();
  clock.tick(100);

  td.verify(mockAdapter.notifyOpening(), {times: 1});
  clock.tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
  td.verify(mockAdapter.notifyOpened(), {times: 1});
});

test('#close emits "closing" and "closed" events', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  clock.tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
  td.reset();
  foundation.close();

  td.verify(mockAdapter.notifyClosing(''), {times: 1});
  clock.tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
  td.verify(mockAdapter.notifyClosed(''), {times: 1});

  foundation.open();
  clock.tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
  td.reset();

  const reason = 'reason';
  foundation.close(reason);
  td.verify(mockAdapter.notifyClosing(reason), {times: 1});
  clock.tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
  td.verify(mockAdapter.notifyClosed(reason), {times: 1});
});

test('#close does nothing if the snackbar is already closed', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.close();
  clock.runToFrame();
  clock.tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.OPENING), {times: 0});
  td.verify(mockAdapter.addClass(cssClasses.CLOSING), {times: 0});
  td.verify(mockAdapter.notifyClosing(''), {times: 0});
  td.verify(mockAdapter.notifyClosed(''), {times: 0});
});

test('#open automatically dismisses snackbar after timeout', () => {
  const {foundation} = setupTest();
  const clock = installClock();
  foundation.close = td.func('close');

  foundation.open();

  // Note: #open uses a combination of rAF and setTimeout due to Firefox behavior, so we need to wait 2 ticks
  clock.runToFrame();
  clock.runToFrame();

  // Auto-dismiss timeout
  clock.tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
  clock.tick(foundation.getTimeoutMs());

  td.verify(foundation.close(strings.REASON_DISMISS), {times: 1});
});

test('#snackbar remains open for indefinite timeout', () => {
  const {foundation} = setupTest();
  const clock = installClock();
  foundation.close = td.func('close');
  foundation.setTimeoutMs(-1);

  foundation.open();

  // Note: #open uses a combination of rAF and setTimeout due to Firefox behavior, so we need to wait 2 ticks
  clock.runToFrame();
  clock.runToFrame();

  // Wait for max timeout and ensure that close has not been called
  clock.tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
  clock.tick(numbers.MAX_AUTO_DISMISS_TIMEOUT_MS);

  td.verify(foundation.close(strings.REASON_DISMISS), {times: 0});
});

test('#isOpen returns false when the snackbar has never been opened', () => {
  const {foundation} = setupTest();
  assert.isFalse(foundation.isOpen());
});

test('#isOpen returns true when the snackbar is open', () => {
  const {foundation} = setupTest();

  foundation.open();

  assert.isTrue(foundation.isOpen());
});

test('#isOpen returns false when the snackbar is closed after being open', () => {
  const {foundation} = setupTest();

  foundation.open();
  foundation.close();

  assert.isFalse(foundation.isOpen());
});

test('escape keydown closes snackbar when closeOnEscape is true (via key property)', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.handleKeyDown({key: 'Escape'});

  td.verify(foundation.close(strings.REASON_DISMISS));
});

test('escape keydown closes snackbar when closeOnEscape is true (via keyCode property)', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.handleKeyDown({keyCode: 27});

  td.verify(foundation.close(strings.REASON_DISMISS));
});

test('escape keydown does not close snackbar when closeOnEscape is false (via key property)', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');
  foundation.setCloseOnEscape(false);

  foundation.open();
  foundation.handleKeyDown({key: 'Escape'});

  td.verify(foundation.close(strings.REASON_DISMISS), {times: 0});
});

test('escape keydown does not close snackbar when closeOnEscape is false (via keyCode property)', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');
  foundation.setCloseOnEscape(false);

  foundation.open();
  foundation.handleKeyDown({keyCode: 27});

  td.verify(foundation.close(strings.REASON_DISMISS), {times: 0});
});

test('keydown does nothing when key other than escape is pressed', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.handleKeyDown({key: 'Enter'});

  td.verify(foundation.close(strings.REASON_DISMISS), {times: 0});
});

test(`#handleActionButtonClick closes the snackbar with reason "${strings.REASON_ACTION}"`, () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.handleActionButtonClick({});

  td.verify(foundation.close(strings.REASON_ACTION));
});

test(`#handleActionIconClick closes the snackbar with reason "${strings.REASON_DISMISS}"`, () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.handleActionIconClick({});

  td.verify(foundation.close(strings.REASON_DISMISS));
});

test('#setTimeoutMs throws an error for values outside the min/max range', () => {
  const {foundation} = setupTest();
  assert.throws(() => foundation.setTimeoutMs(numbers.MIN_AUTO_DISMISS_TIMEOUT_MS - 1));
  assert.throws(() => foundation.setTimeoutMs(numbers.MAX_AUTO_DISMISS_TIMEOUT_MS + 1));
});

test('#getTimeoutMs returns the default value', () => {
  const {foundation} = setupTest();
  assert.equal(foundation.getTimeoutMs(), numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS);
});

test('#getTimeoutMs returns the value set by setTimeoutMs', () => {
  const {foundation} = setupTest();
  const timeoutMs = numbers.MAX_AUTO_DISMISS_TIMEOUT_MS - 1;
  foundation.setTimeoutMs(timeoutMs);
  assert.equal(foundation.getTimeoutMs(), timeoutMs);
});

test('#getCloseOnEscape returns the value set by setCloseOnEscape', () => {
  const {foundation} = setupTest();
  foundation.setCloseOnEscape(false);
  assert.equal(foundation.getCloseOnEscape(), false);
  foundation.setCloseOnEscape(true);
  assert.equal(foundation.getCloseOnEscape(), true);
});
