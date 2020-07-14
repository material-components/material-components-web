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

import {MDCSegmentedButtonSegmentFoundation} from '../foundation';
import {verifyDefaultAdapter} from '../../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {cssClasses, strings} from '../constants';

describe('MDCSegmentedButtonSegmentFoundation', () => {
  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCSegmentedButtonSegmentFoundation, [
      'isSingleSelect',
      'getAttr',
      'setAttr',
      'addClass',
      'removeClass',
      'hasClass',
      'notifySelectedChange'
    ]);
  });

  const setupTest = (selected: boolean, singleSelect: boolean) => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCSegmentedButtonSegmentFoundation);
    mockAdapter.hasClass.withArgs(cssClasses.SELECTED).and.returnValue(selected);
    mockAdapter.isSingleSelect.and.returnValue(singleSelect);
    mockAdapter.getAttr.and.callFake((name: string) => {
      let is_selected = false;
      if ((singleSelect && name === strings.ARIA_PRESSED) ||
          (!singleSelect && name === strings.ARIA_CHECKED)) {
        return null;
      } else if (name === strings.ARIA_CHECKED) {
        is_selected = singleSelect;
      } else if (name === strings.ARIA_PRESSED) {
        is_selected = !singleSelect;
      }
      return (selected && is_selected) ? strings.TRUE : strings.FALSE;
    });

    // Need calls to mocked methods to change mocked state
    mockAdapter.addClass.and.callFake((cssClass: string) => {
      mockAdapter.hasClass.withArgs(cssClass).and.returnValue(true);
    });
    mockAdapter.removeClass.and.callFake((cssClass: string) => {
      mockAdapter.hasClass.withArgs(cssClass).and.returnValue(false);
    });
    mockAdapter.setAttr.and.callFake((name: string, value: string | null) => {
      mockAdapter.getAttr.withArgs(name).and.returnValue(value);
    });

    return {foundation, mockAdapter};
  };

  const setupSelectedTest = (singleSelect: boolean = false) => {
    return setupTest(true, singleSelect);
  };

  const setupUnselectedTest = (singleSelect: boolean = false) => {
    return setupTest(false, singleSelect);
  };

  it('#isSelected returns true if segment is selected', () => {
    const {foundation} = setupSelectedTest();
    expect(foundation.isSelected()).toBeTruthy();
  });

  it('#isSelected returns false if segment is unselected', () => {
    const {foundation} = setupUnselectedTest();
    expect(foundation.isSelected()).toBeFalsy();
  });

  it('#getSegmentId returns segment id', () => {
    const {foundation, mockAdapter} = setupSelectedTest();
    mockAdapter.getAttr.withArgs(strings.DATA_SEGMENT_ID).and.returnValue(strings.SEGMENT_ID);
    expect(foundation.getSegmentId()).toEqual(strings.SEGMENT_ID);
  });

  describe('Selection toggling', () => {
    it('#setSelected adds the `selected` css class and if singleSelect then sets aria-checked to true', () => {
      const {foundation, mockAdapter} = setupUnselectedTest(true);
      foundation.setSelected();

      expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.SELECTED);
      expect(mockAdapter.setAttr).toHaveBeenCalledWith(strings.ARIA_CHECKED, strings.TRUE);
    });

    it('#setSelected adds the `selected` css class and if not singleSelect then sets aria-pressed to true', () => {
      const {foundation, mockAdapter} = setupUnselectedTest();
      foundation.setSelected();

      expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.SELECTED);
      expect(mockAdapter.setAttr).toHaveBeenCalledWith(strings.ARIA_PRESSED, strings.TRUE);
    });

    it('#setUnselected removes the `selected` css class and if singleSelect then sets aria-checked to false', () => {
      const {foundation, mockAdapter} = setupSelectedTest(true);
      foundation.setUnselected();

      expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.SELECTED);
      expect(mockAdapter.setAttr).toHaveBeenCalledWith(strings.ARIA_CHECKED, strings.FALSE);
    });

    it('#setUnselected removes the `selected` css class and if not singleSelect then sets aria-pressed to false', () => {
      const {foundation, mockAdapter} = setupSelectedTest();
      foundation.setUnselected();

      expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.SELECTED);
      expect(mockAdapter.setAttr).toHaveBeenCalledWith(strings.ARIA_PRESSED, strings.FALSE);
    });
  });

  describe('Click handling', () => {
    it('#handleClick if singleSelect and previously unselected: selects segment, sets aria-checked to true, and notifies parent', () => {
      const {foundation, mockAdapter} = setupUnselectedTest(true);
      foundation.handleClick();

      expect(mockAdapter.hasClass(cssClasses.SELECTED)).toBeTruthy();
      expect(mockAdapter.getAttr(strings.ARIA_CHECKED)).toBeTruthy();
      expect(mockAdapter.notifySelectedChange).toHaveBeenCalledWith(true);
    });

    it('#handleClick if singleSelect and previously selected: changes nothing and notifies parent', () => {
      const {foundation, mockAdapter} = setupSelectedTest(true);
      foundation.handleClick();

      expect(mockAdapter.hasClass(cssClasses.SELECTED)).toBeTruthy();
      expect(mockAdapter.getAttr(strings.ARIA_CHECKED)).toBeTruthy();
      expect(mockAdapter.notifySelectedChange).toHaveBeenCalledWith(true);
    });

    it('#handleClick if not singleSelect and previously unselected: selects segment, sets aria-pressed to true, and notifies parent', () => {
      const {foundation, mockAdapter} = setupUnselectedTest();
      foundation.handleClick();

      expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.SELECTED);
      expect(mockAdapter.setAttr).toHaveBeenCalledWith(strings.ARIA_PRESSED, strings.TRUE);
      expect(mockAdapter.notifySelectedChange).toHaveBeenCalledWith(true);
    });

    it('#handleClick if not singleSelect and previously selected: unselects segment, sets aria-pressed to false, and notifies parent', () => {
      const {foundation, mockAdapter} = setupSelectedTest();
      foundation.handleClick();

      expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.SELECTED);
      expect(mockAdapter.setAttr).toHaveBeenCalledWith(strings.ARIA_PRESSED, strings.FALSE);
      expect(mockAdapter.notifySelectedChange).toHaveBeenCalledWith(false);
    });
  });
});
