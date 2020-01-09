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

import {MDCFoundation} from '../../packages/mdc-base/foundation';
import {FoundationConstructor} from './setup';

/**
 * Creates a mockFoundation object with spy functions for each of the
 * foundation class' methods.
 */
export function createMockFoundation<F extends MDCFoundation>(
    FoundationClass: FoundationConstructor<F>) {
  const mockFoundationMethods =
      Object.getOwnPropertyNames(FoundationClass.prototype)
          .concat(Object.getOwnPropertyNames(MDCFoundation.prototype));
  const mockFoundation =
      jasmine.createSpyObj(FoundationClass.name, mockFoundationMethods);
  return mockFoundation;
}

/**
 * Sanity tests to ensure the following:
 * - Default adapters contain functions
 * - All expected adapter functions are accounted for
 * - Invoking any of the default methods does not throw an error.
 * Every foundation test suite includes this verification.
 */
export function verifyDefaultAdapter<F extends MDCFoundation>(
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
  actualMethodNames.forEach((method) => {
    expect(() => {
      defaultAdapter[method]();
    }).not.toThrow();
  });
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
    array.forEach((value) => {
      set.add(value);
    });
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
