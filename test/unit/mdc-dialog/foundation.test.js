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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';

import MDCDialogFoundation from '../../../packages/mdc-dialog/foundation';

suite('MDCDialogFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCDialogFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCDialogFoundation, [
    'setBackgroundAriaHidden', 'setDialogAriaHidden', 'hasClass', 'addClass',
    'removeClass', 'addScrollLockClass', 'removeScrollLockClass',
    'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerDialogInteractionHandler', 'deregisterDialogInteractionHandler',
    'registerDocumentKeydownHandler', 'deregisterDocumentKeydownHandler',
    'registerAcceptHandler', 'deregisterAcceptHandler',
    'registerCancelHandler', 'deregisterCancelHandler',
    'registerFocusTrappingHandler', 'deregisterFocusTrappingHandler',
    'getFocusableElements', 'saveElementTabState', 'restoreElementTabState',
    'makeElementUntabbable', 'setAttribute', 'acceptAction', 'cancelAction',
    'getFocusedElement', 'setFocusedElement',
  ]);
});

function setupTest() {
  return setupFoundationTest(MDCDialogFoundation);
}

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

  td.verify(mockAdapter.registerAcceptHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.registerCancelHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.registerDialogInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerFocusTrappingHandler());
});

test('#close deregisters all events registered within open()', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  foundation.close();

  td.verify(mockAdapter.deregisterAcceptHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterCancelHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterDialogInteractionHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterDocumentKeydownHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler(td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterFocusTrappingHandler());
});

test('#open adds the open class to reveal the dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.addClass('mdc-dialog--open'));
});

test('#close removes the open class to hide the dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.removeClass('mdc-dialog--open'));
});

test('#open adds the scroll lock class to dialog background', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.addScrollLockClass());
});

test('#close removes the scroll lock class from dialog background', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.removeScrollLockClass());
});

test('#open makes elements tabbable', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-dialog--open')).thenReturn(false);
  td.when(mockAdapter.getFocusableElements()).thenReturn(['foo', 'bar']);

  foundation.init();
  foundation.open();
  td.verify(mockAdapter.restoreElementTabState('foo'));
  td.verify(mockAdapter.restoreElementTabState('bar'));
});

test('#close makes elements untabbable', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-dialog--open')).thenReturn(true);
  td.when(mockAdapter.getFocusableElements()).thenReturn(['foo', 'bar']);

  foundation.open();
  foundation.close();
  td.verify(mockAdapter.makeElementUntabbable('foo'));
  td.verify(mockAdapter.makeElementUntabbable('bar'));
});

test('#open sets aria attributes for dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.setDialogAriaHidden(false), {times: 1});
  td.verify(mockAdapter.setBackgroundAriaHidden(true), {times: 1});
})

test('#close sets aria attributes for dialog', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.setDialogAriaHidden(true), {times: 1});
  td.verify(mockAdapter.setBackgroundAriaHidden(false), {times: 1});
})

test('#accept accepts the terms of the dialog', () => {
   const {foundation, mockAdapter} = setupTest();

  foundation.accept();
  td.verify(mockAdapter.acceptAction());
});

test('#cancel rejects the terms of the dialog', () => {
   const {foundation, mockAdapter} = setupTest();

  foundation.cancel();
  td.verify(mockAdapter.cancelAction());
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
  td.verify(mockAdapter.removeClass('mdc-dialog--open'));
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
  td.verify(mockAdapter.removeClass('mdc-dialog--open'), {times: 0});
});
