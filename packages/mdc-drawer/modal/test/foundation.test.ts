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

import {createMockFoundation} from '../../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';
import {MDCModalDrawerFoundation} from '../foundation';

class MDCModalDrawerFoundationTest extends MDCModalDrawerFoundation {
  override opened() {
    super.opened();
  }

  override closed() {
    super.closed();
  }
}

describe('MDCModalDrawerFoundation', () => {
  setUpMdcTestEnvironment();

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCModalDrawerFoundationTest);
    const mockFoundation = createMockFoundation(MDCModalDrawerFoundationTest);

    return {foundation, mockAdapter, mockFoundation};
  };

  it('#opened traps the focus when drawer finishes animating open', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.opened();
    expect(mockAdapter.trapFocus).toHaveBeenCalledTimes(1);
  });

  it('#closed untraps the focus when drawer finishes animating close', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.closed();
    expect(mockAdapter.releaseFocus).toHaveBeenCalledTimes(1);
  });

  it('#handleScrimClick closes the drawer', () => {
    const foundation = new MDCModalDrawerFoundation();
    foundation.close = jasmine.createSpy('close');
    foundation.handleScrimClick();
    expect(foundation.close).toHaveBeenCalledTimes(1);
  });
});
