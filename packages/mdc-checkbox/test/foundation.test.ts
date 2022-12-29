/**
 * @license
 * Copyright 2019 Google Inc.
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

import 'jasmine';

import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {cssClasses, numbers, strings} from '../constants';
import MDCCheckboxFoundation from '../foundation';

const DESC_UNDEFINED = {
  configurable: true,
  enumerable: false,
  get: undefined,
  set: undefined,
};

function setupTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCCheckboxFoundation);
  const nativeControl = document.createElement('input');
  nativeControl.setAttribute('type', 'checkbox');
  return {foundation, mockAdapter, nativeControl};
}

interface CheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

/**
 * Sets up tests which execute change events through the change handler which
 * the foundation registers. Returns an object containing the following
 * properties:
 * - foundation - The MDCCheckboxFoundation instance
 * - mockAdapter - The adapter given to the foundation. The adapter is
 *   pre-configured to capture the changeHandler registered as well as respond
 *   with different mock objects for native controls based on the state given
 *   to the change() function.
 * - change - A function that's passed an object containing two "checked" and
 *   "boolean" properties, representing the state of the native control after
 *   it was changed. E.g. `change({checked: true, indeterminate: false})`
 *   simulates a change event as the result of a checkbox being checked.
 */
function setupChangeHandlerTest() {
  const {foundation, mockAdapter} = setupTest();
  mockAdapter.isAttachedToDOM.and.returnValue(true);
  mockAdapter.isIndeterminate.and.returnValue(false);
  mockAdapter.isChecked.and.returnValue(false);

  foundation.init();

  const change = (newState: CheckboxState) => {
    mockAdapter.hasNativeControl.and.returnValue(true);
    mockAdapter.isChecked.and.returnValue(newState.checked);
    mockAdapter.isIndeterminate.and.returnValue(newState.indeterminate);
    foundation.handleChange();
  };

  return {foundation, mockAdapter, change};
}

function testChangeHandler(
    desc: string, changes: CheckboxState|CheckboxState[],
    expectedClass: string) {
  changes = Array.isArray(changes) ? changes : [changes]
  it(`changeHandler: ${desc}`, () => {
    const {mockAdapter, change} = setupChangeHandlerTest();

    (changes as any).forEach(change);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(expectedClass);
  });
}

describe('MDCCheckboxFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports constants', () => {
    expect(cssClasses).toEqual(MDCCheckboxFoundation.cssClasses);
    expect(numbers).toEqual(MDCCheckboxFoundation.numbers);
    expect(strings).toEqual(MDCCheckboxFoundation.strings);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCCheckboxFoundation, [
      'addClass',
      'removeClass',
      'setNativeControlAttr',
      'removeNativeControlAttr',
      'forceLayout',
      'isAttachedToDOM',
      'isIndeterminate',
      'isChecked',
      'hasNativeControl',
      'setNativeControlDisabled',
    ]);
  });

  it('#init adds the upgraded class to the root element', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.UPGRADED);
  });

  it('#init adds aria-checked="mixed" if checkbox is initially indeterminate',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.isIndeterminate.and.returnValue(true);

       foundation.init();
       expect(mockAdapter.setNativeControlAttr)
           .toHaveBeenCalledWith(
               'aria-checked', strings.ARIA_CHECKED_INDETERMINATE_VALUE);
     });

  /*
   * Shims Object.getOwnPropertyDescriptor for the checkbox's WebIDL attributes.
   * Used to test the behavior of overriding WebIDL properties in different
   * browser environments. For example, in Safari WebIDL attributes don't
   * return get/set in descriptors.
   */
  function withMockCheckboxDescriptorReturning(
      descriptor: undefined|typeof DESC_UNDEFINED, runTests: () => void) {
    const mockGetOwnPropertyDescriptor =
        jasmine.createSpy('mockGetOwnPropertyDescriptor');
    mockGetOwnPropertyDescriptor
        .withArgs(
            HTMLInputElement.prototype,
            jasmine.stringMatching('/checked|indeterminate/'))
        .and.returnValue(descriptor);

    const originalDesc =
        Object.getOwnPropertyDescriptor(Object, 'getOwnPropertyDescriptor');
    Object.defineProperty(Object, 'getOwnPropertyDescriptor', {
      ...originalDesc,
      value: mockGetOwnPropertyDescriptor,
    });
    runTests();

    // After running tests, restore original property.
    Object.defineProperty(
        Object, 'getOwnPropertyDescriptor', originalDesc as PropertyDescriptor);
  }

  it('#init handles case when WebIDL attrs cannot be overridden (Safari)',
     () => {
       const {foundation, nativeControl} = setupTest();
       withMockCheckboxDescriptorReturning(DESC_UNDEFINED, () => {
         expect(() => {
           foundation.init();
           nativeControl.checked = !nativeControl.checked;
         }).not.toThrow();
       });
     });

  it('#init handles case when property descriptors are not returned at all (Android Browser)',
     () => {
       const {foundation} = setupTest();
       withMockCheckboxDescriptorReturning(undefined, () => {
         expect(() => foundation.init).not.toThrow();
       });
     });

  it('#destroy handles case when WebIDL attrs cannot be overridden (Safari)',
     () => {
       const {foundation} = setupTest();
       withMockCheckboxDescriptorReturning(DESC_UNDEFINED, () => {
         expect(() => foundation.init).not.toThrow('init sanity check');
         expect(() => foundation.destroy).not.toThrow();
       });
     });

  it('#setDisabled updates the value of nativeControl.disabled', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(true);
    expect(mockAdapter.setNativeControlDisabled).toHaveBeenCalledWith(true);
    expect(mockAdapter.setNativeControlDisabled).toHaveBeenCalledTimes(1);
  });

  it('#setDisabled adds mdc-checkbox--disabled class to the root element when set to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setDisabled(true);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.DISABLED);
     });

  it('#setDisabled removes mdc-checkbox--disabled class from the root element when set to false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setDisabled(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.DISABLED);
     });

  testChangeHandler(
      'unchecked -> checked animation class', {
        checked: true,
        indeterminate: false,
      },
      cssClasses.ANIM_UNCHECKED_CHECKED);

  testChangeHandler(
      'unchecked -> indeterminate animation class', {
        checked: false,
        indeterminate: true,
      },
      cssClasses.ANIM_UNCHECKED_INDETERMINATE);

  testChangeHandler(
      'checked -> unchecked animation class',
      [
        {
          checked: true,
          indeterminate: false,
        },
        {
          checked: false,
          indeterminate: false,
        },
      ],
      cssClasses.ANIM_CHECKED_UNCHECKED);

  testChangeHandler(
      'checked -> indeterminate animation class',
      [
        {
          checked: true,
          indeterminate: false,
        },
        {
          checked: true,
          indeterminate: true,
        },
      ],
      cssClasses.ANIM_CHECKED_INDETERMINATE);

  testChangeHandler(
      'indeterminate -> checked animation class',
      [
        {
          checked: false,
          indeterminate: true,
        },
        {
          checked: true,
          indeterminate: false,
        },
      ],
      cssClasses.ANIM_INDETERMINATE_CHECKED);

  testChangeHandler(
      'indeterminate -> unchecked animation class',
      [
        {
          checked: true,
          indeterminate: true,
        },
        {
          checked: false,
          indeterminate: false,
        },
      ],
      cssClasses.ANIM_INDETERMINATE_UNCHECKED);

  testChangeHandler(
      'no transition classes applied when no state change',
      [
        {
          checked: true,
          indeterminate: false,
        },
        {
          checked: true,
          indeterminate: false,
        },
      ],
      cssClasses.ANIM_UNCHECKED_CHECKED);

  it('changing from unchecked to checked adds selected class', () => {
    const {mockAdapter, change} = setupChangeHandlerTest();
    change({
      checked: false,
      indeterminate: false,
    });
    change({
      checked: true,
      indeterminate: false,
    });
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.SELECTED);
  });

  it('changing from unchecked to indeterminate adds selected class', () => {
    const {mockAdapter, change} = setupChangeHandlerTest();
    change({
      checked: false,
      indeterminate: false,
    });
    change({
      checked: false,
      indeterminate: true,
    });
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.SELECTED);
  });

  it('changing from checked to unchecked removes selected class', () => {
    const {mockAdapter, change} = setupChangeHandlerTest();
    change({
      checked: true,
      indeterminate: false,
    });
    change({
      checked: false,
      indeterminate: false,
    });
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.SELECTED);
  });

  it('changing from indeterminate to unchecked removes selected class', () => {
    const {mockAdapter, change} = setupChangeHandlerTest();
    change({
      checked: false,
      indeterminate: true,
    });
    change({
      checked: false,
      indeterminate: false,
    });
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.SELECTED);
  });

  it('animation end handler removes animation class after short delay', () => {
    const {ANIM_UNCHECKED_CHECKED} = cssClasses;
    const {mockAdapter, foundation} = setupTest();

    (foundation as any).enableAnimationEndHandler = true;
    (foundation as any).currentAnimationClass = ANIM_UNCHECKED_CHECKED;
    expect(mockAdapter.removeClass).not.toHaveBeenCalled();

    foundation.handleAnimationEnd();

    jasmine.clock().tick(numbers.ANIM_END_LATCH_MS);
    expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
    expect((foundation as any).enableAnimationEndHandler).toBe(false);
  });

  it('animation end is debounced if event is called twice', () => {
    const {ANIM_UNCHECKED_CHECKED} = cssClasses;
    const {mockAdapter, foundation} = setupChangeHandlerTest();
    (foundation as any).enableAnimationEndHandler = true;
    (foundation as any).currentAnimationClass = ANIM_UNCHECKED_CHECKED;

    foundation.handleAnimationEnd();

    expect(mockAdapter.removeClass).not.toHaveBeenCalled();

    foundation.handleAnimationEnd();

    jasmine.clock().tick(numbers.ANIM_END_LATCH_MS);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(ANIM_UNCHECKED_CHECKED);
  });

  it('change handler triggers layout for changes within the same frame to correctly restart anims',
     () => {
       const {mockAdapter, change} = setupChangeHandlerTest();

       change({checked: true, indeterminate: false});
       expect(mockAdapter.forceLayout).not.toHaveBeenCalled();

       change({checked: true, indeterminate: true});
       expect(mockAdapter.forceLayout).toHaveBeenCalled();
     });

  it('change handler updates aria-checked attribute correctly.', () => {
    const {mockAdapter, change} = setupChangeHandlerTest();

    change({checked: true, indeterminate: true});
    expect(mockAdapter.setNativeControlAttr)
        .toHaveBeenCalledWith('aria-checked', 'mixed');

    change({checked: true, indeterminate: false});
    expect(mockAdapter.removeNativeControlAttr)
        .toHaveBeenCalledWith('aria-checked');
  });

  it('change handler does not add animation classes when isAttachedToDOM() is falsy',
     () => {
       const {mockAdapter, change} = setupChangeHandlerTest();
       mockAdapter.isAttachedToDOM.and.returnValue(false);

       change({checked: true, indeterminate: false});
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(
               jasmine.stringMatching('mdc-checkbox--anim'));
     });

  it('change handler does not add animation classes for bogus changes (init -> unchecked)',
     () => {
       const {mockAdapter, change} = setupChangeHandlerTest();

       change({checked: false, indeterminate: false});
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(
               jasmine.stringMatching('mdc-checkbox--anim'));
     });

  it('change handler does not do anything if checkbox element is not found',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasNativeControl.and.returnValue(false);
       expect(() => foundation.handleChange).not.toThrow();
       expect(mockAdapter.setNativeControlAttr).not.toHaveBeenCalled();
       expect(mockAdapter.removeNativeControlAttr).not.toHaveBeenCalled();
     });
});
