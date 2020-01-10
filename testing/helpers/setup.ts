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

import {createMockAdapter, FoundationConstructor} from './foundation';

export function setUpFoundationTest<F extends MDCFoundation>(
    FoundationClass: FoundationConstructor<F>) {
  const mockAdapter = createMockAdapter(FoundationClass);
  const foundation = new FoundationClass(mockAdapter);
  return {foundation, mockAdapter};
}

/**
 * Sets up common functionality across all MDC foundation/component unit tests:
 * - Installation of the Jasmine clock.
 * - Replaces RAF with setTimeout so functionality in RAF's can be tested with
 *   the Jasmine clock.
 */
export function setUpMdcTestEnvironment() {
  beforeAll(() => {
    // Replace RAF with setTimeout, since setTimeout is overridden to be
    // synchronous in Jasmine clock installation.
    window.requestAnimationFrame = (fn: Function) => setTimeout(fn, 1);
    window.cancelAnimationFrame = (id: number) => { clearTimeout(id); };
  });

  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
}
