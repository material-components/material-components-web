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

import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {MDCChipActionAttributes, MDCChipActionType} from '../constants';
import {MDCChipPrimaryActionFoundation} from '../primary-foundation';

describe('MDCChipPrimaryActionFoundation', () => {
  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCChipPrimaryActionFoundation);
    return {foundation, mockAdapter};
  };

  it(`#actionType returns "${MDCChipActionType.PRIMARY}"`, () => {
    const {foundation} = setupTest();
    expect(foundation.actionType()).toBe(MDCChipActionType.PRIMARY);
  });

  it(`#isSelectable returns true when role="option"`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ROLE)
        .and.returnValue('option');
    expect(foundation.isSelectable()).toBe(true);
  });

  it(`#isSelectable returns false when role != "option"`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.ROLE)
        .and.returnValue('button');
    expect(foundation.isSelectable()).toBe(false);
  });

  it(`#shouldEmitInteractionOnRemoveKey() returns true if ${
         MDCChipActionAttributes.DATA_DELETABLE} == 'true'`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getAttribute.withArgs(MDCChipActionAttributes.DATA_DELETABLE)
           .and.returnValue('true');
       expect((foundation as any).shouldEmitInteractionOnRemoveKey())
           .toBe(true);
     });
});
