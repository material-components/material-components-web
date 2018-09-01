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
    'eventTargetHasClass', 'eventTargetMatchesSelector',
    'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerDocumentKeyDownHandler', 'deregisterDocumentKeyDownHandler',
    'registerWindowResizeHandler', 'deregisterWindowResizeHandler',
    'trapFocusOnSurface', 'untrapFocusOnSurface',
    'fixOverflowIE', 'isContentScrollable', 'areButtonsStacked', 'getAction',
    'notifyOpening', 'notifyOpened', 'notifyClosing', 'notifyClosed',
  ]);
});

/**
 * @return {{mockAdapter: !MDCDialogAdapter, foundation: !MDCDialogFoundation}}
 */
function setupTest() {
  const ret = /** @type {{mockAdapter: !MDCDialogAdapter, foundation: !MDCDialogFoundation}} */ (
    setupFoundationTest(MDCDialogFoundation)
  );

  const {foundation} = ret;

  foundation.init();

  return ret;
}

test('#destroy closes the dialog to perform any necessary cleanup', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  foundation.destroy();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.removeClass(cssClasses.ANIMATING));
  td.verify(mockAdapter.removeBodyClass(cssClasses.SCROLL_LOCK));
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
  td.verify(mockAdapter.registerDocumentKeyDownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.registerWindowResizeHandler(td.matchers.isA(Function)));
});

test('#close deregisters all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.deregisterInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterDocumentKeyDownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterWindowResizeHandler(td.matchers.isA(Function)));
});

test('#open adds the open class to reveal the dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();

  td.verify(mockAdapter.addClass(cssClasses.OPEN));
});

test('#close removes the open class to hide the dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('#open adds the animation class to start an animation, and removes it after the animation is done', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = lolex.install();

  foundation.open();

  td.verify(mockAdapter.addClass(cssClasses.ANIMATING));
  clock.tick(numbers.DIALOG_ANIMATION_TIME_MS);
  td.verify(mockAdapter.removeClass(cssClasses.ANIMATING));
  clock.uninstall();
});

test('#open adds scroll lock class to the body', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();

  td.verify(mockAdapter.addBodyClass(cssClasses.SCROLL_LOCK));
});

test('#close removes the scroll lock class from the body', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  foundation.close();

  td.verify(mockAdapter.removeBodyClass(cssClasses.SCROLL_LOCK));
});

test('#open activates focus trapping on the dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = lolex.install();

  foundation.open();

  clock.tick(numbers.DIALOG_ANIMATION_TIME_MS);
  td.verify(mockAdapter.trapFocusOnSurface());
  clock.uninstall();
});

test('#close deactivates focus trapping on the dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.untrapFocusOnSurface());
});

test('#yes closes the dialog', () => {
  const {foundation} = setupTest();

  foundation.yes();
  assert.isFalse(foundation.isOpen());
});

test('#yes calls notifyYes when shouldNotify is set to true', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.yes(true);
  td.verify(mockAdapter.notifyYes(), {times: 1});
});

test('#yes does not call notifyYes when shouldNotify is falsy', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.yes();
  td.verify(mockAdapter.notifyYes(), {times: 0});
});

test('#no closes the dialog', () => {
  const {foundation} = setupTest();

  foundation.no();
  assert.isFalse(foundation.isOpen());
});

test('#no calls notifyNo when shouldNotify is set to true', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.no(true);
  td.verify(mockAdapter.notifyNo(), {times: 1});
});

test('#no does not call notifyNo when shouldNotify is falsy', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.no();
  td.verify(mockAdapter.notifyNo(), {times: 0});
});

test('#cancel closes the dialog', () => {
  const {foundation} = setupTest();

  foundation.cancel();
  assert.isFalse(foundation.isOpen());
});

test('#cancel calls notifyCancel when shouldNotify is set to true', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.cancel(true);
  td.verify(mockAdapter.notifyCancel(), {times: 1});
});

test('#cancel does not call notifyCancel when shouldNotify is falsy', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.cancel();
  td.verify(mockAdapter.notifyCancel(), {times: 0});
});

test('on dialog surface click closes and notifies if event target is the "yes" button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerContainerInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetMatchesSelector(evt.target, strings.YES_BTN_SELECTOR)).thenReturn(true);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyYes());
});

test('on dialog surface click closes and notifies if event target is the "no" button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerContainerInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetMatchesSelector(evt.target, strings.NO_BTN_SELECTOR)).thenReturn(true);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyNo());
});

test('on dialog surface click closes and notifies cancellation if event target is the "cancel" button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerContainerInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetMatchesSelector(evt.target, strings.CANCEL_BTN_SELECTOR)).thenReturn(true);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());
});

test('on dialog surface click does not close or notify if the event target is not the ' +
     '"yes", "no", or "cancel" button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerContainerInteractionHandler');
  const evt = {
    target: {},
    stopPropagation: () => {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, td.matchers.isA(String))).thenReturn(false);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.notifyCancel(), {times: 0});
  td.verify(mockAdapter.notifyYes(), {times: 0});
  td.verify(mockAdapter.notifyNo(), {times: 0});
});

test('on click closes the dialog and notifies cancellation if event target is the backdrop', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.SCRIM)).thenReturn(true);

  foundation.open();
  handlers.click(evt);

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());
});

test('on click does not close or notify cancellation if event target is the surface', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.SCRIM)).thenReturn(false);

  foundation.open();
  handlers.click(evt);

  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
});

test('on document keydown closes the dialog when escape key is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeyDownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Escape',
  });
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('on document keydown closes the dialog when escape key is pressed using keycode', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeyDownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    keyCode: 27,
  });
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('on document keydown calls notifyCancel', () => {
  const {foundation, mockAdapter} = setupTest();

  let keydown;
  td.when(mockAdapter.registerDocumentKeyDownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Escape',
  });

  td.verify(mockAdapter.notifyCancel());
});

test('on document keydown does nothing when key other than escape is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeyDownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Enter',
  });
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
});

test('should clean up transition handlers after dialog close', () => {
  const {foundation} = setupTest();
  foundation.close();
  // TODO(acdvorak): Write this test
});
