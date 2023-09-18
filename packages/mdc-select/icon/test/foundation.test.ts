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
import {strings} from '../constants';
import {MDCSelectIconFoundation} from '../foundation';

describe('MDCSelectIconFoundation', () => {
  it('exports strings', () => {
    expect(MDCSelectIconFoundation.strings).toEqual(strings);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCSelectIconFoundation, [
      'getAttr',
      'setAttr',
      'removeAttr',
      'setContent',
      'registerInteractionHandler',
      'deregisterInteractionHandler',
      'notifyIconAction',
    ]);
  });

  const setupTest =
      () => {
        const {foundation, mockAdapter} =
            setUpFoundationTest(MDCSelectIconFoundation);
        return {foundation, mockAdapter};
      }

  it('#init adds event listeners', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();

    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('keydown', jasmine.any(Function));
  });

  it('#destroy removes event listeners', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.destroy();

    expect(mockAdapter.deregisterInteractionHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
    expect(mockAdapter.deregisterInteractionHandler)
        .toHaveBeenCalledWith('keydown', jasmine.any(Function));
  });

  it('#setDisabled sets icon tabindex to -1 and removes role when set to true if icon initially had a tabindex',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getAttr.withArgs('tabindex').and.returnValue('1');
       foundation.init();

       foundation.setDisabled(true);
       expect(mockAdapter.setAttr).toHaveBeenCalledWith('tabindex', '-1');
       expect(mockAdapter.removeAttr).toHaveBeenCalledWith('role');
     });

  it('#setDisabled does not change icon tabindex or role when set to true if icon initially had no tabindex',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getAttr.withArgs('tabindex').and.returnValue(null);
       foundation.init();

       foundation.setDisabled(true);
       expect(mockAdapter.setAttr)
           .not.toHaveBeenCalledWith('tabindex', jasmine.any(String));
       expect(mockAdapter.removeAttr).not.toHaveBeenCalledWith('role');
     });

  it('#setDisabled restores icon tabindex and role when set to false if icon initially had a tabindex',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const expectedTabIndex = '1';
       mockAdapter.getAttr.withArgs('tabindex')
           .and.returnValue(expectedTabIndex);
       foundation.init();

       foundation.setDisabled(false);
       expect(mockAdapter.setAttr)
           .toHaveBeenCalledWith('tabindex', expectedTabIndex);
       expect(mockAdapter.setAttr)
           .toHaveBeenCalledWith('role', strings.ICON_ROLE);
     });

  it('#setDisabled does not change icon tabindex or role when set to false if icon initially had no tabindex',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getAttr.withArgs('tabindex').and.returnValue(null);
       foundation.init();

       foundation.setDisabled(false);
       expect(mockAdapter.setAttr)
           .not.toHaveBeenCalledWith('tabindex', jasmine.any(String));
       expect(mockAdapter.setAttr)
           .not.toHaveBeenCalledWith('role', jasmine.any(String));
     });

  it('#setAriaLabel updates the aria-label', () => {
    const {foundation, mockAdapter} = setupTest();
    const ariaLabel = 'Test label';
    foundation.init();

    foundation.setAriaLabel(ariaLabel);
    expect(mockAdapter.setAttr).toHaveBeenCalledWith('aria-label', ariaLabel);
  });

  it('#setContent updates the text content', () => {
    const {foundation, mockAdapter} = setupTest();
    const content = 'test';
    foundation.init();

    foundation.setContent(content);
    expect(mockAdapter.setContent).toHaveBeenCalledWith(content);
  });

  it('on click notifies custom icon event', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = {
      target: {},
      type: 'click',
    };
    let click;

    mockAdapter.registerInteractionHandler
        .withArgs('click', jasmine.any(Function))
        .and.callFake((_eventType: string, handler: Function) => {
          click = handler;
        });

    foundation.init();
    (click as unknown as Function)(event);
    expect(mockAdapter.notifyIconAction).toHaveBeenCalled();
  });
});
