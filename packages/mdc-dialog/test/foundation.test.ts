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
import {cssClasses, numbers, strings} from '../constants';
import {MDCDialogFoundation} from '../foundation';

const ENTER_EVENTS = [
  {type: 'keydown', key: 'Enter', target: {}} as KeyboardEvent,
  {type: 'keydown', keyCode: 13, target: {}} as KeyboardEvent,
];

describe('MDCDialogFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports cssClasses', () => {
    expect(MDCDialogFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports strings', () => {
    expect(MDCDialogFoundation.strings).toEqual(strings);
  });

  it('exports numbers', () => {
    expect(MDCDialogFoundation.numbers).toEqual(numbers);
  });

  it('default adapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCDialogFoundation, [
      'addClass',
      'removeClass',
      'hasClass',
      'addBodyClass',
      'removeBodyClass',
      'eventTargetMatches',
      'trapFocus',
      'releaseFocus',
      'getInitialFocusEl',
      'isContentScrollable',
      'areButtonsStacked',
      'getActionFromEvent',
      'clickDefaultButton',
      'reverseButtons',
      'notifyOpening',
      'notifyOpened',
      'notifyClosing',
      'notifyClosed',
      'registerContentEventHandler',
      'deregisterContentEventHandler',
      'isScrollableContentAtTop',
      'isScrollableContentAtBottom',
      'registerWindowEventHandler',
      'deregisterWindowEventHandler',
    ]);
  });

  function setupTest(dialogOptions: {isFullscreen?: boolean} = {}) {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCDialogFoundation);
    if (dialogOptions.isFullscreen) {
      mockAdapter.hasClass.withArgs(cssClasses.FULLSCREEN)
          .and.returnValue(true);
    }
    foundation.init();
    return {foundation, mockAdapter};
  }

  it(`#init turns off auto-stack if ${cssClasses.STACKED} is already present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.STACKED).and.returnValue(true);

       foundation.init();
       expect(foundation.getAutoStackButtons()).toBe(false);
     });

  it('#destroy removes animating classes if called when the dialog is animating',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.open();
       jasmine.clock().tick(1);
       foundation.destroy();

       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPENING);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.CLOSING);
     });

  it('#destroy cancels layout handling if called on same frame as layout',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.layout();
       foundation.destroy();
       jasmine.clock().tick(1);

       expect(mockAdapter.areButtonsStacked).not.toHaveBeenCalled();
       expect(mockAdapter.isContentScrollable).not.toHaveBeenCalled();
     });

  it('#destroy deregisters event handlers on dialog content if they exist',
     () => {
       const {foundation, mockAdapter} = setupTest({isFullscreen: true});
       mockAdapter.isContentScrollable.and.returnValue(true);

       foundation.open();
       foundation.destroy();
       expect(mockAdapter.deregisterContentEventHandler)
           .toHaveBeenCalledWith('scroll', jasmine.any(Function));
     });

  it('#destroy deregisters event handlers on the window', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isContentScrollable.and.returnValue(true);

    foundation.open();
    foundation.destroy();
    expect(mockAdapter.deregisterWindowEventHandler)
        .toHaveBeenCalledWith('resize', jasmine.any(Function));
    expect(mockAdapter.deregisterWindowEventHandler)
        .toHaveBeenCalledWith('orientationchange', jasmine.any(Function));
  });

  it('#open adds CSS classes after rAF', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPEN);
    expect(mockAdapter.addBodyClass)
        .not.toHaveBeenCalledWith(cssClasses.SCROLL_LOCK);

    // Note: #open uses a combination of rAF and setTimeout due to Firefox
    // behavior, so we need to wait 2 ticks
    jasmine.clock().tick(1);
    jasmine.clock().tick(1);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPEN);
    expect(mockAdapter.addBodyClass)
        .toHaveBeenCalledWith(cssClasses.SCROLL_LOCK);
  });

  it('#close removes CSS classes', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.close();

    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPEN);
    expect(mockAdapter.removeBodyClass)
        .toHaveBeenCalledWith(cssClasses.SCROLL_LOCK);
  });

  it('#close cancels rAF scheduled by open if still pending', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.close();

    // Note: #open uses a combination of rAF and setTimeout due to Firefox
    // behavior, so we need to wait 2 ticks
    jasmine.clock().tick(1);
    jasmine.clock().tick(1);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('#open adds the opening class to start an animation, and removes it after the animation is done',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.open();
       jasmine.clock().tick(1);
       jasmine.clock().tick(100);

       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPENING);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.OPENING);
       jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPENING);
     });

  it('#close adds the closing class to start an animation, and removes it after the animation is done',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.open();
       jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
       foundation.close();

       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSING);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.CLOSING);
       jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.CLOSING);
     });

  it('#open activates focus trapping on the dialog surface', () => {
    const {foundation, mockAdapter} = setupTest();

    const button = document.createElement('button');
    mockAdapter.getInitialFocusEl.and.returnValue(button);
    foundation.open();

    // Wait for application of opening class and setting of additional timeout
    // prior to full open animation timeout
    jasmine.clock().tick(1);
    jasmine.clock().tick(100);
    jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);

    expect(mockAdapter.trapFocus).toHaveBeenCalledWith(button);
  });

  it('#close deactivates focus trapping on the dialog surface', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();

    foundation.close();

    // Wait till setTimeout callback is executed.
    jasmine.clock().tick(1);
    jasmine.clock().tick(100);
    jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);

    expect(mockAdapter.releaseFocus).toHaveBeenCalled();
  });

  it('#open emits "opening" and "opened" events', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    jasmine.clock().tick(1);
    jasmine.clock().tick(100);

    expect(mockAdapter.notifyOpening).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
    expect(mockAdapter.notifyOpened).toHaveBeenCalledTimes(1);
  });

  it('#close emits "closing" and "closed" events', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);
    foundation.close();

    expect(mockAdapter.notifyClosing).toHaveBeenCalledWith('');
    jasmine.clock().tick(numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);
    expect(mockAdapter.notifyClosed).toHaveBeenCalledWith('');

    foundation.open();
    jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS);

    const action = 'action';
    foundation.close(action);
    expect(mockAdapter.notifyClosing).toHaveBeenCalledWith(action);
    jasmine.clock().tick(numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);
    expect(mockAdapter.notifyClosed).toHaveBeenCalledWith(action);
  });

  it('#close does nothing if the dialog is already closed', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.close();
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(cssClasses.OPEN);
    expect(mockAdapter.removeBodyClass)
        .not.toHaveBeenCalledWith(cssClasses.SCROLL_LOCK);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.CLOSING);
    expect(mockAdapter.releaseFocus).not.toHaveBeenCalled();
    expect(mockAdapter.notifyClosing).not.toHaveBeenCalledWith('');
  });

  it('#isOpen returns false when the dialog has never been opened', () => {
    const {foundation} = setupTest();
    expect(foundation.isOpen()).toBe(false);
  });

  it('#isOpen returns true when the dialog is open', () => {
    const {foundation} = setupTest();

    foundation.open();

    expect(foundation.isOpen()).toBe(true);
  });

  it('#isOpen returns false when the dialog is closed after being open', () => {
    const {foundation} = setupTest();

    foundation.open();
    foundation.close();

    expect(foundation.isOpen()).toBe(false);
  });

  it('#open recalculates layout', () => {
    const {foundation} = setupTest();

    foundation.layout = jasmine.createSpy('layout');

    foundation.open();
    jasmine.clock().tick(1);
    jasmine.clock().tick(100);

    expect(foundation.layout).toHaveBeenCalled();
  });

  it('#open registers scroll event handler if dialog is full-screen and scrollable',
     () => {
       const {foundation, mockAdapter} = setupTest({isFullscreen: true});
       mockAdapter.isContentScrollable.and.returnValue(true);

       foundation.open();

       expect(mockAdapter.registerContentEventHandler)
           .toHaveBeenCalledWith('scroll', jasmine.any(Function));
     });

  it('#open registers scroll event handler if dialog is full-screen and not scrollable',
     () => {
       const {foundation, mockAdapter} = setupTest({isFullscreen: true});
       mockAdapter.isContentScrollable.and.returnValue(false);

       foundation.open();

       expect(mockAdapter.registerContentEventHandler)
           .toHaveBeenCalledWith('scroll', jasmine.any(Function));
     });

  it('#open doesn\'t registers scroll event handler if dialog is not full-screen',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.isContentScrollable.and.returnValue(true);

       foundation.open();

       expect(mockAdapter.registerContentEventHandler)
           .not.toHaveBeenCalledWith('scroll', jasmine.any(Function));
     });

  it('#close deregisters scroll event handler if dialog is full-screen and scrollable',
     () => {
       const {foundation, mockAdapter} = setupTest({isFullscreen: true});
       mockAdapter.isContentScrollable.and.returnValue(true);

       foundation.open();
       foundation.close();

       expect(mockAdapter.deregisterContentEventHandler)
           .toHaveBeenCalledWith('scroll', jasmine.any(Function));
     });

  it('#close deregisters scroll event handler if dialog is full-screen and not scrollable',
     () => {
       const {foundation, mockAdapter} = setupTest({isFullscreen: true});
       mockAdapter.isContentScrollable.and.returnValue(false);

       foundation.open();
       foundation.close();

       expect(mockAdapter.deregisterContentEventHandler)
           .toHaveBeenCalledWith('scroll', jasmine.any(Function));
     });

  it('#open hides the scrim if "isAboveFullscreenDialog" is true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.open({isAboveFullscreenDialog: true});

    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.SCRIM_HIDDEN);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPENING);
  });

  it('#open registers resize and orientationchange event listeners on the window',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.open();

       expect(mockAdapter.registerWindowEventHandler)
           .toHaveBeenCalledWith('resize', jasmine.any(Function));
       expect(mockAdapter.registerWindowEventHandler)
           .toHaveBeenCalledWith('orientationchange', jasmine.any(Function));
     });

  it('#close deregisters resize and orientationchange event listeners on the window',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.open();
       foundation.close();

       expect(mockAdapter.deregisterWindowEventHandler)
           .toHaveBeenCalledWith('resize', jasmine.any(Function));
       expect(mockAdapter.deregisterWindowEventHandler)
           .toHaveBeenCalledWith('orientationchange', jasmine.any(Function));
     });

  it(`#layout removes ${
         cssClasses.STACKED} class, detects stacked buttons, and adds class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.areButtonsStacked.and.returnValue(true);

       foundation.layout();
       jasmine.clock().tick(1);

       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.STACKED);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.STACKED);
     });

  it(`#layout removes ${
         cssClasses
             .STACKED} class, detects unstacked buttons, and does not add class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.areButtonsStacked.and.returnValue(true);

       foundation.setAutoStackButtons(false);
       foundation.layout();
       jasmine.clock().tick(1);

       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.STACKED);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.STACKED);
     });

  it('#layout adds scrollable class when content is scrollable', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isContentScrollable.and.returnValue(true);

    foundation.layout();
    jasmine.clock().tick(1);

    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.SCROLLABLE);
  });

  it('#layout removes scrollable class when content is not scrollable', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isContentScrollable.and.returnValue(false);

    foundation.layout();

    jasmine.clock().tick(1);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.SCROLLABLE);
  });

  it('#layout adds header scroll divider if dialog is fullscreen and content is scrolled',
     () => {
       const {foundation, mockAdapter} = setupTest({isFullscreen: true});
       mockAdapter.isContentScrollable.and.returnValue(true);
       mockAdapter.isScrollableContentAtTop.and.returnValue(false);

       foundation.layout();
       jasmine.clock().tick(1);

       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(cssClasses.SCROLL_DIVIDER_HEADER);
     });

  it('#layout adds footer scroll divider if dialog is fullscreen and content is scrollable',
     () => {
       const {foundation, mockAdapter} = setupTest({isFullscreen: true});
       mockAdapter.isContentScrollable.and.returnValue(true);
       mockAdapter.isScrollableContentAtBottom.and.returnValue(false);

       foundation.layout();
       jasmine.clock().tick(1);

       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(cssClasses.SCROLL_DIVIDER_FOOTER);
     });

  it(`#handleClick: Click closes dialog when ${
         strings.ACTION_ATTRIBUTE} attribute is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       const action = 'action';
       foundation.close = jasmine.createSpy('close');

       const event = {target: {}} as MouseEvent;
       mockAdapter.getActionFromEvent.withArgs(event).and.returnValue(action);
       foundation.open();
       foundation.handleClick(event);

       expect(foundation.close).toHaveBeenCalledWith(action);
     });

  it('#handleKeydown: Keydown does not close dialog with action for non-activation keys',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const action = 'action';
       const event = {type: 'keydown', key: 'Shift', target: {}} as
           KeyboardEvent;
       foundation.close = jasmine.createSpy('close');
       mockAdapter.getActionFromEvent.withArgs(event).and.returnValue(action);

       foundation.open();
       foundation.handleKeydown(event);

       expect(foundation.close).not.toHaveBeenCalledWith(action);
     });

  it(`#handleClick: Click does nothing when ${
         strings.ACTION_ATTRIBUTE} attribute is not present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.close = jasmine.createSpy('close');

       const event = {target: {}} as MouseEvent;
       mockAdapter.getActionFromEvent.withArgs(event).and.returnValue('');
       foundation.open();
       foundation.handleClick(event);

       expect(foundation.close).not.toHaveBeenCalledWith(jasmine.any(String));
     });

  it(`#handleKeydown: Keydown does nothing when ${
         strings.ACTION_ATTRIBUTE} attribute is not present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.close = jasmine.createSpy('close');

       ENTER_EVENTS.forEach((event) => {
         mockAdapter.getActionFromEvent.withArgs(event).and.returnValue('');
         foundation.open();
         foundation.handleKeydown(event);

         expect(foundation.close).not.toHaveBeenCalledWith(jasmine.any(String));
       });
     });

  it('#handleKeydown: Enter keydown calls adapter.clickDefaultButton', () => {
    const {foundation, mockAdapter} = setupTest();

    ENTER_EVENTS.forEach((event) => {
      foundation.handleKeydown(event);
      expect(mockAdapter.clickDefaultButton).toHaveBeenCalled();
    });
  });

  it('#handleKeydown: Enter keydown does not call adapter.clickDefaultButton when it should be suppressed',
     () => {
       const {foundation, mockAdapter} = setupTest();

       ENTER_EVENTS.forEach((event) => {
         mockAdapter.eventTargetMatches
             .withArgs(event.target, strings.SUPPRESS_DEFAULT_PRESS_SELECTOR)
             .and.returnValue(true);
         foundation.handleKeydown(event);
         expect(mockAdapter.clickDefaultButton).not.toHaveBeenCalled();
       });
     });

  it(`#handleClick: Click closes dialog when ${
         strings.SCRIM_SELECTOR} selector matches`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = {type: 'click', target: {}} as MouseEvent;
       foundation.close = jasmine.createSpy('close');
       mockAdapter.eventTargetMatches
           .withArgs(event.target, strings.SCRIM_SELECTOR)
           .and.returnValue(true);

       foundation.open();
       foundation.handleClick(event);

       expect(foundation.close)
           .toHaveBeenCalledWith(foundation.getScrimClickAction());
     });

  it(`#handleClick: Click does nothing when ${
         strings.SCRIM_SELECTOR} class is present but scrimClickAction is 
    empty string`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       const event = {type: 'click', target: {}} as MouseEvent;
       foundation.close = jasmine.createSpy('close');
       mockAdapter.eventTargetMatches
           .withArgs(event.target, strings.SCRIM_SELECTOR)
           .and.returnValue(true);

       foundation.setScrimClickAction('');
       foundation.open();
       foundation.handleClick(event);

       expect(foundation.close).not.toHaveBeenCalledWith(jasmine.any(String));
     });

  it('escape keydown closes the dialog (via key property)', () => {
    const {foundation} = setupTest();
    foundation.close = jasmine.createSpy('close');

    foundation.open();
    foundation.handleDocumentKeydown({key: 'Escape'} as KeyboardEvent);

    expect(foundation.close)
        .toHaveBeenCalledWith(foundation.getEscapeKeyAction());
  });

  it('escape keydown closes the dialog (via keyCode property)', () => {
    const {foundation} = setupTest();
    foundation.close = jasmine.createSpy('close');

    foundation.open();
    foundation.handleDocumentKeydown({keyCode: 27} as KeyboardEvent);

    expect(foundation.close)
        .toHaveBeenCalledWith(foundation.getEscapeKeyAction());
  });

  it('escape keydown does nothing if escapeKeyAction is set to empty string',
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');

       foundation.setEscapeKeyAction('');
       foundation.open();
       foundation.handleDocumentKeydown({key: 'Escape'} as KeyboardEvent);

       expect(foundation.close)
           .not.toHaveBeenCalledWith(foundation.getEscapeKeyAction());
     });

  it('keydown does nothing when key other than escape is pressed', () => {
    const {foundation} = setupTest();
    foundation.close = jasmine.createSpy('close');

    foundation.open();
    foundation.handleDocumentKeydown({key: 'Enter'} as KeyboardEvent);

    expect(foundation.close)
        .not.toHaveBeenCalledWith(foundation.getEscapeKeyAction());
  });

  it('#getAutoStackButtons reflects setting of #setAutoStackButtons', () => {
    const {foundation} = setupTest();
    foundation.setAutoStackButtons(false);
    expect(foundation.getAutoStackButtons()).toBe(false);
    foundation.setAutoStackButtons(true);
    expect(foundation.getAutoStackButtons()).toBe(true);
  });

  it('#getEscapeKeyAction reflects setting of #setEscapeKeyAction', () => {
    const {foundation} = setupTest();
    const action = 'foo';
    foundation.setEscapeKeyAction(action);
    expect(foundation.getEscapeKeyAction()).toBe(action);
  });

  it('#getScrimClickAction reflects setting of #setScrimClickAction', () => {
    const {foundation} = setupTest();
    const action = 'foo';
    foundation.setScrimClickAction(action);
    expect(foundation.getScrimClickAction()).toBe(action);
  });

  it('shows header scroll divider on scrollable full-screen dialogs', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.FULLSCREEN).and.returnValue(true);
    mockAdapter.isContentScrollable.and.returnValue(true);
    mockAdapter.registerContentEventHandler.and.callThrough();
    mockAdapter.isScrollableContentAtTop.and.returnValue(false);

    foundation.open();
    foundation['handleScrollEvent']();
    jasmine.clock().tick(1);

    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.SCROLL_DIVIDER_HEADER);
  });

  it('removes header scroll divider on scrollable full-screen dialogs when content is at top',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.FULLSCREEN)
           .and.returnValue(true);
       mockAdapter.isContentScrollable.and.returnValue(true);
       mockAdapter.registerContentEventHandler.and.callThrough();
       mockAdapter.isScrollableContentAtTop.and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.SCROLL_DIVIDER_HEADER)
           .and.returnValue(true);

       foundation.open();
       foundation['handleScrollEvent']();
       jasmine.clock().tick(1);

       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.SCROLL_DIVIDER_HEADER);
     });

  it('shows footer scroll divider on scrollable full-screen dialogs', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.FULLSCREEN).and.returnValue(true);
    mockAdapter.isContentScrollable.and.returnValue(true);
    mockAdapter.registerContentEventHandler.and.callThrough();
    mockAdapter.isScrollableContentAtBottom.and.returnValue(false);

    foundation.open();
    foundation['handleScrollEvent']();
    jasmine.clock().tick(1);

    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.SCROLL_DIVIDER_FOOTER);
  });

  it('removes footer scroll divider on scrollable full-screen dialogs when content is at bottom',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.FULLSCREEN)
           .and.returnValue(true);
       mockAdapter.isContentScrollable.and.returnValue(true);
       mockAdapter.registerContentEventHandler.and.callThrough();
       mockAdapter.isScrollableContentAtBottom.and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.SCROLL_DIVIDER_FOOTER)
           .and.returnValue(true);

       foundation.open();
       foundation['handleScrollEvent']();
       jasmine.clock().tick(1);

       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.SCROLL_DIVIDER_FOOTER);
     });

  it('#showSurfaceScrim adds css classes to show surface scrim', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.showSurfaceScrim();

    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.SURFACE_SCRIM_SHOWING);
    // tick to wait for next animation frame
    jasmine.clock().tick(1);
    jasmine.clock().tick(100);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.SURFACE_SCRIM_SHOWN);
  });

  it('#hideSurfaceScrim adds css classes to hide surface scrim', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.hideSurfaceScrim();

    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.SURFACE_SCRIM_SHOWN);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.SURFACE_SCRIM_HIDING);
  });

  it('#handleSurfaceScrimTransitionEnd removes surface-scrim animation classes',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.handleSurfaceScrimTransitionEnd();

       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.SURFACE_SCRIM_SHOWING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.SURFACE_SCRIM_HIDING);
     });
});
