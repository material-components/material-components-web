/**
 * @license
 * Copyright 2019 Google Inc.
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

import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';
import {MDCTabFoundation} from '../foundation';

function setupTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCTabFoundation);
  return {foundation, mockAdapter};
}

describe('MDCTabFoundation', () => {
  it('exports cssClasses', () => {
    expect('cssClasses' in MDCTabFoundation).toBeTruthy();
  });

  it('exports strings', () => {
    expect('strings' in MDCTabFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCTabFoundation, [
      'addClass',
      'removeClass',
      'hasClass',
      'setAttr',
      'activateIndicator',
      'deactivateIndicator',
      'getOffsetLeft',
      'getOffsetWidth',
      'getContentOffsetLeft',
      'getContentOffsetWidth',
      'notifyInteracted',
      'focus',
      'isFocused',
    ]);
  });

  it('#activate adds mdc-tab--active class to the root element', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.activate();
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(MDCTabFoundation.cssClasses.ACTIVE);
  });

  it('#activate sets the root element aria-selected attribute to true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.activate();
    expect(mockAdapter.setAttr)
        .toHaveBeenCalledWith(MDCTabFoundation.strings.ARIA_SELECTED, 'true');
  });

  it('#activate sets the root element tabindex to 0', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.activate();
    expect(mockAdapter.setAttr)
        .toHaveBeenCalledWith(MDCTabFoundation.strings.TABINDEX, '0');
  });

  it('#activate activates the indicator', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.activate({width: 100, left: 200} as DOMRect);
    expect(mockAdapter.activateIndicator)
        .toHaveBeenCalledWith({width: 100, left: 200});
  });

  it('#activate focuses the root node by default', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.activate({width: 100, left: 200} as DOMRect);
    expect(mockAdapter.focus).toHaveBeenCalled();
  });

  it('#activate focuses the root node if focusOnActivate is true and it is not already focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setFocusOnActivate(true);
       foundation.activate({width: 100, left: 200} as DOMRect);
       expect(mockAdapter.focus).toHaveBeenCalled();
     });

  it('#activate does not focus the root node if focusOnActivate is false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setFocusOnActivate(false);
       foundation.activate({width: 100, left: 200} as DOMRect);
       expect(mockAdapter.focus).not.toHaveBeenCalled();
     });

  it('#activate does not focus the root node if focusOnActivate is true but it is already focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.isFocused.and.returnValue(true);
       foundation.activate({width: 100, left: 200} as DOMRect);
       expect(mockAdapter.focus).not.toHaveBeenCalled();
     });

  it('#deactivate does nothing if not active', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.deactivate();
    expect(mockAdapter.addClass).not.toHaveBeenCalled();
  });

  it('#deactivate removes mdc-tab--active class to the root element', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.and.returnValue(true);
    foundation.deactivate();
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(MDCTabFoundation.cssClasses.ACTIVE);
  });

  it('#deactivate sets the root element aria-selected attribute to false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.and.returnValue(true);
       foundation.deactivate();
       expect(mockAdapter.setAttr)
           .toHaveBeenCalledWith(
               MDCTabFoundation.strings.ARIA_SELECTED, 'false');
     });

  it('#deactivate deactivates the indicator', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.and.returnValue(true);
    foundation.deactivate();
    expect(mockAdapter.deactivateIndicator).toHaveBeenCalled();
  });

  it('#deactivate sets the root element tabindex to -1', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.and.returnValue(true);
    foundation.deactivate();
    expect(mockAdapter.setAttr)
        .toHaveBeenCalledWith(MDCTabFoundation.strings.TABINDEX, '-1');
  });

  it(`#handleClick emits the ${
         MDCTabFoundation.strings.INTERACTED_EVENT} event`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.handleClick();
       expect(mockAdapter.notifyInteracted).toHaveBeenCalled();
     });

  it('#computeDimensions() returns the dimensions of the tab', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getOffsetLeft.and.returnValue(10);
    mockAdapter.getOffsetWidth.and.returnValue(100);
    mockAdapter.getContentOffsetLeft.and.returnValue(11);
    mockAdapter.getContentOffsetWidth.and.returnValue(30);
    expect(foundation.computeDimensions()).toEqual({
      rootLeft: 10,
      rootRight: 110,
      contentLeft: 21,
      contentRight: 51,
    });
  });
});
