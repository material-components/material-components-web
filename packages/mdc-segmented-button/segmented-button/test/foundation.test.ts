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

  const SELECTED = 0;
  const UNSELECTED = 1;

  // const setupSegmentTest = (selected: boolean[], singleSelect: boolean = false) => {
  const setupSegmentTest = (singleSelect: boolean = false) => {
    const {foundation, mockAdapter} = singleSelect ? setupSingleSelectTest() : setupMultiSelectTest();
    mockAdapter.getSegments.and.returnValue([
      {
        'index': SELECTED,
        'selected': true,
        'segmentId': 'segment' + SELECTED
      }, {
        'index': UNSELECTED,
        'selected': false,
        'segmentId': 'segment' + UNSELECTED
      }
    ]);
    return {foundation, mockAdapter};
  }

  /*** #isSingleSelect ***/

  it('if single select, #isSingleSelect returns true', () => {
    const {foundation} = setupSingleSelectTest();
    expect(foundation.isSingleSelect()).toBeTruthy();
  });

  it('if multi select, #isSingleSelect returns false', () => {
    const {foundation} = setupMultiSelectTest();
    expect(foundation.isSingleSelect()).toBeFalsy();
  });


  /*** #isSegmentSelected ***/

  it('if segment at index is selected, #isSegmentSelected returns true', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let selectedSegment = mockAdapter.getSegments()[SELECTED];
    expect(foundation.isSegmentSelected(selectedSegment.index)).toBeTruthy();
  });

  it('if segment with segmentId is selected, #isSegmentSelected returns true', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let selectedSegment = mockAdapter.getSegments()[SELECTED];
    expect(foundation.isSegmentSelected(selectedSegment.segmentId)).toBeTruthy();
  });

  it('if segment at index is not selected, #isSegmentSelected returns false', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let unselectedSegment = mockAdapter.getSegments()[UNSELECTED];
    expect(foundation.isSegmentSelected(unselectedSegment.index)).toBeFalsy();
  });

  it('if segment with segmentId is not selected, #isSegmentSelected returns false', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let unselectedSegment = mockAdapter.getSegments()[UNSELECTED];
    expect(foundation.isSegmentSelected(unselectedSegment.segmentId)).toBeFalsy();
  });

  it('if no segment at index, #isSegmentSelected returns false', () => {
    const {foundation} = setupSegmentTest();
    expect(foundation.isSegmentSelected(-1)).toBeFalsy();
  });

  it('if no segment with segmentId, #isSegmentSelected returns false', () => {
    const {foundation} = setupSegmentTest();
    expect(foundation.isSegmentSelected('-1')).toBeFalsy();
  });

  /*** #getSelectedSegments ***/

  it('#getSelectedSegments returns selected segments', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let selectedSegment = mockAdapter.getSegments()[SELECTED];
    let selectedSegments = foundation.getSelectedSegments();
    
    expect(selectedSegments.length).toEqual(1);
    expect(selectedSegments[0].index).toEqual(selectedSegment.index);
    expect(selectedSegments[0].selected).toBeTruthy();
    expect(selectedSegments[0].segmentId).toEqual(selectedSegment.segmentId);
  });

  /*** #selectSegment ***/

  it('#selectSegment selects segment at index if it is unselected', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let unselectedSegment = mockAdapter.getSegments()[UNSELECTED];

    foundation.selectSegment(unselectedSegment.index);
    expect(mockAdapter.selectSegment).toHaveBeenCalledWith(unselectedSegment.index);
  });

  it('#selectSegment selects segment with segmentId if it is unselected', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let unselectedSegment = mockAdapter.getSegments()[UNSELECTED];

    foundation.selectSegment(unselectedSegment.segmentId);
    expect(mockAdapter.selectSegment).toHaveBeenCalledWith(unselectedSegment.segmentId);
  });

  it('#selectSegment does not emit an event', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let unselectedSegment = mockAdapter.getSegments()[UNSELECTED];

    foundation.selectSegment(unselectedSegment.index);
    expect(mockAdapter.notifySelectedChange).toHaveBeenCalledTimes(0);
  });

  /*** #unselectSegment ***/

  it('#unselectSegment unselects segment at index if it is selected', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let selectedSegment = mockAdapter.getSegments()[SELECTED];

    foundation.unselectSegment(selectedSegment.index);
    expect(mockAdapter.unselectSegment).toHaveBeenCalledWith(selectedSegment.index);
  });

  it('#unselectSegment unselects segment with segmentId if it is selected', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let selectedSegment = mockAdapter.getSegments()[SELECTED];

    foundation.unselectSegment(selectedSegment.segmentId);
    expect(mockAdapter.unselectSegment).toHaveBeenCalledWith(selectedSegment.segmentId);
  });

  it('#unselectSegment does not emit an event', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let selectedSegment = mockAdapter.getSegments()[SELECTED];

    foundation.unselectSegment(selectedSegment.segmentId);
    expect(mockAdapter.notifySelectedChange).toHaveBeenCalledTimes(0);
  });

  /*** #handleSelected ****/

  it('if single select, #handleSelected unselects segment if another segment was selected', () => {
    const {foundation, mockAdapter} = setupSegmentTest(true);
    let newSelectedSegment = mockAdapter.getSegments()[UNSELECTED];
    let newUnselectedSegment = mockAdapter.getSegments()[SELECTED];
    newSelectedSegment.selected = true;

    foundation.handleSelected(newSelectedSegment);
    expect(mockAdapter.unselectSegment).toHaveBeenCalledTimes(1);
    if (typeof mockAdapter.unselectSegment.calls.mostRecent().args[0] === 'number') {
      expect(mockAdapter.unselectSegment).toHaveBeenCalledWith(newUnselectedSegment.index);
    } else {
      expect(mockAdapter.unselectSegment).toHaveBeenCalledWith(newUnselectedSegment.segmentId);
    }
    expect(mockAdapter.notifySelectedChange).toHaveBeenCalledWith(newSelectedSegment);
  });

  it('if single select, #handleSelected reselects segment if it was unselected', () => {
    const {foundation, mockAdapter} = setupSegmentTest(true);
    let newUnselectedSegment = mockAdapter.getSegments()[SELECTED];
    newUnselectedSegment.selected = false;

    foundation.handleSelected(newUnselectedSegment);
    expect(mockAdapter.selectSegment).toHaveBeenCalledTimes(1);
    if (typeof mockAdapter.selectSegment.calls.mostRecent().args[0] === 'number') {
      expect(mockAdapter.selectSegment).toHaveBeenCalledWith(newUnselectedSegment.index);
    } else {
      expect(mockAdapter.selectSegment).toHaveBeenCalledWith(newUnselectedSegment.segmentId);
    }
    expect(mockAdapter.notifySelectedChange).toHaveBeenCalledWith(newUnselectedSegment);
  });

  it('if multi select, #handleSelected changes nothing if segment is selected or unselected', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    let newUnselectedSegment = mockAdapter.getSegments()[SELECTED];
    let newSelectedSegment = mockAdapter.getSegments()[UNSELECTED];
    newUnselectedSegment.selected = false;
    newSelectedSegment.selected = true;

    foundation.handleSelected(newUnselectedSegment);
    expect(mockAdapter.selectSegment).toHaveBeenCalledTimes(0);
    expect(mockAdapter.unselectSegment).toHaveBeenCalledTimes(0);
    expect(mockAdapter.notifySelectedChange).toHaveBeenCalledWith(newUnselectedSegment);

    foundation.handleSelected(newSelectedSegment);
    expect(mockAdapter.selectSegment).toHaveBeenCalledTimes(0);
    expect(mockAdapter.unselectSegment).toHaveBeenCalledTimes(0);
    expect(mockAdapter.notifySelectedChange).toHaveBeenCalledWith(newSelectedSegment);
  });
});
