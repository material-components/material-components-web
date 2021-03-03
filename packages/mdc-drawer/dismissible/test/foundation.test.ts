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


import {getFixture} from '../../../../testing/dom';
import {verifyDefaultAdapter} from '../../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';
import {cssClasses, strings} from '../../constants';
import {MDCDismissibleDrawerFoundation} from '../foundation';

describe('MDCDismissibleDrawerFoundation', () => {
  setUpMdcTestEnvironment();

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCDismissibleDrawerFoundation);
    return {foundation, mockAdapter};
  };

  it('exports strings', () => {
    expect('strings' in MDCDismissibleDrawerFoundation).toBe(true);
    expect(MDCDismissibleDrawerFoundation.strings).toEqual(strings);
  });

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCDismissibleDrawerFoundation).toBe(true);
    expect(MDCDismissibleDrawerFoundation.cssClasses).toEqual(cssClasses);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCDismissibleDrawerFoundation, [
      'hasClass',
      'addClass',
      'removeClass',
      'elementHasClass',
      'saveFocus',
      'restoreFocus',
      'focusActiveNavigationItem',
      'notifyClose',
      'notifyOpen',
      'trapFocus',
      'releaseFocus',
    ]);
  });

  it('#destroy cancels pending rAF for #open', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.destroy();

    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPENING);
  });

  it('#destroy cancels pending setTimeout for #open', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    jasmine.clock().tick(1);
    foundation.destroy();

    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPENING);
  });

  it('#open does nothing if drawer is already open', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(true);
    foundation.open();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(jasmine.any(String));
  });

  it('#open does nothing if drawer is already opening', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPENING).and.returnValue(true);
    foundation.open();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(jasmine.any(String));
  });

  it('#open does nothing if drawer is closing', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.CLOSING).and.returnValue(true);
    foundation.open();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(jasmine.any(String));
  });

  it('#open adds appropriate classes and saves focus', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    jasmine.clock().tick(50);

    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPEN);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.ANIMATE);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPENING);
    expect(mockAdapter.saveFocus).toHaveBeenCalledTimes(1);
  });

  it('#close does nothing if drawer is already closed', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(false);
    foundation.close();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(jasmine.any(String));
  });

  it('#close does nothing if drawer is opening', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPENING).and.returnValue(true);
    foundation.close();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(jasmine.any(String));
  });

  it('#close does nothing if drawer is closing', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.CLOSING).and.returnValue(true);
    foundation.close();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(jasmine.any(String));
  });

  it('#close adds appropriate classes', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(true);
    foundation.close();

    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSING);
  });

  it(`#isOpen returns true when it has ${cssClasses.OPEN} class`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(true);
    expect(foundation.isOpen()).toBe(true);
  });

  it(`#isOpen returns false when it lacks ${cssClasses.OPEN} class`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(false);
    expect(foundation.isOpen()).toBe(false);
  });

  it(`#isOpening returns true when it has ${cssClasses.OPENING} class`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.ANIMATE).and.returnValue(true);
    mockAdapter.hasClass.withArgs(cssClasses.OPENING).and.returnValue(true);
    expect(foundation.isOpening()).toBe(true);
  });

  it('#isOpening returns true when drawer just start animate', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.ANIMATE).and.returnValue(true);
    mockAdapter.hasClass.withArgs(cssClasses.OPENING).and.returnValue(false);
    expect(foundation.isOpening()).toBe(true);
  });

  it(`#isOpening returns false when it lacks ${cssClasses.OPENING} class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.ANIMATE).and.returnValue(false);
       mockAdapter.hasClass.withArgs(cssClasses.OPENING).and.returnValue(false);
       expect(foundation.isOpening()).toBe(false);
     });

  it(`#isClosing returns true when it has ${cssClasses.CLOSING} class`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.CLOSING).and.returnValue(true);
    expect(foundation.isClosing()).toBe(true);
  });

  it(`#isClosing returns false when it lacks ${cssClasses.CLOSING} class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.CLOSING).and.returnValue(false);
       expect(foundation.isClosing()).toBe(false);
     });

  it('#handleKeydown does nothing when event key is not the escape key', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(true);
    foundation.handleKeydown({key: 'Shift'} as KeyboardEvent);

    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.CLOSING);
  });

  it('#handleKeydown does nothing when event keyCode is not 27', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(true);
    foundation.handleKeydown({keyCode: 11} as KeyboardEvent);

    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.CLOSING);
  });

  it('#handleKeydown calls close when event key is the escape key', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(true);
    foundation.handleKeydown({key: 'Escape'} as KeyboardEvent);

    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSING);
  });

  it('#handleKeydown calls close when event keyCode is 27', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(true);
    foundation.handleKeydown({keyCode: 27} as KeyboardEvent);

    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSING);
  });

  it('#handleTransitionEnd removes all animating classes', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEventTarget = getFixture(`<div class="foo">bar</div>`);
    mockAdapter.elementHasClass.withArgs(mockEventTarget, cssClasses.ROOT)
        .and.returnValue(true);
    foundation.handleTransitionEnd(
        {target: mockEventTarget} as unknown as TransitionEvent);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.ANIMATE);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPENING);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.CLOSING);
  });

  it('#handleTransitionEnd removes open class after closing, restores the focus and calls notifyClose',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEventTarget = getFixture(`<div>root</div>`);
       mockAdapter.elementHasClass.withArgs(mockEventTarget, cssClasses.ROOT)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.CLOSING).and.returnValue(true);

       foundation.handleTransitionEnd(
           {target: mockEventTarget} as unknown as TransitionEvent);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPEN);
       expect(mockAdapter.restoreFocus).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifyClose).toHaveBeenCalledTimes(1);
     });

  it(`#handleTransitionEnd doesn\'t remove open class after opening,
    focuses on active navigation item and calls notifyOpen`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEventTarget = getFixture(`<div>root</div>`);
       mockAdapter.elementHasClass.withArgs(mockEventTarget, cssClasses.ROOT)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.CLOSING).and.returnValue(false);

       foundation.handleTransitionEnd(
           {target: mockEventTarget} as unknown as TransitionEvent);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.OPEN);
       expect(mockAdapter.focusActiveNavigationItem).toHaveBeenCalledTimes(1);
       expect(mockAdapter.notifyOpen).toHaveBeenCalledTimes(1);
     });

  it('#handleTransitionEnd doesn\'t do anything if event is not triggered by root element',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEventTarget = getFixture(`<div>child</div>`);
       mockAdapter.elementHasClass.withArgs(mockEventTarget, cssClasses.ROOT)
           .and.returnValue(false);

       foundation.handleTransitionEnd(
           {target: mockEventTarget} as unknown as TransitionEvent);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.OPEN);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.ANIMATE);
       expect(mockAdapter.notifyOpen).not.toHaveBeenCalled();
       expect(mockAdapter.notifyClose).not.toHaveBeenCalled();
     });

  it('#handleTransitionEnd doesn\'t do anything if event is emitted with a non-element target',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleTransitionEnd({target: {}} as TransitionEvent);
       expect(mockAdapter.elementHasClass)
           .not.toHaveBeenCalledWith(jasmine.anything(), jasmine.any(String));
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.OPEN);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.ANIMATE);
       expect(mockAdapter.notifyOpen).not.toHaveBeenCalled();
       expect(mockAdapter.notifyClose).not.toHaveBeenCalled();
     });

  it('#handleTransitionEnd restores the focus.', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEventTarget = getFixture(`<div class="foo">bar</div>`);

    mockAdapter.elementHasClass.withArgs(mockEventTarget, cssClasses.ROOT)
        .and.returnValue(true);
    mockAdapter.hasClass.withArgs(cssClasses.CLOSING).and.returnValue(true);
    foundation.handleTransitionEnd(
        {target: mockEventTarget} as unknown as TransitionEvent);

    expect(mockAdapter.restoreFocus).toHaveBeenCalled();
  });
});
