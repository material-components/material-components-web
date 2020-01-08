/**
 * @license
 * Copyright 2018 Google Inc.
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

import {setUpFoundationTest} from '../../testing/helpers/setup';
import {MDCSwitchFoundation} from '../../switch/foundation';

function setupTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCSwitchFoundation);
  return {foundation, mockAdapter};
}

describe('MDCSwitchFoundation', () => {
  it('exports cssClasses', () => {
    expect('cssClasses' in MDCSwitchFoundation).toBeTruthy();
  });

  it('exports strings', () => {
    expect('strings' in MDCSwitchFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    const {defaultAdapter} = MDCSwitchFoundation;
    const methods = Object.keys(defaultAdapter)
                        .filter((k) => typeof (defaultAdapter as any)[k] === 'function');

    expect(methods.length).toEqual(Object.keys(defaultAdapter).length);
    expect(methods).toEqual([
      'addClass', 'removeClass', 'setNativeControlChecked',
      'setNativeControlDisabled', 'setNativeControlAttr'
    ]);
    methods.forEach((m) => {
      expect(() => (defaultAdapter as any)[m]).not.toThrow();
    });
  });

  it('#setChecked updates the checked state', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setChecked(true);
    expect(mockAdapter.setNativeControlChecked).toHaveBeenCalledWith(true);

    foundation.setChecked(false);
    expect(mockAdapter.setNativeControlChecked).toHaveBeenCalledWith(false);
  });

  it('#setChecked adds mdc-switch--checked to the switch element when set to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setChecked(true);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCSwitchFoundation.cssClasses.CHECKED);
     });

  it('#setChecked removes mdc-switch--checked from the switch element when set to false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setChecked(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCSwitchFoundation.cssClasses.CHECKED);
     });

  it('#setDisabled updates the disabled state', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(true);
    expect(mockAdapter.setNativeControlDisabled).toHaveBeenCalledWith(true);

    foundation.setDisabled(false);
    expect(mockAdapter.setNativeControlDisabled).toHaveBeenCalledWith(false);
  });

  it('#setDisabled adds mdc-switch--disabled to the switch element when set to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setDisabled(true);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCSwitchFoundation.cssClasses.DISABLED);
     });

  it('#setDisabled removes mdc-switch--disabled from the switch element when set to false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setDisabled(false);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCSwitchFoundation.cssClasses.DISABLED);
     });

  it('#handleChange adds mdc-switch--checked to the switch when it is a checked state',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleChange({target: {checked: true}});
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCSwitchFoundation.cssClasses.CHECKED);
     });

  it('#handleChange removes mdc-switch--checked from the switch when it is an unchecked state',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleChange({target: {checked: false}});
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCSwitchFoundation.cssClasses.CHECKED);
     });
});
