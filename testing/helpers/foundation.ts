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

type MDCFoundationStatics = typeof MDCFoundation;

// `extends MDCFoundationStatics` to include MDCFoundation statics in type
// definition.
export interface FoundationConstructor<F extends MDCFoundation> extends
    MDCFoundationStatics {
  new(...args: any[]): F;
}

/**
 * @returns Method names of the given foundation class, including all MDC
 *     superclasses.
 */
function getFoundationMethods<F extends MDCFoundation>(
    // tslint:disable-next-line:enforce-name-casing
    FoundationCtor: FoundationConstructor<F>,
    foundationMethods: string[] = []): string[] {
  const methods = foundationMethods;
  for (const methodName of Object.getOwnPropertyNames(FoundationCtor.prototype)) {
    methods.push(methodName);
  }

  // tslint:disable-next-line:enforce-name-casing
  const BaseFoundationCtor = Object.getPrototypeOf(FoundationCtor);
  if (BaseFoundationCtor === Function.prototype) {
    return methods;
  } else {
    return getFoundationMethods(BaseFoundationCtor, methods);
  }
}

/**
 * Creates a mockFoundation object with spy functions for each of the
 * foundation class' methods.
 */
export function createMockFoundation<F extends MDCFoundation>(
    // tslint:disable-next-line:enforce-name-casing
    FoundationCtor: FoundationConstructor<F>) {
  const mockFoundationMethods = getFoundationMethods(FoundationCtor);
  const mockFoundation =
      jasmine.createSpyObj(FoundationCtor.name, mockFoundationMethods);
  return mockFoundation;
}

/**
 * Creates a mockAdapter object with spy functions for each of the
 * adapter class' methods.
 */
export function createMockAdapter<F extends MDCFoundation>(
    // tslint:disable-next-line:enforce-name-casing
    FoundationCtor: FoundationConstructor<F>) {
  const mockAdapterMethods = {};
  Object.keys(FoundationCtor.defaultAdapter).forEach((methodName) => {
    const value = (FoundationCtor.defaultAdapter as any)[methodName];
    (mockAdapterMethods as any)[methodName] =
        typeof value === 'function' ? value() : value;
  });
  const mockAdapter =
      jasmine.createSpyObj(FoundationCtor.name, mockAdapterMethods);
  return mockAdapter;
}

/**
 * Sanity tests to ensure the following:
 * - Default adapters contain functions
 * - All expected adapter functions are accounted for
 * - Invoking any of the default methods does not throw an error.
 * Every foundation test suite includes this verification.
 */
export function verifyDefaultAdapter<F extends MDCFoundation>(
    // tslint:disable-next-line:enforce-name-casing
    FoundationCtor: FoundationConstructor<F>, expectedMethodNames: string[]) {
  const defaultAdapter = FoundationCtor.defaultAdapter as {
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

/**
 * Returns an object that intercepts calls to an adapter method used to register
 * event handlers, and adds it to that object where the key is the event name
 * and the value is the function being used. This is the preferred way of
 * testing interaction handlers.
 *
 * Note that `handlerCaptureMethodName` _must_ have a signature of `(string,
 * EventListener) => any` in order to be effective.
 */
export function captureHandlers(
    adapter: {[key: string]: any}, handlerCaptureMethodName: string) {
  const handlers: {[key: string]: any} = {};
  adapter[handlerCaptureMethodName]
      .withArgs(jasmine.any(String), jasmine.any(Function))
      .and.callFake((type: string, handler: Function) => {
        handlers[type] = (evtInfo: {[key: string]: any} = {}) =>
            handler({type, ...evtInfo});
      });
  return handlers;
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

/**
 * Checks if the spy was called with specific arguments a certain number of
 * times. This is intended for tests that are particularly concerned with the
 * number of times one specific invocation occurred (i.e. ripple debouncing
 * tests), and for which combining Jasmine's `toHaveBeenCalledWith` followed by
 * `toHaveBeenCalledTimes` is insufficient because `toHaveBeenCalledTimes`
 * potentially counts other invocations with arguments we don't care about.
 *
 * Note: This performs SHALLOW equality comparisons only and doesn't support
 * matchers (i.e. jasmine.any()).
 */
export function checkNumTimesSpyCalledWithArgs(
    spy: jasmine.Spy, args: any[], count: number) {
  expect(spy.calls.allArgs()
             .filter((x: any[]) => arraysShallowEqual(x, args))
             .length)
      .toEqual(count);
}

function arraysShallowEqual(expected: any[], actual: any[]) {
  return expected.length === actual.length &&
      expected.every((el, i) => el === actual[i]);
}
