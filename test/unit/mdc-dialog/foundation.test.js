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

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';

import {cssClasses, strings, numbers} from '../../../packages/mdc-dialog/constants';
import {install as installClock} from '../helpers/clock';
import {MDCDialogFoundation} from '../../../packages/mdc-dialog/foundation';

const ENTER_EVENTS = [
  {type: 'keydown', key: 'Enter', target: {}},
  {type: 'keydown', keyCode: 13, target: {}},
];

suite('MDCDialogFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCDialogFoundation.cssClasses, cssClasses);
});

test('exports strings', () => {
  assert.deepEqual(MDCDialogFoundation.strings, strings);
});

test('exports numbers', () => {
  assert.deepEqual(MDCDialogFoundation.numbers, numbers);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCDialogFoundation, [
    'addClass', 'removeClass', 'hasClass',
    'addBodyClass', 'removeBodyClass', 'eventTargetMatches',
    'trapFocus', 'releaseFocus',
    'isContentScrollable', 'areButtonsStacked', 'getActionFromEvent', 'clickDefaultButton', 'reverseButtons',
    'notifyOpening', 'notifyOpened', 'notifyClosing', 'notifyClosed',
  ]);
});

/**
 * @return {{mockAdapter: !MDCDialogAdapter, foundation: !MDCDialogFoundation}}
 */
function setupTest() {
  const adapterFoundationPair = /** @type {{mockAdapter: !MDCDialogAdapter, foundation: !MDCDialogFoundation}} */ (
    setupFoundationTest(MDCDialogFoundation)
  );
  adapterFoundationPair.foundation.init();
  return adapterFoundationPair;
}

test(`#init turns off auto-stack if ${cssClasses.STACKED} is already present`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.STACKED)).thenReturn(true);

  foundation.init();
  assert.isFalse(foundation.getAutoStackButtons());
});

test('#destroy closes the dialog if it is still open', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.destroy();

  td.verify(foundation.close(strings.DESTROY_ACTION));
});

test('#destroy removes animating classes if called when the dialog is animating', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  foundation.destroy();

  td.verify(mockAdapter.removeClass(cssClasses.OPENING));
  td.verify(mockAdapter.removeClass(cssClasses.CLOSING));
});

test('#destroy cancels layout handling if called on same frame as layout', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.layout();
  foundation.destroy();
  clock.runToFrame();

  td.verify(mockAdapter.areButtonsStacked(), {times: 0});
  td.verify(mockAdapter.isContentScrollable(), {times: 0});
});

test('#open adds CSS classes after rAF', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.addBodyClass(cssClasses.SCROLL_LOCK), {times: 0});

  // Note: #open uses a combination of rAF and setTimeout due to Firefox behavior, so we need to wait 2 ticks
  clock.runToFrame();
  clock.runToFrame();
  td.verify(mockAdapter.addClass(cssClasses.OPEN));
  td.verify(mockAdapter.addBodyClass(cssClasses.SCROLL_LOCK));
});

test('#close removes CSS classes', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.reset();
  foundation.close();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.removeBodyClass(cssClasses.SCROLL_LOCK));
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
  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
  td.verify(mockAdapter.removeClass(cssClasses.OPENING));
});

test('#close adds the closing class to start an animation, and removes it after the animation is done', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
  td.reset();
  foundation.close();

  td.verify(mockAdapter.addClass(cssClasses.CLOSING));
  td.verify(mockAdapter.removeClass(cssClasses.CLOSING), {times: 0});
  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
  td.verify(mockAdapter.removeClass(cssClasses.CLOSING));
});

test('#open activates focus trapping on the dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();

  // Wait for application of opening class and setting of additional timeout prior to full open animation timeout
  clock.runToFrame();
  clock.tick(100);
  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);

  td.verify(mockAdapter.trapFocus());
});

test('#close deactivates focus trapping on the dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.reset();

  const clock = installClock();
  foundation.close();

  // Wait till setTimeout callback is executed.
  clock.runToFrame();
  clock.tick(100);
  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);

  td.verify(mockAdapter.releaseFocus());
});

test('#open emits "opening" and "opened" events', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  clock.runToFrame();
  clock.tick(100);

  td.verify(mockAdapter.notifyOpening(), {times: 1});
  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
  td.verify(mockAdapter.notifyOpened(), {times: 1});
});

test('#close emits "closing" and "closed" events', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  foundation.open();
  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
  td.reset();
  foundation.close();

  td.verify(mockAdapter.notifyClosing(''), {times: 1});
  clock.tick(numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);
  td.verify(mockAdapter.notifyClosed(''), {times: 1});

  foundation.open();
  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
  td.reset();

  const action = 'action';
  foundation.close(action);
  td.verify(mockAdapter.notifyClosing(action), {times: 1});
  clock.tick(numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);
  td.verify(mockAdapter.notifyClosed(action), {times: 1});
});

test('#close does nothing if the dialog is already closed', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.removeBodyClass(cssClasses.SCROLL_LOCK), {times: 0});
  td.verify(mockAdapter.addClass(cssClasses.CLOSING), {times: 0});
  td.verify(mockAdapter.releaseFocus(), {times: 0});
  td.verify(mockAdapter.notifyClosing(''), {times: 0});
});

test('#isOpen returns false when the dialog has never been opened', () => {
  const {foundation} = setupTest();
  assert.isFalse(foundation.isOpen());
});

test('#isOpen returns true when the dialog is open', () => {
  const {foundation} = setupTest();

  foundation.open();

  assert.isTrue(foundation.isOpen());
});

test('#isOpen returns false when the dialog is closed after being open', () => {
  const {foundation} = setupTest();

  foundation.open();
  foundation.close();

  assert.isFalse(foundation.isOpen());
});

test('#open recalculates layout', () => {
  const {foundation} = setupTest();
  const clock = installClock();

  foundation.layout = td.func('layout');

  foundation.open();
  clock.runToFrame();
  clock.tick(100);

  td.verify(foundation.layout());
});

test(`#layout removes ${cssClasses.STACKED} class, detects stacked buttons, and adds class`, () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();
  td.when(mockAdapter.areButtonsStacked()).thenReturn(true);

  foundation.layout();
  clock.runToFrame();

  td.verify(mockAdapter.removeClass(cssClasses.STACKED));
  td.verify(mockAdapter.addClass(cssClasses.STACKED));
});

test(`#layout removes ${cssClasses.STACKED} class, detects unstacked buttons, and does not add class`, () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();
  td.when(mockAdapter.areButtonsStacked()).thenReturn(false);

  foundation.layout();
  clock.runToFrame();

  td.verify(mockAdapter.removeClass(cssClasses.STACKED));
  td.verify(mockAdapter.addClass(cssClasses.STACKED), {times: 0});
});

test(`#layout does nothing to ${cssClasses.STACKED} class if autoStackButtons is false`, () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();
  td.when(mockAdapter.areButtonsStacked()).thenReturn(true);

  foundation.setAutoStackButtons(false);
  foundation.layout();
  clock.runToFrame();

  td.verify(mockAdapter.addClass(cssClasses.STACKED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.STACKED), {times: 0});
});

test('#layout adds scrollable class when content is scrollable', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();
  td.when(mockAdapter.isContentScrollable()).thenReturn(true);

  foundation.layout();
  clock.runToFrame();

  td.verify(mockAdapter.addClass(cssClasses.SCROLLABLE));
});

test('#layout removes scrollable class when content is not scrollable', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();
  td.when(mockAdapter.isContentScrollable()).thenReturn(false);

  foundation.layout();

  clock.runToFrame();
  td.verify(mockAdapter.removeClass(cssClasses.SCROLLABLE));
});

test(`#handleClick: Click closes dialog when ${strings.ACTION_ATTRIBUTE} attribute is present`, () => {
  const {foundation, mockAdapter} = setupTest();
  const action = 'action';
  foundation.close = td.func('close');

  const event = {target: {}};
  td.when(mockAdapter.getActionFromEvent(event)).thenReturn(action);
  foundation.open();
  foundation.handleClick(event);

  td.verify(foundation.close(action));
});

test('#handleKeydown: Keydown does not close dialog with action for non-activation keys', () => {
  const {foundation, mockAdapter} = setupTest();
  const action = 'action';
  const event = {type: 'keydown', key: 'Shift', target: {}};
  foundation.close = td.func('close');
  td.when(mockAdapter.getActionFromEvent(event)).thenReturn(action);

  foundation.open();
  foundation.handleKeydown(event);

  td.verify(foundation.close(action), {times: 0});
});

test(`#handleClick: Click does nothing when ${strings.ACTION_ATTRIBUTE} attribute is not present`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.close = td.func('close');

  const event = {target: {}};
  td.when(mockAdapter.getActionFromEvent(event)).thenReturn('');
  foundation.open();
  foundation.handleClick(event);

  td.verify(foundation.close(td.matchers.isA(String)), {times: 0});
});

test(`#handleKeydown: Keydown does nothing when ${strings.ACTION_ATTRIBUTE} attribute is not present`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.close = td.func('close');

  ENTER_EVENTS.forEach((event) => {
    td.when(mockAdapter.getActionFromEvent(event)).thenReturn('');
    foundation.open();
    foundation.handleKeydown(event);

    td.verify(foundation.close(td.matchers.isA(String)), {times: 0});
    td.reset();
  });
});

test('#handleKeydown: Enter keydown calls adapter.clickDefaultButton', () => {
  const {foundation, mockAdapter} = setupTest();

  ENTER_EVENTS.forEach((event) => {
    foundation.handleKeydown(event);
    td.verify(mockAdapter.clickDefaultButton());
    td.reset();
  });
});

test('#handleKeydown: Enter keydown does not call adapter.clickDefaultButton when it should be suppressed', () => {
  const {foundation, mockAdapter} = setupTest();

  ENTER_EVENTS.forEach((event) => {
    td.when(mockAdapter.eventTargetMatches(event.target, strings.SUPPRESS_DEFAULT_PRESS_SELECTOR)).thenReturn(true);
    foundation.handleKeydown(event);
    td.verify(mockAdapter.clickDefaultButton(), {times: 0});
    td.reset();
  });
});

test(`#handleClick: Click closes dialog when ${strings.SCRIM_SELECTOR} selector matches`, () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = {type: 'click', target: {}};
  foundation.close = td.func('close');
  td.when(mockAdapter.eventTargetMatches(evt.target, strings.SCRIM_SELECTOR)).thenReturn(true);

  foundation.open();
  foundation.handleClick(evt);

  td.verify(foundation.close(foundation.getScrimClickAction()));
});

test(`#handleClick: Click does nothing when ${strings.SCRIM_SELECTOR} class is present but scrimClickAction is 
    empty string`, () => {
  const {foundation, mockAdapter} = setupTest();
  const evt = {type: 'click', target: {}};
  foundation.close = td.func('close');
  td.when(mockAdapter.eventTargetMatches(evt.target, strings.SCRIM_SELECTOR)).thenReturn(true);

  foundation.setScrimClickAction('');
  foundation.open();
  foundation.handleClick(evt);

  td.verify(foundation.close(td.matchers.isA(String)), {times: 0});
});

test('escape keydown closes the dialog (via key property)', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.handleDocumentKeydown({key: 'Escape'});

  td.verify(foundation.close(foundation.getEscapeKeyAction()));
});

test('escape keydown closes the dialog (via keyCode property)', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.handleDocumentKeydown({keyCode: 27});

  td.verify(foundation.close(foundation.getEscapeKeyAction()));
});

test('escape keydown does nothing if escapeKeyAction is set to empty string', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.setEscapeKeyAction('');
  foundation.open();
  foundation.handleDocumentKeydown({key: 'Escape'});

  td.verify(foundation.close(foundation.getEscapeKeyAction()), {times: 0});
});

test('keydown does nothing when key other than escape is pressed', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.handleDocumentKeydown({key: 'Enter'});

  td.verify(foundation.close(foundation.getEscapeKeyAction()), {times: 0});
});

test('#getAutoStackButtons reflects setting of #setAutoStackButtons', () => {
  const {foundation} = setupTest();
  foundation.setAutoStackButtons(false);
  assert.isFalse(foundation.getAutoStackButtons());
  foundation.setAutoStackButtons(true);
  assert.isTrue(foundation.getAutoStackButtons());
});

test('#getEscapeKeyAction reflects setting of #setEscapeKeyAction', () => {
  const {foundation} = setupTest();
  const action = 'foo';
  foundation.setEscapeKeyAction(action);
  assert.strictEqual(foundation.getEscapeKeyAction(), action);
});

test('#getScrimClickAction reflects setting of #setScrimClickAction', () => {
  const {foundation} = setupTest();
  const action = 'foo';
  foundation.setScrimClickAction(action);
  assert.strictEqual(foundation.getScrimClickAction(), action);
});
