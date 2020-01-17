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

import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {cssClasses, numbers, strings} from '../constants';
import {MDCSnackbarFoundation} from '../foundation';

describe('MDCSnackbarFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports cssClasses', () => {
    expect(MDCSnackbarFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports strings', () => {
    expect(MDCSnackbarFoundation.strings).toEqual(strings);
  });

  it('exports numbers', () => {
    expect(MDCSnackbarFoundation.numbers).toEqual(numbers);
  });

  it('default adapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCSnackbarFoundation, [
      'addClass',
      'removeClass',
      'announce',
      'notifyOpening',
      'notifyOpened',
      'notifyClosing',
      'notifyClosed',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCSnackbarFoundation);
    return {foundation, mockAdapter};
  };

  it('#destroy removes all animating and open classes', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.destroy();

    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPENING);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPEN);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.CLOSING);
  });

  it('#destroy cancels all timers', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.close = jasmine.createSpy('close');

    foundation.open();
    foundation.destroy();

    // Note: #open uses a combination of rAF and setTimeout due to Firefox
    // behavior, so we need to wait 2 ticks
    jasmine.clock().tick(2);

    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPEN);

    jasmine.clock().tick(1);
    expect(foundation.close).not.toHaveBeenCalledWith(strings.REASON_DISMISS);
  });

  it('#open announces text to screen readers', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    expect(mockAdapter.announce).toHaveBeenCalledTimes(1);
  });

  it('#open adds CSS classes after rAF', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPEN);

    // Note: #open uses a combination of rAF and setTimeout due to Firefox
    // behavior, so we need to wait 2 ticks
    jasmine.clock().tick(2);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('#close removes CSS classes', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.close();

    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('#close cancels rAF scheduled by open if still pending', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.close();

    // Note: #open uses a combination of rAF and setTimeout due to Firefox
    // behavior, so we need to wait 2 ticks
    jasmine.clock().tick(2);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('#open adds the opening class to start an animation, and removes it after the animation is done',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.open();
       jasmine.clock().tick(101);

       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPENING);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.OPENING);
       jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPENING);
     });

  it('#close adds the closing class to start an animation, and removes it after the animation is done',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.open();
       jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.CLOSING);
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
       foundation.close();

       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSING);
       jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.CLOSING);
       // Once in #open, twice in #close and twice in #handleAnimationTimerEnd_
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(5);
     });

  it('#open emits "opening" and "opened" events', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    jasmine.clock().tick(101);

    expect(mockAdapter.notifyOpening).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
    expect(mockAdapter.notifyOpened).toHaveBeenCalledTimes(1);
  });

  it('#close emits "closing" and "closed" events', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
    foundation.close();

    expect(mockAdapter.notifyClosing).toHaveBeenCalledWith('');
    expect(mockAdapter.notifyClosing).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
    expect(mockAdapter.notifyClosed).toHaveBeenCalledWith('');
    expect(mockAdapter.notifyClosed).toHaveBeenCalledTimes(1);

    foundation.open();
    jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);

    const reason = 'reason';
    foundation.close(reason);
    expect(mockAdapter.notifyClosing).toHaveBeenCalledWith(reason);
    expect(mockAdapter.notifyClosing).toHaveBeenCalledTimes(2);
    jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
    expect(mockAdapter.notifyClosed).toHaveBeenCalledWith(reason);
    expect(mockAdapter.notifyClosed).toHaveBeenCalledTimes(2);
  });

  it('#close does nothing if the snackbar is already closed', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.close();
    jasmine.clock().tick(1);
    jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(cssClasses.OPEN);
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.OPENING);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.CLOSING);
    expect(mockAdapter.notifyClosing).not.toHaveBeenCalledWith('');
    expect(mockAdapter.notifyClosed).not.toHaveBeenCalledWith('');
  });

  it('#open automatically dismisses snackbar after timeout', () => {
    const {foundation} = setupTest();
    foundation.close = jasmine.createSpy('close');

    foundation.open();

    // Note: #open uses a combination of rAF and setTimeout due to Firefox
    // behavior, so we need to wait 2 ticks
    jasmine.clock().tick(2);

    // Auto-dismiss timeout
    jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
    jasmine.clock().tick(foundation.getTimeoutMs());

    expect(foundation.close).toHaveBeenCalledWith(strings.REASON_DISMISS);
    expect(foundation.close).toHaveBeenCalledTimes(1);
  });

  it('#snackbar remains open for indefinite timeout', () => {
    const {foundation} = setupTest();
    foundation.close = jasmine.createSpy('close');
    foundation.setTimeoutMs(-1);

    foundation.open();

    // Note: #open uses a combination of rAF and setTimeout due to Firefox
    // behavior, so we need to wait 2 ticks
    jasmine.clock().tick(2);

    // Wait for max timeout and ensure that close has not been called
    jasmine.clock().tick(numbers.SNACKBAR_ANIMATION_OPEN_TIME_MS);
    jasmine.clock().tick(numbers.MAX_AUTO_DISMISS_TIMEOUT_MS);

    expect(foundation.close).not.toHaveBeenCalledWith(strings.REASON_DISMISS);
  });

  it('#isOpen returns false when the snackbar has never been opened', () => {
    const {foundation} = setupTest();
    expect(foundation.isOpen()).toBe(false);
  });

  it('#isOpen returns true when the snackbar is open', () => {
    const {foundation} = setupTest();

    foundation.open();

    expect(foundation.isOpen()).toBe(true);
  });

  it('#isOpen returns false when the snackbar is closed after being open',
     () => {
       const {foundation} = setupTest();

       foundation.open();
       foundation.close();

       expect(foundation.isOpen()).toBe(false);
     });

  it('escape keydown closes snackbar when closeOnEscape is true (via key property)',
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');

       foundation.open();
       foundation.handleKeyDown({key: 'Escape'});

       expect(foundation.close).toHaveBeenCalledWith(strings.REASON_DISMISS);
     });

  it('escape keydown closes snackbar when closeOnEscape is true (via keyCode property)',
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');

       foundation.open();
       foundation.handleKeyDown({keyCode: 27});

       expect(foundation.close).toHaveBeenCalledWith(strings.REASON_DISMISS);
     });

  it('escape keydown does not close snackbar when closeOnEscape is false (via key property)',
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');
       foundation.setCloseOnEscape(false);

       foundation.open();
       foundation.handleKeyDown({key: 'Escape'});

       expect(foundation.close)
           .not.toHaveBeenCalledWith(strings.REASON_DISMISS);
     });

  it('escape keydown does not close snackbar when closeOnEscape is false (via keyCode property)',
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');
       foundation.setCloseOnEscape(false);

       foundation.open();
       foundation.handleKeyDown({keyCode: 27});

       expect(foundation.close)
           .not.toHaveBeenCalledWith(strings.REASON_DISMISS);
     });

  it('keydown does nothing when key other than escape is pressed', () => {
    const {foundation} = setupTest();
    foundation.close = jasmine.createSpy('close');

    foundation.open();
    foundation.handleKeyDown({key: 'Enter'});

    expect(foundation.close).not.toHaveBeenCalledWith(strings.REASON_DISMISS);
  });

  it(`#handleActionButtonClick closes the snackbar with reason "${
         strings.REASON_ACTION}"`,
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');

       foundation.open();
       foundation.handleActionButtonClick({});

       expect(foundation.close).toHaveBeenCalledWith(strings.REASON_ACTION);
     });

  it(`#handleActionIconClick closes the snackbar with reason "${
         strings.REASON_DISMISS}"`,
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');

       foundation.open();
       foundation.handleActionIconClick({});

       expect(foundation.close).toHaveBeenCalledWith(strings.REASON_DISMISS);
     });

  it('#setTimeoutMs throws an error for values outside the min/max range',
     () => {
       const {foundation} = setupTest();
       expect(
           () =>
               foundation.setTimeoutMs(numbers.MIN_AUTO_DISMISS_TIMEOUT_MS - 1))
           .toThrow();
       expect(
           () =>
               foundation.setTimeoutMs(numbers.MAX_AUTO_DISMISS_TIMEOUT_MS + 1))
           .toThrow();
     });

  it('#getTimeoutMs returns the default value', () => {
    const {foundation} = setupTest();
    expect(foundation.getTimeoutMs())
        .toEqual(numbers.DEFAULT_AUTO_DISMISS_TIMEOUT_MS);
  });

  it('#getTimeoutMs returns the value set by setTimeoutMs', () => {
    const {foundation} = setupTest();
    const timeoutMs = numbers.MAX_AUTO_DISMISS_TIMEOUT_MS - 1;
    foundation.setTimeoutMs(timeoutMs);
    expect(foundation.getTimeoutMs()).toEqual(timeoutMs);
  });

  it('#getCloseOnEscape returns the value set by setCloseOnEscape', () => {
    const {foundation} = setupTest();
    foundation.setCloseOnEscape(false);
    expect(foundation.getCloseOnEscape()).toEqual(false);
    foundation.setCloseOnEscape(true);
    expect(foundation.getCloseOnEscape()).toEqual(true);
  });
});
