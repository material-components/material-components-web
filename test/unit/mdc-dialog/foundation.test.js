/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter, captureHandlers} from '../helpers/foundation';

import {cssClasses} from '../../../packages/mdc-dialog/constants';
import MDCDialogFoundation from '../../../packages/mdc-dialog/foundation';

suite('MDCDialogFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCDialogFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCDialogFoundation, [
    'hasClass', 'addClass', 'removeClass',
    'addBodyClass', 'removeBodyClass', 'eventTargetHasClass',
    'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerSurfaceInteractionHandler', 'deregisterSurfaceInteractionHandler',
    'registerDocumentKeydownHandler', 'deregisterDocumentKeydownHandler',
    'registerFocusTrappingHandler', 'deregisterFocusTrappingHandler',
    'numFocusableTargets', 'setDialogFocusFirstTarget', 'setInitialFocus',
    'getFocusableElements', 'saveElementTabState', 'restoreElementTabState',
    'makeElementUntabbable', 'setBodyAttr', 'rmBodyAttr', 'setAttr',
    'getFocusedTarget', 'setFocusedTarget', 'notifyAccept', 'notifyCancel',
  ]);
});

function setupTest() {
  return setupFoundationTest(MDCDialogFoundation);
}

test('#destroy closes the dialog to perform any necessary cleanup', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('#isOpen returns true when the dialog is open', () => {
  const {foundation} = setupTest();

  foundation.open();
  assert.isOk(foundation.isOpen());
});

test('#isOpen returns false when the dialog is closed', () => {
  const {foundation} = setupTest();

  foundation.close();
  assert.isNotOk(foundation.isOpen());
});

test('#open registers all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();

  td.verify(mockAdapter.registerSurfaceInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerFocusTrappingHandler(td.matchers.isA(Function)));
});

test('#close deregisters all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  foundation.close();

  td.verify(mockAdapter.deregisterSurfaceInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterDocumentKeydownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterFocusTrappingHandler(td.matchers.isA(Function)));
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

test('#open adds scroll lock class to the body', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.addBodyClass(cssClasses.SCROLL_LOCK));
});

test('#close removes the scroll lock class from dialog background', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.removeBodyClass(cssClasses.SCROLL_LOCK));
});

test('#open makes elements tabbable', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);
  td.when(mockAdapter.getFocusableElements()).thenReturn(['foo', 'bar']);

  foundation.init();
  foundation.open();
  td.verify(mockAdapter.restoreElementTabState('foo'));
  td.verify(mockAdapter.restoreElementTabState('bar'));
});

test('#close makes elements untabbable', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  td.when(mockAdapter.getFocusableElements()).thenReturn(['foo', 'bar']);

  foundation.open();
  foundation.close();
  td.verify(mockAdapter.makeElementUntabbable('foo'));
  td.verify(mockAdapter.makeElementUntabbable('bar'));
});

test('#open sets aria attributes for dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.setAttr('aria-hidden', 'false'));
  td.verify(mockAdapter.setBodyAttr('aria-hidden', 'true'));
});

test('#close sets aria attributes for dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.setAttr('aria-hidden', 'true'));
  td.verify(mockAdapter.rmBodyAttr('aria-hidden'));
});

test('#open sets default focus', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.setInitialFocus());
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

test('on dialog surface click calls evt.stopPropagation() to prevent click from propagating to background el', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerSurfaceInteractionHandler');
  const evt = {
    stopPropagation: td.func('evt.stopPropagation'),
    target: {},
  };

  foundation.open();
  handlers.click(evt);

  td.verify(evt.stopPropagation());
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

test('on click closese the dialog and notifies cancellation', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');

  foundation.open();
  handlers.click();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());
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

test('on focus does not call setDialogFocusFirstTarget if previous focus target is not last target', () => {
  const {foundation, mockAdapter} = setupTest();
  let focusTrappingHandler;
  const focusEvent = {
    relatedTarget: {},
  };

  td.when(mockAdapter.numFocusableTargets()).thenReturn(2);
  td.when(mockAdapter.registerFocusTrappingHandler(td.matchers.isA(Function))).thenDo((handler) => {
    focusTrappingHandler = handler;
  });

  foundation.open();
  focusTrappingHandler(focusEvent);
  focusTrappingHandler(focusEvent);

  td.verify(mockAdapter.setDialogFocusFirstTarget());
});

test('on focus resets focus to first target when last focus target was previously focused', () => {
  const {foundation, mockAdapter} = setupTest();
  let focusTrappingHandler;
  const focusEvent = {
    relatedTarget: {},
  };

  td.when(mockAdapter.numFocusableTargets()).thenReturn(2);
  td.when(mockAdapter.registerFocusTrappingHandler(td.matchers.isA(Function))).thenDo((handler) => {
    focusTrappingHandler = handler;
  });

  foundation.open();
  focusTrappingHandler(focusEvent);

  td.verify(mockAdapter.setDialogFocusFirstTarget());
});

test('on focus does not increment the focus element index when `relatedTarget` is absent from the event', () => {
  const {foundation, mockAdapter} = setupTest();
  let focusTrappingHandler;
  const focusEvent = {
    relatedTarget: null,
  };

  td.when(mockAdapter.numFocusableTargets()).thenReturn(2);
  td.when(mockAdapter.registerFocusTrappingHandler(td.matchers.isA(Function))).thenDo((handler) => {
    focusTrappingHandler = handler;
  });

  foundation.open();
  focusTrappingHandler(focusEvent);

  td.verify(mockAdapter.setDialogFocusFirstTarget(), {times: 0});
});

test('on focus ensures redundant focus events do not trample the index', () => {
  const {foundation, mockAdapter} = setupTest();
  let focusTrappingHandler;
  const focusEvent = {
    relatedTarget: {},
  };
  let timesSetDialogFocusFirstTargetWasCalled = 0;

  td.when(mockAdapter.numFocusableTargets()).thenReturn(1);
  td.when(mockAdapter.registerFocusTrappingHandler(td.matchers.isA(Function))).thenDo((handler) => {
    focusTrappingHandler = handler;
  });

  foundation.open();

  // Call additional focus() event within setDialogFocus...(), simulating the focus handler being
  // triggered by the manual focusing of that element. Also manually increment the amount of times
  // this method was called so that we don't need to call it an additional time when verifying.
  td.when(mockAdapter.setDialogFocusFirstTarget()).thenDo(() => {
    timesSetDialogFocusFirstTargetWasCalled++;
    focusTrappingHandler(focusEvent);
  });

  // Ensure that additional focus() event did not lead to additional calls to
  // setDialogFocusFirstTarget.
  focusTrappingHandler(focusEvent);
  assert.equal(timesSetDialogFocusFirstTargetWasCalled, 1);
});

test('#open regisers focus trapping handler after initial focus is assigned', () => {
  const {foundation, mockAdapter} = setupTest();
  let setInitialFocusCalledBeforeFocusHandlerRegistered = false;
  let registerFocusTrappingHandlerCalled = false;

  td.when(mockAdapter.registerFocusTrappingHandler(td.matchers.isA(Function))).thenDo(() => {
    registerFocusTrappingHandlerCalled = true;
  });

  td.when(mockAdapter.setInitialFocus()).thenDo(() => {
     setInitialFocusCalledBeforeFocusHandlerRegistered = !registerFocusTrappingHandlerCalled;
  });

  foundation.open();

  assert.isTrue(setInitialFocusCalledBeforeFocusHandlerRegistered);
});

test('#close does not call setFocusedTarget if there is no lastFocusedTarget ', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();

  td.verify(mockAdapter.setFocusedTarget(td.matchers.anything()), {times: 0});
});

test('#close calls setFocusedTarget if lastFocusedTarget evaluates to true', () => {
  const {foundation, mockAdapter} = setupTest();
  const lastFocusedTarget = {};

  td.when(mockAdapter.getFocusedTarget()).thenReturn(lastFocusedTarget);
  foundation.open();
  foundation.close();

  td.verify(mockAdapter.setFocusedTarget(lastFocusedTarget));
});
