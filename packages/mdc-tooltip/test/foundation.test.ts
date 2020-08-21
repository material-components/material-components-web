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

import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {AnchorBoundaryType, CssClasses, numbers, XPosition, YPosition} from '../constants';
import {MDCTooltipFoundation} from '../foundation';

const ESC_EVENTS = [
  {type: 'keydown', key: 'Escape', target: {}},
  {type: 'keydown', keyCode: 27, target: {}},
];

describe('MDCTooltipFoundation', () => {
  setUpMdcTestEnvironment();

  it('default adapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCTooltipFoundation, [
      'getAttribute',
      'setAttribute',
      'addClass',
      'hasClass',
      'removeClass',
      'setStyleProperty',
      'getViewportWidth',
      'getViewportHeight',
      'getTooltipSize',
      'getAnchorBoundingRect',
      'getAnchorAttribute',
      'isRTL',
      'registerDocumentEventHandler',
      'deregisterDocumentEventHandler',
      'notifyHidden',
    ]);
  });

  it('#show modifies tooltip element so it is shown', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-hidden', 'false');
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWING);
  });

  it('#show leaves aria-hidden="true" attribute on tooltips intended to be hidden from screenreader',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getAnchorAttribute.and.returnValue('id');

       foundation.show();
       expect(mockAdapter.setAttribute)
           .not.toHaveBeenCalledWith('aria-hidden', 'false');
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWING);
     });

  it('#show adds SHOWN and SHOWN_TRANSITION class after rAF', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-hidden', 'false');
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWN);
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);

    jasmine.clock().tick(1);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWN);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
  });

  it('#hide cancels a pending rAF', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    foundation.hide();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWING);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);

    jasmine.clock().tick(1);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWN);
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
  });

  it('#show registers click and keydown event listeners on the document',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.show();
       expect(mockAdapter.registerDocumentEventHandler)
           .toHaveBeenCalledWith('click', jasmine.any(Function));
       expect(mockAdapter.registerDocumentEventHandler)
           .toHaveBeenCalledWith('keydown', jasmine.any(Function));
     });

  it('#hide deregisters click and keydown event listeners on the document',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.show();
       foundation.hide();

       expect(mockAdapter.deregisterDocumentEventHandler)
           .toHaveBeenCalledWith('click', jasmine.any(Function));
       expect(mockAdapter.deregisterDocumentEventHandler)
           .toHaveBeenCalledWith('keydown', jasmine.any(Function));
     });

  it('#hide modifies tooltip element so it is hidden', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    foundation.hide();

    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-hidden', 'false');
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
  });

  it('#show only performs an action if tooltip is hidden', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    foundation.show();
    expect(mockAdapter.setAttribute).toHaveBeenCalledTimes(1);
    expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
  });

  it('#show cancels a pending hideTimeout', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    foundation.handleAnchorMouseLeave();
    expect(foundation.hideTimeout).not.toEqual(null);
    foundation.show();
    expect(foundation.hideTimeout).toEqual(null);

    jasmine.clock().tick(numbers.HIDE_DELAY_MS);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
  });

  it('#hide only performs an action if tooltip is shown', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.hide();

    expect(mockAdapter.setAttribute).not.toHaveBeenCalled();
    expect(mockAdapter.removeClass).not.toHaveBeenCalled();
  });

  it('#handleTransitionEnd removes the SHOWING, SHOWING_TRANSITION, HIDE, and HIDE_TRANSITION classes',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleTransitionEnd();

       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
     });

  it('#handleTransitionEnd after #hide sends notification that tooltip has been hidden',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.hasClass.and.returnValue(true);

       foundation.show();
       foundation.hide();
       foundation.handleTransitionEnd();

       expect(mockAdapter.hasClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.notifyHidden).toHaveBeenCalled();
     });

  it('#handleTransitionEnd after #show does not send notification that tooltip has been hidden',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);

       foundation.show();
       foundation.handleTransitionEnd();

       expect(mockAdapter.hasClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWING);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.notifyHidden).not.toHaveBeenCalled();
     });

  it('clears any in-progress animations befores starting a show animation',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);

       foundation.show();

       jasmine.clock().tick(1);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);

       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWN);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
     });

  it('clears any in-progress animations befores starting a hide animation',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);

       foundation.show();
       foundation.hide();

       jasmine.clock().tick(1);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);

       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
     });

  for (const evt of ESC_EVENTS) {
    it(`#handleKeydown(${evt}) hides tooltip`, () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(MDCTooltipFoundation);

      foundation.show();
      foundation.handleKeydown(evt);

      expect(foundation.hideTimeout).toEqual(null);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith('aria-hidden', 'true');
      expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
      expect(mockAdapter.addClass)
          .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
      expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
      expect(mockAdapter.removeClass)
          .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
      expect(mockAdapter.deregisterDocumentEventHandler)
          .toHaveBeenCalledWith('click', jasmine.any(Function));
      expect(mockAdapter.deregisterDocumentEventHandler)
          .toHaveBeenCalledWith('keydown', jasmine.any(Function));
    });
  }

  it('#handleKeydown does not hide the tooltip if the ESCAPE key was not pressed',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.hide = jasmine.createSpy('hide');

       foundation.show();
       foundation.handleKeydown({type: 'keydown', key: 'Space'});

       expect(mockAdapter.setAttribute).toHaveBeenCalledTimes(1);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
       expect(mockAdapter.deregisterDocumentEventHandler)
           .not.toHaveBeenCalled();
     });

  it('#handleClick hides the tooltip', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.show();
    foundation.handleClick();

    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-hidden', 'true');
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
    expect(mockAdapter.deregisterDocumentEventHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
    expect(mockAdapter.deregisterDocumentEventHandler)
        .toHaveBeenCalledWith('keydown', jasmine.any(Function));
  });

  it(`#handleAnchorMouseLeave hides the tooltip after a ${
         numbers.HIDE_DELAY_MS}ms delay`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.show();
       foundation.handleAnchorMouseLeave();
       expect(foundation.hideTimeout).not.toEqual(null);

       jasmine.clock().tick(numbers.HIDE_DELAY_MS);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(foundation.hideTimeout).toEqual(null);
     });

  it(`#handleAnchorBlur hides the tooltip immediately`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.show();
       foundation.handleAnchorBlur();

       expect(foundation.hideTimeout).toEqual(null);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);

       expect(foundation.hideTimeout).toEqual(null);
     });

  it(`#handleClick hides the tooltip immediately`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.show();
       foundation.handleClick();

       expect(foundation.hideTimeout).toEqual(null);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(foundation.hideTimeout).toEqual(null);
     });

  it('properly calculates tooltip position (START alignment)', () => {
    const anchorHeight = 35;
    const expectedTooltipHeight = anchorHeight + numbers.BOUNDED_ANCHOR_GAP;

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue({
      top: 0,
      bottom: anchorHeight,
      left: 32,
      right: 82,
      width: 50,
      height: anchorHeight
    });
    mockAdapter.getTooltipSize.and.returnValue({width: 100, height: 30});
    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipHeight}px`);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', `32px`);
  });

  it('properly calculates tooltip position (END alignment)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 400, right: 450, width: 50, height: 35};
    const expectedTooltipTop =
        anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
    const tooltipSize = {width: 100, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', `350px`);
  });

  it('properly calculates tooltip position (CENTER alignment)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, right: 200, width: 200, height: 35};
    const expectedTooltipTop =
        anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
    const tooltipSize = {width: 40, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', `80px`);
  });

  it('properly calculates tooltip position with an UNBOUNDED anchor', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, width: 200, height: 35};
    const expectedTooltipTop =
        anchorBoundingRect.height + numbers.UNBOUNDED_ANCHOR_GAP;
    const tooltipSize = {width: 40, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.setAnchorBoundaryType(AnchorBoundaryType.UNBOUNDED);
    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', `80px`);
  });

  it('allows users to specify the tooltip position (START alignment instead of CENTER)',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 35, left: 32, right: 232, width: 200, height: 35};
       const expectedTooltipTop =
           anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
       const tooltipSize = {width: 40, height: 30};

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportWidth.and.returnValue(500);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.setTooltipPosition({xPos: XPosition.START});
       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `32px`);
     });

  it('ignores user specification if positioning violates threshold (CENTER alignment instead of START)',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 35, left: 0, right: 200, width: 200, height: 35};
       const expectedTooltipTop =
           anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
       const tooltipSize = {width: 40, height: 30};

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportWidth.and.returnValue(500);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.setTooltipPosition({xPos: XPosition.START});
       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `80px`);
     });

  it('allows users to specify the tooltip position (END alignment instead of START)',
     () => {
       const anchorHeight = 35;
       const expectedTooltipHeight = anchorHeight + numbers.BOUNDED_ANCHOR_GAP;

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportWidth.and.returnValue(500);
       mockAdapter.getAnchorBoundingRect.and.returnValue({
         top: 0,
         bottom: anchorHeight,
         left: 0,
         right: 100,
         width: 100,
         height: anchorHeight
       });
       mockAdapter.getTooltipSize.and.returnValue({width: 50, height: 30});

       foundation.setTooltipPosition({xPos: XPosition.END});
       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipHeight}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `50px`);
     });

  it('properly calculates START tooltip position in RTL', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, right: 100, width: 100, height: 35};
    const expectedTooltipTop =
        anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
    const tooltipSize = {width: 50, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.isRTL.and.returnValue(true);

    foundation.setTooltipPosition({xPos: XPosition.START});
    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', `50px`);
  });

  it('properly calculates END tooltip position in RTL', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 32, right: 132, width: 100, height: 35};
    const expectedTooltipTop =
        anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
    const tooltipSize = {width: 50, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.isRTL.and.returnValue(true);

    foundation.setTooltipPosition({xPos: XPosition.END});
    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', `32px`);
  });

  it('positions tooltip within viewport if threshold cannot be maintained (x-axis)',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 35, left: 450, right: 500, width: 50, height: 35};
       const expectedTooltipTop =
           anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
       const tooltipSize = {width: 100, height: 30};

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportWidth.and.returnValue(500);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `400px`);
     });

  it('allows users to specify a position within viewport if threshold cannot be maintained (START alignment instead of CENTER)',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 35, left: 10, right: 60, width: 50, height: 35};
       const expectedTooltipTop =
           anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
       const tooltipSize = {width: 60, height: 30};

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportWidth.and.returnValue(500);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.setTooltipPosition({xPos: XPosition.START});
       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `10px`);
     });

  it('properly calculates tooltip y-position (ABOVE alignment)', () => {
    const anchorBoundingRect =
        {top: 100, bottom: 125, left: 10, right: 60, width: 50, height: 25};
    const tooltipSize = {width: 60, height: 20};
    const expectedTooltipTop = anchorBoundingRect.top -
        (numbers.BOUNDED_ANCHOR_GAP + tooltipSize.height);

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getViewportHeight.and.returnValue(300);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.setTooltipPosition({yPos: YPosition.ABOVE});
    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
  });

  it('properly calculates tooltip y-position (BELOW alignment)', () => {
    const anchorBoundingRect =
        {top: 100, bottom: 125, left: 10, right: 60, width: 50, height: 25};
    const tooltipSize = {width: 60, height: 20};
    const expectedTooltipTop =
        anchorBoundingRect.bottom + numbers.BOUNDED_ANCHOR_GAP;

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getViewportHeight.and.returnValue(300);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.setTooltipPosition({yPos: YPosition.BELOW});
    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
  });

  it('positions tooltip within viewport if threshold cannot be maintained (y-axis)',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 30, left: 450, right: 500, width: 50};
       const expectedTooltipTop =
           anchorBoundingRect.bottom + numbers.BOUNDED_ANCHOR_GAP;
       const tooltipSize = {width: 100, height: 30};

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportHeight.and.returnValue(70);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
     });

  it('ignores user specification if positioning violates threshold (BELOW alignment instead of ABOVE)',
     () => {
       const anchorBoundingRect =
           {top: 40, bottom: 70, left: 450, right: 500, width: 50};
       const tooltipSize = {width: 100, height: 30};
       const expectedTooltipTop =
           anchorBoundingRect.bottom + numbers.BOUNDED_ANCHOR_GAP;

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportHeight.and.returnValue(140);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.setTooltipPosition({yPos: YPosition.ABOVE});
       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
     });

  it('allows users to specify a position within viewport if threshold cannot be maintained (ABOVE alignment instead of BELOW)',
     () => {
       const anchorBoundingRect =
           {top: 40, bottom: 70, left: 450, right: 500, width: 50};
       const tooltipSize = {width: 100, height: 30};
       const expectedTooltipTop = anchorBoundingRect.top -
           (numbers.BOUNDED_ANCHOR_GAP + tooltipSize.height);

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportHeight.and.returnValue(120);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.setTooltipPosition({yPos: YPosition.ABOVE});
       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
     });

  it('#destroy cancels any pending callbacks, removes global event listeners, and removes all tooltip animation classes',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorMouseEnter();
       foundation.handleAnchorMouseLeave();
       foundation.destroy();

       jasmine.clock().tick(1);
       expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWN);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(foundation.hideTimeout).toEqual(null);

       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWING);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.deregisterDocumentEventHandler)
           .toHaveBeenCalledWith('click', jasmine.any(Function));
       expect(mockAdapter.deregisterDocumentEventHandler)
           .toHaveBeenCalledWith('keydown', jasmine.any(Function));
     });
});
