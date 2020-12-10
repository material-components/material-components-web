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

import {createMouseEvent, emitEvent} from '../../../testing/dom/events';
import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {MDCTooltipAdapter} from '../adapter';
import {AnchorBoundaryType, attributes, CssClasses, numbers, XPosition, YPosition} from '../constants';
import {MDCTooltipFoundation} from '../foundation';

const ESC_EVENTS = [
  {type: 'keydown', key: 'Escape', target: {}},
  {type: 'keydown', keyCode: 27, target: {}},
];

// Constant for the animationFrame mock found in setUpMdcTestEnvironment
const ANIMATION_FRAME = 1;

// This function assumes that the foundation has already been initialized for
// rich tooltips. If isRich and isPersistent have not been initialized, the
// checks for rich tooltip and persistent rich tooltips will not be called. This
// function also assumes that isShown is false, since the checks for isShown
// being true is trivial.
function expectShowToBeCalled(
    foundation: MDCTooltipFoundation,
    mockAdapter: jasmine.SpyObj<MDCTooltipAdapter>) {
  expect(foundation['hideTimeout']).toEqual(null);
  expect(foundation['showTimeout']).toEqual(null);

  if (foundation.getIsRich()) {
    expect(mockAdapter.registerEventHandler)
        .toHaveBeenCalledWith('focusout', jasmine.any(Function));
    if (foundation['isInteractive']) {
      expect(mockAdapter.setAnchorAttribute)
          .toHaveBeenCalledWith('aria-expanded', 'true');
    }
    if (!foundation.getIsPersistent()) {
      expect(mockAdapter.registerEventHandler)
          .toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
      expect(mockAdapter.registerEventHandler)
          .toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
    }
  }

  expect(mockAdapter.setAttribute).toHaveBeenCalledWith('aria-hidden', 'false');
  expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.HIDE);
  expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SHOWING);

  expect(mockAdapter.registerDocumentEventHandler)
      .toHaveBeenCalledWith('click', jasmine.any(Function));
  expect(mockAdapter.registerDocumentEventHandler)
      .toHaveBeenCalledWith('keydown', jasmine.any(Function));

  expect(mockAdapter.registerWindowEventHandler)
      .toHaveBeenCalledWith('scroll', jasmine.any(Function));
  expect(mockAdapter.registerWindowEventHandler)
      .toHaveBeenCalledWith('resize', jasmine.any(Function));
}

// This function assumes that the foundation has already been initialized for
// rich tooltips. If isRich and isPersistent have not been initialized, the
// checks for rich tooltip and persistent rich tooltips will not be called. This
// function also assumes that isShown is true, since the checks for isShown
// being false is trivial.
function expectHideToBeCalled(
    foundation: MDCTooltipFoundation,
    mockAdapter: jasmine.SpyObj<MDCTooltipAdapter>) {
  expect(foundation['hideTimeout']).toEqual(null);
  expect(foundation['showTimeout']).toEqual(null);

  if (foundation.getIsRich()) {
    expect(mockAdapter.deregisterEventHandler)
        .toHaveBeenCalledWith('focusout', jasmine.any(Function));
    if (foundation['isInteractive']) {
      expect(mockAdapter.setAnchorAttribute)
          .toHaveBeenCalledWith('aria-expanded', 'false');
    }
    if (!foundation.getIsPersistent()) {
      expect(mockAdapter.deregisterEventHandler)
          .toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
      expect(mockAdapter.deregisterEventHandler)
          .toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
    }
  }

  expect(mockAdapter.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
  expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE);
  expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
  expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.SHOWN);

  expect(mockAdapter.deregisterDocumentEventHandler)
      .toHaveBeenCalledWith('click', jasmine.any(Function));
  expect(mockAdapter.deregisterDocumentEventHandler)
      .toHaveBeenCalledWith('keydown', jasmine.any(Function));
  expect(mockAdapter.deregisterWindowEventHandler)
      .toHaveBeenCalledWith('scroll', jasmine.any(Function));
  expect(mockAdapter.deregisterWindowEventHandler)
      .toHaveBeenCalledWith('resize', jasmine.any(Function));
}

function expectHideNotToBeCalled(
    foundation: MDCTooltipFoundation,
    mockAdapter: jasmine.SpyObj<MDCTooltipAdapter>) {
  if (foundation.getIsRich()) {
    expect(mockAdapter.deregisterEventHandler)
        .not.toHaveBeenCalledWith('focusout', jasmine.any(Function));
    if (foundation['isInteractive']) {
      expect(mockAdapter.setAnchorAttribute)
          .not.toHaveBeenCalledWith('aria-expanded', 'false');
    }
    if (!foundation.getIsPersistent()) {
      expect(mockAdapter.deregisterEventHandler)
          .not.toHaveBeenCalledWith('mouseenter', jasmine.any(Function));
      expect(mockAdapter.deregisterEventHandler)
          .not.toHaveBeenCalledWith('mouseleave', jasmine.any(Function));
    }
  }

  expect(mockAdapter.setAttribute)
      .not.toHaveBeenCalledWith('aria-hidden', 'true');
  expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
  expect(mockAdapter.addClass)
      .not.toHaveBeenCalledWith(CssClasses.HIDE_TRANSITION);
  expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(CssClasses.SHOWN);

  expect(mockAdapter.deregisterDocumentEventHandler)
      .not.toHaveBeenCalledWith('click', jasmine.any(Function));
  expect(mockAdapter.deregisterDocumentEventHandler)
      .not.toHaveBeenCalledWith('keydown', jasmine.any(Function));
  expect(mockAdapter.deregisterWindowEventHandler)
      .not.toHaveBeenCalledWith('scroll', jasmine.any(Function));
  expect(mockAdapter.deregisterWindowEventHandler)
      .not.toHaveBeenCalledWith('resize', jasmine.any(Function));
}

function setUpFoundationTestForRichTooltip(
    tooltipFoundation: typeof MDCTooltipFoundation,
    {isInteractive,
     isPersistent}: {isInteractive?: boolean, isPersistent?: boolean} = {}) {
  const {foundation, mockAdapter} = setUpFoundationTest(tooltipFoundation);

  mockAdapter.hasClass.withArgs(CssClasses.RICH).and.returnValue(true);
  mockAdapter.getAttribute.withArgs(attributes.PERSISTENT)
      .and.returnValue(isPersistent ? 'true' : 'false');
  mockAdapter.getAnchorAttribute.withArgs(attributes.ARIA_EXPANDED)
      .and.returnValue(isInteractive ? 'false' : null);
  mockAdapter.getAnchorAttribute.withArgs(attributes.ARIA_HASPOPUP)
      .and.returnValue(isInteractive ? 'true' : 'false');
  foundation.init();

  return {foundation, mockAdapter};
}

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
      'setAnchorAttribute',
      'isRTL',
      'anchorContainsElement',
      'tooltipContainsElement',
      'registerEventHandler',
      'deregisterEventHandler',
      'registerDocumentEventHandler',
      'deregisterDocumentEventHandler',
      'registerWindowEventHandler',
      'deregisterWindowEventHandler',
      'notifyHidden',
    ]);
  });

  it('#getIsRich returns false for plain tooltip', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    mockAdapter.hasClass.withArgs(CssClasses.RICH).and.returnValue(false);
    foundation.init();

    expect(foundation.getIsRich()).toBeFalse();
  });

  it('#getIsRich returns true for rich tooltip', () => {
    const {foundation} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    expect(foundation.getIsRich()).toBeTrue();
  });

  it('#getIsPersistent returns false for default rich tooltip', () => {
    const {foundation} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    expect(foundation.getIsPersistent()).toBeFalse();
  });

  it('#getIsPersistent returns true for persistent rich tooltip', () => {
    const {foundation} = setUpFoundationTestForRichTooltip(
        MDCTooltipFoundation, {isPersistent: true});

    expect(foundation.getIsPersistent()).toBeTrue();
  });

  it('#show modifies tooltip element so it is shown', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.show();
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-hidden', 'false');
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

       expectHideNotToBeCalled(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for plain tooltips',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       const mockClickEvent = createMouseEvent('click');

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for default rich tooltips',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       const mockClickEvent = createMouseEvent('click');

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for persistent rich tooltips if there is no event target',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       const mockClickEvent = createMouseEvent('click');

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for persistent rich tooltips if event target is not HTMLElement',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       const mockClickEvent = {
         ...createMouseEvent('click'),
         target: 'not an HTMLElement'
       };

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it('#handleDocumentClick hides the tooltip immediately for persistent rich tooltips if event target is not within anchorElement',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.anchorContainsElement.and.returnValue(false);
       const mockClickEvent = {
         ...createMouseEvent('click'),
         target: document.createElement('div')
       };

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it('#handleDocumentClick does not hide the tooltip for persistent rich tooltips if event target is within anchorElement',
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.anchorContainsElement.and.returnValue(true);
       const mockClickEvent = {
         ...createMouseEvent('click'),
         target: document.createElement('div')
       };

       foundation.show();
       foundation.handleDocumentClick(mockClickEvent);

       expectHideNotToBeCalled(foundation, mockAdapter);
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
       expectHideToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately for plain tooltips`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);

       foundation.show();
       foundation.handleAnchorBlur();

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately when focus changes to non-HTMLElement related target for default rich tooltips`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       foundation.handleAnchorBlur({});

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately when focus changes to related target not within tooltip for default rich tooltips`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       mockAdapter.tooltipContainsElement.and.returnValue(false);

       const mockFocusEvent = {relatedTarget: document.createElement('div')};
       foundation.show();
       foundation.handleAnchorBlur(mockFocusEvent);

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur doesn't hide the tooltip when focus changes to related target not within tooltip for default rich tooltips`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);
       mockAdapter.tooltipContainsElement.and.returnValue(true);

       const mockFocusEvent = {relatedTarget: document.createElement('div')};
       foundation.show();
       foundation.handleAnchorBlur(mockFocusEvent);

       expectHideNotToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately when focus changes to non-HTMLElement related target for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});

       foundation.show();
       foundation.handleAnchorBlur({});

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur hides the tooltip immediately when focus changes to related target not within tooltip for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.tooltipContainsElement.and.returnValue(false);

       const mockFocusEvent = {relatedTarget: document.createElement('div')};
       foundation.show();
       foundation.handleAnchorBlur(mockFocusEvent);

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorBlur doesn't hide the tooltip when focus changes to related target within tooltip for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});
       mockAdapter.tooltipContainsElement.and.returnValue(true);

       const mockFocusEvent = {relatedTarget: document.createElement('div')};
       foundation.show();
       foundation.handleAnchorBlur(mockFocusEvent);

       expectHideNotToBeCalled(foundation, mockAdapter);
     });

  it(`#handleDocumentClick hides the tooltip immediately`, () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    const mockClickEvent = createMouseEvent('click');

    foundation.show();
    foundation.handleDocumentClick(mockClickEvent);

    expectHideToBeCalled(foundation, mockAdapter);
  });

  it(`#handleAnchorMouseEnter shows the tooltip after a ${
         numbers.SHOW_DELAY_MS}ms delay`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorMouseEnter();
       expect(foundation.showTimeout).not.toEqual(null);

       jasmine.clock().tick(numbers.SHOW_DELAY_MS);
       expectShowToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorFocus shows the tooltip after a ${
         numbers.SHOW_DELAY_MS}ms delay`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorFocus();
       expect(foundation.showTimeout).not.toEqual(null);

       jasmine.clock().tick(numbers.SHOW_DELAY_MS);
       expectShowToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorClick shows the tooltip immediately when tooltip is hidden for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});

       expect(foundation.isShown).toBe(false);
       foundation.handleAnchorClick();

       expectShowToBeCalled(foundation, mockAdapter);
     });

  it(`#handleAnchorClick hides the tooltip immediately when tooltip is shown for persistent rich tooltips`,
     () => {
       const {foundation, mockAdapter} = setUpFoundationTestForRichTooltip(
           MDCTooltipFoundation, {isPersistent: true});

       foundation.show();
       foundation.handleAnchorClick();

       expectHideToBeCalled(foundation, mockAdapter);
     });


  it(`#handleRichTooltipMouseEnter shows the tooltip immediately`, () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    foundation.handleRichTooltipMouseEnter();

    expectShowToBeCalled(foundation, mockAdapter);
  });

  it(`#handleRichTooltipMouseLeave hides the tooltip after a ${
         numbers.HIDE_DELAY_MS}ms delay`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       foundation.handleRichTooltipMouseLeave();
       expect(foundation.hideTimeout).not.toEqual(null);
       jasmine.clock().tick(numbers.HIDE_DELAY_MS);

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it('#handleRichTooltipMouseLeave clears any pending showTimeout', () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    foundation.handleAnchorMouseEnter();
    expect(foundation.showTimeout).not.toEqual(null);
    foundation.handleRichTooltipMouseLeave();

    expect(foundation.showTimeout).toEqual(null);
    jasmine.clock().tick(numbers.SHOW_DELAY_MS);
    expect(mockAdapter.setAttribute)
        .not.toHaveBeenCalledWith('aria-hidden', 'false');
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWING);
  });

  it('#handleRichTooltipFocusOut hides the tooltip immediately if there is no related target',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       foundation.handleRichTooltipFocusOut({});

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it('#handleRichTooltipFocusOut hides the tooltip immediately if related target is not within the anchor or the tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       mockAdapter.anchorContainsElement.and.returnValue(false);
       mockAdapter.tooltipContainsElement.and.returnValue(false);
       foundation.handleRichTooltipFocusOut(
           {relatedTarget: document.createElement('div')});

       expectHideToBeCalled(foundation, mockAdapter);
     });

  it('#handleRichTooltipFocusOut does not hide the tooltip if related target is within the anchor',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       mockAdapter.anchorContainsElement.and.returnValue(true);
       mockAdapter.tooltipContainsElement.and.returnValue(false);
       foundation.handleRichTooltipFocusOut(
           {relatedTarget: document.createElement('div')});

       expectHideNotToBeCalled(foundation, mockAdapter);
     });

  it('#handleRichTooltipFocusOut does not hide the tooltip if related target is within the tooltip',
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

       foundation.show();
       mockAdapter.anchorContainsElement.and.returnValue(false);
       mockAdapter.tooltipContainsElement.and.returnValue(true);
       foundation.handleRichTooltipFocusOut(
           {relatedTarget: document.createElement('div')});

       expectHideNotToBeCalled(foundation, mockAdapter);
     });

  it(`does not re-animate a tooltip already shown in the dom (from focus)`,
     () => {
       const {foundation, mockAdapter} =
           setUpFoundationTest(MDCTooltipFoundation);
       foundation.handleAnchorFocus();
       jasmine.clock().tick(numbers.SHOW_DELAY_MS);

       foundation.handleAnchorMouseLeave();
       jasmine.clock().tick(numbers.HIDE_DELAY_MS / 2);
       foundation.handleAnchorFocus();

       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith('aria-hidden', 'false');
       expect(mockAdapter.setAttribute).toHaveBeenCalledTimes(1);
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

       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith('aria-hidden', 'false');
       expect(mockAdapter.setAttribute).toHaveBeenCalledTimes(1);
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
    expect(foundation.showTimeout).not.toEqual(null);
    foundation.handleAnchorMouseLeave();
    expect(foundation.showTimeout).toEqual(null);

    jasmine.clock().tick(numbers.SHOW_DELAY_MS);
    expect(mockAdapter.setAttribute)
        .not.toHaveBeenCalledWith('aria-hidden', 'false');
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWING);
  });

  it('#handleRichTooltipMouseEnter keeps tooltip visible', () => {
    const {foundation, mockAdapter} =
        setUpFoundationTestForRichTooltip(MDCTooltipFoundation);

    foundation.handleAnchorMouseLeave();
    expect(foundation.hideTimeout).not.toEqual(null);
    foundation.handleRichTooltipMouseEnter();

    expect(foundation.hideTimeout).toEqual(null);
    expect(mockAdapter.setAttribute)
        .not.toHaveBeenCalledWith('aria-hidden', 'true');
    expect(foundation.isShown).toBeTrue();
  });

  it('#hide clears any pending showTimeout', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);
    foundation.handleAnchorMouseEnter();
    expect(foundation.showTimeout).not.toEqual(null);
    foundation.hide();
    expect(foundation.showTimeout).toEqual(null);

    jasmine.clock().tick(numbers.SHOW_DELAY_MS);
    expect(mockAdapter.setAttribute)
        .not.toHaveBeenCalledWith('aria-hidden', 'false');
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(CssClasses.HIDE);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SHOWING);
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
    mockAdapter.getViewportWidth.and.returnValue(480);
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
       mockAdapter.getViewportHeight.and.returnValue(110);
       mockAdapter.getAnchorBoundingRect.and.returnValue(anchorBoundingRect);
       mockAdapter.getTooltipSize.and.returnValue(tooltipSize);

       foundation.setTooltipPosition({yPos: YPosition.ABOVE});
       foundation.show();
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('top', `${expectedTooltipTop}px`);
     });

  it('#destroy clears showTimeout', () => {
    const {foundation} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.handleAnchorMouseEnter();
    foundation.destroy();

    expect(foundation.showTimeout).toEqual(null);
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

    expect(foundation.hideTimeout).toEqual(null);
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

    foundation.handleWindowChangeEvent();
    foundation.destroy();

    expect(foundation['animFrame']['rafIDs'].size).toEqual(0);
  });

  it('#destroy removes the event listeners for plain tooltips', () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCTooltipFoundation);

    foundation.destroy();

    expect(mockAdapter.deregisterEventHandler)
        .not.toHaveBeenCalledWith('focusout', jasmine.any(Function));
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

  it('#destroy removes the event listeners for default rich tooltips',
     () => {
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
    emitEvent(window, 'scroll');
    jasmine.clock().tick(1);

    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith('top', `${expectedTooltipTop + yPositionDiff}px`);
    expect(mockAdapter.setStyleProperty)
        .toHaveBeenCalledWith(
            'left', `${expectedTooltipLeft + xPositionDiff}px`);
  });
});
