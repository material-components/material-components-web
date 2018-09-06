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
import lolex from 'lolex';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter, captureHandlers} from '../helpers/foundation';

import {cssClasses, strings, numbers} from '../../../packages/mdc-dialog/constants';
import {createMockRaf} from '../helpers/raf';
import MDCDialogFoundation from '../../../packages/mdc-dialog/foundation';

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
    'addClass', 'removeClass', 'addBodyClass', 'removeBodyClass',
    'eventTargetHasClass',
    'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerDocumentHandler', 'deregisterDocumentHandler',
    'registerWindowHandler', 'deregisterWindowHandler',
    'computeBoundingRect', 'trapFocus', 'releaseFocus',
    'isContentScrollable', 'areButtonsStacked', 'getActionFromEvent',
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

test('#destroy closes the dialog if it is still open', () => {
  const {foundation} = setupTest();
  foundation.close = td.func('close');

  foundation.open();
  foundation.destroy();

  td.verify(foundation.close(strings.DESTROY_ACTION));
});

test(`#destroy removes the animating classes`, () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.destroy();

  td.verify(mockAdapter.removeClass(cssClasses.OPENING));
  td.verify(mockAdapter.removeClass(cssClasses.CLOSING));
});

test('#open adds CSS classes', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();

  td.verify(mockAdapter.addClass(cssClasses.OPEN));
  td.verify(mockAdapter.addBodyClass(cssClasses.SCROLL_LOCK));
});

test('#close removes CSS classes', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.removeBodyClass(cssClasses.SCROLL_LOCK));
});

test('#open adds the opening class to start an animation, and removes it after the animation is done', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = lolex.install();

  foundation.open();

  try {
    td.verify(mockAdapter.addClass(cssClasses.OPENING));
    td.verify(mockAdapter.removeClass(cssClasses.OPENING), {times: 0});
    clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
    td.verify(mockAdapter.removeClass(cssClasses.OPENING));
  } finally {
    clock.uninstall();
  }
});

test('#close adds the closing class to start an animation, and removes it after the animation is done', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = lolex.install();

  foundation.close();

  try {
    td.verify(mockAdapter.addClass(cssClasses.CLOSING));
    td.verify(mockAdapter.removeClass(cssClasses.CLOSING), {times: 0});
    clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
    td.verify(mockAdapter.removeClass(cssClasses.CLOSING));
  } finally {
    clock.uninstall();
  }
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

test('#open registers all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();

  td.verify(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerDocumentHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerWindowHandler('resize', td.matchers.isA(Function)));
});

test('#close deregisters all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.deregisterInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterDocumentHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterWindowHandler('resize', td.matchers.isA(Function)));
});

test('#open activates focus trapping on the dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = lolex.install();

  foundation.open();

  clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);

  try {
    td.verify(mockAdapter.trapFocus());
  } finally {
    clock.uninstall();
  }
});

test('#close deactivates focus trapping on the dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.releaseFocus());
});

test('#open emits "opening" and "opened" events', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = lolex.install();

  foundation.open();

  try {
    td.verify(mockAdapter.notifyOpening(), {times: 1});
    clock.tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
    td.verify(mockAdapter.notifyOpened(), {times: 1});
  } finally {
    clock.uninstall();
  }
});

test('#close emits "closing" and "closed" events', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = lolex.install();

  foundation.close();

  try {
    td.verify(mockAdapter.notifyClosing(undefined), {times: 1});
    clock.tick(numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);
    td.verify(mockAdapter.notifyClosed(undefined), {times: 1});
  } finally {
    clock.uninstall();
  }
});

test('#open recalculates layout', () => {
  const {foundation} = setupTest();
  foundation.layout = td.func('layout');

  foundation.open();

  td.verify(foundation.layout());
});

test('#layout detects stacked buttons', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  td.when(mockAdapter.areButtonsStacked()).thenReturn(true);

  foundation.layout();
  mockRaf.flush();

  try {
    td.verify(mockAdapter.addClass(cssClasses.STACKED));
  } finally {
    mockRaf.restore();
  }
});

test('#layout detects unstacked buttons', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  td.when(mockAdapter.areButtonsStacked()).thenReturn(false);

  foundation.layout();
  mockRaf.flush();

  try {
    td.verify(mockAdapter.removeClass(cssClasses.STACKED));
  } finally {
    mockRaf.restore();
  }
});

test(`#layout removes ${cssClasses.STACKED} class before recalculating button stacking`, () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  td.when(mockAdapter.areButtonsStacked()).thenReturn(true);

  foundation.layout();
  mockRaf.flush();

  try {
    td.verify(mockAdapter.removeClass(cssClasses.STACKED));
    td.verify(mockAdapter.addClass(cssClasses.STACKED));
  } finally {
    mockRaf.restore();
  }
});

test('#layout adds scrollable class when content is scrollable', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  td.when(mockAdapter.isContentScrollable()).thenReturn(true);

  foundation.layout();
  mockRaf.flush();

  try {
    td.verify(mockAdapter.addClass(cssClasses.SCROLLABLE));
  } finally {
    mockRaf.restore();
  }
});

test('#layout removes scrollable class when content is not scrollable', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  td.when(mockAdapter.isContentScrollable()).thenReturn(false);

  foundation.layout();

  mockRaf.flush();
  td.verify(mockAdapter.removeClass(cssClasses.SCROLLABLE));
  mockRaf.restore();
});

test(`clicking does nothing when ${strings.ACTION_ATTRIBUTE} attribute is not present`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.close = td.func('close');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const evt = {
    target: {},
  };

  td.when(mockAdapter.getActionFromEvent(evt)).thenReturn(null);
  foundation.open();
  handlers.click(evt);
  td.verify(foundation.close(), {times: 0});
});

test(`clicking closes dialog when ${strings.ACTION_ATTRIBUTE} attribute is present`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.close = td.func('close');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const evt = {
    target: {},
  };
  const action = 'action';

  td.when(mockAdapter.getActionFromEvent(td.matchers.anything())).thenReturn(action);
  foundation.open();
  handlers.click(evt);
  td.verify(foundation.close(action));
});

test('window resize recalculates layout', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.layout = td.func('layout');
  const handlers = captureHandlers(mockAdapter, 'registerWindowHandler');
  foundation.open();
  handlers.resize();
  td.verify(foundation.layout());
});

test('on document keydown closes the dialog when escape key is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.close = td.func('close');
  const handlers = captureHandlers(mockAdapter, 'registerDocumentHandler');
  foundation.open();
  handlers.keydown({
    key: 'Escape',
  });
  td.verify(foundation.close(strings.ESCAPE_ACTION));
});

test('on document keydown closes the dialog when escape key is pressed using keycode', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.close = td.func('close');
  const handlers = captureHandlers(mockAdapter, 'registerDocumentHandler');
  foundation.open();
  handlers.keydown({
    keyCode: 27,
  });
  td.verify(foundation.close(strings.ESCAPE_ACTION));
});

test('on document keydown does nothing when key other than escape is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.close = td.func('close');
  const handlers = captureHandlers(mockAdapter, 'registerDocumentHandler');
  foundation.open();
  handlers.keydown({
    key: 'Enter',
  });
  td.verify(foundation.close(strings.ESCAPE_ACTION), {times: 0});
});
