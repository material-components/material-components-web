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

import {getCorrectPropertyName} from '../../mdc-animation/index';
import {cssClasses, numbers, strings} from '../../mdc-slider/constants';
import {MDCSliderFoundation} from '../../mdc-slider/foundation';
import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

const TRANSFORM_PROP = getCorrectPropertyName(window, 'transform');

describe('MDCSliderFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports cssClasses', () => {
    expect(MDCSliderFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports strings', () => {
    expect(MDCSliderFoundation.strings).toEqual(strings);
  });

  it('exports numbers', () => {
    expect(MDCSliderFoundation.numbers).toEqual(numbers);
  });

  it('default adapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCSliderFoundation, [
      'hasClass',
      'addClass',
      'removeClass',
      'getAttribute',
      'setAttribute',
      'removeAttribute',
      'computeBoundingRect',
      'getTabIndex',
      'registerInteractionHandler',
      'deregisterInteractionHandler',
      'registerThumbContainerInteractionHandler',
      'deregisterThumbContainerInteractionHandler',
      'registerBodyInteractionHandler',
      'deregisterBodyInteractionHandler',
      'registerResizeHandler',
      'deregisterResizeHandler',
      'notifyInput',
      'notifyChange',
      'setThumbContainerStyleProperty',
      'setTrackStyleProperty',
      'setMarkerValue',
      'setTrackMarkers',
      'isRTL',
    ]);
  });

  const setupTest =
      () => {
        const {foundation, mockAdapter} =
            setUpFoundationTest(MDCSliderFoundation);
        return {foundation, mockAdapter};
      }

  it('#constructor sets the default slider value to 0', () => {
    const {foundation} = setupTest();
    expect(foundation.getValue()).toEqual(0);
  });

  it('#constructor sets the default slider max to 100', () => {
    const {foundation} = setupTest();
    expect(foundation.getMax()).toEqual(100);
  });

  it('#constructor sets the default slider min to 0', () => {
    const {foundation} = setupTest();
    expect(foundation.getMin()).toEqual(0);
  });

  it('#constructor sets the default slider step to 0 (no step)', () => {
    const {foundation} = setupTest();
    expect(foundation.getStep()).toEqual(0);
  });

  it('#constructor sets the default disabled state to enabled', () => {
    const {foundation} = setupTest();
    expect(foundation.isDisabled()).toBe(false);
  });

  it('#init registers all necessary event handlers for the component', () => {
    const {foundation, mockAdapter} = setupTest();
    const isA = jasmine.any;

    mockAdapter.computeBoundingRect.and.returnValue({width: 0, left: 0});
    foundation.init();

    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('mousedown', isA(Function));
    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('pointerdown', isA(Function));
    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('touchstart', isA(Function));
    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('keydown', isA(Function));
    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('focus', isA(Function));
    expect(mockAdapter.registerInteractionHandler)
        .toHaveBeenCalledWith('blur', isA(Function));
    expect(mockAdapter.registerThumbContainerInteractionHandler)
        .toHaveBeenCalledWith('mousedown', isA(Function));
    expect(mockAdapter.registerThumbContainerInteractionHandler)
        .toHaveBeenCalledWith('pointerdown', isA(Function));
    expect(mockAdapter.registerThumbContainerInteractionHandler)
        .toHaveBeenCalledWith('touchstart', isA(Function));
    expect(mockAdapter.registerResizeHandler)
        .toHaveBeenCalledWith(isA(Function));
  });

  it('#init checks if slider is discrete and if display track markers', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({width: 100, left: 200});
    foundation.init();

    jasmine.clock().tick(1);

    expect(mockAdapter.hasClass).toHaveBeenCalledWith(cssClasses.IS_DISCRETE);
    expect(mockAdapter.hasClass)
        .toHaveBeenCalledWith(cssClasses.HAS_TRACK_MARKER);
  });

  it('#init sets step to one if slider is discrete but step is zero', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({width: 100, left: 200});
    mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE).and.returnValue(true);
    foundation.init();

    jasmine.clock().tick(1);

    expect(foundation.getStep()).toEqual(1);
  });

  it('#init performs an initial layout of the component', () => {
    const {foundation, mockAdapter} = setupTest();
    const anything = jasmine.anything;

    mockAdapter.computeBoundingRect.and.returnValue({width: 100, left: 200});
    foundation.init();

    jasmine.clock().tick(1);

    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(anything(), anything());
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(anything(), anything());
  });

  it('#destroy deregisters all component event handlers registered during init()',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const isA = jasmine.any;

       foundation.destroy();

       expect(mockAdapter.deregisterInteractionHandler)
           .toHaveBeenCalledWith('mousedown', isA(Function));
       expect(mockAdapter.deregisterInteractionHandler)
           .toHaveBeenCalledWith('pointerdown', isA(Function));
       expect(mockAdapter.deregisterInteractionHandler)
           .toHaveBeenCalledWith('touchstart', isA(Function));
       expect(mockAdapter.deregisterInteractionHandler)
           .toHaveBeenCalledWith('keydown', isA(Function));
       expect(mockAdapter.deregisterInteractionHandler)
           .toHaveBeenCalledWith('focus', isA(Function));
       expect(mockAdapter.deregisterInteractionHandler)
           .toHaveBeenCalledWith('blur', isA(Function));
       expect(mockAdapter.deregisterThumbContainerInteractionHandler)
           .toHaveBeenCalledWith('mousedown', isA(Function));
       expect(mockAdapter.deregisterThumbContainerInteractionHandler)
           .toHaveBeenCalledWith('pointerdown', isA(Function));
       expect(mockAdapter.deregisterThumbContainerInteractionHandler)
           .toHaveBeenCalledWith('touchstart', isA(Function));
       expect(mockAdapter.deregisterResizeHandler)
           .toHaveBeenCalledWith(isA(Function));
     });

  it('#setupTrackMarker sets correct number of markers to discrete slider with markers',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.HAS_TRACK_MARKER)
           .and.returnValue(true);
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setMax(100);
       foundation.setMin(0);
       foundation.setStep(10);
       foundation.setupTrackMarker();

       expect(mockAdapter.setTrackMarkers).toHaveBeenCalledWith(10, 100, 0);
     });

  it('#setupTrackMarker does execute if it is continuous slider', () => {
    const {foundation, mockAdapter} = setupTest();
    const isA = jasmine.any;

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
        .and.returnValue(false);
    mockAdapter.hasClass.withArgs(cssClasses.HAS_TRACK_MARKER)
        .and.returnValue(true);
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setMax(100);
    foundation.setMin(0);
    foundation.setStep(10);
    foundation.setupTrackMarker();

    expect(mockAdapter.setTrackMarkers)
        .not.toHaveBeenCalledWith(isA(Number), isA(Number), isA(Number));
  });

  it('#setupTrackMarker does execute if discrete slider does not display markers',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const isA = jasmine.any;

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.HAS_TRACK_MARKER)
           .and.returnValue(false);
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setMax(100);
       foundation.setMin(0);
       foundation.setStep(10);
       foundation.setupTrackMarker();

       expect(mockAdapter.setTrackMarkers)
           .not.toHaveBeenCalledWith(isA(Number), isA(Number), isA(Number));
     });

  it('#layout re-computes the bounding rect for the component on each call',
     () => {
       const {foundation, mockAdapter} = setupTest();
       let numComputations = 0;

       // NOTE: Using a counter for numComputations here since we do indeed need
       // to stub getComputedBoundingRect(), but verifying a stub gives a
       // warning from testdouble (rightfully so).
       mockAdapter.computeBoundingRect.and.callFake(() => {
         numComputations++;
         return /* dummy value */ {};
       });

       foundation.layout();
       foundation.layout();

       expect(numComputations).toEqual(2);
     });

  it('#layout re-updates the UI for the current value', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 50});

    foundation.init();
    jasmine.clock().tick(1);

    const halfMaxValue = 50;
    foundation.setValue(halfMaxValue);
    jasmine.clock().tick(1);
    // Sanity check
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(25px) translateX(-50%)');

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.layout();
    jasmine.clock().tick(1);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(50px) translateX(-50%)');
  });

  it('#getValue/#setValue retrieves / sets the max value, respectively', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(10);
    expect(foundation.getValue()).toEqual(10);
  });

  it('#getValue returns the current value of the slider (0 by default)', () => {
    const {foundation} = setupTest();
    expect(foundation.getValue()).toEqual(0);
  });

  it('#setValue does nothing if the value being set is the same as the current value',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(50px) translateX(-50%)');
     });

  it('#setValue quantizes the given value to the nearest step value when a step is set',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setStep(1);

       foundation.setValue(2.4);
       expect(foundation.getValue()).toEqual(2);

       foundation.setValue(2.6);
       expect(foundation.getValue()).toEqual(3);
     });

  it('#setValue does not quantize the given value if the value is set to the minimum value',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setMin(5);
       foundation.setStep(10);
       foundation.setValue(5);

       expect(foundation.getValue()).toEqual(5);
     });

  it('#setValue does not quantize the given value if the value is set to the maximum value',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setMax(102);
       foundation.setStep(20);
       foundation.setValue(102);

       expect(foundation.getValue()).toEqual(102);
     });

  it('#setValue clamps the value to the minimum value if given value is less than the minimum',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(foundation.getMin() - 1);

       expect(foundation.getValue()).toEqual(foundation.getMin());
     });

  it('#setValue clamps the value to the maximum value if given value is less than the maximum',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue((foundation.getMax() as number) + 1);
       expect(foundation.getValue()).toEqual(foundation.getMax());
     });

  it('#setValue updates "aria-valuenow" with the current value', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(10);

    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-valuenow', '10');
  });

  it('#setValue updates the slider thumb to represent the current value of the slider',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(75);
       jasmine.clock().tick(1);

       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(75px) translateX(-50%)');
     });

  it('#setValue updates the slider track to represent the current value of the slider',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(75);
       jasmine.clock().tick(1);

       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.75)');
     });

  it('#setValue respects the width of the slider when setting the thumb container transform',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 200});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(75);
       jasmine.clock().tick(1);

       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(150px) translateX(-50%)');
     });

  it('#setValue flips the slider thumb position across the X-axis when in an RTL context',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       mockAdapter.isRTL.and.returnValue(true);
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(75);
       jasmine.clock().tick(1);

       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(25px) translateX(-50%)');
     });

  it('#setValue does not cause any events to be fired', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({width: 0, left: 0});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(20);

    expect(mockAdapter.notifyInput).not.toHaveBeenCalled();
    expect(mockAdapter.notifyChange).not.toHaveBeenCalled();
  });

  it('#getMax/#setMax retrieves / sets the maximum value, respectively', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setMax(50);
    expect(foundation.getMax()).toEqual(50);
  });

  it('#setMax throws if the maximum value given is less than the minimum value',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setMin(50);
       expect(() => foundation.setMax(49)).toThrow();
     });

  it('#setMax clamps the value to the new maximum if above the new maximum',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(100);
       foundation.setMax(50);

       expect(foundation.getValue()).toEqual(50);
       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith('aria-valuenow', '50');
     });

  it('#setMax updates the slider\'s UI when clamping the value to a new maximum',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);
       // Sanity check
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.5)');

       foundation.setMax(50);
       jasmine.clock().tick(1);

       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(100px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(1)');
     });

  it('#setMax updates "aria-valuemax" to the new maximum', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setMax(50);

    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-valuemax', '50');
  });

  it('#setMax re-renders track markers if slider is discrete and displays markers',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const isA = jasmine.any;

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.HAS_TRACK_MARKER)
           .and.returnValue(true);
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setMax(50);

       expect(mockAdapter.setTrackMarkers)
           .toHaveBeenCalledWith(isA(Number), isA(Number), isA(Number));
     });


  it('#getMin/#setMin retrieves / sets the minimum value, respectively', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setMin(10);
    expect(foundation.getMin()).toEqual(10);
  });

  it('#setMin throws if the minimum value given is greater than the maximum value',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setMax(10);
       expect(() => foundation.setMin(11)).toThrow();
     });

  it('#setMin clamps the value to the new minimum if above the new minimum',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(5);
       foundation.setMin(10);

       expect(foundation.getValue()).toEqual(10);
       expect(mockAdapter.setAttribute)
           .toHaveBeenCalledWith('aria-valuenow', '10');
     });

  it('#setMin updates the slider\'s UI when clamping the value to a new minimum',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(10);
       jasmine.clock().tick(1);
       // Sanity check
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.1)');

       foundation.setMin(10);
       jasmine.clock().tick(1);

       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(0px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0)');
     });

  it('#setMin updates "aria-valuemin" to the new minimum', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setMin(10);

    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-valuemin', '10');
  });

  it('#setMin re-renders track markers if slider is discrete and displays markers',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const isA = jasmine.any;

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.HAS_TRACK_MARKER)
           .and.returnValue(true);
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setMin(10);

       expect(mockAdapter.setTrackMarkers)
           .toHaveBeenCalledWith(isA(Number), isA(Number), isA(Number));
     });

  it('#getStep/#setStep retrieves / sets the step value, respectively', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setStep(2);
    expect(foundation.getStep()).toEqual(2);
  });

  it('#setStep allows floating-point values to be used as step values', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setStep(0.2);

    foundation.setValue(0.46);
    expect(foundation.getValue()).toEqual(0.4);

    foundation.setValue(1.52);
    expect(foundation.getValue()).toEqual(1.6);
  });

  it('#setStep throws if the step value given is less than 0', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
    foundation.init();
    jasmine.clock().tick(1);

    expect(() => foundation.setStep(-1)).toThrow();
  });

  it('#setStep set discrete slider step to 1 if the provided step is invalid',
     () => {
       const {foundation, mockAdapter} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 0});
       mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
           .and.returnValue(true);
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setStep(0.5);

       expect(foundation.getStep()).toEqual(1);
     });

  it('#setStep updates the slider\'s UI when altering the step value', () => {
    const {foundation, mockAdapter} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(9.8);
    jasmine.clock().tick(1);
    // Sanity check
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.098)');

    foundation.setStep(1);
    jasmine.clock().tick(1);

    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(10px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.1)');
  });

  it('#setStep re-renders track markers if slider is discrete and displays markers',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const isA = jasmine.any;

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.HAS_TRACK_MARKER)
           .and.returnValue(true);
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setStep(10);

       expect(mockAdapter.setTrackMarkers)
           .toHaveBeenCalledWith(isA(Number), isA(Number), isA(Number));
     });

  it('#isDisabled/#setDisabled retrieves / sets the disabled state, respectively',
     () => {
       const {foundation} = setupTest();
       foundation.setDisabled(true);

       expect(foundation.isDisabled()).toBe(true);
     });

  it('#setDisabled adds the mdc-slider--disabled class when given true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(true);

    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.DISABLED);
  });

  it('#setDisabled adds "aria-disabled=true" when given true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(true);

    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith('aria-disabled', 'true');
  });

  it('#setDisabled removes the tabindex attribute when given true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setDisabled(true);

    expect(mockAdapter.removeAttribute).toHaveBeenCalledWith('tabindex');
  });

  it('#setDisabled removes the mdc-slider--disabled class when given false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setDisabled(false);

       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.DISABLED);
     });

  it('#setDisabled removes the "aria-disabled" attribute when given false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setDisabled(false);

       expect(mockAdapter.removeAttribute)
           .toHaveBeenCalledWith('aria-disabled');
     });

  it('#setDisabled restores any previously set tabindices when given false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getTabIndex.and.returnValue(0);

       // Save the mock tab index set above
       foundation.setDisabled(true);
       foundation.setDisabled(false);

       expect(mockAdapter.setAttribute).toHaveBeenCalledWith('tabindex', '0');
     });

  it('#setDisabled does not touch the tabindex property if no previous tabindex saved when given false',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setDisabled(false);

       expect(mockAdapter.setAttribute)
           .not.toHaveBeenCalledWith('tabindex', jasmine.anything());
     });
});
