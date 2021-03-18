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

import {animationDimensionPercentages as percentages} from '../../mdc-linear-progress/constants';
import {MDCLinearProgressFoundation} from '../../mdc-linear-progress/foundation';
import {WithMDCResizeObserver} from '../../mdc-linear-progress/types';
import {checkNumTimesSpyCalledWithArgs, verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';

const {cssClasses, strings} = MDCLinearProgressFoundation;

const RO = (window as unknown as WithMDCResizeObserver).ResizeObserver;

const multiplyPercentages = (multipler: number) => {
  return {
    PRIMARY_HALF: percentages.PRIMARY_HALF * multipler,
    PRIMARY_FULL: percentages.PRIMARY_FULL * multipler,
    SECONDARY_QUARTER: percentages.SECONDARY_QUARTER * multipler,
    SECONDARY_HALF: percentages.SECONDARY_HALF * multipler,
    SECONDARY_FULL: percentages.SECONDARY_FULL * multipler,
  };
};

describe('MDCLinearProgressFoundation', () => {
  it('exports strings', () => {
    expect('strings' in MDCLinearProgressFoundation).toBeTruthy();
  });

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCLinearProgressFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCLinearProgressFoundation, [
      'addClass',
      'attachResizeObserver',
      'forceLayout',
      'getWidth',
      'hasClass',
      'removeAttribute',
      'removeClass',
      'setAttribute',
      'setBufferBarStyle',
      'setPrimaryBarStyle',
      'setStyle',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCLinearProgressFoundation);
    return {foundation, mockAdapter};
  };

  it('#setDeterminate false updates state, adds class, resets transforms, and removes aria-valuenow',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
           .and.returnValue(false);
       foundation.init();
       foundation.setDeterminate(false);
       expect(foundation.isDeterminate()).toBe(false);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(cssClasses.INDETERMINATE_CLASS);
       expect(mockAdapter.setPrimaryBarStyle)
           .toHaveBeenCalledWith('transform', 'scaleX(1)');
       expect(mockAdapter.setBufferBarStyle)
           .toHaveBeenCalledWith('flex-basis', '100%');
       expect(mockAdapter.removeAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUENOW);
       expect(mockAdapter.removeAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUEMAX);
       expect(mockAdapter.removeAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUEMIN);
     });

  it('#setDeterminate false updates custom props', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getWidth.and.returnValue(100);
    mockAdapter.attachResizeObserver.and.returnValue(RO);
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    foundation.init();
    expect(mockAdapter.attachResizeObserver).toHaveBeenCalled();
    expect(mockAdapter.setStyle).toHaveBeenCalledTimes(0);
    foundation.setDeterminate(false);
    expect(foundation.isDeterminate()).toBe(false);

    if (!RO) {
      expect(mockAdapter.setStyle).toHaveBeenCalledTimes(0);
      return;
    }

    expect(mockAdapter.setStyle).toHaveBeenCalledTimes(10);
    const testPercentages = multiplyPercentages(100);
    expect(mockAdapter.setStyle.calls.allArgs()).toEqual([
      [
        '--mdc-linear-progress-primary-half',
        `${testPercentages.PRIMARY_HALF}px`
      ],
      [
        '--mdc-linear-progress-primary-half-neg',
        `-${testPercentages.PRIMARY_HALF}px`
      ],
      [
        '--mdc-linear-progress-primary-full',
        `${testPercentages.PRIMARY_FULL}px`
      ],
      [
        '--mdc-linear-progress-primary-full-neg',
        `-${testPercentages.PRIMARY_FULL}px`
      ],
      [
        '--mdc-linear-progress-secondary-quarter',
        `${testPercentages.SECONDARY_QUARTER}px`
      ],
      [
        '--mdc-linear-progress-secondary-quarter-neg',
        `-${testPercentages.SECONDARY_QUARTER}px`
      ],
      [
        '--mdc-linear-progress-secondary-half',
        `${testPercentages.SECONDARY_HALF}px`
      ],
      [
        '--mdc-linear-progress-secondary-half-neg',
        `-${testPercentages.SECONDARY_HALF}px`
      ],
      [
        '--mdc-linear-progress-secondary-full',
        `${testPercentages.SECONDARY_FULL}px`
      ],
      [
        '--mdc-linear-progress-secondary-full-neg',
        `-${testPercentages.SECONDARY_FULL}px`
      ]
    ]);
  });

  it('#setDeterminate updates state and removes class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    foundation.init();
    foundation.setDeterminate(true);
    expect(foundation.isDeterminate()).toBe(true);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.INDETERMINATE_CLASS);
  });

  it('#setDeterminate restores previous progress value after toggled from false to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       foundation.setProgress(0.123);
       foundation.setDeterminate(false);
       foundation.setDeterminate(true);

       checkNumTimesSpyCalledWithArgs(
           mockAdapter.setPrimaryBarStyle, ['transform', 'scaleX(0.123)'], 2);
       checkNumTimesSpyCalledWithArgs(
           mockAdapter.setAttribute, [strings.ARIA_VALUENOW, '0.123'], 2);
     });

  it('#setDeterminate restores previous buffer value after toggled from false to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       foundation.setBuffer(0.123);
       foundation.setDeterminate(false);
       foundation.setDeterminate(true);
       checkNumTimesSpyCalledWithArgs(
           mockAdapter.setBufferBarStyle, ['flex-basis', '12.3%'], 2);
     });

  it('#setDeterminate updates progress value set while determinate is false after determinate is true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       foundation.setDeterminate(false);
       foundation.setProgress(0.123);
       foundation.setDeterminate(true);
       expect(mockAdapter.setPrimaryBarStyle)
           .toHaveBeenCalledWith('transform', 'scaleX(0.123)');
       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUENOW, '0.123');
       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUEMAX, '1');
       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith(strings.ARIA_VALUEMIN, '0');
     });

  it('#calculateAndSetDimensions called on initialization with indeterminate class',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
           .and.returnValue(true);
       mockAdapter.attachResizeObserver.and.returnValue(RO);
       foundation.init();
       expect(mockAdapter.setStyle).toHaveBeenCalledTimes(RO ? 10 : 0);
     });

  it('#calculateAndSetDimensions called only on setDeterminate(false)', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(true);
    mockAdapter.attachResizeObserver.and.returnValue(RO);
    foundation.init();
    expect(mockAdapter.setStyle).toHaveBeenCalledTimes(RO ? 10 : 0);

    foundation.setDeterminate(true);

    expect(mockAdapter.setStyle).toHaveBeenCalledTimes(RO ? 10 : 0);

    foundation.setDeterminate(false);

    expect(mockAdapter.setStyle).toHaveBeenCalledTimes(RO ? 20 : 0);
  });

  it('#calculateAndSetDimensions restarts animation with a forced reflow',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
           .and.returnValue(true);
       mockAdapter.attachResizeObserver.and.returnValue(RO);
       foundation.init();
       if (RO) {
         expect(mockAdapter.addClass)
             .toHaveBeenCalledWith(cssClasses.ANIMATION_READY_CLASS);
         expect(mockAdapter.forceLayout).toHaveBeenCalledTimes(1);
         expect(mockAdapter.removeClass)
             .toHaveBeenCalledWith(cssClasses.ANIMATION_READY_CLASS);
       } else {
         expect(mockAdapter.setStyle).toHaveBeenCalledTimes(0);
       }
     });

  it('#setProgress updates state, sets transform and aria-valuenow', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    foundation.init();
    foundation.setProgress(0.5);
    expect(foundation.getProgress()).toEqual(0.5);
    expect(mockAdapter.setPrimaryBarStyle)
        .toHaveBeenCalledWith('transform', 'scaleX(0.5)');
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith(strings.ARIA_VALUENOW, '0.5');
    expect(foundation.getProgress()).toEqual(0.5);
  });

  it('#setProgress on indeterminate does nothing', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(true);
    foundation.init();
    foundation.setProgress(0.5);
    expect(mockAdapter.setPrimaryBarStyle).not.toHaveBeenCalled();
    expect(mockAdapter.setAttribute).not.toHaveBeenCalled();
  });

  it('#setBuffer sets flex-basis', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(false);
    foundation.init();
    foundation.setBuffer(0.5);
    expect(mockAdapter.setBufferBarStyle)
        .toHaveBeenCalledWith('flex-basis', '50%');
    expect(foundation.getBuffer()).toEqual(0.5);
  });

  it('#setBuffer on indeterminate does nothing', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.INDETERMINATE_CLASS)
        .and.returnValue(true);
    foundation.init();
    foundation.setBuffer(0.5);
    expect(mockAdapter.setBufferBarStyle).not.toHaveBeenCalled();
  });

  it('#open removes class and aria-hidden', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    foundation.open();
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.CLOSED_CLASS);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(cssClasses.CLOSED_ANIMATION_OFF_CLASS);
    expect(mockAdapter.removeAttribute)
        .toHaveBeenCalledWith(strings.ARIA_HIDDEN);
  });

  it('#close adds class and aria-hidden', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    foundation.close();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CLOSED_CLASS);
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith(strings.ARIA_HIDDEN, 'true');
    mockAdapter.hasClass.withArgs(cssClasses.CLOSED_CLASS)
        .and.returnValue(true);
    foundation.handleTransitionEnd();
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(cssClasses.CLOSED_ANIMATION_OFF_CLASS);
    expect(foundation.isClosed()).toBeTrue();
  });

  it('#destroy disconnects the resize observer', () => {
    const {foundation, mockAdapter} = setupTest();
    let disconnected = false;
    const mockedObserver = {
      disconnect: () => {
        disconnected = true;
      }
    };
    mockAdapter.attachResizeObserver.and.returnValue(mockedObserver);
    foundation.init();
    const withObserver =
        foundation as unknown as {observer: typeof mockedObserver};

    expect(withObserver.observer).toEqual(mockedObserver);
    expect(disconnected).toBeFalse();

    foundation.destroy();

    expect(disconnected).toBeTrue();
  });
});
