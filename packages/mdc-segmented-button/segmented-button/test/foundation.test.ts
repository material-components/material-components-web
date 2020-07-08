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

import {MDCSegmentedButtonFoundation} from '../foundation';
import {verifyDefaultAdapter} from '../../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../../testing/helpers/setup';

describe('MDCSegmentedButtonFoundation', () => {
  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCSegmentedButtonFoundation, [
      'hasClass',
      'getSegments',
      'selectSegment',
      'unselectSegment',
      'notifySelectedChange'
    ]);
  });

  const setupSingleSelectTest = () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCSegmentedButtonFoundation);
    mockAdapter.hasClass.withArgs('mdc-segmented-button--single-select').and.returnValue(true);
    return {foundation, mockAdapter};
  };

  const setupMultiSelectTest = () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCSegmentedButtonFoundation);
    mockAdapter.hasClass.withArgs('mdc-segmented-button--single-select').and.returnValue(false);
    return {foundation, mockAdapter};
  };

  /*** #isSingleSelect ***/

  it('if single select, #isSingleSelect returns true', () => {
    const {foundation} = setupSingleSelectTest()
    expect(foundation.isSingleSelect()).toBeTruthy();
  });

  it('if multi select, #isSingleSelect returns false', () => {
    const {foundation} = setupMultiSelectTest();
    expect(foundation.isSingleSelect()).toBeFalsy();
  });


  /*** #isSegmentSelected ***/

  it('if segment at index is selected, #isSegmenteSelected returns true', () => {

  });

  it('if segment with segmentId is selected, #isSegmenteSelected returns true', () => {

  });

  it('if segment at index is not selected, #isSegmenteSelected returns false', () => {

  });

  it('if segment with segmentId is not selected, #isSegmenteSelected returns false', () => {

  });

  it('if no segment at index, #isSegmenteSelected returns false', () => {

  });

  it('if no segment with segmentId, #isSegmenteSelected returns false', () => {

  });

  /*** getSelectedSegments ***/

  it('#getSelectedSegments returns selected segments', () => {

  });

  /*** #selectSegment ***/

  it('#selectSegment selects segment at index if it is unselected', () => {

  });

  it('#selectSegment selects segment with segmentId if it is unselected', () => {

  });

  it('#selectSegment does nothing if segment is already selected', () => {

  });

  //?
  it('#selectSegment does nothing if segment does not exist', () => {

  });

  it('#selectSegment does not emit an event', () => {

  });

  /*** #unselectSegment ***/

  it('#unselectSegment unselects segment at index if it is selected', () => {

  });

  it('#unselectSegment unselects segment with segmentId if it is selected', () => {

  });

  it('#unselectSegment does nothing if segment is already unselected', () => {

  });

  //?
  it('#unselectSegment does nothing if segment does not exist', () => {

  });

  it('#unselectSegment does not emit an event', () => {

  });

  /*** #handleSelected ****/

  // TODO: include this in every test
  it('#handleSelected emits event with appropriate details', () => {

  });

  it('if single select, #handleSelected unselects segment if another segment was selected', () => {

  });

  it('if single select, #handleSelected reselects segment if it was unselected', () => {

  });

  it('if multi select, #handleSelected changes nothing if segment is selected', () => {

  });

  //? tests ability to unselect everything...this is not an obscure nor problematic edge case
  it('if multi select, #handleSelected changes nothing if segment is unselected', () => {

  });
});
