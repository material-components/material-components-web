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
import bel from 'bel';
import lolex from 'lolex';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCCheckboxFoundation from '../../../packages/mdc-checkbox/foundation';
import {cssClasses, strings, numbers} from '../../../packages/mdc-checkbox/constants';

const DESC_UNDEFINED = {
  get: undefined,
  set: undefined,
  enumerable: false,
  configurable: true,
};

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCCheckboxFoundation);
  const nativeControl = bel`<input type="checkbox">`;
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  return {foundation, mockAdapter, nativeControl};
}

// Shims Object.getOwnPropertyDescriptor for the checkbox's WebIDL attributes. Used to test
// the behavior of overridding WebIDL properties in different browser environments. For example,
// in Safari WebIDL attributes don't return get/set in descriptors.
function withMockCheckboxDescriptorReturning(descriptor, runTests) {
  const originalDesc = Object.getOwnPropertyDescriptor(Object, 'getOwnPropertyDescriptor');
  const mockGetOwnPropertyDescriptor = td.func('.getOwnPropertyDescriptor');
  const oneOf = (...validArgs) => td.matchers.argThat((x) => validArgs.indexOf(x) >= 0);

  td.when(mockGetOwnPropertyDescriptor(HTMLInputElement.prototype, oneOf('checked', 'indeterminate')))
    .thenReturn(descriptor);

  Object.defineProperty(Object, 'getOwnPropertyDescriptor', Object.assign({}, originalDesc, {
    value: mockGetOwnPropertyDescriptor,
  }));
  runTests(mockGetOwnPropertyDescriptor);
  Object.defineProperty(Object, 'getOwnPropertyDescriptor', originalDesc);
}

// Sets up tests which execute change events through the change handler which the foundation
// registers. Returns an object containing the following properties:
// - foundation - The MDCCheckboxFoundation instance
// - mockAdapter - The adapter given to the foundation. The adapter is pre-configured to capture
//   the changeHandler registered as well as respond with different mock objects for native controls
//   based on the state given to the change() function.
// - change - A function that's passed an object containing two "checked" and "boolean" properties,
//   representing the state of the native control after it was changed. E.g.
//   `change({checked: true, indeterminate: false})` simulates a change event as the result of a checkbox
//   being checked.
function setupChangeHandlerTest() {
  let changeHandler;
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;
  td.when(mockAdapter.registerChangeHandler(isA(Function))).thenDo(function(handler) {
    changeHandler = handler;
  });
  td.when(mockAdapter.isAttachedToDOM()).thenReturn(true);

  foundation.init();

  const change = (newState) => {
    td.when(mockAdapter.getNativeControl()).thenReturn(newState);
    changeHandler();
  };

  return {foundation, mockAdapter, change};
}

function testChangeHandler(desc, changes, expectedClass, verificationOpts) {
  changes = Array.isArray(changes) ? changes : [changes];
  test(`changeHandler: ${desc}`, () => {
    const {mockAdapter, change} = setupChangeHandlerTest();
    changes.forEach(change);
    td.verify(mockAdapter.addClass(expectedClass), verificationOpts);
  });
}

suite('MDCCheckboxFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCCheckboxFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCCheckboxFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCCheckboxFoundation.numbers, numbers);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCCheckboxFoundation, [
    'addClass', 'removeClass', 'registerAnimationEndHandler', 'deregisterAnimationEndHandler',
    'registerChangeHandler', 'deregisterChangeHandler', 'getNativeControl', 'forceLayout',
    'isAttachedToDOM',
  ]);
});

test('#init adds the upgraded class to the root element', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.verify(mockAdapter.addClass(cssClasses.UPGRADED));
});

test('#init calls adapter.registerChangeHandler() with a change handler function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerChangeHandler(isA(Function)));
});

test('#init handles case where getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(undefined);
  assert.doesNotThrow(() => foundation.init());
});

test('#init handles case when WebIDL attrs cannot be overridden (Safari)', () => {
  const {foundation, nativeControl} = setupTest();
  withMockCheckboxDescriptorReturning(DESC_UNDEFINED, () => {
    assert.doesNotThrow(() => {
      foundation.init();
      nativeControl.checked = !nativeControl.checked;
    });
  });
});

test('#init handles case when property descriptors are not returned at all (Android Browser)', () => {
  const {foundation} = setupTest();
  withMockCheckboxDescriptorReturning(undefined, () => {
    assert.doesNotThrow(() => foundation.init());
  });
});

test('#destroy calls adapter.deregisterChangeHandler() with a registerChangeHandler function', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  let changeHandler;
  td.when(mockAdapter.registerChangeHandler(isA(Function))).thenDo(function(handler) {
    changeHandler = handler;
  });
  foundation.init();

  foundation.destroy();
  td.verify(mockAdapter.deregisterChangeHandler(changeHandler));
});

test('#destroy handles case where getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.when(mockAdapter.getNativeControl()).thenReturn(undefined);
  assert.doesNotThrow(() => foundation.destroy());
});

test('#destroy handles case when WebIDL attrs cannot be overridden (Safari)', () => {
  const {foundation} = setupTest();
  withMockCheckboxDescriptorReturning(DESC_UNDEFINED, () => {
    assert.doesNotThrow(() => foundation.init(), 'init sanity check');
    assert.doesNotThrow(() => foundation.destroy());
  });
});

test('#setChecked updates the value of nativeControl.checked', () => {
  const {foundation, nativeControl} = setupTest();
  foundation.setChecked(true);
  assert.isOk(foundation.isChecked());
  assert.isOk(nativeControl.checked);
  foundation.setChecked(false);
  assert.isNotOk(foundation.isChecked());
  assert.isNotOk(nativeControl.checked);
});

test('#setChecked works when no native control is returned', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setChecked(true));
});

test('#isChecked returns false when no native control is returned', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.isNotOk(foundation.isChecked());
});

test('#setIndeterminate updates the value of nativeControl.indeterminate', () => {
  const {foundation, nativeControl} = setupTest();
  foundation.setIndeterminate(true);
  assert.isOk(foundation.isIndeterminate());
  assert.isOk(nativeControl.indeterminate);
  foundation.setIndeterminate(false);
  assert.isNotOk(foundation.isIndeterminate());
  assert.isNotOk(nativeControl.indeterminate);
});

test('#setIndeterminate works when no native control is returned', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setIndeterminate(true));
});

test('#isIndeterminate returns false when no native control is returned', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.isNotOk(foundation.isIndeterminate());
});

test('#setDisabled updates the value of nativeControl.disabled', () => {
  const {foundation, nativeControl} = setupTest();
  foundation.setDisabled(true);
  assert.isOk(foundation.isDisabled());
  assert.isOk(nativeControl.disabled);
  foundation.setDisabled(false);
  assert.isNotOk(foundation.isDisabled());
  assert.isNotOk(nativeControl.disabled);
});

test('#setDisabled adds mdc-checkbox--disabled class to the root element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {disabled: false};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(cssClasses.DISABLED));
});

test('#setDisabled removes mdc-checkbox--disabled class from the root element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {disabled: true};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED));
});

test('#isDisabled returns false when no native control is returned', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled works when no native control is returned', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setDisabled(true));
});

test('#getValue returns the value of nativeControl.value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn({value: 'value'});
  assert.equal(foundation.getValue(), 'value');
});

test('#getValue returns null if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.isNull(foundation.getValue());
});

test('#setValue sets the value of nativeControl.value', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeControl = {value: null};
  td.when(mockAdapter.getNativeControl()).thenReturn(nativeControl);
  foundation.setValue('new value');
  assert.equal(nativeControl.value, 'new value');
});

test('#setValue exits gracefully if getNativeControl() does not return anything', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeControl()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setValue('new value'));
});

testChangeHandler('unchecked -> checked animation class', {
  checked: true,
  indeterminate: false,
}, cssClasses.ANIM_UNCHECKED_CHECKED);

testChangeHandler('unchecked -> indeterminate animation class', {
  checked: false,
  indeterminate: true,
}, cssClasses.ANIM_UNCHECKED_INDETERMINATE);

testChangeHandler('checked -> unchecked animation class', [
  {
    checked: true,
    indeterminate: false,
  },
  {
    checked: false,
    indeterminate: false,
  },
], cssClasses.ANIM_CHECKED_UNCHECKED);

testChangeHandler('checked -> indeterminate animation class', [
  {
    checked: true,
    indeterminate: false,
  },
  {
    checked: true,
    indeterminate: true,
  },
], cssClasses.ANIM_CHECKED_INDETERMINATE);

testChangeHandler('indeterminate -> checked animation class', [
  {
    checked: false,
    indeterminate: true,
  },
  {
    checked: true,
    indeterminate: false,
  },
], cssClasses.ANIM_INDETERMINATE_CHECKED);

testChangeHandler('indeterminate -> unchecked animation class', [
  {
    checked: true,
    indeterminate: true,
  },
  {
    checked: false,
    indeterminate: false,
  },
], cssClasses.ANIM_INDETERMINATE_UNCHECKED);

testChangeHandler('no transition classes applied when no state change', [
  {
    checked: true,
    indeterminate: false,
  },
  {
    checked: true,
    indeterminate: false,
  },
], cssClasses.ANIM_UNCHECKED_CHECKED, {times: 1});

test('animation end handler one-off removes animation class after short delay', () => {
  const clock = lolex.install();
  const {mockAdapter, change} = setupChangeHandlerTest();
  const {isA} = td.matchers;

  let animEndHandler;
  td.when(mockAdapter.registerAnimationEndHandler(isA(Function))).thenDo(function(handler) {
    animEndHandler = handler;
  });

  change({checked: true, indeterminate: false});
  assert.isOk(animEndHandler instanceof Function, 'animationend handler registeration sanity test');

  animEndHandler();
  const {ANIM_UNCHECKED_CHECKED} = cssClasses;
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 0});

  clock.tick(numbers.ANIM_END_LATCH_MS);
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED));
  td.verify(mockAdapter.deregisterAnimationEndHandler(animEndHandler));

  clock.uninstall();
});

test('change handler debounces changes within the animation end delay period', () => {
  const clock = lolex.install();
  const {mockAdapter, change} = setupChangeHandlerTest();
  const {isA} = td.matchers;

  let animEndHandler;
  td.when(mockAdapter.registerAnimationEndHandler(isA(Function))).thenDo(function(handler) {
    animEndHandler = handler;
  });

  change({checked: true, indeterminate: false});
  assert.isOk(animEndHandler instanceof Function, 'animationend handler registeration sanity test');
  // Queue up initial timer
  animEndHandler();

  const {ANIM_UNCHECKED_CHECKED, ANIM_CHECKED_INDETERMINATE} = cssClasses;

  change({checked: true, indeterminate: true});
  // Without ticking the clock, check that the prior class has been removed.
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED));
  // The animation end handler should not yet have been removed.
  td.verify(mockAdapter.deregisterAnimationEndHandler(animEndHandler), {times: 0});

  // Call animEndHandler again, and tick the clock. The original timer should have been cleared, and the
  // current timer should remove the correct, latest animation class, along with deregistering the handler.
  animEndHandler();
  clock.tick(numbers.ANIM_END_LATCH_MS);
  td.verify(mockAdapter.removeClass(ANIM_CHECKED_INDETERMINATE), {times: 1});
  td.verify(mockAdapter.deregisterAnimationEndHandler(animEndHandler), {times: 1});

  clock.uninstall();
});

test('change handler triggers layout for changes within the same frame to correctly restart anims', () => {
  const {mockAdapter, change} = setupChangeHandlerTest();

  change({checked: true, indeterminate: false});
  td.verify(mockAdapter.forceLayout(), {times: 0});

  change({checked: true, indeterminate: true});
  td.verify(mockAdapter.forceLayout());
});

test('change handler does not add animation classes when isAttachedToDOM() is falsy', () => {
  const {mockAdapter, change} = setupChangeHandlerTest();
  const animClassArg = td.matchers.argThat((cls) => cls.indexOf('mdc-checkbox--anim') >= 0);
  td.when(mockAdapter.isAttachedToDOM()).thenReturn(false);

  change({checked: true, indeterminate: false});
  td.verify(mockAdapter.addClass(animClassArg), {times: 0});
});

test('change handler does not add animation classes for bogus changes (init -> unchecked)', () => {
  const {mockAdapter, change} = setupChangeHandlerTest();
  const animClassArg = td.matchers.argThat((cls) => cls.indexOf('mdc-checkbox--anim') >= 0);

  change({checked: false, indeterminate: false});
  td.verify(mockAdapter.addClass(animClassArg), {times: 0});
});

test('change handler gracefully exits when getNativeControl() returns nothing', () => {
  const {change} = setupChangeHandlerTest();
  assert.doesNotThrow(() => change(undefined));
});

test('"checked" property change hook works correctly', () => {
  const {foundation, mockAdapter, nativeControl} = setupTest();
  const clock = lolex.install();
  td.when(mockAdapter.isAttachedToDOM()).thenReturn(true);

  withMockCheckboxDescriptorReturning({
    get: () => {},
    set: () => {},
    enumerable: false,
    configurable: true,
  }, () => {
    foundation.init();
    td.when(mockAdapter.getNativeControl()).thenReturn({
      checked: true,
      indeterminate: false,
    });
    nativeControl.checked = !nativeControl.checked;
    td.verify(mockAdapter.addClass(cssClasses.ANIM_UNCHECKED_CHECKED));
  });

  clock.uninstall();
});

test('"indeterminate" property change hook works correctly', () => {
  const {foundation, mockAdapter, nativeControl} = setupTest();
  const clock = lolex.install();
  td.when(mockAdapter.isAttachedToDOM()).thenReturn(true);

  withMockCheckboxDescriptorReturning({
    get: () => {},
    set: () => {},
    enumerable: false,
    configurable: true,
  }, () => {
    foundation.init();
    td.when(mockAdapter.getNativeControl()).thenReturn({
      checked: false,
      indeterminate: true,
    });
    nativeControl.indeterminate = !nativeControl.indeterminate;
    td.verify(mockAdapter.addClass(cssClasses.ANIM_UNCHECKED_INDETERMINATE));
  });

  clock.uninstall();
});
