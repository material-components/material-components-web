/**
 * @license
 * Copyright 2021 Google Inc.
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

// SpyAnd for group of multiple spies.
export interface SpyGroupAnd<T> {
  callThrough(): jasmine.SpyObj<T>;
  stub(): jasmine.SpyObj<T>;
}

// SpyObj with "and" for chaining a group of spies.
export type SpyGroup<T> = jasmine.SpyObj<T>&{
  and: SpyGroupAnd<T>;
}

// Checks if a value is a jasmine spy.
export function isSpy(value: unknown): value is jasmine.Spy {
  return typeof value === 'function' && 'and' in value;
}

// More versatile spyOnAllFunctions that allows chaining callThrough() and
// stub() for all function spies.
export function spyOnAllFunctions<T extends object>(obj: T) {
  const spyObj = window.spyOnAllFunctions(obj) as SpyGroup<T>;
  spyObj.and = {
    callThrough() {
      for (const key of Object.keys(spyObj)) {
        const value = spyObj[key as keyof typeof spyObj];
        if (isSpy(value)) {
          value.and.callThrough();
        }
      }
      return spyObj;
    },
    stub() {
      for (const key of Object.keys(spyObj)) {
        const value = spyObj[key as keyof typeof spyObj];
        if (isSpy(value)) {
          value.and.stub();
        }
      }
      return spyObj;
    }
  };
  return spyObj;
}
