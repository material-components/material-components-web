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

import {MDCFoundation} from '@material/base/foundation';

import {cssClasses, numbers, strings} from './constants';
import MDCCheckboxFoundation from './foundation';

const DESC_UNDEFINED = {
  get: undefined,
  set: undefined,
  enumerable: false,
  configurable: true,
};

/* TODO: Move below to separate directory. */
type MDCFoundationStatics = typeof MDCFoundation;

// `extends MDCFoundationStatics` to include MDCFoundation statics in type
// definition.
interface FoundationConstructor<F extends MDCFoundation> extends
    MDCFoundationStatics {
  new(...args: any[]): F;
}

function setupFoundationTest<F extends MDCFoundation>(
    FoundationClass: FoundationConstructor<F>) {
  const mockAdapter = jasmine.createSpyObj(
      FoundationClass.name, FoundationClass.defaultAdapter);
  const foundation = new FoundationClass(mockAdapter);
  return {foundation, mockAdapter};
}

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCCheckboxFoundation);
  const nativeControl = document.createElement('input');
  nativeControl.setAttribute('type', 'checkbox');
  return {foundation, mockAdapter, nativeControl};
}

function getUnequalArrayMessage(
    actualArray: string[], expectedArray: string[]): string {
  const format = (values: string[], singularName: string): string => {
    const count = values.length;
    if (count === 0) {
      return '';
    }
    const plural = count === 1 ? '' : 's';
    const str = values.join(', ');
    return `${count} ${singularName}${plural}: ${str}`;
  };

  const getAddedStr =
      (actualSet: Set<string>, expectedSet: Set<string>): string => {
        const addedArray: string[] = [];
        actualSet.forEach((val) => {
          if (!expectedSet.has(val)) {
            addedArray.push(val);
          }
        });
        return format(addedArray, 'unexpected method');
      };

  const getRemovedStr =
      (actualSet: Set<string>, expectedSet: Set<string>): string => {
        const removedArray: string[] = [];
        expectedSet.forEach((val) => {
          if (!actualSet.has(val)) {
            removedArray.push(val);
          }
        });
        return format(removedArray, 'missing method');
      };

  const toSet = (array: string[]): Set<string> => {
    const set: Set<string> = new Set();
    array.forEach((value) => set.add(value));
    return set;
  };

  const actualSet = toSet(actualArray);
  const expectedSet = toSet(expectedArray);
  const addedStr = getAddedStr(actualSet, expectedSet);
  const removedStr = getRemovedStr(actualSet, expectedSet);
  const messages = [addedStr, removedStr].filter((val) => val.length > 0);

  if (messages.length === 0) {
    return '';
  }

  return `Found ${messages.join('; ')}`;
}

function verifyDefaultAdapter<F extends MDCFoundation>(
    FoundationClass: FoundationConstructor<F>, expectedMethodNames: string[]) {
  const defaultAdapter = FoundationClass.defaultAdapter as {
    [key: string]: any;
  };
  const adapterKeys = Object.keys(defaultAdapter);
  const actualMethodNames =
      adapterKeys.filter((key) => typeof defaultAdapter[key] === 'function');

  expect(adapterKeys.length)
      .toEqual(
          actualMethodNames.length, 'Every adapter key must be a function');

  // Test for equality without requiring that the array be in a specific order.
  const actualArray = actualMethodNames.slice().sort();
  const expectedArray = expectedMethodNames.slice().sort();
  expect(expectedArray)
      .toEqual(actualArray, getUnequalArrayMessage(actualArray, expectedArray));

  // Test default methods.
  actualMethodNames.forEach(
      (method) => expect(() => defaultAdapter[method]).not.toThrow());
}
/* TODO: Move above to separate directory. */

interface CheckboxState {
  checked: boolean, indeterminate: boolean,
}
;

// Sets up tests which execute change events through the change handler which
// the foundation registers. Returns an object containing the following
// properties:
// - foundation - The MDCCheckboxFoundation instance
// - mockAdapter - The adapter given to the foundation. The adapter is
//   pre-configured to capture the changeHandler registered as well as respond
//   with different mock objects for native controls based on the state given
//   to the change() function.
// - change - A function that's passed an object containing two "checked" and
//   "boolean" properties, representing the state of the native control after
//   it was changed. E.g. `change({checked: true, indeterminate: false})`
//   simulates a change event as the result of a checkbox being checked.
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
  changes = (Array.isArray(changes) ? changes : [changes]) as CheckboxState[];
  it(`changeHandler: ${desc}`, () => {
    const {mockAdapter, change} = setupChangeHandlerTest();

    (changes as any).forEach(change);
    // td.verify(mockAdapter.addClass(expectedClass), verificationOpts);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(expectedClass);
  });
}

describe('MDCCheckboxFoundation', () => {
  beforeAll(() => {
    jasmine.clock().install();
  });

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

  // Shims Object.getOwnPropertyDescriptor for the checkbox's WebIDL attributes.
  // Used to test the behavior of overridding WebIDL properties in different
  // browser environments. For example, in Safari WebIDL attributes don't
  // return get/set in descriptors.
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
    Object.defineProperty(
        Object, 'getOwnPropertyDescriptor', Object.assign({}, originalDesc, {
          value: mockGetOwnPropertyDescriptor,
        }));
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

    foundation.enableAnimationEndHandler_ = true;
    foundation.currentAnimationClass_ = ANIM_UNCHECKED_CHECKED;
    expect(mockAdapter.removeClass).not.toHaveBeenCalled();

    foundation.handleAnimationEnd();

    jasmine.clock().tick(numbers.ANIM_END_LATCH_MS);
    expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
    expect(foundation.enableAnimationEndHandler_).toBe(false);
  });

  it('animation end is debounced if event is called twice', () => {
    const {ANIM_UNCHECKED_CHECKED} = cssClasses;
    const {mockAdapter, foundation} = setupChangeHandlerTest();
    foundation.enableAnimationEndHandler_ = true;
    foundation.currentAnimationClass_ = ANIM_UNCHECKED_CHECKED;

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
