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

import {createKeyboardEvent, createMouseEvent, emitEvent} from '../../../testing/dom/events';
import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {MDCTooltipAdapter} from '../adapter';
import {AnchorBoundaryType, attributes, CssClasses, numbers, PositionWithCaret, XPosition, YPosition} from '../constants';
import {MDCTooltipFoundation} from '../foundation';

const CARET_WIDTH = 24;
const CARET_HEIGHT = 32;
const RICH_TOOLTIP_WIDTH = '300px';
const RICH_TOOLTIP_HEIGHT = '140px';
const CARET_POSITION_STYLES = new Map([
  [
    PositionWithCaret.ABOVE_START, {
      yAlignment: 'bottom',
      xAlignment: 'left',
      yAxisPx: '0',
      xAxisPx: `${numbers.CARET_INDENTATION}px`,
      rotation: 35,
      skew: 20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: `${numbers.CARET_INDENTATION}px`,
      yTransformOrigin: RICH_TOOLTIP_HEIGHT,
    }
  ],
  [
    PositionWithCaret.ABOVE_CENTER, {
      yAlignment: 'bottom',
      xAlignment: 'left',
      yAxisPx: '0',
      xAxisPx: `calc((${RICH_TOOLTIP_WIDTH} - ${
          CARET_WIDTH / numbers.ANIMATION_SCALE}px) / 2)`,
      rotation: 35,
      skew: 20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: `calc((${RICH_TOOLTIP_WIDTH} - ${
          CARET_WIDTH / numbers.ANIMATION_SCALE}px) / 2)`,
      yTransformOrigin: RICH_TOOLTIP_HEIGHT,

    }
  ],
  [
    PositionWithCaret.ABOVE_END, {
      yAlignment: 'bottom',
      xAlignment: 'right',
      yAxisPx: '0',
      xAxisPx: `${numbers.CARET_INDENTATION}px`,
      rotation: -35,
      skew: -20,
      scaleX: 0.9396926207859084,
      xTransformOrigin:
          `calc(${RICH_TOOLTIP_WIDTH} - ${numbers.CARET_INDENTATION}px)`,
      yTransformOrigin: RICH_TOOLTIP_HEIGHT,
    }
  ],
  [
    PositionWithCaret.TOP_SIDE_START, {
      yAlignment: 'top',
      xAlignment: 'right',
      yAxisPx: `${numbers.CARET_INDENTATION}px`,
      xAxisPx: '0',
      rotation: -55,
      skew: 20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: RICH_TOOLTIP_WIDTH,
      yTransformOrigin: `${numbers.CARET_INDENTATION}px`,

    }
  ],
  [
    PositionWithCaret.CENTER_SIDE_START, {
      yAlignment: 'top',
      xAlignment: 'right',
      yAxisPx: `calc((${RICH_TOOLTIP_HEIGHT} - ${
          CARET_WIDTH / numbers.ANIMATION_SCALE}px) / 2)`,
      xAxisPx: '0',
      rotation: -55,
      skew: 20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: RICH_TOOLTIP_WIDTH,
      yTransformOrigin: `calc((${RICH_TOOLTIP_HEIGHT} - ${
          CARET_WIDTH / numbers.ANIMATION_SCALE}px) / 2)`,
    }
  ],
  [
    PositionWithCaret.BOTTOM_SIDE_START, {
      yAlignment: 'bottom',
      xAlignment: 'right',
      yAxisPx: `${numbers.CARET_INDENTATION}px`,
      xAxisPx: '0',
      rotation: 55,
      skew: -20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: RICH_TOOLTIP_WIDTH,
      yTransformOrigin:
          `calc(${RICH_TOOLTIP_HEIGHT} - ${numbers.CARET_INDENTATION}px)`,
    }
  ],
  [
    PositionWithCaret.TOP_SIDE_END, {
      yAlignment: 'top',
      xAlignment: 'left',
      yAxisPx: `${numbers.CARET_INDENTATION}px`,
      xAxisPx: '0',
      rotation: 55,
      skew: -20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: 0,
      yTransformOrigin: `${numbers.CARET_INDENTATION}px`,

    }
  ],
  [
    PositionWithCaret.CENTER_SIDE_END, {
      yAlignment: 'top',
      xAlignment: 'left',
      yAxisPx: `calc((${RICH_TOOLTIP_HEIGHT} - ${
          CARET_WIDTH / numbers.ANIMATION_SCALE}px) / 2)`,
      xAxisPx: '0',
      rotation: 55,
      skew: -20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: 0,
      yTransformOrigin: `calc((${RICH_TOOLTIP_HEIGHT} - ${
          CARET_WIDTH / numbers.ANIMATION_SCALE}px) / 2)`,

    }
  ],
  [
    PositionWithCaret.BOTTOM_SIDE_END, {
      yAlignment: 'bottom',
      xAlignment: 'left',
      yAxisPx: `${numbers.CARET_INDENTATION}px`,
      xAxisPx: '0',
      rotation: -55,
      skew: 20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: 0,
      yTransformOrigin:
          `calc(${RICH_TOOLTIP_HEIGHT} - ${numbers.CARET_INDENTATION}px)`,

    }
  ],
  [
    PositionWithCaret.BELOW_START, {
      yAlignment: 'top',
      xAlignment: 'left',
      yAxisPx: '0',
      xAxisPx: `${numbers.CARET_INDENTATION}px`,
      rotation: -35,
      skew: -20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: `${numbers.CARET_INDENTATION}px`,
      yTransformOrigin: 0,

    }
  ],
  [
    PositionWithCaret.BELOW_CENTER, {
      yAlignment: 'top',
      xAlignment: 'left',
      yAxisPx: '0',
      xAxisPx: `calc((${RICH_TOOLTIP_WIDTH} - ${
          CARET_WIDTH / numbers.ANIMATION_SCALE}px) / 2)`,
      rotation: -35,
      skew: -20,
      scaleX: 0.9396926207859084,
      xTransformOrigin: `calc((${RICH_TOOLTIP_WIDTH} - ${
          CARET_WIDTH / numbers.ANIMATION_SCALE}px) / 2)`,
      yTransformOrigin: 0,

    }
  ],
  [
    PositionWithCaret.BELOW_END, {
      yAlignment: 'top',
      xAlignment: 'right',
      yAxisPx: '0',
      xAxisPx: `${numbers.CARET_INDENTATION}px`,
      rotation: 35,
      skew: 20,
      scaleX: 0.9396926207859084,
      xTransformOrigin:
          `calc(${RICH_TOOLTIP_WIDTH} - ${numbers.CARET_INDENTATION}px)`,
      yTransformOrigin: 0,
    }
  ]
]);
const CARET_POSITION_STYLES_RTL = new Map([
  [
    PositionWithCaret.BELOW_START, {
      yAlignment: 'top',
      xAlignment: 'right',
      yAxisPx: '0',
      xAxisPx: `${numbers.CARET_INDENTATION}px`,
      rotation: 35,
      skew: 20,
      scaleX: 0.9396926207859084,
      xTransformOrigin:
          `calc(${RICH_TOOLTIP_WIDTH} - ${numbers.CARET_INDENTATION}px)`,
      yTransformOrigin: 0,

    }
  ],
]);

// Constant for the animationFrame mock found in setUpMdcTestEnvironment
const ANIMATION_FRAME = 1;

// This function assumes that the foundation has already been initialized for
// interactive rich tooltips. If isRich and isInteractive have not been
// initialized, the checks for interactive rich tooltips will not be called.
function expectTooltipToHaveBeenShown(
    foundation: MDCTooltipFoundation,
    mockAdapter: jasmine.SpyObj<MDCTooltipAdapter>) {
  if (foundation.isRich() && foundation['interactiveTooltip']) {
    expect(mockAdapter.setAnchorAttribute)
        .toHaveBeenCalledWith('aria-expanded', 'true');
  }

  expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
  expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWING);
}

// This function assumes that the foundation has already been initialized for
// interactive rich tooltips. If isRich and isInteractive have not been
// initialized, the checks for interactive rich tooltips will not be called.
function expectTooltipToHaveBeenHidden(
    foundation: MDCTooltipFoundation,
    mockAdapter: jasmine.SpyObj<MDCTooltipAdapter>) {
  if (foundation.isRich() && foundation['interactiveTooltip']) {
    expect(mockAdapter.setAnchorAttribute)
        .toHaveBeenCalledWith('aria-expanded', 'false');
  }

  expect(mockAdapter.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
  expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
  expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
  expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
}

// This function assumes that the foundation has already been initialized for
// interactive rich tooltips. If isRich and isInteractive have not been
// initialized, the checks for interactive rich tooltips will not be called.
function expectTooltipNotToHaveBeenHidden(
    foundation: MDCTooltipFoundation,
    mockAdapter: jasmine.SpyObj<MDCTooltipAdapter>) {
  if (foundation.isRich() && foundation['interactiveTooltip']) {
    expect(mockAdapter.setAnchorAttribute)
        .not.toHaveBeenCalledWith('aria-expanded', 'false');
  }

  expect(mockAdapter.setAttribute)
      .not.toHaveBeenCalledWith('aria-hidden', 'true');
  expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
  expect(mockAdapter.addClass)
      .not.toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
  expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(CssClasses.SHOWN);
}

function setUpFoundationTestForRichTooltip(
    tooltipFoundation: typeof MDCTooltipFoundation,
    {isInteractive, isPersistent, hasCaret}:
        {isInteractive?: boolean,
         isPersistent?: boolean,
         hasCaret?: boolean} = {}) {
  const {foundation, mockAdapter} = setUpFoundationTest(tooltipFoundation);

  mockAdapter.hasClass.withArgs(CssClasses.RICH).and.returnValue(true);
  mockAdapter.getAttribute.withArgs(attributes.PERSISTENT)
      .and.returnValue(isPersistent ? 'true' : 'false');
  mockAdapter.getAnchorAttribute.withArgs(attributes.ARIA_EXPANDED)
      .and.returnValue(isInteractive ? 'false' : null);
  mockAdapter.getAnchorAttribute.withArgs(attributes.ARIA_HASPOPUP)
      .and.returnValue(isInteractive ? 'dialog' : 'false');
  mockAdapter.getAttribute.withArgs(attributes.HAS_CARET)
      .and.returnValue(hasCaret ? 'true' : 'false');
  mockAdapter.isInstanceOfElement.and.returnValue(true);

  foundation.init();

  return {foundation, mockAdapter};
}

describe('MDCTooltipFoundation', () => {
  setUpMdcTestEnvironment();

  it('default adapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCTooltipFoundation, [
      'getAttribute',
      'setAttribute',
      'removeAttribute',
      'addClass',
      'hasClass',
      'removeClass',
      'getComputedStyleProperty',
      'setStyleProperty',
      'setSurfaceAnimationStyleProperty',
      'getViewportWidth',
      'getViewportHeight',
      'getTooltipSize',
      'getAnchorBoundingRect',
      'getParentBoundingRect',
      'getAnchorAttribute',
      'setAnchorAttribute',
      'isRTL',
      'anchorContainsElement',
      'tooltipContainsElement',
      'focusAnchorElement',
      'registerEventHandler',
      'deregisterEventHandler',
      'registerAnchorEventHandler',
      'deregisterAnchorEventHandler',
      'registerDocumentEventHandler',
      'deregisterDocumentEventHandler',
      'registerWindowEventHandler',
      'deregisterWindowEventHandler',
      'notifyHidden',
      'notifyShown',
      'getTooltipCaretBoundingRect',
      'setTooltipCaretStyle',
      'clearTooltipCaretStyles',
      'getActiveElement',
      'isInstanceOfElement',
    ]);
  });

  it('#isRich returns false for plain tooltip', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.hasClass.withArgs(CssClasses.RICH).and.returnValue(false);
    foundation.init();

    expect(foundation.isRich()).toBeFalse();
  });

  it('#isRich returns true for rich tooltip', () => {
    const {foundation} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    expect(foundation.isRich()).toBeTrue();
  });

  it('#isPersistent returns false for default rich tooltip', () => {
    const {foundation} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    expect(foundation.isPersistent()).toBeFalse();
  });

  it('#isPersistent returns true for persistent rich tooltip', () => {
    const {foundation} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {isPersistent: true});

    expect(foundation.isPersistent()).toBeTrue();
  });

  it('#isShown returns true if the tooltip is currently shown', () => {
    const {foundation} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();

    expect(foundation.isShown()).toBeTrue();
  });

  it('#isShown returns false if the tooltip is currently hidden', () => {
    const {foundation} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    foundation.hide();

    expect(foundation.isShown()).toBeFalse();
  });

  it('#show modifies tooltip element so it is shown', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWING);
  });

  it('#show does not set aria-expanded="true" on anchor element for non-interactive rich tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();

       expect(mockAdapter.setAnchorAttribute)
           .not.toHaveBeenCalledWith('aria-expanded', 'true');
     });

  it('#show sets aria-expanded="true" on anchor element for interactive rich tooltip',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isInteractive: true});

       foundation.show();

       expect(mockAdapter.setAnchorAttribute)
           .toHaveBeenCalledWith('aria-expanded', 'true');
     });

  it('#show adds SHOWN and SHOWN_TRANSITION class after rAF', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
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

  it('#show registers mouseenter event listener on the tooltip for rich tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();

       expect(mockAdapter.registerEventHandler)
           .toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
     });

  it('#show registers mouseleave event listener on the tooltip for rich tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();

       expect(mockAdapter.registerEventHandler)
           .toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
     });

  it('#hide deregisters mouseenter event listeners on the tooltip for rich tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       foundation.hide();

       expect(mockAdapter.deregisterEventHandler)
           .toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
     });

  it('#hide deregisters mouseleave event listeners on the tooltip for rich tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       foundation.hide();

       expect(mockAdapter.deregisterEventHandler)
           .toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
     });


  it('#show registers blur event listener on the anchor element', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.show();

    expect(mockAdapter.registerAnchorEventHandler)
        .toHaveBeenCalledWith('blur', jasmine.any(Function));
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

  it('#hide deregisters blur event listeners on the anchor', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.show();
    foundation.hide();

    expect(mockAdapter.deregisterAnchorEventHandler)
        .toHaveBeenCalledWith('blur', jasmine.any(Function));
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

  it('#show registers scroll and resize event listeners on the window', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    expect(mockAdapter.registerWindowEventHandler)
        .toHaveBeenCalledWith('scroll', jasmine.any(Function));
    expect(mockAdapter.registerWindowEventHandler)
        .toHaveBeenCalledWith('resize', jasmine.any(Function));
  });

  it('#hide deregisters scroll and resize event listeners on the window',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.show();
       foundation.hide();

       expect(mockAdapter.deregisterWindowEventHandler)
           .toHaveBeenCalledWith('scroll', jasmine.any(Function));
       expect(mockAdapter.deregisterWindowEventHandler)
           .toHaveBeenCalledWith('resize', jasmine.any(Function));
     });

  it('#hide modifies tooltip element so it is hidden', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    foundation.hide();

    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
  });

  it('#show only performs an action if tooltip is hidden', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    foundation.show();
    expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
  });

  it('#show cancels a pending hideTimeout', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    foundation.handleAnchorMouseLeave();
    expect((foundation as any).hideTimeout).not.toEqual(null);
    foundation.show();
    expect((foundation as any).hideTimeout).toEqual(null);

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
       expect(mockAdapter.notifyShown).not.toHaveBeenCalled();
     });

  it('#handleTransitionEnd after #show sends notification that tooltip has been shown',
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
       expect(mockAdapter.notifyShown).toHaveBeenCalled();
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

  it(`#handleKeydown with ESC key hides tooltip`, () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.show();
    foundation.handleKeydown(createKeyboardEvent('keydown', {key: 'Escape'}));

    expect((foundation as any).hideTimeout).toEqual(null);
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

  it('#handleKeydown does not hide the tooltip if the ESCAPE key was not pressed',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.hide = jasmine.createSpy('hide');

       foundation.show();
       foundation.handleKeydown(createKeyboardEvent('keydown', {key: 'Space'}));

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleKeydown does not restore focus to the anchorElement if the activeElement is not a HTMLElement',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getActiveElement.and.returnValue(null);

       foundation.handleKeydown(
           createKeyboardEvent('keydown', {key: 'Escape'}));

       expect(mockAdapter.focusAnchorElement).not.toHaveBeenCalled();
     });

  it('#handleKeydown does not restore focus to the anchorElement if the activeElement is not within tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.tooltipContainsElement.and.returnValue(false);

       document.body.focus();
       foundation.handleKeydown(
           createKeyboardEvent('keydown', {key: 'Escape'}));

       expect(mockAdapter.focusAnchorElement).not.toHaveBeenCalled();
     });

  it('#handleKeydown restores focus to the anchorElement if the activeElement was within tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       const activeElement = document.createElement('div');
       mockAdapter.getActiveElement.and.returnValue(activeElement);
       mockAdapter.isInstanceOfElement.and.returnValue(true);
       mockAdapter.tooltipContainsElement.and.returnValue(true);

       document.body.focus();
       const mockKeyboardEvent =
           createKeyboardEvent('keydown', {key: 'Escape'});
       foundation.handleKeydown(mockKeyboardEvent);

       expect(mockAdapter.tooltipContainsElement)
           .toHaveBeenCalledWith(activeElement);
       expect(mockAdapter.focusAnchorElement).toHaveBeenCalled();
     });

  it('#handleDocumentClick hides the tooltip immediately for plain tooltips',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       const mockClickEvent = createMouseEvent('click');

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for default rich tooltips',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       const mockClickEvent = createMouseEvent('click');

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for persistent rich tooltips if there is no event target',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       const mockClickEvent = createMouseEvent('click');

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for persistent rich tooltips if event target is not HTMLElement',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       const mockClickEvent = {
         ...createMouseEvent('click'),
         target: 'not an HTMLElement'
       } as unknown as MouseEvent;

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for persistent rich tooltips if event target is not within anchorElement or tooltipElement',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.anchorContainsElement.and.returnValue(false);
       mockAdapter.tooltipContainsElement.and.returnValue(false);
       const mockClickEvent = {
         ...createMouseEvent('click'),
         target: document.createElement('div')
       };

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleDocumentClick does not hide the tooltip for persistent rich tooltips if event target is within anchorElement',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.anchorContainsElement.and.returnValue(true);
       mockAdapter.tooltipContainsElement.and.returnValue(false);
       const mockClickEvent = {
         ...createMouseEvent('click'),
         target: document.createElement('div')
       };

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleDocumentClick does not hide the tooltip for persistent rich tooltips if event target is within tooltipElement',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.anchorContainsElement.and.returnValue(false);
       mockAdapter.tooltipContainsElement.and.returnValue(true);
       const mockClickEvent = {
         ...createMouseEvent('click'),
         target: document.createElement('div')
       };

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });


  it(`#handleAnchorMouseLeave hides the tooltip after a ${
         numbers.HIDE_DELAY_MS}ms delay`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.show();
       foundation.handleAnchorMouseLeave();
       expect((foundation as any).hideTimeout).not.toEqual(null);

       jasmine.clock().tick(numbers.HIDE_DELAY_MS);
       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleAnchorMouseLeave does not clear showTimeout after #handleAnchorMouseEnter is called',
     () => {
       const {foundation} = setUpFoundationTest(MDCTooltipFoundation);

       foundation.handleAnchorMouseLeave();
       jasmine.clock().tick(numbers.HIDE_DELAY_MS / 2);
       foundation.handleAnchorMouseEnter();
       jasmine.clock().tick(numbers.HIDE_DELAY_MS / 2);

       expect((foundation as any).showTimeout).not.toEqual(null);
     });

  it(`#handleAnchorBlur hides the tooltip immediately for plain tooltips`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);

       foundation.show();
       (foundation as any).handleAnchorBlur();

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately when focus changes to non-HTMLElement related target for default rich tooltips`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       (foundation as any).handleAnchorBlur({});

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately when focus changes to related target not within tooltip for default rich tooltips`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       mockAdapter.tooltipContainsElement.and.returnValue(false);

       const mockFocusEvent = {relatedTarget: document.createElement('div')};
       foundation.show();
       (foundation as any).handleAnchorBlur(mockFocusEvent);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur doesn't hide the tooltip when focus changes to related target not within tooltip for default rich tooltips`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       mockAdapter.tooltipContainsElement.and.returnValue(true);

       const mockFocusEvent = {relatedTarget: document.createElement('div')};
       foundation.show();
       (foundation as any).handleAnchorBlur(mockFocusEvent);

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately when focus changes to non-HTMLElement related target for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});

       foundation.show();
       (foundation as any).handleAnchorBlur({});

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately when focus changes to related target not within tooltip for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.tooltipContainsElement.and.returnValue(false);

       const mockFocusEvent = {relatedTarget: document.createElement('div')};
       foundation.show();
       (foundation as any).handleAnchorBlur(mockFocusEvent);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur doesn't hide the tooltip when focus changes to related target within tooltip for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.tooltipContainsElement.and.returnValue(true);

       const mockFocusEvent = {relatedTarget: document.createElement('div')};
       foundation.show();
       (foundation as any).handleAnchorBlur(mockFocusEvent);

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`#handleDocumentClick hides the tooltip immediately`, () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    const mockClickEvent = createMouseEvent('click');

    foundation.show();
    foundation.handleDocumentClick(mockClickEvent);

    expectTooltipToHaveBeenHidden(foundation, mockAdapter);
  });

  it(`#handleAnchorMouseEnter shows the tooltip after a ${
         numbers.SHOW_DELAY_MS}ms delay`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorMouseEnter();
       expect((foundation as any).showTimeout).not.toEqual(null);

       jasmine.clock().tick(numbers.SHOW_DELAY_MS);
       expectTooltipToHaveBeenShown(foundation, mockAdapter);
     });

  it('#handleAnchorMouseEnter clears any pending hideTimeout', () => {
    const {foundation} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.handleAnchorMouseLeave();
    expect((foundation as any).hideTimeout).not.toEqual(null);

    foundation.handleAnchorMouseEnter();

    expect((foundation as any).hideTimeout).toEqual(null);
  });

  it(`#handleAnchorFocus shows the tooltip after a ${
         numbers.SHOW_DELAY_MS}ms delay if relatedTarget is not a HTMLElement`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);

       foundation.handleAnchorFocus({relatedTarget: null} as FocusEvent);
       expect((foundation as any).showTimeout).not.toEqual(null);
       jasmine.clock().tick(numbers.SHOW_DELAY_MS);

       expectTooltipToHaveBeenShown(foundation, mockAdapter);
     });

  it(`#handleAnchorFocus shows the tooltip if the relatedTarget is not within tooltip`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.tooltipContainsElement.and.returnValue(false);

       foundation.handleAnchorFocus(
           {relatedTarget: document.createElement('div')} as unknown as
           FocusEvent);
       expect((foundation as any).showTimeout).not.toEqual(null);
       jasmine.clock().tick(numbers.SHOW_DELAY_MS);

       expectTooltipToHaveBeenShown(foundation, mockAdapter);
     });

  it(`#handleAnchorFocus doesn't show the tooltip if the relatedTarget is within tooltip`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.isInstanceOfElement.and.returnValue(true);
       mockAdapter.tooltipContainsElement.and.returnValue(true);

       foundation.handleAnchorFocus(
           {relatedTarget: document.createElement('div')} as unknown as
           FocusEvent);
       expect((foundation as any).showTimeout).toEqual(null);
       jasmine.clock().tick(numbers.SHOW_DELAY_MS);

       expect(mockAdapter.removeAttribute)
           .not.toHaveBeenCalledWith('aria-hidden');
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(CssClasses.SHOWING);
     });

  it(`#handleAnchorClick shows the tooltip immediately when tooltip is hidden for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});

       expect(foundation.isShown()).toBeFalse();
       foundation.handleAnchorClick();

       expectTooltipToHaveBeenShown(foundation, mockAdapter);
     });

  it(`#handleAnchorClick hides the tooltip immediately when tooltip is shown for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});

       foundation.show();
       foundation.handleAnchorClick();

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`#handleTooltipMouseEnter shows plain tooltips immediately`, () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    (foundation as any).handleTooltipMouseEnter();
    expectTooltipToHaveBeenShown(foundation, mockAdapter);
  });

  it(`#handleTooltipMouseLeave hides plain tooltips after a ${
         numbers.HIDE_DELAY_MS}ms delay`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);

       foundation.show();
       (foundation as any).handleTooltipMouseLeave();
       expect((foundation as any).hideTimeout).not.toEqual(null);
       jasmine.clock().tick(numbers.HIDE_DELAY_MS);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleTooltipMouseLeave clears any pending showTimeout for plain tooltips',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);

       foundation.handleAnchorMouseEnter();
       expect((foundation as any).showTimeout).not.toEqual(null);
       (foundation as any).handleTooltipMouseLeave();

       expect((foundation as any).showTimeout).toEqual(null);
       jasmine.clock().tick(numbers.SHOW_DELAY_MS);
       expect(mockAdapter.removeAttribute)
           .not.toHaveBeenCalledWith('aria-hidden');
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(CssClasses.SHOWING);
     });

  it(`#handleTooltipMouseEnter shows rich tooltips immediately`, () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    (foundation as any).handleTooltipMouseEnter();

    expectTooltipToHaveBeenShown(foundation, mockAdapter);
  });

  it(`#handleTooltipMouseLeave hides rich tooltips after a ${
         numbers.HIDE_DELAY_MS}ms delay`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       (foundation as any).handleTooltipMouseLeave();
       expect((foundation as any).hideTimeout).not.toEqual(null);
       jasmine.clock().tick(numbers.HIDE_DELAY_MS);

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleTooltipMouseLeave clears any pending showTimeout for rich tooltips',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.handleAnchorMouseEnter();
       expect((foundation as any).showTimeout).not.toEqual(null);
       (foundation as any).handleTooltipMouseLeave();

       expect((foundation as any).showTimeout).toEqual(null);
       jasmine.clock().tick(numbers.SHOW_DELAY_MS);
       expect(mockAdapter.removeAttribute)
           .not.toHaveBeenCalledWith('aria-hidden');
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(CssClasses.SHOWING);
     });

  it('#handleRichTooltipFocusOut hides the tooltip immediately if there is no related target',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       (foundation as any).handleRichTooltipFocusOut({});

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleRichTooltipFocusOut leaves tooltip open if related target is null and tooltip is interactive',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isInteractive: true});

       foundation.show();
       (foundation as any).handleRichTooltipFocusOut({relatedTarget: null});

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleRichTooltipFocusOut  hides the tooltip immediately if related target is null and tooltip is not interactive',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       (foundation as any).handleRichTooltipFocusOut({relatedTarget: null});

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleRichTooltipFocusOut hides the tooltip immediately if related target is not within the anchor or the tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       mockAdapter.anchorContainsElement.and.returnValue(false);
       mockAdapter.tooltipContainsElement.and.returnValue(false);
       (foundation as any).handleRichTooltipFocusOut({
         relatedTarget: document.createElement('div')
       });

       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleRichTooltipFocusOut does not hide the tooltip if related target is within the anchor',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       mockAdapter.anchorContainsElement.and.returnValue(true);
       mockAdapter.tooltipContainsElement.and.returnValue(false);
       (foundation as any).handleRichTooltipFocusOut({
         relatedTarget: document.createElement('div')
       });

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleRichTooltipFocusOut does not hide the tooltip if related target is within the tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       mockAdapter.anchorContainsElement.and.returnValue(false);
       mockAdapter.tooltipContainsElement.and.returnValue(true);
       (foundation as any).handleRichTooltipFocusOut({
         relatedTarget: document.createElement('div')
       });

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });

  it(`does not re-animate a tooltip already shown in the dom (from focus)`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorFocus({relatedTarget: null} as FocusEvent);
       jasmine.clock().tick(numbers.SHOW_DELAY_MS);

       foundation.handleAnchorMouseLeave();
       jasmine.clock().tick(numbers.HIDE_DELAY_MS / 2);
       foundation.handleAnchorFocus({relatedTarget: null} as FocusEvent);

       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(3);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWING);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWN);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(3);
     });

  it(`does not re-animate a tooltip already shown in the dom (from mouseenter)`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorMouseEnter();
       jasmine.clock().tick(numbers.SHOW_DELAY_MS);

       foundation.handleAnchorMouseLeave();
       jasmine.clock().tick(numbers.HIDE_DELAY_MS / 2);
       foundation.handleAnchorMouseEnter();

       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(3);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWING);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWN);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(3);
     });

  it('#handleAnchorMouseLeave clears any pending showTimeout', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.handleAnchorMouseEnter();
    expect((foundation as any).showTimeout).not.toEqual(null);
    foundation.handleAnchorMouseLeave();
    expect((foundation as any).showTimeout).toEqual(null);

    jasmine.clock().tick(numbers.SHOW_DELAY_MS);
    expect(mockAdapter.removeAttribute).not.toHaveBeenCalledWith('aria-hidden');
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWING);
  });

  it('#handleTooltipMouseEnter keeps tooltip visible', () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    foundation.handleAnchorMouseLeave();
    expect((foundation as any).hideTimeout).not.toEqual(null);
    (foundation as any).handleTooltipMouseEnter();

    expect((foundation as any).hideTimeout).toEqual(null);
    expect(mockAdapter.setAttribute)
        .not.toHaveBeenCalledWith('aria-hidden', 'true');
    expect(foundation.isShown()).toBeTrue();
  });

  it('#hide clears any pending showTimeout', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.handleAnchorMouseEnter();
    expect((foundation as any).showTimeout).not.toEqual(null);
    foundation.hide();
    expect((foundation as any).showTimeout).toEqual(null);

    jasmine.clock().tick(numbers.SHOW_DELAY_MS);
    expect(mockAdapter.removeAttribute).not.toHaveBeenCalledWith('aria-hidden');
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWING);
  });

  it(`#handleAnchorTouchstart shows a tooltip if the user long-presses for ${
         numbers.SHOW_DELAY_MS}ms`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorTouchstart();

       jasmine.clock().tick(numbers.SHOW_DELAY_MS);
       expectTooltipToHaveBeenShown(foundation, mockAdapter);
     });

  it(`#handleAnchorTouchstart adds event handler for "contextmenu" event`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorTouchstart();

       expect(mockAdapter.registerWindowEventHandler)
           .toHaveBeenCalledWith('contextmenu', jasmine.any(Function));
     });

  it(`#handleAnchorTouchend clears any pending showTimeout`, () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.handleAnchorTouchstart();

    expect((foundation as any).showTimeout).not.toEqual(null);
    foundation.handleAnchorTouchend();
    expect((foundation as any).showTimeout).toEqual(null);

    jasmine.clock().tick(numbers.SHOW_DELAY_MS);
    expect(mockAdapter.removeAttribute).not.toHaveBeenCalledWith('aria-hidden');
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWING);
  });

  it(`#handleAnchorTouchend removes event handler for "contextmenu" event if tooltip is not shown`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorTouchstart();
       foundation.handleAnchorTouchend();

       expect(mockAdapter.registerWindowEventHandler)
           .toHaveBeenCalledWith('contextmenu', jasmine.any(Function));
       expect(mockAdapter.deregisterWindowEventHandler)
           .toHaveBeenCalledWith('contextmenu', jasmine.any(Function));
     });

  it('#hide deregisters "contextmenu" event listeners on the window', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.handleAnchorTouchstart();
    jasmine.clock().tick(numbers.SHOW_DELAY_MS);
    foundation.hide();

    expect(mockAdapter.deregisterWindowEventHandler)
        .toHaveBeenCalledWith('contextmenu', jasmine.any(Function));
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

  it('properly sets tooltip transform origin (left top)', () => {
    const anchorHeight = 35;

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
    expect(mockAdapter.setSurfaceAnimationStyleProperty)
        .toHaveBeenCalledWith('transform-origin', 'left top');
  });

  it('properly calculates tooltip position (END alignment)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 400, right: 450, width: 50, height: 35};
    const expectedTooltipTop =
        anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
    const tooltipSize = {width: 100, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(480);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', `350px`);
  });

  it('properly sets tooltip transform origin (right top)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 400, right: 450, width: 50, height: 35};
    const tooltipSize = {width: 100, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(480);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.show();
    expect(mockAdapter.setSurfaceAnimationStyleProperty)
        .toHaveBeenCalledWith('transform-origin', 'right top');
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

  it('properly sets tooltip transform origin (center top)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, right: 200, width: 200, height: 35};
    const tooltipSize = {width: 40, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.show();
    expect(mockAdapter.setSurfaceAnimationStyleProperty)
        .toHaveBeenCalledWith('transform-origin', 'center top');
  });

  it('properly calculates tooltip position with an UNBOUNDED anchor', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, width: 200, height: 35} as DOMRect;
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

  it('sets width of rich tooltip after positioning', () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
    const testWidth = '50px';
    mockAdapter.getComputedStyleProperty.and.returnValue(testWidth);
    mockAdapter.getViewportWidth.and.returnValue(300);

    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('width', testWidth);
  });

  it('sets width of rich tooltip so it fits in small viewports', () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
    const testWidth = '230px';
    mockAdapter.getComputedStyleProperty.and.returnValue(testWidth);
    mockAdapter.getViewportWidth.and.returnValue(150);

    foundation.show();

    // expected width is 150 - (2 * MIN_VIEWPORT_THRESHOLD) => 150 - 16
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('width', '134px');
  });

  it('maintains a min width for rich tooltips when in a small viewport', () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
    const testWidth = '50px';
    mockAdapter.getComputedStyleProperty.and.returnValue(testWidth);
    mockAdapter.getViewportWidth.and.returnValue(20);

    foundation.show();

    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('width', '40px');
  });

  it('properly calculates rich tooltip position (START alignment)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 100, right: 150, width: 50, height: 35};
    const parentBoundingRect =
        {top: 5, bottom: 35, left: 0, right: 50, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 30};
    const expectedTooltipTop = anchorBoundingRect.height +
        numbers.BOUNDED_ANCHOR_GAP - parentBoundingRect.top;
    const expectedTooltipLeft =
        anchorBoundingRect.left - tooltipSize.width - parentBoundingRect.left;
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(150);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly sets rich tooltip transform origin (right top)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 100, right: 150, width: 50, height: 35};
    const parentBoundingRect =
        {top: 5, bottom: 35, left: 0, right: 50, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 30};
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(150);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.show();
    expect(mockAdapter.setSurfaceAnimationStyleProperty)
        .toHaveBeenCalledWith('transform-origin', 'right top');
  });

  it('properly calculates rich tooltip position (END alignment)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, right: 50, width: 50, height: 35};
    const parentBoundingRect =
        {top: 5, bottom: 35, left: 0, right: 50, width: 50, height: 30};
    const expectedTooltipTop = anchorBoundingRect.height +
        numbers.BOUNDED_ANCHOR_GAP - parentBoundingRect.top;
    const expectedTooltipLeft =
        anchorBoundingRect.right - parentBoundingRect.left;
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(150);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);

    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates rich tooltip transform origin (left top)', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, right: 50, width: 50, height: 35};
    const parentBoundingRect =
        {top: 5, bottom: 35, left: 0, right: 50, width: 50, height: 30};
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(150);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);

    foundation.show();
    expect(mockAdapter.setSurfaceAnimationStyleProperty)
        .toHaveBeenCalledWith('transform-origin', 'left top');
  });

  it('allows users to specify the tooltip position for plain tooltips (START alignment instead of CENTER)',
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

  it('ignores user specification if positioning violates threshold for plain tooltips (CENTER alignment instead of START)',
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

  it('allows users to specify the tooltip position for plain tooltips (END alignment instead of START)',
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

  it('allows users to specify the tooltip position for rich tooltips (END alignment instead of START)',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 35, left: 132, right: 232, width: 100, height: 35};
       const parentBoundingRect =
           {top: 5, bottom: 35, left: 0, right: 50, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 30};
       const expectedTooltipTop = anchorBoundingRect.height +
           numbers.BOUNDED_ANCHOR_GAP - parentBoundingRect.top;
       const expectedTooltipLeft = anchorBoundingRect.left - tooltipSize.width -
           parentBoundingRect.left;
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       mockAdapter.getViewportWidth.and.returnValue(500);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.setTooltipPosition({xPos: XPosition.START});
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
     });

  it('ignores user specification if positioning violates threshold for rich tooltips (END alignment instead of START)',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 35, left: 0, right: 200, width: 200, height: 35};
       const parentBoundingRect =
           {top: 5, bottom: 35, left: 0, right: 50, width: 50, height: 30};
       const expectedTooltipTop = anchorBoundingRect.height +
           numbers.BOUNDED_ANCHOR_GAP - parentBoundingRect.top;
       const expectedTooltipLeft =
           anchorBoundingRect.right - parentBoundingRect.left;
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       mockAdapter.getViewportWidth.and.returnValue(500);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);

       foundation.setTooltipPosition({xPos: XPosition.START});
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
     });

  it('ignores user specification if positioning is not supported for rich tooltips (END alignment instead of CENTER)',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 35, left: 0, right: 100, width: 100, height: 35};
       const parentBoundingRect =
           {top: 5, bottom: 35, left: 0, right: 50, width: 50, height: 30};
       const expectedTooltipTop = anchorBoundingRect.height +
           numbers.BOUNDED_ANCHOR_GAP - parentBoundingRect.top;
       const expectedTooltipLeft =
           anchorBoundingRect.right - parentBoundingRect.left;
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       mockAdapter.getViewportWidth.and.returnValue(500);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);

       foundation.setTooltipPosition({xPos: XPosition.CENTER});
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
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

  it('properly calculates "right top" transform origin in RTL', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, right: 100, width: 100, height: 35};
    const tooltipSize = {width: 50, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.isRTL.and.returnValue(true);

    foundation.setTooltipPosition({xPos: XPosition.START});
    foundation.show();
    expect(mockAdapter.setSurfaceAnimationStyleProperty)
        .toHaveBeenCalledWith('transform-origin', 'right top');
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

  it('properly calculates "left top" transform origin in RTL', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 32, right: 132, width: 100, height: 35};
    const tooltipSize = {width: 50, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.isRTL.and.returnValue(true);

    foundation.setTooltipPosition({xPos: XPosition.END});
    foundation.show();
    expect(mockAdapter.setSurfaceAnimationStyleProperty)
        .toHaveBeenCalledWith('transform-origin', 'left top');
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

  it('properly calculates tooltip transform origin (left bottom)', () => {
    const anchorBoundingRect =
        {top: 100, bottom: 125, left: 10, right: 60, width: 50, height: 25};
    const tooltipSize = {width: 60, height: 20};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getViewportHeight.and.returnValue(300);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.setTooltipPosition({yPos: YPosition.ABOVE});
    foundation.show();
    expect(mockAdapter.setSurfaceAnimationStyleProperty)
        .toHaveBeenCalledWith('transform-origin', 'left bottom');
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
           {top: 0, bottom: 30, left: 450, right: 500, width: 50} as DOMRect;
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
           {top: 40, bottom: 70, left: 450, right: 500, width: 50} as DOMRect;
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
           {top: 40, bottom: 70, left: 450, right: 500, width: 50} as DOMRect;
       const tooltipSize = {width: 100, height: 30};
       const expectedTooltipTop = anchorBoundingRect.top -
           (numbers.BOUNDED_ANCHOR_GAP + tooltipSize.height);

       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.getViewportHeight.and.returnValue(110);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.setTooltipPosition({yPos: YPosition.ABOVE});
       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
     });

  it('properly calculates tooltip position SIDE_END', () => {
    const anchorBoundingRect =
        {top: 100, bottom: 140, left: 0, right: 100, width: 100, height: 40};
    const tooltipSize = {width: 50, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportHeight.and.returnValue(500);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.setTooltipPosition(
        {xPos: XPosition.SIDE_END, yPos: YPosition.SIDE});
    foundation.show();
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('top', '105px');
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', '104px');
  });

  it('properly calculates tooltip position SIDE_START in RTL', () => {
    const anchorBoundingRect =
        {top: 100, bottom: 140, left: 0, right: 100, width: 100, height: 40};
    const tooltipSize = {width: 50, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportHeight.and.returnValue(500);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.isRTL.and.returnValue(true);

    foundation.setTooltipPosition(
        {xPos: XPosition.SIDE_START, yPos: YPosition.SIDE});
    foundation.show();
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('top', '105px');
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', '104px');
  });

  it('properly calculates tooltip position SIDE_START', () => {
    const anchorBoundingRect =
        {top: 100, bottom: 140, left: 100, right: 200, width: 100, height: 40};
    const tooltipSize = {width: 50, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportHeight.and.returnValue(500);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

    foundation.setTooltipPosition(
        {xPos: XPosition.SIDE_START, yPos: YPosition.SIDE});
    foundation.show();
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('top', '105px');
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', '46px');
  });

  it('properly calculates tooltip position SIDE_END in RTL', () => {
    const anchorBoundingRect =
        {top: 100, bottom: 140, left: 100, right: 200, width: 100, height: 40};
    const tooltipSize = {width: 50, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportHeight.and.returnValue(500);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.isRTL.and.returnValue(true);

    foundation.setTooltipPosition(
        {xPos: XPosition.SIDE_END, yPos: YPosition.SIDE});
    foundation.show();
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('top', '105px');
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('left', '46px');
  });

  it('#destroy clears showTimeout', () => {
    const {foundation} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.handleAnchorMouseEnter();
    foundation.destroy();

    expect((foundation as any).showTimeout).toEqual(null);
  });

  it('#destroy clears requestAnimationFrame from show', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.show();
    expect(foundation['frameId']).not.toEqual(null);
    foundation.destroy();
    jasmine.clock().tick(ANIMATION_FRAME);

    expect(foundation['frameId']).toEqual(null);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
    // 1 call from show and 5 calls from destroy
    expect(mockAdapter.removeClass).toHaveBeenCalledTimes(6);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWN);
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
  });

  it('#destroy clears hideTimeout', () => {
    const {foundation} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.handleAnchorMouseLeave();
    foundation.destroy();

    expect((foundation as any).hideTimeout).toEqual(null);
  });

  it('#destroy removes tooltip classes', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.destroy();

    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWING);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
  });

  it('#destroy cancels all animation frame requests', () => {
    const {foundation} = setUpFoundationTest(MDCTooltipFoundation);

    (foundation as any).handleWindowChangeEvent();
    foundation.destroy();

    expect(foundation['animFrame']['rafIDs'].size).toEqual(0);
  });

  it('#destroy removes the event listeners for plain tooltips', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.destroy();

    expect(mockAdapter.deregisterEventHandler)
        .toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
    expect(mockAdapter.deregisterEventHandler)
        .toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
    expect(mockAdapter.deregisterEventHandler)
        .not.toHaveBeenCalledWith('focusout', jasmine.any(Function));
    expect(mockAdapter.deregisterDocumentEventHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
    expect(mockAdapter.deregisterDocumentEventHandler)
        .toHaveBeenCalledWith('keydown', jasmine.any(Function));
    expect(mockAdapter.deregisterWindowEventHandler)
        .toHaveBeenCalledWith('scroll', jasmine.any(Function));
    expect(mockAdapter.deregisterWindowEventHandler)
        .toHaveBeenCalledWith('resize', jasmine.any(Function));
    expect(mockAdapter.deregisterAnchorEventHandler)
        .toHaveBeenCalledWith('blur', jasmine.any(Function));
  });

  it('#destroy removes the event listeners for default rich tooltips', () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    foundation.destroy();

    expect(mockAdapter.deregisterEventHandler)
        .toHaveBeenCalledWith('focusout', jasmine.any(Function));
    expect(mockAdapter.deregisterEventHandler)
        .toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
    expect(mockAdapter.deregisterEventHandler)
        .toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
    expect(mockAdapter.deregisterDocumentEventHandler)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
    expect(mockAdapter.deregisterDocumentEventHandler)
        .toHaveBeenCalledWith('keydown', jasmine.any(Function));
    expect(mockAdapter.deregisterWindowEventHandler)
        .toHaveBeenCalledWith('scroll', jasmine.any(Function));
    expect(mockAdapter.deregisterWindowEventHandler)
        .toHaveBeenCalledWith('resize', jasmine.any(Function));
  });

  it('#destroy removes the event listeners for persistent rich tooltips',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});

       foundation.destroy();

       expect(mockAdapter.deregisterEventHandler)
           .toHaveBeenCalledWith('focusout', jasmine.any(Function));
       expect(mockAdapter.deregisterEventHandler)
           .not.toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
       expect(mockAdapter.deregisterEventHandler)
           .not.toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
       expect(mockAdapter.deregisterDocumentEventHandler)
           .toHaveBeenCalledWith('click', jasmine.any(Function));
       expect(mockAdapter.deregisterDocumentEventHandler)
           .toHaveBeenCalledWith('keydown', jasmine.any(Function));
       expect(mockAdapter.deregisterWindowEventHandler)
           .toHaveBeenCalledWith('scroll', jasmine.any(Function));
       expect(mockAdapter.deregisterWindowEventHandler)
           .toHaveBeenCalledWith('resize', jasmine.any(Function));
     });

  it('recalculates position of tooltip if anchor position changes', () => {
    const anchorBoundingRect =
        {top: 0, bottom: 35, left: 0, right: 200, width: 200, height: 35};
    const expectedTooltipTop =
        anchorBoundingRect.height + numbers.BOUNDED_ANCHOR_GAP;
    const expectedTooltipLeft = 80;
    const tooltipSize = {width: 40, height: 30};

    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.getViewportWidth.and.returnValue(500);
    mockAdapter.getViewportHeight.and.returnValue(500);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.registerWindowEventHandler.and.callFake(
        (ev: string, handler: EventListener) => {
          window.addEventListener(ev, handler);
        });

    foundation.show();
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);

    const yPositionDiff = 50;
    const xPositionDiff = 20;
    const newAnchorBoundingRect = {
      top: anchorBoundingRect.top + yPositionDiff,
      bottom: anchorBoundingRect.bottom + yPositionDiff,
      left: anchorBoundingRect.left + xPositionDiff,
      right: anchorBoundingRect.right + xPositionDiff,
      width: anchorBoundingRect.width,
      height: anchorBoundingRect.height,
    };

    mockAdapter.getAnchorBoundingRect.and.returnValue(newAnchorBoundingRect);
    emitEvent(window, 'resize');
    jasmine.clock().tick(1);

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop + yPositionDiff}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith(
            'left', `${expectedTooltipLeft + xPositionDiff}px`);
  });

  it('doesn\'t recalculates position of tooltip if anchor is scrolled above viewport',
     () => {
       const anchorBoundingRect =
           {top: 0, bottom: 35, left: 200, right: 250, height: 35};
       const parentBoundingRect =
           {top: 5, bottom: 40, left: 100, right: 150, height: 35};
       const tooltipSize = {width: 40, height: 30};

       const scrollableAncestor = document.createElement('div');
       scrollableAncestor.setAttribute('id', 'scrollable');
       document.body.appendChild(scrollableAncestor);

       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.getViewportWidth.and.returnValue(300);
       mockAdapter.getViewportHeight.and.returnValue(150);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       mockAdapter.registerWindowEventHandler.and.callFake(
           (ev: string, handler: EventListener) => {
             window.addEventListener(ev, handler);
           });
       foundation.show();

       const yPositionDiff = 50;
       const newAnchorBoundingRect = {
         top: anchorBoundingRect.top - yPositionDiff,
         bottom: anchorBoundingRect.bottom - yPositionDiff,
         left: anchorBoundingRect.left,
         right: anchorBoundingRect.right,
         height: anchorBoundingRect.height
       };
       mockAdapter.getAnchorBoundingRect.and.returnValue(newAnchorBoundingRect);

       // Reset spy on setStyleProperty so we can verify it is not called again
       // after the scroll event.
       mockAdapter.setStyleProperty.calls.reset();
       emitEvent(window, 'scroll');
       jasmine.clock().tick(1);

       expect(mockAdapter.setStyleProperty).not.toHaveBeenCalled();
     });

  it('doesn\'t recalculates position of tooltip if anchor is scrolled below viewport',
     () => {
       const anchorBoundingRect =
           {top: 110, bottom: 145, left: 200, right: 250, height: 35};
       const parentBoundingRect =
           {top: 115, bottom: 150, left: 100, right: 150, height: 35};
       const tooltipSize = {width: 40, height: 30};

       const scrollableAncestor = document.createElement('div');
       scrollableAncestor.setAttribute('id', 'scrollable');
       document.body.appendChild(scrollableAncestor);

       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.getViewportWidth.and.returnValue(300);
       mockAdapter.getViewportHeight.and.returnValue(150);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       mockAdapter.registerWindowEventHandler.and.callFake(
           (ev: string, handler: EventListener) => {
             window.addEventListener(ev, handler);
           });
       foundation.show();

       const newAnchorBoundingRect = {
         top: anchorBoundingRect.top + 50,
         bottom: anchorBoundingRect.bottom + 50,
         left: anchorBoundingRect.left,
         right: anchorBoundingRect.right,
         height: anchorBoundingRect.height
       };
       mockAdapter.getAnchorBoundingRect.and.returnValue(newAnchorBoundingRect);

       // Reset spy on setStyleProperty so we can verify it is not called again
       // after the scroll event.
       mockAdapter.setStyleProperty.calls.reset();
       emitEvent(window, 'scroll');
       jasmine.clock().tick(1);

       expect(mockAdapter.setStyleProperty).not.toHaveBeenCalled();
     });

  it('#show registers additional user-specified scroll handlers', () => {
    const scrollableAncestor = document.createElement('div');
    scrollableAncestor.setAttribute('id', 'scrollable');
    document.body.appendChild(scrollableAncestor);
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.attachScrollHandler((evt, handler) => {
      scrollableAncestor.addEventListener(evt, handler);
    });
    foundation.show();

    emitEvent(scrollableAncestor, 'scroll');
    jasmine.clock().tick(numbers.HIDE_DELAY_MS);

    expectTooltipToHaveBeenHidden(foundation, mockAdapter);
  });

  it('#hide deregisters additional user-specified scroll handlers', () => {
    const scrollableAncestor = document.createElement('div');
    scrollableAncestor.setAttribute('id', 'scrollable');
    document.body.appendChild(scrollableAncestor);
    const {foundation} = setUpFoundationTest(MDCTooltipFoundation);

    spyOn(foundation, 'hide').and.callThrough();

    foundation.attachScrollHandler((evt, handler) => {
      scrollableAncestor.addEventListener(evt, handler);
    });
    foundation.removeScrollHandler((evt, handler) => {
      scrollableAncestor.removeEventListener(evt, handler);
    });
    foundation.show();
    foundation.hide();

    emitEvent(scrollableAncestor, 'scroll');
    jasmine.clock().tick(1);

    expect(foundation.hide).toHaveBeenCalledTimes(1);
  });

  it('persistent tooltip remains visible if user specified ancestor is scrolled',
     () => {
       const scrollableAncestor = document.createElement('div');
       scrollableAncestor.setAttribute('id', 'scrollable');
       document.body.appendChild(scrollableAncestor);

       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});

       foundation.attachScrollHandler((evt, handler) => {
         scrollableAncestor.addEventListener(evt, handler);
       });
       foundation.show();
       expectTooltipToHaveBeenShown(foundation, mockAdapter);

       emitEvent(scrollableAncestor, 'scroll');
       jasmine.clock().tick(numbers.HIDE_DELAY_MS);

       expectTooltipNotToHaveBeenHidden(foundation, mockAdapter);
     });

  for (const pos of CARET_POSITION_STYLES.keys()) {
    it(`correctly positions a ${pos} aligned caret`, () => {
      const anchorBoundingRect =
          {top: 200, bottom: 235, left: 350, right: 400, width: 50, height: 35};
      const tooltipSize = {width: 300, height: 150};

      const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
          MDCTooltipFoundation, {hasCaret: true});

      mockAdapter.getViewportWidth.and.returnValue(850);
      mockAdapter.getViewportHeight.and.returnValue(800);
      mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
      mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
      mockAdapter.isRTL.and.returnValue(false);
      mockAdapter.getComputedStyleProperty.withArgs('width').and.returnValue(
          RICH_TOOLTIP_WIDTH);
      mockAdapter.getComputedStyleProperty.withArgs('height').and.returnValue(
          RICH_TOOLTIP_HEIGHT);
      mockAdapter.getTooltipCaretBoundingRect.and.returnValue(
          {width: CARET_WIDTH, height: CARET_HEIGHT});

      foundation.setTooltipPosition({withCaretPos: pos});
      foundation.show();

      const styleValues = CARET_POSITION_STYLES.get(pos)!;
      expect(mockAdapter.setTooltipCaretStyle)
          .toHaveBeenCalledWith(styleValues.yAlignment, styleValues.yAxisPx);
      expect(mockAdapter.setTooltipCaretStyle)
          .toHaveBeenCalledWith(styleValues.xAlignment, styleValues.xAxisPx);
      expect(mockAdapter.setTooltipCaretStyle)
          .toHaveBeenCalledWith(
              'transform',
              `rotate(${styleValues.rotation}deg) skewY(${
                  styleValues.skew}deg) scaleX(${styleValues.scaleX})`);
      expect(mockAdapter.setTooltipCaretStyle)
          .toHaveBeenCalledWith(
              'transform-origin',
              `${styleValues.xAlignment} ${styleValues.yAlignment}`);
      expect(mockAdapter.setSurfaceAnimationStyleProperty)
          .toHaveBeenCalledWith(
              'transform-origin',
              `${styleValues.xTransformOrigin} ${
                  styleValues.yTransformOrigin}`);
    });
  }

  it('properly calculates tooltip with caret position (ABOVE_START)', () => {
    const anchorBoundingRect =
        {top: 200, bottom: 235, left: 350, right: 400, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0};
    const tooltipSize = {width: 40, height: 30};
    const expectedTooltipTop =
        (anchorBoundingRect.top -
         (numbers.BOUNDED_ANCHOR_GAP + tooltipSize.height + CARET_HEIGHT / 2)) -
        parentBoundingRect.top;
    const expectedTooltipLeft =
        (anchorBoundingRect.left + anchorBoundingRect.width / 2 -
         (numbers.CARET_INDENTATION + CARET_WIDTH / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(850);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret position (ABOVE_CENTER)', () => {
    const anchorBoundingRect = {top: 200, left: 10, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0};
    const tooltipSize = {width: 40, height: 30};
    const expectedTooltipTop =
        (anchorBoundingRect.top -
         (numbers.BOUNDED_ANCHOR_GAP + tooltipSize.height + CARET_HEIGHT / 2)) -
        parentBoundingRect.top;
    const expectedTooltipLeft =
        (anchorBoundingRect.left + anchorBoundingRect.width / 2 -
         (tooltipSize.width / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(850);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret position (ABOVE_END)', () => {
    const anchorBoundingRect = {top: 200, left: 0, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0};
    const tooltipSize = {width: 40, height: 30};
    const expectedTooltipTop =
        (anchorBoundingRect.top -
         (numbers.BOUNDED_ANCHOR_GAP + tooltipSize.height + CARET_HEIGHT / 2)) -
        parentBoundingRect.top;
    const expectedTooltipLeft =
        (anchorBoundingRect.left + anchorBoundingRect.width / 2 -
         (tooltipSize.width - numbers.CARET_INDENTATION - CARET_WIDTH / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(850);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret position (BELOW_START)', () => {
    const anchorBoundingRect = {bottom: 35, left: 40, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 30};
    const expectedTooltipTop = (anchorBoundingRect.bottom +
                                numbers.BOUNDED_ANCHOR_GAP + CARET_HEIGHT / 2) -
        parentBoundingRect.top;
    const expectedTooltipLeft =
        (anchorBoundingRect.left + anchorBoundingRect.width / 2 -
         (numbers.CARET_INDENTATION + CARET_WIDTH / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(90);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret position (BELOW_CENTER)', () => {
    const anchorBoundingRect = {bottom: 35, left: 10, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 30};
    const expectedTooltipTop = (anchorBoundingRect.bottom +
                                numbers.BOUNDED_ANCHOR_GAP + CARET_HEIGHT / 2) -
        parentBoundingRect.top;
    const expectedTooltipLeft =
        (anchorBoundingRect.left + anchorBoundingRect.width / 2 -
         (tooltipSize.width / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(90);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret position (BELOW_END)', () => {
    const anchorBoundingRect = {bottom: 35, left: 0, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 30};
    const expectedTooltipTop = (anchorBoundingRect.bottom +
                                numbers.BOUNDED_ANCHOR_GAP + CARET_HEIGHT / 2) -
        parentBoundingRect.top;
    const expectedTooltipLeft =
        (anchorBoundingRect.left + anchorBoundingRect.width / 2 -
         (tooltipSize.width - numbers.CARET_INDENTATION - CARET_WIDTH / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(90);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });

    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret position (TOP_SIDE_START)', () => {
    const anchorBoundingRect =
        {top: 50, bottom: 85, left: 350, right: 400, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 50};

    const expectedTooltipTop =
        (anchorBoundingRect.top + anchorBoundingRect.height / 2 -
         (numbers.CARET_INDENTATION + CARET_WIDTH / 2)) -
        parentBoundingRect.top;
    const expectedTooltipLeft =
        (anchorBoundingRect.left -
         (tooltipSize.width + numbers.BOUNDED_ANCHOR_GAP + CARET_HEIGHT / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(850);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret position (CENTER_SIDE_START)',
     () => {
       const anchorBoundingRect = {top: 25, left: 350, width: 50, height: 35};
       const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 50};

       const expectedTooltipTop =
           (anchorBoundingRect.top + anchorBoundingRect.height / 2 -
            tooltipSize.height / 2) -
           parentBoundingRect.top;
       const expectedTooltipLeft =
           (anchorBoundingRect.left -
            (tooltipSize.width + numbers.BOUNDED_ANCHOR_GAP +
             CARET_HEIGHT / 2)) -
           parentBoundingRect.left;
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(850);
       mockAdapter.getViewportHeight.and.returnValue(800);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
     });

  it('properly calculates tooltip with caret position (BOTTOM_SIDE_START)',
     () => {
       const anchorBoundingRect = {top: 20, left: 350, width: 50, height: 35};
       const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 60};

       const expectedTooltipTop =
           (anchorBoundingRect.top + anchorBoundingRect.height / 2 -
            (tooltipSize.height - numbers.CARET_INDENTATION -
             CARET_WIDTH / 2)) -
           parentBoundingRect.top;
       const expectedTooltipLeft =
           (anchorBoundingRect.left -
            (tooltipSize.width + numbers.BOUNDED_ANCHOR_GAP +
             CARET_HEIGHT / 2)) -
           parentBoundingRect.left;
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(850);
       mockAdapter.getViewportHeight.and.returnValue(105);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
     });

  it('properly calculates tooltip with caret position (TOP_SIDE_END)', () => {
    const anchorBoundingRect = {top: 50, right: 35, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 60};

    const expectedTooltipTop =
        (anchorBoundingRect.top + anchorBoundingRect.height / 2 -
         (numbers.CARET_INDENTATION + CARET_WIDTH / 2)) -
        parentBoundingRect.top;
    const expectedTooltipLeft =
        (anchorBoundingRect.right + numbers.BOUNDED_ANCHOR_GAP +
         CARET_HEIGHT / 2) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(850);
    mockAdapter.getViewportHeight.and.returnValue(95);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret position (CENTER_SIDE_END)',
     () => {
       const anchorBoundingRect = {top: 22, right: 35, width: 50, height: 35};
       const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 60};

       const expectedTooltipTop =
           (anchorBoundingRect.top + anchorBoundingRect.height / 2 -
            tooltipSize.height / 2) -
           parentBoundingRect.top;
       const expectedTooltipLeft =
           (anchorBoundingRect.right + numbers.BOUNDED_ANCHOR_GAP +
            CARET_HEIGHT / 2) -
           parentBoundingRect.left;
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(850);
       mockAdapter.getViewportHeight.and.returnValue(95);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.isRTL.and.returnValue(false);
       mockAdapter.getComputedStyleProperty.withArgs('width').and.returnValue(
           RICH_TOOLTIP_WIDTH);
       mockAdapter.getComputedStyleProperty.withArgs('height').and.returnValue(
           RICH_TOOLTIP_HEIGHT);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });

       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
     });

  it('properly calculates tooltip with caret position (BOTTOM_SIDE_END)',
     () => {
       const anchorBoundingRect = {top: 20, right: 35, width: 50, height: 35};
       const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 60};

       const expectedTooltipTop =
           (anchorBoundingRect.top + anchorBoundingRect.height / 2 -
            (tooltipSize.height - numbers.CARET_INDENTATION -
             CARET_WIDTH / 2)) -
           parentBoundingRect.top;
       const expectedTooltipLeft =
           (anchorBoundingRect.right + numbers.BOUNDED_ANCHOR_GAP +
            CARET_HEIGHT / 2) -
           parentBoundingRect.left;
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(850);
       mockAdapter.getViewportHeight.and.returnValue(95);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });

       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
     });

  it('properly calculates tooltip with caret SIDE_END position in RTL', () => {
    const anchorBoundingRect = {top: 200, left: 350, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 30};

    const expectedTooltipLeft =
        (anchorBoundingRect.left -
         (tooltipSize.width + numbers.BOUNDED_ANCHOR_GAP + CARET_HEIGHT / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(850);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.isRTL.and.returnValue(true);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });

    foundation.setTooltipPosition(
        {withCaretPos: PositionWithCaret.BOTTOM_SIDE_END});
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret SIDE_START position in RTL',
     () => {
       const anchorBoundingRect = {top: 200, right: 400, width: 50, height: 35};
       const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 30};

       const expectedTooltipLeft =
           (anchorBoundingRect.right + numbers.BOUNDED_ANCHOR_GAP +
            CARET_HEIGHT / 2) -
           parentBoundingRect.left;
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(850);
       mockAdapter.getViewportHeight.and.returnValue(800);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.isRTL.and.returnValue(true);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });

       foundation.setTooltipPosition(
           {withCaretPos: PositionWithCaret.BOTTOM_SIDE_START});
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
     });

  it('properly calculates tooltip with caret START position in RTL', () => {
    const anchorBoundingRect = {top: 200, left: 350, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 30};

    const expectedTooltipLeft =
        (anchorBoundingRect.left + anchorBoundingRect.width / 2 -
         (tooltipSize.width - numbers.CARET_INDENTATION - CARET_WIDTH / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(850);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.isRTL.and.returnValue(true);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });

    foundation.setTooltipPosition(
        {withCaretPos: PositionWithCaret.ABOVE_START});
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('properly calculates tooltip with caret END position in RTL', () => {
    const anchorBoundingRect = {top: 200, left: 350, width: 50, height: 35};
    const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
    const tooltipSize = {width: 40, height: 30};
    const expectedTooltipLeft =
        (anchorBoundingRect.left + anchorBoundingRect.width / 2 -
         (numbers.CARET_INDENTATION + CARET_WIDTH / 2)) -
        parentBoundingRect.left;
    const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {hasCaret: true});
    mockAdapter.getViewportWidth.and.returnValue(850);
    mockAdapter.getViewportHeight.and.returnValue(800);
    mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
    mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
    mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
    mockAdapter.isRTL.and.returnValue(true);
    mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
      width: CARET_WIDTH * numbers.ANIMATION_SCALE,
      height: CARET_HEIGHT * numbers.ANIMATION_SCALE
    });

    foundation.setTooltipPosition({withCaretPos: PositionWithCaret.ABOVE_END});
    foundation.show();

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
  });

  it('allows users to specify the position for tooltips with carets (TOP_SIDE_START instead of ABOVE_START)',
     () => {
       const anchorBoundingRect = {top: 200, left: 350, width: 50, height: 35};
       const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 30};

       const expectedTooltipTop =
           (anchorBoundingRect.top + anchorBoundingRect.height / 2 -
            (numbers.CARET_INDENTATION + CARET_WIDTH / 2)) -
           parentBoundingRect.top;
       const expectedTooltipLeft =
           (anchorBoundingRect.left -
            (tooltipSize.width + numbers.BOUNDED_ANCHOR_GAP +
             CARET_HEIGHT / 2)) -
           parentBoundingRect.left;
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(850);
       mockAdapter.getViewportHeight.and.returnValue(800);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });

       foundation.setTooltipPosition(
           {withCaretPos: PositionWithCaret.TOP_SIDE_START});
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);
     });

  it('ignores user specification if positioning violates threshold for tooltips with caret (BELOW alignment instead of ABOVE)',
     () => {
       const anchorBoundingRect = {bottom: 35, left: 40, width: 50, height: 35};
       const parentBoundingRect = {top: 5, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 30};
       const expectedTooltipTop =
           (anchorBoundingRect.bottom + numbers.BOUNDED_ANCHOR_GAP +
            CARET_HEIGHT / 2) -
           parentBoundingRect.top;
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(90);
       mockAdapter.getViewportHeight.and.returnValue(800);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });

       foundation.setTooltipPosition(
           {withCaretPos: PositionWithCaret.ABOVE_START});
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
     });

  it('handles positioning for tooltip with caret when all possible positions are invalid (BELOW_END)',
     () => {
       const anchorBoundingRect = {top: -135, left: -40, width: 50, height: 35};
       const parentBoundingRect = {top: 0, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 30};
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(50);
       mockAdapter.getViewportHeight.and.returnValue(50);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.isRTL.and.returnValue(false);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });
       mockAdapter.getComputedStyleProperty.withArgs('width').and.returnValue(
           RICH_TOOLTIP_WIDTH);
       mockAdapter.getComputedStyleProperty.withArgs('height').and.returnValue(
           RICH_TOOLTIP_HEIGHT);

       foundation.setTooltipPosition(
           {withCaretPos: PositionWithCaret.ABOVE_START});
       foundation.show();

       const expectedTooltipTop =
           numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD + CARET_HEIGHT / 2;
       const expectedTooltipLeft =
           numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD + CARET_HEIGHT / 2;
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);

       // Verify caret is styled for BELOW_END tooltip position
       const styleValues =
           CARET_POSITION_STYLES.get(PositionWithCaret.BELOW_END)!;
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(styleValues.yAlignment, styleValues.yAxisPx);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(styleValues.xAlignment, styleValues.xAxisPx);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(
               'transform',
               `rotate(${styleValues.rotation}deg) skewY(${
                   styleValues.skew}deg) scaleX(${styleValues.scaleX})`);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(
               'transform-origin',
               `${styleValues.xAlignment} ${styleValues.yAlignment}`);
     });

  it('handles positioning for tooltip with caret when all possible positions are invalid (ABOVE_START)',
     () => {
       const anchorBoundingRect = {top: 135, left: 100, width: 50, height: 35};
       const parentBoundingRect = {top: 0, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 30};
       const viewportWidth = 50;
       const viewportHeight = 50;
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(viewportWidth);
       mockAdapter.getViewportHeight.and.returnValue(viewportHeight);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.isRTL.and.returnValue(false);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });
       mockAdapter.getComputedStyleProperty.withArgs('width').and.returnValue(
           RICH_TOOLTIP_WIDTH);
       mockAdapter.getComputedStyleProperty.withArgs('height').and.returnValue(
           RICH_TOOLTIP_HEIGHT);

       foundation.show();

       const expectedTooltipTop = viewportHeight -
           (tooltipSize.height + numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD +
            CARET_HEIGHT / 2);
       const expectedTooltipLeft = viewportWidth -
           (tooltipSize.width + numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD +
            CARET_HEIGHT / 2);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);

       // Verify caret is styled for ABOVE_START tooltip position
       const styleValues =
           CARET_POSITION_STYLES.get(PositionWithCaret.ABOVE_START)!;
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(styleValues.yAlignment, styleValues.yAxisPx);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(styleValues.xAlignment, styleValues.xAxisPx);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(
               'transform',
               `rotate(${styleValues.rotation}deg) skewY(${
                   styleValues.skew}deg) scaleX(${styleValues.scaleX})`);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(
               'transform-origin',
               `${styleValues.xAlignment} ${styleValues.yAlignment}`);
     });

  it('handles positioning for tooltip with caret when all possible positions are invalid (in RTL)',
     () => {
       const anchorBoundingRect = {top: -135, left: -40, width: 50, height: 35};
       const parentBoundingRect = {top: 0, left: 0, width: 50, height: 30};
       const tooltipSize = {width: 40, height: 30};
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.isRTL.and.returnValue(true);
       mockAdapter.getViewportWidth.and.returnValue(50);
       mockAdapter.getViewportHeight.and.returnValue(50);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });
       mockAdapter.getComputedStyleProperty.withArgs('width').and.returnValue(
           RICH_TOOLTIP_WIDTH);
       mockAdapter.getComputedStyleProperty.withArgs('height').and.returnValue(
           RICH_TOOLTIP_HEIGHT);

       foundation.setTooltipPosition(
           {withCaretPos: PositionWithCaret.ABOVE_START});
       foundation.show();
       const expectedTooltipTop =
           numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD + CARET_HEIGHT / 2;
       const expectedTooltipLeft =
           numbers.MIN_VIEWPORT_TOOLTIP_THRESHOLD + CARET_HEIGHT / 2;
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', `${expectedTooltipLeft}px`);

       // Verify caret is styled for BELOW_START tooltip position
       const styleValues =
           CARET_POSITION_STYLES_RTL.get(PositionWithCaret.BELOW_START)!;
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(styleValues.yAlignment, styleValues.yAxisPx);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(styleValues.xAlignment, styleValues.xAxisPx);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(
               'transform',
               `rotate(${styleValues.rotation}deg) skewY(${
                   styleValues.skew}deg) scaleX(${styleValues.scaleX})`);
       expect(mockAdapter.setTooltipCaretStyle)
           .toHaveBeenCalledWith(
               'transform-origin',
               `${styleValues.xAlignment} ${styleValues.yAlignment}`);
       expect(mockAdapter.setSurfaceAnimationStyleProperty)
           .toHaveBeenCalledWith(
               'transform-origin',
               `${styleValues.xTransformOrigin} ${
                   styleValues.yTransformOrigin}`);
     });

  it('handles positioning for tooltip with caret when only one dimension is within the viewport threshold (ABOVE_CENTER)',
     () => {
       const anchorBoundingRect = {top: 200, left: 10, width: 50, height: 35};
       const parentBoundingRect = {top: 5, left: 0};
       const tooltipSize = {width: 40, height: 30};
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {hasCaret: true});
       mockAdapter.getViewportWidth.and.returnValue(60);
       mockAdapter.getViewportHeight.and.returnValue(800);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getParentBoundingRect.and.returnValue(parentBoundingRect);
       mockAdapter.getTooltipCaretBoundingRect.and.returnValue({
         width: CARET_WIDTH * numbers.ANIMATION_SCALE,
         height: CARET_HEIGHT * numbers.ANIMATION_SCALE
       });
       foundation.show();

       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', '145px');
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('left', '15px');
     });

  it(`#setShowDelay allows users to configure the delay prior to showing a tooltip`,
     () => {
       const extraDelayMs = 20;
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.setShowDelay(numbers.SHOW_DELAY_MS + extraDelayMs);
       foundation.handleAnchorMouseEnter();
       expect((foundation as any).showTimeout).not.toEqual(null);

       jasmine.clock().tick(numbers.SHOW_DELAY_MS);
       expect((foundation as any).showTimeout).not.toEqual(null);
       jasmine.clock().tick(extraDelayMs);
       expectTooltipToHaveBeenShown(foundation, mockAdapter);
     });

  it(`#setHideDelay allows users to configure the delay prior to hiding a tooltip`,
     () => {
       const extraDelayMs = 20;
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.setHideDelay(numbers.HIDE_DELAY_MS + extraDelayMs);
       foundation.show();
       foundation.handleAnchorMouseLeave();
       expect((foundation as any).hideTimeout).not.toEqual(null);

       jasmine.clock().tick(numbers.HIDE_DELAY_MS);
       expect((foundation as any).hideTimeout).not.toEqual(null);
       jasmine.clock().tick(extraDelayMs);
       expectTooltipToHaveBeenHidden(foundation, mockAdapter);
     });

  it('#handleTransitionEnd after #hide does NOT sends notification that tooltip has been hidden if showTimeout is set',
     async () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       mockAdapter.hasClass.and.returnValue(true);

       foundation.show();
       foundation.hide();
       foundation.show();
       foundation.handleTransitionEnd();

       expect(mockAdapter.hasClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SHOWING_TRANSITION);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
     });
});
