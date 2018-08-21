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
    'eventTargetHasClass', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerSurfaceInteractionHandler', 'deregisterSurfaceInteractionHandler',
    'registerDocumentKeydownHandler', 'deregisterDocumentKeydownHandler',
    'notifyAccept', 'notifyCancel', 'trapFocusOnSurface', 'untrapFocusOnSurface', 'isDialog',
  ]);
});

function setupTest() {
  return setupFoundationTest(MDCDialogFoundation);
}

test('#destroy closes the dialog to perform any necessary cleanup', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.open();
  foundation.destroy();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('#isOpen returns true when the dialog is open', () => {
  const {foundation} = setupTest();

  foundation.open();
  assert.isTrue(foundation.isOpen());
});

test('#isOpen returns false when the dialog is closed', () => {
  const {foundation} = setupTest();

  foundation.close();
  assert.isFalse(foundation.isOpen());
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

  td.verify(mockAdapter.registerSurfaceInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function)));
});

test('#close deregisters all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.deregisterSurfaceInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterDocumentKeydownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('click', td.matchers.isA(Function)));
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

  td.when(mockAdapter.isDialog(td.matchers.isA(Object))).thenReturn(true);
  foundation.open();
  td.when(mockAdapter.isDialog(td.matchers.isA(Object))).thenReturn(true);
  foundation.close();

  td.verify(mockAdapter.removeBodyClass(cssClasses.SCROLL_LOCK));
});

test('#open activates focus trapping on the dialog surface', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = lolex.install();

  td.when(mockAdapter.isDialog(td.matchers.isA(Object))).thenReturn(true);
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

test('#accept closes the dialog', () => {
  const {foundation} = setupTest();

  foundation.accept();
  assert.isFalse(foundation.isOpen());
});

test('#accept calls accept when shouldNotify is set to true', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.accept(true);
  td.verify(mockAdapter.notifyAccept());
});

test('#cancel closes the dialog', () => {
  const {foundation} = setupTest();

  foundation.cancel();
  assert.isFalse(foundation.isOpen());
});

test('#cancel calls notifyCancel when shouldNotify is set to true', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.cancel(true);
  td.verify(mockAdapter.notifyCancel());
});

test('on dialog surface click closes and notifies acceptance if event target is the accept button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerSurfaceInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.ACCEPT_BTN)).thenReturn(true);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyAccept());
});

test('on dialog surface click closes and notifies cancellation if event target is the cancel button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerSurfaceInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.CANCEL_BTN)).thenReturn(true);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());
});

test('on dialog surface click does not close or notify if the event target is not the ' +
     'accept or cancel button', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerSurfaceInteractionHandler');
  const evt = {
    target: {},
    stopPropagation: () => {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, td.matchers.isA(String))).thenReturn(false);
  foundation.open();
  handlers.click(evt);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.notifyCancel(), {times: 0});
  td.verify(mockAdapter.notifyAccept(), {times: 0});
});

test('on click closes the dialog and notifies cancellation if event target is the backdrop', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.BACKDROP)).thenReturn(true);

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

  td.when(mockAdapter.eventTargetHasClass(evt.target, cssClasses.BACKDROP)).thenReturn(false);

  foundation.open();
  handlers.click(evt);

  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
});

test('on document keydown closes the dialog when escape key is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
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
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
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
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
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
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
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
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isDialog(td.matchers.isA(Object))).thenReturn(true);
  foundation.close();
});
