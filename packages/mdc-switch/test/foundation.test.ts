/**
 * @license
 * Copyright 2021 Google Inc.
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

import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {CssClasses} from '../constants';
import {MDCSwitchFoundation, MDCSwitchRenderFoundation} from '../foundation';

describe('MDCSwitchFoundation', () => {
  setUpMdcTestEnvironment();

  function setupTest() {
    return setUpFoundationTest(
        MDCSwitchFoundation,
        {state: {disabled: false, processing: false, selected: false}});
  }

  it('#destroy() removes state observers', () => {
    const {foundation} = setupTest();
    foundation.init();
    spyOn(foundation, 'unobserve').and.callThrough();
    foundation.destroy();
    expect(foundation.unobserve).toHaveBeenCalled();
  });

  it('#handleClick() toggles selected', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    foundation.handleClick();
    expect(mockAdapter.state.selected)
        .toBe(true, 'toggled from initial false to true');
    foundation.handleClick();
    expect(mockAdapter.state.selected).toBe(false);
  });

  it('#handleClick() does nothing when disabled', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    mockAdapter.state.disabled = true;
    foundation.handleClick();
    expect(mockAdapter.state.selected).toBe(false, 'should not toggle to true');
  });

  it('#stopProcessingIfDisabled() sets processing to false when disabling',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       mockAdapter.state.processing = true;
       mockAdapter.state.disabled = true;
       expect(mockAdapter.state.processing)
           .toBe(false, 'processing set to false when disabled = true');
     });

  it('#stopProcessingIfDisabled() disallows processing if already disabled',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       mockAdapter.state.disabled = true;
       mockAdapter.state.processing = true;
       expect(mockAdapter.state.processing)
           .toBe(
               false,
               'processing should be set back to false when already disabled');
     });

  it('#stopProcessingIfDisabled() allows processing if enabled', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    mockAdapter.state.processing = true;
    expect(mockAdapter.state.processing)
        .toBe(true, 'should be true when not disabled');
  });
});

describe('MDCSwitchRenderFoundation', () => {
  setUpMdcTestEnvironment();

  function setupTest() {
    return setUpFoundationTest(MDCSwitchRenderFoundation, {
      state: {disabled: false, processing: false, selected: false},
      addClass: () => {},
      hasClass: () => false,
      isDisabled: () => false,
      removeClass: () => false,
      setAriaChecked: () => {},
      setDisabled: () => {},
    });
  }

  it('#initFromDOM() sets selected if adapter has class', () => {
    const {foundation, mockAdapter} = setupTest();
    // TODO(b/183749291): remove explicit arg type when Jasmine is updated
    mockAdapter.hasClass.and.callFake(
        (name: CssClasses) => name === CssClasses.SELECTED);
    foundation.init();
    foundation.initFromDOM();
    expect(mockAdapter.state.selected).toBe(true);
  });

  it('#initFromDOM() ensures aria-checked is set in case it does not exist',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       foundation.initFromDOM();
       // Default selected is false, aria-checked should be false
       expect(mockAdapter.setAriaChecked).toHaveBeenCalledWith('false');
     });

  it('#initFromDOM() sets disabled from adapter.isDisabled', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isDisabled.and.returnValue(true);
    foundation.init();
    foundation.initFromDOM();
    expect(mockAdapter.state.disabled).toBe(true);
  });

  it('#initFromDOM() sets processing if adapter has class', () => {
    const {foundation, mockAdapter} = setupTest();
    // TODO(b/183749291): remove explicit arg type when Jasmine is updated
    mockAdapter.hasClass.and.callFake(
        (name: CssClasses) => name === CssClasses.PROCESSING);
    foundation.init();
    foundation.initFromDOM();
    expect(mockAdapter.state.processing).toBe(true);
  });

  it('#initFromDOM() stops processing if adapter is disabled and has processing class',
     () => {
       const {foundation, mockAdapter} = setupTest();
       // TODO(b/183749291): remove explicit arg type when Jasmine is updated
       mockAdapter.hasClass.and.callFake(
           (name: CssClasses) => name === CssClasses.PROCESSING);
       mockAdapter.isDisabled.and.returnValue(true);
       foundation.init();
       foundation.initFromDOM();
       expect(mockAdapter.state.processing)
           .toBe(
               false,
               'should not be processing if adapter.isDisabled() returns false');
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.PROCESSING);
     });

  it('#onDisabledChange() calls adapter.setDisabled when disabled changes',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       mockAdapter.state.disabled = true;
       expect(mockAdapter.setDisabled).toHaveBeenCalledWith(true);
     });

  it(`#onProcessingChange() updates ${
         CssClasses.PROCESSING} when processing changes`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       mockAdapter.state.processing = true;
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.PROCESSING);
       mockAdapter.state.processing = false;
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.PROCESSING);
     });

  it('#onSelectedChange() calls adapter.setAriaChecked when selected changes',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       mockAdapter.state.selected = true;
       expect(mockAdapter.setAriaChecked).toHaveBeenCalledWith('true');
       mockAdapter.state.selected = false;
       expect(mockAdapter.setAriaChecked).toHaveBeenCalledWith('false');
     });
});
