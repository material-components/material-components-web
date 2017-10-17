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

import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {createMockRaf} from '../helpers/raf';
import {captureHandlers as baseCaptureHandlers} from '../helpers/foundation';
import MDCRippleFoundation from '../../../packages/mdc-ripple/foundation';

export function setupTest(isCssVarsSupported = true) {
  const {foundation, mockAdapter} = setupFoundationTest(MDCRippleFoundation);
  td.when(mockAdapter.browserSupportsCssVars()).thenReturn(isCssVarsSupported);
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width: 0, height: 0, left: 0, top: 0});
  td.when(mockAdapter.getWindowPageOffset()).thenReturn({x: 0, y: 0});
  return {foundation, adapter: mockAdapter};
}

export function testFoundation(desc, isCssVarsSupported, runTests) {
  if (arguments.length === 2) {
    runTests = isCssVarsSupported;
    isCssVarsSupported = true;
  }

  test(desc, () => {
    const {adapter, foundation} = setupTest(isCssVarsSupported);
    const mockRaf = createMockRaf();
    runTests({adapter, foundation, mockRaf});
    mockRaf.restore();
  });
}

export function captureHandlers(adapter) {
  const handlers = baseCaptureHandlers(adapter, 'registerInteractionHandler');
  return handlers;
}

// Creates a mock window object with all members necessary to test util.supportsCssVariables
// in cases where window.CSS.supports indicates the feature is supported.
export function createMockWindowForCssVariables() {
  const getComputedStyle = td.func('window.getComputedStyle');
  const remove = () => mockWindow.appendedNodes--;
  const mockDoc = {
    body: {
      appendChild: () => mockWindow.appendedNodes++,
    },
    createElement: td.func('document.createElement'),
  };

  td.when(getComputedStyle(td.matchers.anything())).thenReturn({
    borderTopStyle: 'none',
  });

  td.when(mockDoc.createElement('div')).thenReturn({
    remove: remove,
  });

  const mockWindow = {
    // Expose count of nodes that have been appended and not removed, to be verified in tests
    appendedNodes: 0,
    CSS: {
      supports: td.func('.supports'),
    },
    document: mockDoc,
    getComputedStyle: getComputedStyle,
  };
  return mockWindow;
}
