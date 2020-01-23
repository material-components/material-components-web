/**
 * @license
 * Copyright 2020 Google Inc.
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


import {MDCRippleFoundation} from '../../mdc-ripple/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';

export function setupTest(isCssVarsSupported = true) {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCRippleFoundation);
  mockAdapter.isUnbounded.and.returnValue(undefined);
  mockAdapter.isSurfaceDisabled.and.returnValue(false);
  mockAdapter.isSurfaceActive.and.returnValue(false);
  mockAdapter.containsEventTarget.and.returnValue(false);
  mockAdapter.browserSupportsCssVars.and.returnValue(isCssVarsSupported);
  mockAdapter.computeBoundingRect.and.returnValue(
      {width: 0, height: 0, left: 0, top: 0});
  mockAdapter.getWindowPageOffset.and.returnValue({x: 0, y: 0});
  return {foundation, adapter: mockAdapter};
}

export function testFoundation(
    desc: string, runTests: Function, isCssVarsSupported = true) {
  it(desc, () => {
    const {adapter, foundation} = setupTest(isCssVarsSupported);
    runTests({adapter, foundation});
  });
}

// Creates a mock window object with all members necessary to test
// util.supportsCssVariables in cases where window.CSS.supports indicates the
// feature is supported.
export function createMockWindowForCssVariables() {
  const getComputedStyle = jasmine.createSpy('window.getComputedStyle');
  const remove = () => mockWindow.appendedNodes--;
  const mockDoc = {
    head: {
      appendChild: () => mockWindow.appendedNodes++,
    },
    body: {
      appendChild: () => mockWindow.appendedNodes++,
    },
    createElement: jasmine.createSpy('document.createElement'),
  };

  getComputedStyle.withArgs(jasmine.anything()).and.returnValue({
    borderTopStyle: 'none',
  });

  mockDoc.createElement.withArgs('div').and.returnValue({
    remove: remove,
    parentNode: {
      removeChild: () => mockWindow.appendedNodes--,
    },
  });

  const mockWindow = {
    // Expose count of nodes that have been appended and not removed, to be
    // verified in tests
    appendedNodes: 0,
    CSS: {
      supports: jasmine.createSpy('.supports'),
    },
    document: mockDoc,
    getComputedStyle: getComputedStyle,
  };
  return mockWindow;
}
