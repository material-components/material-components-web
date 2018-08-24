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
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isAttachedToDOM()).thenReturn(true);

  foundation.init();

  const change = (newState) => {
    td.when(mockAdapter.getNativeControl()).thenReturn(newState);
    foundation.handleChange();
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
    'addClass', 'removeClass', 'setNativeControlAttr', 'removeNativeControlAttr',
    'getNativeControl', 'forceLayout', 'isAttachedToDOM',
  ]);
});

test('#init adds the upgraded class to the root element', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.verify(mockAdapter.addClass(cssClasses.UPGRADED));
});

test('#init adds aria-checked="mixed" if checkbox is initially indeterminate', () => {
  const {foundation, mockAdapter, nativeControl} = setupTest();
  nativeControl.indeterminate = true;

  foundation.init();
  td.verify(mockAdapter.setNativeControlAttr('aria-checked', strings.ARIA_CHECKED_INDETERMINATE_VALUE));
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

test('#setIndeterminate adds aria-checked="mixed" when indeterminate is true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.setIndeterminate(true);
  td.verify(mockAdapter.setNativeControlAttr('aria-checked', strings.ARIA_CHECKED_INDETERMINATE_VALUE));
});

test('#setIndeterminate removes aria-checked when indeterminate is false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.setIndeterminate(false);
  td.verify(mockAdapter.removeNativeControlAttr('aria-checked'));
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

test('animation end handler removes animation class after short delay', () => {
  const clock = lolex.install();
  const {ANIM_UNCHECKED_CHECKED} = cssClasses;
  const {mockAdapter, foundation} = setupTest();

  foundation.enableAnimationEndHandler_ = true;
  foundation.currentAnimationClass_ = ANIM_UNCHECKED_CHECKED;
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 0});

  foundation.handleAnimationEnd();

  clock.tick(numbers.ANIM_END_LATCH_MS);
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 1});
  assert.isFalse(foundation.enableAnimationEndHandler_);

  clock.uninstall();
});

test('animation end is debounced if event is called twice', () => {
  const clock = lolex.install();
  const {ANIM_UNCHECKED_CHECKED} = cssClasses;
  const {mockAdapter, foundation} = setupChangeHandlerTest();
  foundation.enableAnimationEndHandler_ = true;
  foundation.currentAnimationClass_ = ANIM_UNCHECKED_CHECKED;

  foundation.handleAnimationEnd();

  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 0});

  foundation.handleAnimationEnd();

  clock.tick(numbers.ANIM_END_LATCH_MS);
  td.verify(mockAdapter.removeClass(ANIM_UNCHECKED_CHECKED), {times: 1});

  clock.uninstall();
});

test('change handler triggers layout for changes within the same frame to correctly restart anims', () => {
  const {mockAdapter, change} = setupChangeHandlerTest();

  change({checked: true, indeterminate: false});
  td.verify(mockAdapter.forceLayout(), {times: 0});

  change({checked: true, indeterminate: true});
  td.verify(mockAdapter.forceLayout());
});

test('change handler updates aria-checked attribute correctly.', () => {
  const {mockAdapter, change} = setupChangeHandlerTest();

  change({checked: true, indeterminate: true});
  td.verify(mockAdapter.setNativeControlAttr('aria-checked', 'mixed'));

  change({checked: true, indeterminate: false});
  td.verify(mockAdapter.removeNativeControlAttr('aria-checked'));
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
