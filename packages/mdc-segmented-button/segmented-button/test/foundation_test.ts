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

import {verifyDefaultAdapter} from '../../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {cssClasses} from '../constants';
import {MDCSegmentedButtonFoundation} from '../foundation';

import {testIndices, testSegmentIds} from './constants';

describe('MDCSegmentedButtonFoundation', () => {
  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCSegmentedButtonFoundation, [
      'hasClass', 'getSegments', 'selectSegment', 'unselectSegment',
      'notifySelectedChange'
    ]);
  });

  const setupSingleSelectTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCSegmentedButtonFoundation);
    mockAdapter.hasClass.withArgs(cssClasses.SINGLE_SELECT)
        .and.returnValue(true);
    return {foundation, mockAdapter};
  };

  const setupMultiSelectTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCSegmentedButtonFoundation);
    mockAdapter.hasClass.withArgs(cssClasses.SINGLE_SELECT)
        .and.returnValue(false);
    return {foundation, mockAdapter};
  };

  const setupSegmentTest = (singleSelect: boolean = false) => {
    const {foundation, mockAdapter} =
        singleSelect ? setupSingleSelectTest() : setupMultiSelectTest();
    mockAdapter.getSegments.and.callFake(() => {
      const l = [];
      l[testIndices.UNSELECTED] = {
        'index': testIndices.UNSELECTED,
        'selected': false,
        'segmentId': testSegmentIds.UNSELECTED_SEGMENT_ID
      };
      l[testIndices.SELECTED] = {
        'index': testIndices.SELECTED,
        'selected': true,
        'segmentId': testSegmentIds.SELECTED_SEGMENT_ID
      };
      return l;
    });
    return {foundation, mockAdapter};
  };

  it('#unselectSegment does not emit an event', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    const selectedSegment = mockAdapter.getSegments()[testIndices.SELECTED];

    foundation.unselectSegment(selectedSegment.segmentId!);
    expect(mockAdapter.notifySelectedChange).toHaveBeenCalledTimes(0);
  });

  it('#getSelectedSegments returns selected segments', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    const selectedSegment = mockAdapter.getSegments()[testIndices.SELECTED];
    const selectedSegments = foundation.getSelectedSegments();

    expect(selectedSegments.length).toEqual(1);
    expect(selectedSegments[0].index).toEqual(selectedSegment.index);
    expect(selectedSegments[0].selected).toBeTruthy();
    expect(selectedSegments[0].segmentId).toEqual(selectedSegment.segmentId);
  });

  it('#selectSegment does not emit an event', () => {
    const {foundation, mockAdapter} = setupSegmentTest();
    const unselectedSegment = mockAdapter.getSegments()[testIndices.UNSELECTED];

    foundation.selectSegment(unselectedSegment.index);
    expect(mockAdapter.notifySelectedChange).toHaveBeenCalledTimes(0);
  });

  describe('Single selection', () => {
    it('#isSingleSelect returns true if single select', () => {
      const {foundation} = setupSegmentTest(true);
      expect(foundation.isSingleSelect()).toBeTruthy();
    });

    it('#handleSelected unselects segment if single select and another segment was selected',
       () => {
         const {foundation, mockAdapter} = setupSegmentTest(true);
         const newSelectedSegment =
             mockAdapter.getSegments()[testIndices.UNSELECTED];
         const newUnselectedSegment =
             mockAdapter.getSegments()[testIndices.SELECTED];
         newSelectedSegment.selected = true;

         foundation.handleSelected(newSelectedSegment);
         expect(mockAdapter.unselectSegment).toHaveBeenCalledTimes(1);
         if (typeof mockAdapter.unselectSegment.calls.mostRecent().args[0] ===
             'number') {
           expect(mockAdapter.unselectSegment)
               .toHaveBeenCalledWith(newUnselectedSegment.index);
         } else {
           expect(mockAdapter.unselectSegment)
               // TODO: Wait until b/208710526 is fixed, then remove this
               // autogenerated error suppression.
               //  @ts-ignore(go/unfork-jasmine-typings): Argument of type
               //  'string | undefined' is not assignable to parameter of type
               //  'Expected<string | number>'.
               .toHaveBeenCalledWith(newUnselectedSegment.segmentId);
         }
         expect(mockAdapter.notifySelectedChange)
             .toHaveBeenCalledWith(newSelectedSegment);
       });
  });

  describe('Multi selection', () => {
    it('#isSingleSelect returns false if multi select', () => {
      const {foundation} = setupSegmentTest();
      expect(foundation.isSingleSelect()).toBeFalsy();
    });

    it('#handleSelected changes nothing if multi select and segment is selected or unselected',
       () => {
         const {foundation, mockAdapter} = setupSegmentTest();
         const newUnselectedSegment =
             mockAdapter.getSegments()[testIndices.SELECTED];
         const newSelectedSegment =
             mockAdapter.getSegments()[testIndices.UNSELECTED];
         newUnselectedSegment.selected = false;
         newSelectedSegment.selected = true;

         foundation.handleSelected(newUnselectedSegment);
         expect(mockAdapter.selectSegment).toHaveBeenCalledTimes(0);
         expect(mockAdapter.unselectSegment).toHaveBeenCalledTimes(0);
         expect(mockAdapter.notifySelectedChange)
             .toHaveBeenCalledWith(newUnselectedSegment);

         foundation.handleSelected(newSelectedSegment);
         expect(mockAdapter.selectSegment).toHaveBeenCalledTimes(0);
         expect(mockAdapter.unselectSegment).toHaveBeenCalledTimes(0);
         expect(mockAdapter.notifySelectedChange)
             .toHaveBeenCalledWith(newSelectedSegment);
       });
  });

  describe('Segment selections by index', () => {
    it('#isSegmentSelected returns true if segment at index is selected',
       () => {
         const {foundation, mockAdapter} = setupSegmentTest();
         const selectedSegment =
             mockAdapter.getSegments()[testIndices.SELECTED];
         expect(foundation.isSegmentSelected(selectedSegment.index))
             .toBeTruthy();
       });

    it('#isSegmentSelected returns false if segment at index is not selected',
       () => {
         const {foundation, mockAdapter} = setupSegmentTest();
         const unselectedSegment =
             mockAdapter.getSegments()[testIndices.UNSELECTED];
         expect(foundation.isSegmentSelected(unselectedSegment.index))
             .toBeFalsy();
       });

    it('#isSegmentSelected returns false if no segment is at index', () => {
      const {foundation} = setupSegmentTest();
      expect(foundation.isSegmentSelected(testIndices.NOT_PRESENT)).toBeFalsy();
    });

    it('#selectSegment selects segment at index if it is unselected', () => {
      const {foundation, mockAdapter} = setupSegmentTest();
      const unselectedSegment =
          mockAdapter.getSegments()[testIndices.UNSELECTED];

      foundation.selectSegment(unselectedSegment.index);
      expect(mockAdapter.selectSegment)
          .toHaveBeenCalledWith(unselectedSegment.index);
    });

    it('#unselectSegment unselects segment at index if it is selected', () => {
      const {foundation, mockAdapter} = setupSegmentTest();
      const selectedSegment = mockAdapter.getSegments()[testIndices.SELECTED];

      foundation.unselectSegment(selectedSegment.index);
      expect(mockAdapter.unselectSegment)
          .toHaveBeenCalledWith(selectedSegment.index);
    });
  });

  describe('Segment selections by segmentId', () => {
    it('#isSegmentSelected returns true if segment with segmentId is selected',
       () => {
         const {foundation, mockAdapter} = setupSegmentTest();
         const selectedSegment =
             mockAdapter.getSegments()[testIndices.SELECTED];
         expect(foundation.isSegmentSelected(selectedSegment.segmentId))
             .toBeTruthy();
       });

    it('#isSegmentSelected returns false if segment with segmentId is not selected',
       () => {
         const {foundation, mockAdapter} = setupSegmentTest();
         const unselectedSegment =
             mockAdapter.getSegments()[testIndices.UNSELECTED];
         expect(foundation.isSegmentSelected(unselectedSegment.segmentId))
             .toBeFalsy();
       });

    it('#isSegmentSelected returns false if no segment has segmentId', () => {
      const {foundation} = setupSegmentTest();
      expect(
          foundation.isSegmentSelected(testSegmentIds.NOT_PRESENT_SEGMENT_ID))
          .toBeFalsy();
    });

    it('#selectSegment selects segment with segmentId if it is unselected',
       () => {
         const {foundation, mockAdapter} = setupSegmentTest();
         const unselectedSegment =
             mockAdapter.getSegments()[testIndices.UNSELECTED];

         foundation.selectSegment(unselectedSegment.segmentId!);
         expect(mockAdapter.selectSegment)
             // TODO: Wait until b/208710526 is fixed, then remove this
             // autogenerated error suppression.
             //  @ts-ignore(go/unfork-jasmine-typings): Argument of type 'string
             //  | undefined' is not assignable to parameter of type
             //  'Expected<string | number>'.
             .toHaveBeenCalledWith(unselectedSegment.segmentId);
       });

    it('#unselectSegment unselects segment with segmentId if it is selected',
       () => {
         const {foundation, mockAdapter} = setupSegmentTest();
         const selectedSegment =
             mockAdapter.getSegments()[testIndices.SELECTED];

         foundation.unselectSegment(selectedSegment.segmentId!);
         expect(mockAdapter.unselectSegment)
             // TODO: Wait until b/208710526 is fixed, then remove this
             // autogenerated error suppression.
             //  @ts-ignore(go/unfork-jasmine-typings): Argument of type 'string
             //  | undefined' is not assignable to parameter of type
             //  'Expected<string | number>'.
             .toHaveBeenCalledWith(selectedSegment.segmentId);
       });
  });
});
