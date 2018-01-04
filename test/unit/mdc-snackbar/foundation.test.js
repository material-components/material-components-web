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
    'addClass', 'removeClass', 'setAriaHidden', 'unsetAriaHidden', 'setActionAriaHidden',
    'unsetActionAriaHidden', 'setActionText', 'setMessageText', 'setFocus', 'visibilityIsHidden',
    'registerCapturedBlurHandler', 'deregisterCapturedBlurHandler', 'registerVisibilityChangeHandler',
    'deregisterVisibilityChangeHandler', 'registerCapturedInteractionHandler',
    'deregisterCapturedInteractionHandler', 'registerActionClickHandler',
    'deregisterActionClickHandler', 'registerTransitionEndHandler',
    'deregisterTransitionEndHandler',
  ]);
  // Test default methods
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

test('#init calls adapter.registerActionClickHandler() with an action click handler function', () => {
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

test('#destroy calls adapter.deregisterVisibilityChangeHandler() with a function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();
  td.verify(mockAdapter.deregisterVisibilityChangeHandler(isA(Function)));
});

test('#destroy calls adapter.deregisterCapturedBlurHandler() with a function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();
  td.verify(mockAdapter.deregisterCapturedBlurHandler(isA(Function)));
});

test('#destroy calls adapter.deregisterCapturedInteractionHandler() with an event type and function 3 times', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.destroy();
  td.verify(mockAdapter.deregisterCapturedInteractionHandler(isA(String), isA(Function)), {times: 3});
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

  td.verify(mockAdapter.setMessageText('Message Deleted'));
  td.verify(mockAdapter.setMessageText('Message Archived'), {times: 0});
});

test('#show while snackbar is already showing will show after the timeout and transition end', () => {
  const clock = lolex.install();
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  let transEndHandler;
  td.when(mockAdapter.registerTransitionEndHandler(isA(Function)))
    .thenDo((handler) => {
      transEndHandler = handler;
    });

  foundation.init();
  foundation.show({
    message: 'Message Deleted',
  });

  foundation.show({
    message: 'Message Archived',
  });

  td.verify(mockAdapter.setMessageText('Message Archived'), {times: 0});

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

  td.verify(mockAdapter.removeClass(cssClasses.MULTILINE));
  td.verify(mockAdapter.removeClass(cssClasses.ACTION_ON_BOTTOM));
  td.verify(mockAdapter.deregisterTransitionEndHandler(transEndHandler));

  clock.uninstall();
});

test('#show calls adapter.registerVisibilityChangeHandler() with a function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.show({message: 'foo'});
  td.verify(mockAdapter.registerVisibilityChangeHandler(isA(Function)));
});

test('#show calls adapter.registerCapturedBlurHandler() with a function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.show({message: 'foo'});
  td.verify(mockAdapter.registerCapturedBlurHandler(isA(Function)));
});

test('#show calls adapter.registerCapturedInteractionHandler() with an event type and function 3 times', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.show({message: 'foo'});
  td.verify(mockAdapter.registerCapturedInteractionHandler(isA(String), isA(Function)), {times: 3});
});

test('snackbar is dismissed after action button is pressed', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  let actionClickHandler;
  td.when(mockAdapter.registerActionClickHandler(isA(Function)))
    .thenDo((handler) => {
      actionClickHandler = handler;
    });

  foundation.init();

  td.reset();

  foundation.show({
    message: 'Message Deleted',
    actionText: 'Undo',
    actionHandler: () => {},
  });

  actionClickHandler();

  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE));
});

test('snackbar is not dismissed after action button is pressed if setDismissOnAction(false) was called before', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  let actionClickHandler;
  td.when(mockAdapter.registerActionClickHandler(isA(Function)))
    .thenDo((handler) => {
      actionClickHandler = handler;
    });

  foundation.init();
  foundation.setDismissOnAction(false);

  td.reset();

  foundation.show({
    message: 'Message Deleted',
    actionText: 'Undo',
    actionHandler: () => {},
  });

  actionClickHandler();

  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE), {times: 0});
});

test('snackbar is not dismissed if action button gets focus', () => {
  const {foundation, mockAdapter} = setupTest();
  const evtType = 'focus';
  const mockEvent = {type: 'focus'};
  let focusEvent;

  td.when(mockAdapter.registerCapturedInteractionHandler(evtType, td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focusEvent = handler;
    });

  foundation.init();
  foundation.show({message: 'foo'});
  focusEvent(mockEvent);

  foundation.show({message: 'foo'});

  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE), {times: 0});
});

test('focus hijacks the snackbar timeout if no click or touchstart occurs', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvent = {type: 'focus'};
  let tabEvent;

  td.when(mockAdapter.registerCapturedInteractionHandler(mockEvent.type, td.matchers.isA(Function)))
    .thenDo((evt, handler) => {
      tabEvent = handler;
    });

  foundation.init();
  foundation.show({message: 'foo'});
  tabEvent(mockEvent);

  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE), {times: 0});
});

test('focus does not hijack the snackbar timeout if it occurs as a result' +
  'of a mousedown or touchstart', () => {
  const clock = lolex.install();
  const {foundation, mockAdapter} = setupTest();
  const mockFocusEvent = {type: 'focus'};
  const mockMouseEvent = {type: 'mousedown'};
  let focusEvent;
  let mouseEvent;

  td.when(mockAdapter.registerCapturedInteractionHandler(mockFocusEvent.type, td.matchers.isA(Function)))
    .thenDo((evt, handler) => {
      focusEvent = handler;
    });
  td.when(mockAdapter.registerCapturedInteractionHandler(mockMouseEvent.type, td.matchers.isA(Function)))
    .thenDo((evt, handler) => {
      mouseEvent = handler;
    });

  foundation.init();
  foundation.show({message: 'foo'});
  mouseEvent(mockMouseEvent);
  focusEvent(mockFocusEvent);
  clock.tick(numbers.MESSAGE_TIMEOUT);

  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE));
  clock.uninstall();
});

test('blur resets the snackbar timeout', () => {
  const clock = lolex.install();
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;
  const mockBlurEvent = {type: 'blur'};
  const mockFocusEvent = {type: 'focus'};
  let focusEvent;
  let blurEvent;

  td.when(mockAdapter.registerCapturedInteractionHandler(mockFocusEvent.type, td.matchers.isA(Function)))
    .thenDo((evt, handler) => {
      focusEvent = handler;
    });
  td.when(mockAdapter.registerCapturedBlurHandler(isA(Function)))
    .thenDo((handler) => {
      blurEvent = handler;
    });

  foundation.init();
  foundation.show({message: 'foo'});
  focusEvent(mockFocusEvent);
  // Sanity Check
  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE), {times: 0});

  blurEvent(mockBlurEvent);
  clock.tick(numbers.MESSAGE_TIMEOUT);
  td.verify(mockAdapter.removeClass(cssClasses.ACTIVE));

  clock.uninstall();
});
