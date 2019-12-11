/**
 * @license
 * Copyright 2016 Google Inc.
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
import bel from 'bel';
import td from 'testdouble';

import {install as installClock} from '../helpers/clock';
import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter} from '../helpers/foundation';
import {MDCCheckboxFoundation} from '../../../packages/mdc-checkbox/foundation';
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

// Sets up tests which execute change events through the click handler which the foundation
// registers. Returns an object containing the following properties:
// - foundation - The MDCCheckboxFoundation instance
// - mockAdapter - The adapter given to the foundation. The adapter is pre-configured to capture
//   the changeHandler registered as well as respond with different mock objects for native controls
//   based on the state given to the change() function.
// - change - A function that's passed an object containing two "checked" and "boolean" properties,
//   representing the state of the native control after it was changed. E.g.
//   `change({checked: true, indeterminate: false})` simulates a change event as the result of a checkbox
//   being checked.
function setupClickHandlerTest() {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isAttachedToDOM()).thenReturn(true);

  foundation.init();

  const change = (newState) => {
    td.when(mockAdapter.hasNativeControl()).thenReturn(true);
    td.when(mockAdapter.isChecked()).thenReturn(newState.checked);
    td.when(mockAdapter.isIndeterminate()).thenReturn(newState.indeterminate);
    foundation.handleClick();
  };

  return {foundation, mockAdapter, change};
}

function testClickHandler(desc, changes, expectedClass, verificationOpts) {
  changes = Array.isArray(changes) ? changes : [changes];
  test(`clickHandler: ${desc}`, () => {
    const {mockAdapter, change} = setupClickHandlerTest();
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
    'addClass', 'removeClass', 'setNativeControlAttr', 'removeNativeControlAttr',
    'forceLayout', 'isAttachedToDOM', 'isIndeterminate', 'isChecked',
    'hasNativeControl', 'setNativeControlDisabled', 'setChecked',
  ]);
});

test('#init adds the upgraded class to the root element', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.verify(mockAdapter.addClass(cssClasses.UPGRADED));
});

test('#init adds aria-checked="mixed" if checkbox is initially indeterminate', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isIndeterminate()).thenReturn(true);

  foundation.init();
  td.verify(mockAdapter.setNativeControlAttr('aria-checked', strings.ARIA_CHECKED_INDETERMINATE_VALUE));
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

test('#destroy handles case when WebIDL attrs cannot be overridden (Safari)', () => {
  const {foundation} = setupTest();
  withMockCheckboxDescriptorReturning(DESC_UNDEFINED, () => {
    assert.doesNotThrow(() => foundation.init(), 'init sanity check');
    assert.doesNotThrow(() => foundation.destroy());
  });
});

test('#setDisabled updates the value of nativeControl.disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setNativeControlDisabled(true), {times: 1});
});

test('#setDisabled adds mdc-checkbox--disabled class to the root element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(cssClasses.DISABLED));
});

test('#setDisabled removes mdc-checkbox--disabled class from the root element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED));
});

testClickHandler('unchecked -> checked animation class', {
  checked: true,
  indeterminate: false,
}, cssClasses.ANIM_UNCHECKED_CHECKED);

testClickHandler('unchecked -> indeterminate animation class', {
  checked: false,
  indeterminate: true,
}, cssClasses.ANIM_UNCHECKED_INDETERMINATE);

testClickHandler('checked -> unchecked animation class', [
  {
    checked: true,
    indeterminate: false,
  },
  {
    checked: false,
    indeterminate: false,
  },
], cssClasses.ANIM_CHECKED_UNCHECKED);

testClickHandler('checked -> indeterminate animation class', [
  {
    checked: true,
    indeterminate: false,
  },
  {
    checked: true,
    indeterminate: true,
  },
], cssClasses.ANIM_CHECKED_INDETERMINATE);

testClickHandler('indeterminate -> checked animation class', [
  {
    checked: false,
    indeterminate: true,
  },
  {
    checked: true,
    indeterminate: false,
  },
], cssClasses.ANIM_INDETERMINATE_CHECKED);

testClickHandler('indeterminate -> unchecked animation class', [
  {
    checked: true,
    indeterminate: true,
  },
  {
    checked: false,
    indeterminate: false,
  },
], cssClasses.ANIM_INDETERMINATE_UNCHECKED);

testClickHandler('no transition classes applied when no state change', [
  {
    checked: true,
    indeterminate: false,
  },
  {
    checked: true,
    indeterminate: false,
  },
], cssClasses.ANIM_UNCHECKED_CHECKED, {times: 1});

test('changing from unchecked to checked adds selected class', () => {
  const {mockAdapter, change} = setupClickHandlerTest();
  change({
    checked: false,
    indeterminate: false,
  });
  change({
    checked: true,
    indeterminate: false,
  });
  td.verify(mockAdapter.addClass(cssClasses.SELECTED), {times: 1});
});

test('changing from unchecked to indeterminate adds selected class', () => {
  const {mockAdapter, change} = setupClickHandlerTest();
  change({
    checked: false,
    indeterminate: false,
  });
  change({
    checked: false,
    indeterminate: true,
  });
  td.verify(mockAdapter.addClass(cssClasses.SELECTED), {times: 1});
});

test('changing from checked to unchecked removes selected class', () => {
  const {mockAdapter, change} = setupClickHandlerTest();
  change({
    checked: true,
    indeterminate: false,
  });
  change({
    checked: false,
    indeterminate: false,
  });
  td.verify(mockAdapter.removeClass(cssClasses.SELECTED), {times: 1});
});

test('changing from indeterminate to unchecked removes selected class', () => {
  const {mockAdapter, change} = setupClickHandlerTest();
  change({
    checked: false,
    indeterminate: true,
  });
  change({
    checked: false,
    indeterminate: false,
  });
  td.verify(mockAdapter.removeClass(cssClasses.SELECTED), {times: 1});
});

test('animation end handler removes animation class after short delay', () => {
  const clock = installClock();
  const {ANIM_UNCHECKED_CHECKED} = cssClasses;
  const {mockAdapter, foundation} = setupTest();

  foundation.enableAnimationEndHandler_ = true;
  foundation.currentAnimationClass_ = ANIM_UNCHECKED_CHECKED;
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 0});

  foundation.handleAnimationEnd();

  clock.tick(numbers.ANIM_END_LATCH_MS);
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 1});
  assert.isFalse(foundation.enableAnimationEndHandler_);
});

test('animation end is debounced if event is called twice', () => {
  const clock = installClock();
  const {ANIM_UNCHECKED_CHECKED} = cssClasses;
  const {mockAdapter, foundation} = setupClickHandlerTest();
  foundation.enableAnimationEndHandler_ = true;
  foundation.currentAnimationClass_ = ANIM_UNCHECKED_CHECKED;

  foundation.handleAnimationEnd();

  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 0});

  foundation.handleAnimationEnd();

  clock.tick(numbers.ANIM_END_LATCH_MS);
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 1});
});

test('click handler triggers layout for changes within the same frame to correctly restart anims', () => {
  const {mockAdapter, change} = setupClickHandlerTest();

  change({checked: true, indeterminate: false});
  td.verify(mockAdapter.forceLayout(), {times: 0});

  change({checked: true, indeterminate: true});
  td.verify(mockAdapter.forceLayout());
});

test('click handler updates aria-checked attribute correctly.', () => {
  const {mockAdapter, change} = setupClickHandlerTest();

  change({checked: true, indeterminate: true});
  td.verify(mockAdapter.setNativeControlAttr('aria-checked', 'mixed'));

  change({checked: true, indeterminate: false});
  td.verify(mockAdapter.removeNativeControlAttr('aria-checked'));
});

test('click handler does not add animation classes when isAttachedToDOM() is falsy', () => {
  const {mockAdapter, change} = setupClickHandlerTest();
  const animClassArg = td.matchers.argThat((cls) => cls.indexOf('mdc-checkbox--anim') >= 0);
  td.when(mockAdapter.isAttachedToDOM()).thenReturn(false);

  change({checked: true, indeterminate: false});
  td.verify(mockAdapter.addClass(animClassArg), {times: 0});
});

test('click handler does not add animation classes for bogus changes (init -> unchecked)', () => {
  const {mockAdapter, change} = setupClickHandlerTest();
  const animClassArg = td.matchers.argThat((cls) => cls.indexOf('mdc-checkbox--anim') >= 0);

  change({checked: false, indeterminate: false});
  td.verify(mockAdapter.addClass(animClassArg), {times: 0});
});

test('click handler does not do anything if checkbox element is not found', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasNativeControl()).thenReturn(false);
  assert.doesNotThrow(() => foundation.handleClick());
  td.verify(mockAdapter.setNativeControlAttr(td.matchers.isA(String), td.matchers.isA(String)), {times: 0});
  td.verify(mockAdapter.removeNativeControlAttr(td.matchers.isA(String)), {times: 0});
});
