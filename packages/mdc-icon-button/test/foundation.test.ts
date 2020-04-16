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


import {MDCIconButtonToggleFoundation} from '../../mdc-icon-button/foundation';
import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';

const {strings, cssClasses} = MDCIconButtonToggleFoundation;

describe('MDCIconButtonToggleFoundation', () => {
  it('exports strings', () => {
    expect('strings' in MDCIconButtonToggleFoundation).toBe(true);
  });

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCIconButtonToggleFoundation).toBe(true);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCIconButtonToggleFoundation, [
      'addClass',
      'removeClass',
      'hasClass',
      'getAttr',
      'setAttr',
      'notifyChange',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCIconButtonToggleFoundation);
    return {foundation, mockAdapter};
  };

  it(`#isOn is false if hasClass(${cssClasses.ICON_BUTTON_ON}) returns false`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.ICON_BUTTON_ON)
           .and.returnValue(false);
       expect(foundation.isOn()).toBe(false);
     });

  it(`#isOn is true if hasClass(${cssClasses.ICON_BUTTON_ON}) returns true`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.ICON_BUTTON_ON)
           .and.returnValue(true);
       expect(foundation.isOn()).toBe(true);
     });

  it('#handleClick calls #toggle', () => {
    const {foundation} = setupTest();
    foundation.init();
    foundation.toggle = jasmine.createSpy('');
    foundation.handleClick();
    expect(foundation.toggle).toHaveBeenCalledTimes(1);
  });

  it('#handleClick calls notifyChange', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.ICON_BUTTON_ON)
        .and.returnValue(true);
    foundation.init();
    foundation.handleClick();
    expect(mockAdapter.notifyChange).toHaveBeenCalledWith({isOn: true});
    expect(mockAdapter.notifyChange).toHaveBeenCalledTimes(1);
  });

  it('#toggle flips on', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    mockAdapter.hasClass.withArgs(cssClasses.ICON_BUTTON_ON)
        .and.returnValues(true, false);

    foundation.toggle();
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.ICON_BUTTON_ON);
    expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
    foundation.toggle();
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.ICON_BUTTON_ON);
    expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
  });

  it('#toggle accepts boolean argument denoting toggle state', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();

    foundation.toggle(false);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.ICON_BUTTON_ON);
    expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
    foundation.toggle(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.ICON_BUTTON_ON);
    expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
  });

  it('#toggle sets "aria-pressed" to true when toggled on', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.toggle(true);
    expect(mockAdapter.setAttr)
        .toHaveBeenCalledWith(strings.ARIA_PRESSED, 'true');
  });

  it('#toggle sets "aria-pressed" to false when toggled off', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.toggle(false);
    expect(mockAdapter.setAttr)
        .toHaveBeenCalledWith(strings.ARIA_PRESSED, 'false');
    expect(mockAdapter.setAttr).toHaveBeenCalledTimes(1);
  });

  describe('Variant with toggled aria label', () => {
    it('#init throws an error if `aria-label-on` and `aria-label-off` are ' +
           'set, but `aria-pressed` is also set',
       () => {
         const {foundation, mockAdapter} = setupTest();

         mockAdapter.getAttr.withArgs(strings.DATA_ARIA_LABEL_ON)
             .and.returnValue('on label');
         mockAdapter.getAttr.withArgs(strings.DATA_ARIA_LABEL_OFF)
             .and.returnValue('off label');
         mockAdapter.getAttr.withArgs(strings.ARIA_PRESSED)
             .and.returnValue('false');

         expect(foundation.init).toThrow();
       });

    it('#toggle sets aria label correctly when toggled on', () => {
      const {foundation, mockAdapter} = initWithToggledAriaLabel({isOn: false});

      mockAdapter.getAttr.withArgs(strings.DATA_ARIA_LABEL_ON)
          .and.returnValue('on label');
      mockAdapter.getAttr.withArgs(strings.DATA_ARIA_LABEL_OFF)
          .and.returnValue('off label');
      foundation.toggle(true);
      expect(mockAdapter.setAttr)
          .toHaveBeenCalledWith(strings.ARIA_LABEL, 'on label');
    });

    it('#toggle sets aria label correctly when toggled off', () => {
      const {foundation, mockAdapter} = initWithToggledAriaLabel({isOn: false});

      mockAdapter.getAttr.withArgs(strings.DATA_ARIA_LABEL_ON)
          .and.returnValue('on label');
      mockAdapter.getAttr.withArgs(strings.DATA_ARIA_LABEL_OFF)
          .and.returnValue('off label');
      foundation.toggle(false);
      expect(mockAdapter.setAttr)
          .toHaveBeenCalledWith(strings.ARIA_LABEL, 'off label');
    });

    const initWithToggledAriaLabel = ({isOn}: {isOn: boolean}) => {
      const {foundation, mockAdapter} = setupTest();

      mockAdapter.getAttr.withArgs(strings.DATA_ARIA_LABEL_ON)
          .and.returnValue('on label');
      mockAdapter.getAttr.withArgs(strings.DATA_ARIA_LABEL_OFF)
          .and.returnValue('off label');
      mockAdapter.getAttr.withArgs(strings.ARIA_PRESSED).and.returnValue(null);
      mockAdapter.hasClass.withArgs(cssClasses.ICON_BUTTON_ON)
          .and.returnValue(isOn);
      foundation.init();

      return {foundation, mockAdapter};
    };
  });
});
