/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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
import lolex from 'lolex';
import td from 'testdouble';
import MDCSnackbarFoundation from '../../../packages/mdc-snackbar/foundation';
import {cssClasses, strings, numbers} from '../../../packages/mdc-snackbar/constants';

function setupTest() {
  const mockAdapter = td.object(MDCSnackbarFoundation.defaultAdapter);

  const foundation = new MDCSnackbarFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

suite('MDCSnackbarFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCSnackbarFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCSnackbarFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  const {defaultAdapter} = MDCSnackbarFoundation;
  const methods = Object.keys(defaultAdapter).filter((k) => typeof defaultAdapter[k] === 'function');

  assert.equal(methods.length, Object.keys(defaultAdapter).length, 'Every adapter key must be a function');
  assert.deepEqual(methods, [
    'addClass', 'removeClass', 'setAriaHidden', 'unsetAriaHidden', 'setMessageText',
    'setActionText', 'setActionAriaHidden', 'unsetActionAriaHidden',
    'registerActionClickHandler', 'deregisterActionClickHandler',
    'registerTransitionEndHandler', 'deregisterTransitionEndHandler',
  ]);
  // Test default methods
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

test('#init calls adapter.registerActionClickHandler() with a action click handler function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerActionClickHandler(isA(Function)));
});

test('#destroy calls adapter.deregisterActionClickHandler() with a registerActionClickHandler function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  let changeHandler;
  td.when(mockAdapter.registerActionClickHandler(isA(Function))).thenDo(function(handler) {
    changeHandler = handler;
  });
  foundation.init();

  foundation.destroy();
  td.verify(mockAdapter.deregisterActionClickHandler(changeHandler));
});

test('#init calls adapter.setAriaHidden to ensure snackbar starts hidden', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.verify(mockAdapter.setAriaHidden());
});

test('#init calls adapter.setActionAriaHidden to ensure snackbar action starts hidden', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.verify(mockAdapter.setActionAriaHidden());
});

test('#show without a data object throws an error', () => {
  const {foundation} = setupTest();

  foundation.init();
  assert.throws(() => foundation.show(), Error);
});

test('#show without a message throws an error', () => {
  const {foundation} = setupTest();

  foundation.init();
  assert.throws(() => foundation.show({}), Error);
});

test('#show with an actionHandler but no actionText throws an error', () => {
  const {foundation} = setupTest();

  foundation.init();
  const data = {
    message: 'Message Deleted',
    actionHandler: () => {},
  };
  assert.throws(() => foundation.show(data), Error);
});

test('#show should add the active class', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({message: 'Message Deleted'});
  td.verify(mockAdapter.addClass(cssClasses.ACTIVE));
});

test('#show should call foundation#unsetAriaHidden() to show the snackbar', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({message: 'Message Deleted'});
  td.verify(mockAdapter.unsetAriaHidden());
});

test('#show should set the message text', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({message: 'Message Deleted'});
  td.verify(mockAdapter.setMessageText('Message Deleted'));
});

test('#show should make the foundation active', () => {
  const {foundation} = setupTest();

  foundation.init();
  foundation.show({message: 'Message Deleted'});
  assert.equal(foundation.active, true);
});

test('#show with action text and handler should set the action text', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({
    message: 'Message Deleted',
    actionText: 'Undo',
    actionHandler: () => {},
  });

  td.verify(mockAdapter.setActionText('Undo'));
});

test('#show with action text and handler should unset action aria-hidden', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({
    message: 'Message Deleted',
    actionText: 'Undo',
    actionHandler: () => {},
  });

  td.verify(mockAdapter.unsetActionAriaHidden());
});

test('#show({ mutliline: true }) should add multiline modifier', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({message: 'Message Deleted', multiline: true});
  td.verify(mockAdapter.addClass(cssClasses.MULTILINE));
});

test('#show({ mutliline: true, actionOnBottom: true }) should add action-on-bottom modifier', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({
    message: 'Message Deleted',
    multiline: true,
    actionOnBottom: true,
  });

  td.verify(mockAdapter.addClass(cssClasses.ACTION_ON_BOTTOM));
});

test('#show({ mutliline: false, actionOnBottom: true }) does not add action-on-bottom modifier', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({
    message: 'Message Deleted',
    actionOnBottom: true,
  });

  td.verify(mockAdapter.addClass(cssClasses.ACTION_ON_BOTTOM), {times: 0});
});

test('#show while snackbar is already showing will queue the data object.', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  foundation.show({
    message: 'Message Deleted',
  });

  foundation.show({
    message: 'Message Archived',
  });

  td.verify(mockAdapter.setMessageText('Message Archived'), {times: 0});
});

test('#show while snackbar is already showing will show after the timeout and transition end', () => {
  const clock = lolex.install();
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();

  let transEndHandler;
  td.when(mockAdapter.registerTransitionEndHandler(isA(Function)))
    .thenDo((handler) => {
      transEndHandler = handler;
    });

  foundation.show({
    message: 'Message Deleted',
  });

  foundation.show({
    message: 'Message Archived',
  });

  clock.tick(numbers.MESSAGE_TIMEOUT);
  transEndHandler();

  td.verify(mockAdapter.setMessageText('Message Archived'));
  clock.uninstall();
});

test('#show will remove active class after the timeout', () => {
  const clock = lolex.install();
  const {foundation, mockAdapter} = setupTest();

  foundation.init();

  foundation.show({
    message: 'Message Deleted',
  });

  clock.tick(numbers.MESSAGE_TIMEOUT);

  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE));
  clock.uninstall();
});

test('#show will add an transition end handler after the timeout', () => {
  const clock = lolex.install();
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();

  foundation.show({
    message: 'Message Deleted',
  });

  clock.tick(numbers.MESSAGE_TIMEOUT);

  td.verify(mockAdapter.registerTransitionEndHandler(isA(Function)));
  clock.uninstall();
});

test('#show will clean up snackbar after the timeout and transition end', () => {
  const clock = lolex.install();
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();

  let transEndHandler;
  td.when(mockAdapter.registerTransitionEndHandler(isA(Function)))
    .thenDo((handler) => {
      transEndHandler = handler;
    });

  foundation.show({
    message: 'Message Deleted',
    actionText: 'Undo',
    multiline: true,
    actionOnBottom: true,
    actionHandler: () => {},
  });

  clock.tick(numbers.MESSAGE_TIMEOUT);
  transEndHandler();

  td.verify(mockAdapter.setMessageText(null));
  td.verify(mockAdapter.setActionText(null));
  td.verify(mockAdapter.removeClass(cssClasses.MULTILINE));
  td.verify(mockAdapter.removeClass(cssClasses.ACTION_ON_BOTTOM));
  td.verify(mockAdapter.deregisterTransitionEndHandler(transEndHandler));

  clock.uninstall();
});
