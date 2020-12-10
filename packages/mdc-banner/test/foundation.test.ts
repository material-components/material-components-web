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
import {CloseReason, cssClasses, numbers} from '../constants';
import {MDCBannerFoundation} from '../foundation';

describe('MDCBannerFoundation', () => {
  setUpMdcTestEnvironment();

  it('default adapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCBannerFoundation, [
      'addClass',
      'getContentHeight',
      'notifyOpening',
      'notifyOpened',
      'notifyClosing',
      'notifyClosed',
      'setStyleProperty',
      'removeClass',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCBannerFoundation);
    return {foundation, mockAdapter};
  };

  it('#destroy cancels all timers', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.destroy();

    jasmine.clock().tick(1);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('#layout sets the root element height to the content height', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.layout();
    expect(mockAdapter.getContentHeight).toHaveBeenCalled();
    // 0px since nothing is being generated.
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('height', '0px');
  });

  it('#open adds CSS classes after rAF', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPEN);

    jasmine.clock().tick(1);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('#close removes CSS classes', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.close(CloseReason.UNSPECIFIED);

    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('#close cancels rAF scheduled by open if still pending', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    foundation.close(CloseReason.UNSPECIFIED);

    jasmine.clock().tick(1);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('#open adds the opening class to start an animation, and removes it after the animation is done',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.open();
       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPENING);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.OPENING);

       jasmine.clock().tick(1);
       jasmine.clock().tick(numbers.BANNER_ANIMATION_OPEN_TIME_MS);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPENING);
     });

  it('#close adds the closing class to start an animation, and removes it after the animation is done',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.open();
       jasmine.clock().tick(numbers.BANNER_ANIMATION_OPEN_TIME_MS);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.CLOSING);
       expect(mockAdapter.removeClass).toHaveBeenCalledTimes(1);
       foundation.close(CloseReason.UNSPECIFIED);

       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSING);
       jasmine.clock().tick(numbers.BANNER_ANIMATION_CLOSE_TIME_MS);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.CLOSING);
     });

  it('#open emits "opening" and "opened" events', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    expect(mockAdapter.notifyOpening).toHaveBeenCalledTimes(1);

    jasmine.clock().tick(1);
    jasmine.clock().tick(numbers.BANNER_ANIMATION_OPEN_TIME_MS);
    expect(mockAdapter.notifyOpened).toHaveBeenCalledTimes(1);
  });

  it('#close emits "closing" and "closed" events', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.open();
    jasmine.clock().tick(numbers.BANNER_ANIMATION_OPEN_TIME_MS);
    foundation.close(CloseReason.UNSPECIFIED);

    expect(mockAdapter.notifyClosing)
        .toHaveBeenCalledWith(CloseReason.UNSPECIFIED);
    expect(mockAdapter.notifyClosing).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(numbers.BANNER_ANIMATION_CLOSE_TIME_MS);
    expect(mockAdapter.notifyClosed)
        .toHaveBeenCalledWith(CloseReason.UNSPECIFIED);
    expect(mockAdapter.notifyClosed).toHaveBeenCalledTimes(1);
  });

  it('#close does nothing if the banner is already closed', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.close(CloseReason.UNSPECIFIED);
    jasmine.clock().tick(1);
    jasmine.clock().tick(numbers.BANNER_ANIMATION_CLOSE_TIME_MS);
    expect(mockAdapter.removeClass).not.toHaveBeenCalledWith(cssClasses.OPEN);
    expect(mockAdapter.removeClass)
        .not.toHaveBeenCalledWith(cssClasses.OPENING);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.CLOSING);
    expect(mockAdapter.notifyClosing).not.toHaveBeenCalledWith('');
    expect(mockAdapter.notifyClosed).not.toHaveBeenCalledWith('');
  });

  it('#isOpen returns false when the banner has never been opened', () => {
    const {foundation} = setupTest();
    expect(foundation.isOpen()).toBe(false);
  });

  it('#isOpen returns true when the banner is open', () => {
    const {foundation} = setupTest();

    foundation.open();

    expect(foundation.isOpen()).toBe(true);
  });

  it('#isOpen returns false when the banner is closed after being open', () => {
    const {foundation} = setupTest();

    foundation.open();
    foundation.close(CloseReason.UNSPECIFIED);

    expect(foundation.isOpen()).toBe(false);
  });

  it(`#handlePrimaryActionClick closes the banner with reason "${
         CloseReason.PRIMARY}"`,
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');

       foundation.open();
       foundation.handlePrimaryActionClick();

       expect(foundation.close).toHaveBeenCalledWith(CloseReason.PRIMARY);
     });

  it(`#handleSecondaryActionClick closes the banner with reason "${
         CloseReason.PRIMARY}"`,
     () => {
       const {foundation} = setupTest();
       foundation.close = jasmine.createSpy('close');

       foundation.open();
       foundation.handleSecondaryActionClick();

       expect(foundation.close).toHaveBeenCalledWith(CloseReason.SECONDARY);
     });
});
