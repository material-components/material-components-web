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

import {createMouseEvent} from '../../../testing/dom/events';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {attributes, cssClasses, numbers} from '../constants';
import {MDCSliderFoundation} from '../foundation';
import {Thumb, TickMark} from '../types';

describe('MDCSliderFoundation', () => {
  setUpMdcTestEnvironment();

  describe('#init sets values based on DOM', () => {
    it('sets min, max, value based on aria attributes', () => {
      const {foundation} = setUpAndInit({min: 0, max: 100, value: 50.5});
      expect(foundation.getMin()).toBe(0);
      expect(foundation.getMax()).toBe(100);
      expect(foundation.getValue()).toBe(50.5);
    });

    it('range slider: sets min, max, value, valueStart based on aria attributes',
       () => {
         const {foundation} = setUpAndInit(
             {min: -20, max: 20, valueStart: -10, value: -5, isRange: true});
         expect(foundation.getMin()).toBe(-20);
         expect(foundation.getMax()).toBe(20);
         expect(foundation.getValue()).toBe(-5);
         expect(foundation.getValueStart()).toBe(-10);
       });

    it('sets step based on step attribute', () => {
      const {foundation} =
          setUpAndInit({value: 50.5, step: 5, isDiscrete: true});
      foundation.init();

      expect(foundation.getStep()).toBe(5);
    });

    it('throws error if attribute value is null', () => {
      const {foundation, mockAdapter} = setUpTest();
      mockAdapter.getInputAttribute.withArgs(attributes.INPUT_MIN, Thumb.END)
          .and.returnValue(null);
      mockAdapter.getInputAttribute.withArgs(attributes.INPUT_MAX, Thumb.END)
          .and.returnValue('100');
      mockAdapter.getInputAttribute.withArgs(attributes.INPUT_VALUE, Thumb.END)
          .and.returnValue('50.5');

      expect(() => foundation.init()).toThrowError(/must be non-null/);
    });

    it('throws error if attribute value is NaN', () => {
      const {foundation, mockAdapter} = setUpTest();
      mockAdapter.getInputAttribute.withArgs(attributes.INPUT_MIN, Thumb.END)
          .and.returnValue('0');
      mockAdapter.getInputAttribute.withArgs(attributes.INPUT_MAX, Thumb.END)
          .and.returnValue('foo');
      mockAdapter.getInputAttribute.withArgs(attributes.INPUT_VALUE, Thumb.END)
          .and.returnValue('50.5');

      expect(() => foundation.init()).toThrowError(/must be a number/);
    });

    it('throws error if min > max', () => {
      expect(() => setUpAndInit({value: 0.5, min: 1, max: 0}))
          .toThrowError(/min must be strictly less than max/);
    });

    it('throws error if min == max', () => {
      expect(() => setUpAndInit({value: 0, min: 0, max: 0}))
          .toThrowError(/min must be strictly less than max/);
    });

    it('throws error if value < min', () => {
      expect(() => setUpAndInit({value: 5, min: 10, max: 50}))
          .toThrowError(/value must be in \[min, max\] range/);
    });

    it('throws error if value > max', () => {
      expect(() => setUpAndInit({value: 55, min: 10, max: 50}))
          .toThrowError(/value must be in \[min, max\] range/);
    });

    it('throws error if step <= 0', () => {
      expect(() => setUpAndInit({value: 20, isDiscrete: true, step: -5}))
          .toThrowError(/step must be a positive number/);
    });

    it('throws error if valueStart < min', () => {
      expect(
          () => setUpAndInit(
              {value: 20, valueStart: 25, min: 22, max: 30, isRange: true}))
          .toThrowError(/values must be in \[min, max\] range/);
    });

    it('throws error if valueStart > max', () => {
      expect(
          () => setUpAndInit(
              {value: 10, valueStart: 25, min: 0, max: 23, isRange: true}))
          .toThrowError(/values must be in \[min, max\] range/);
    });

    it('throws error if start value > end value', () => {
      expect(() => setUpAndInit({value: 10, valueStart: 25, isRange: true}))
          .toThrowError(/start value must be <= end value/);
    });
  });

  describe('#layout', () => {
    it('initial layout removes thumb styles, and subsequent layouts ' +
           'do not',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({isRange: true});
         expect(mockAdapter.removeThumbStyleProperty)
             .toHaveBeenCalledWith('left', Thumb.END);
         expect(mockAdapter.removeThumbStyleProperty)
             .toHaveBeenCalledWith('left', Thumb.START);

         mockAdapter.removeThumbStyleProperty.calls.reset();
         foundation.layout();
         jasmine.clock().tick(1);
         expect(mockAdapter.removeThumbStyleProperty)
             .not.toHaveBeenCalledWith('left', Thumb.END);
         expect(mockAdapter.removeThumbStyleProperty)
             .not.toHaveBeenCalledWith('left', Thumb.START);
       });

    it('initial layout resets thumb/track animations, and subsequent layouts ' +
           'do not',
       () => {
         const {foundation, mockAdapter} =
             setUpAndInit({isRange: true, isDiscrete: true});

         expect(mockAdapter.setThumbStyleProperty)
             .toHaveBeenCalledWith('transition', 'all 0s ease 0s', Thumb.END);
         expect(mockAdapter.setThumbStyleProperty)
             .toHaveBeenCalledWith('transition', 'all 0s ease 0s', Thumb.START);
         expect(mockAdapter.setTrackActiveStyleProperty)
             .toHaveBeenCalledWith('transition', 'all 0s ease 0s');
         jasmine.clock().tick(1);  // Tick for RAF.
         // Newly added inline styles should be removed in next frame.
         expect(mockAdapter.removeThumbStyleProperty)
             .toHaveBeenCalledWith('transition', Thumb.END);
         expect(mockAdapter.removeThumbStyleProperty)
             .toHaveBeenCalledWith('transition', Thumb.START);
         expect(mockAdapter.removeTrackActiveStyleProperty)
             .toHaveBeenCalledWith('transition');

         mockAdapter.setThumbStyleProperty.calls.reset();
         mockAdapter.setTrackActiveStyleProperty.calls.reset();

         foundation.layout();
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(mockAdapter.setThumbStyleProperty)
             .not.toHaveBeenCalledWith(
                 'transition', 'all 0s ease 0s', Thumb.END);
         expect(mockAdapter.setThumbStyleProperty)
             .not.toHaveBeenCalledWith(
                 'transition', 'all 0s ease 0s', Thumb.START);
         expect(mockAdapter.setTrackActiveStyleProperty)
             .not.toHaveBeenCalledWith('transition', 'all 0s ease 0s');
       });

    it('initial layout does not reset thumb/track animations for continuous sliders',
       () => {
         const {mockAdapter} = setUpAndInit({isRange: true, isDiscrete: false});
         expect(mockAdapter.setThumbStyleProperty)
             .not.toHaveBeenCalledWith(
                 'transition', 'all 0s ease 0s', Thumb.END);
         expect(mockAdapter.setThumbStyleProperty)
             .not.toHaveBeenCalledWith(
                 'transition', 'all 0s ease 0s', Thumb.START);
         expect(mockAdapter.setTrackActiveStyleProperty)
             .not.toHaveBeenCalledWith('transition', 'all 0s ease 0s');
       });

    it('RTL: initial layout removes thumb styles', () => {
      const {mockAdapter} = setUpAndInit({isRange: true, isRTL: true});
      expect(mockAdapter.removeThumbStyleProperty)
          .toHaveBeenCalledWith('right', Thumb.END);
      expect(mockAdapter.removeThumbStyleProperty)
          .toHaveBeenCalledWith('right', Thumb.START);
    });

    it('`skipUpdateUI` skips updating the UI', () => {
      const {foundation, mockAdapter} = setUpAndInit({isRange: true});
      mockAdapter.setThumbStyleProperty.calls.reset();
      mockAdapter.setTrackActiveStyleProperty.calls.reset();

      foundation.layout({skipUpdateUI: true});
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.setThumbStyleProperty).not.toHaveBeenCalled();
      expect(mockAdapter.setTrackActiveStyleProperty).not.toHaveBeenCalled();
    });
  });

  describe('#destroy', () => {
    it('Pointer events: Event listeners are deregistered when foundation is ' +
           'destroyed.',
       () => {
         const supportsPointerEvents =
             MDCSliderFoundation.SUPPORTS_POINTER_EVENTS;
         MDCSliderFoundation.SUPPORTS_POINTER_EVENTS = true;
         const {foundation, mockAdapter} = setUpAndInit();

         foundation.destroy();

         expect(mockAdapter.deregisterEventHandler)
             .toHaveBeenCalledWith('pointerdown', jasmine.any(Function));
         expect(mockAdapter.deregisterEventHandler)
             .toHaveBeenCalledWith('pointerup', jasmine.any(Function));

         const thumbEvents = ['mouseenter', 'mouseleave'];
         for (const event of thumbEvents) {
           expect(mockAdapter.deregisterThumbEventHandler)
               .toHaveBeenCalledWith(Thumb.END, event, jasmine.any(Function));
         }

         // Reset to original value.
         MDCSliderFoundation.SUPPORTS_POINTER_EVENTS = supportsPointerEvents;
       });

    it('Pointer events not supported: mousedown/touchstart listeners are ' +
           'deregistered when foundation is destroyed.',
       () => {
         const supportsPointerEvents =
             MDCSliderFoundation.SUPPORTS_POINTER_EVENTS;
         MDCSliderFoundation.SUPPORTS_POINTER_EVENTS = false;
         const {foundation, mockAdapter} = setUpAndInit();

         foundation.destroy();

         expect(mockAdapter.deregisterEventHandler)
             .toHaveBeenCalledWith('mousedown', jasmine.any(Function));
         expect(mockAdapter.deregisterEventHandler)
             .toHaveBeenCalledWith('touchstart', jasmine.any(Function));

         // Reset to original value.
         MDCSliderFoundation.SUPPORTS_POINTER_EVENTS = supportsPointerEvents;
       });

    it('Resize listener is deregistered when foundation is destroyed', () => {
       const {foundation, mockAdapter} = setUpAndInit();

       foundation.destroy();

       expect(mockAdapter.deregisterWindowEventHandler)
           .toHaveBeenCalledWith('resize', jasmine.any(Function));
    });
  });

  describe('Value updates via user events', () => {
    it('throws error if move event occurs with no preceding down event', () => {
      const {foundation} = setUpAndInit();

      expect(() => {
        foundation.handleMove(createMouseEvent('mousemove', {
          clientX: 80,
        }));
      }).toThrowError();
    });

    it('sets slider value to updated value', () => {
      const left = 10;
      const {foundation, mockAdapter} = setUpAndInit({
        value: 50,
        rect: {
          left,
          right: 110,
          width: 100,
        }
      });

      const value = 60;
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: left + value,
      }));
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: left + value,
      }));
      expect(foundation.getValue()).toBe(value);
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith(
              'transform', `translateX(${value}px)`, Thumb.END);
      expect(mockAdapter.setTrackActiveStyleProperty)
          .toHaveBeenCalledWith('transform', `scaleX(${value / 100})`);
    });

    it('clips value to min value', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        min: 10,
        max: 100,
        value: 50,
        rect: {
          left: 10,
          right: 110,
          width: 100,
        }
      });

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 9,
      }));
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 9,
      }));
      expect(foundation.getValue()).toBe(10);
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', `translateX(${0}px)`, Thumb.END);
      expect(mockAdapter.setTrackActiveStyleProperty)
          .toHaveBeenCalledWith('transform', `scaleX(${0})`);
    });

    it('clips value to max value', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        value: 50,
      });

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 101,
      }));
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 101,
      }));
      expect(foundation.getValue()).toBe(100);
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', `translateX(${100}px)`, Thumb.END);
      expect(mockAdapter.setTrackActiveStyleProperty)
          .toHaveBeenCalledWith('transform', `scaleX(${1})`);
    });

    it('quantizes value based on step', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        value: 50,
        isDiscrete: true,
        step: 5,
      });

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 58,
      }));
      expect(foundation.getValue()).toBe(60);
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', `translateX(${60}px)`, Thumb.END);
      expect(mockAdapter.setTrackActiveStyleProperty)
          .toHaveBeenCalledWith('transform', `scaleX(${0.6})`);
    });

    it('down event does not update value if value is inside the range', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 10,
        value: 50,
        isRange: true,
      });

      // Reset UI update calls from initialization, so we can test
      // that the next #handleDown call invokes no UI updates.
      mockAdapter.setThumbStyleProperty.calls.reset();
      mockAdapter.setTrackActiveStyleProperty.calls.reset();

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 40,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.

      expect(foundation.getValueStart()).toBe(10);
      expect(foundation.getValue()).toBe(50);
      expect(mockAdapter.setThumbStyleProperty).not.toHaveBeenCalled();
      expect(mockAdapter.setTrackActiveStyleProperty).not.toHaveBeenCalled();
    });

    it('move event after down event (on end thumb) updates end thumb value ' +
       'inside the range',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           valueStart: 10,
           value: 50,
           isRange: true,
         });

         // Down event on end thumb.
         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: 48,
         }));
         jasmine.clock().tick(1);  // Tick for RAF.
         // Move end thumb towards middle of the range.
         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: 25,
         }));
         jasmine.clock().tick(1);  // Tick for RAF.

         expect(foundation.getValueStart()).toBe(10);
         expect(foundation.getValue()).toBe(25);
         expect(mockAdapter.setThumbStyleProperty)
             .toHaveBeenCalledWith('transform', `translateX(25px)`, Thumb.END);
       });

    it('moves the start thumb if value < start value', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 10,
        value: 50,
        isRange: true,
      });

      // Down event on start thumb.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 5,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.

      expect(foundation.getValueStart()).toBe(5);
      expect(foundation.getValue()).toBe(50);
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', `translateX(5px)`, Thumb.START);
    });

    it('moves the end thumb if value > end value', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 10,
        value: 50,
        isRange: true,
      });

      // Down event on end thumb.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 70,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.

      expect(foundation.getValueStart()).toBe(10);
      expect(foundation.getValue()).toBe(70);
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', `translateX(70px)`, Thumb.END);
    });

    it('does not move the start thumb to be greater than the end thumb', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 45,
        value: 53,
        isRange: true,
      });

      // Down event on start thumb.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 45,
      }));
      // Move event to a clientX greater than end thumb.
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 60,
      }));

      jasmine.clock().tick(1);  // Tick for RAF.

      expect(foundation.getValueStart()).toBe(53);
      expect(foundation.getValue()).toBe(53);
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', `translateX(53px)`, Thumb.START);
    });

    it('does not move the end thumb to be less than than the start thumb',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           valueStart: 45,
           value: 80,
           isRange: true,
         });

         // Down event on end thumb.
         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: 80,
         }));
         // Move event to a clientX less than start thumb.
         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: 40,
         }));

         jasmine.clock().tick(1);  // Tick for RAF.

         expect(foundation.getValueStart()).toBe(45);
         expect(foundation.getValue()).toBe(45);
         expect(mockAdapter.setThumbStyleProperty)
             .toHaveBeenCalledWith('transform', `translateX(45px)`, Thumb.END);
       });

    it('does not update UI if start value is updated to the same value', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 40,
        value: 80,
        isRange: true,
        isDiscrete: true,
        step: 10,
      });

      // Reset UI update calls from initialization, so we can test
      // that the next #handleDown invokes no calls.
      mockAdapter.setThumbStyleProperty.calls.reset();

      // Down event near start value.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 37,
      }));

      jasmine.clock().tick(1);  // Tick for RAF.

      expect(foundation.getValueStart()).toBe(40);
      expect(mockAdapter.setThumbStyleProperty).not.toHaveBeenCalled();
    });

    it('does not update UI if end value is updated to the same value', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 40,
        value: 80,
        isRange: true,
        isDiscrete: true,
        step: 10,
      });

      // Reset UI update calls from initialization, so we can test
      // that the next #handleDown invokes no calls.
      mockAdapter.setThumbStyleProperty.calls.reset();

      // Down event near end value.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 84.5,
      }));

      jasmine.clock().tick(1);  // Tick for RAF.

      expect(foundation.getValue()).toBe(80);
      expect(mockAdapter.setThumbStyleProperty).not.toHaveBeenCalled();
    });

    it('RTL, single point slider: updates track/thumb position with ' +
           'reversed values',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           value: 50,
           isRTL: true,
         });

         // Down event on end thumb.
         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: 10,  // In RTL, maps to value update of 90.
         }));
         jasmine.clock().tick(1);  // Tick for RAF.

         expect(foundation.getValue()).toBe(90);
         expect(mockAdapter.setThumbStyleProperty)
             .toHaveBeenCalledWith('transform', `translateX(10px)`, Thumb.END);
       });

    it('RTL, range slider: updates track/thumb position with reversed values',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           valueStart: 10,
           value: 50,
           isRange: true,
           isRTL: true,
         });

         // Down event on end thumb.
         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: 25,  // In RTL, maps to value update of 75.
         }));
         jasmine.clock().tick(1);  // Tick for RAF.

         expect(foundation.getValue()).toBe(75);
         expect(mockAdapter.setTrackActiveStyleProperty)
             .toHaveBeenCalledWith('transform-origin', 'right');
         expect(mockAdapter.setThumbStyleProperty)
             .toHaveBeenCalledWith('transform', `translateX(25px)`, Thumb.END);
       });
  });

  describe('#get/setValue', () => {
    it('throws error if #get/setValueStart is invoked on single point slider',
       () => {
         const {foundation} = setUpAndInit();

         expect(() => {
           foundation.getValueStart();
         }).toThrowError(/only applicable for range sliders/);
         expect(() => {
           foundation.setValueStart(10);
         }).toThrowError(/only applicable for range sliders/);
       });

    it('throws error if #setValue/setValueStart is set to invalid number',
       () => {
         const {foundation} =
             setUpAndInit({isRange: true, valueStart: 10, value: 50});

         expect(() => {
           foundation.setValueStart(51);
         }).toThrowError(/must be <= end thumb value/);
         expect(() => {
           foundation.setValue(9);
         }).toThrowError(/must be >= start thumb value/);
       });

    it('single point slider: #setValue updates value and UI', () => {
      const {foundation, mockAdapter} =
          setUpAndInit({isDiscrete: true, value: 33});

      foundation.setValue(64);
      expect(foundation.getValue()).toBe(64);

      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', 'translateX(64px)', Thumb.END);
      expect(mockAdapter.setTrackActiveStyleProperty)
          .toHaveBeenCalledWith('transform', 'scaleX(0.64)');
    });

    it('range: #setValue updates end thumb value and UI', () => {
      const {foundation, mockAdapter} = setUpAndInit(
          {isDiscrete: true, valueStart: 10, value: 40, isRange: true});

      foundation.setValue(64);
      expect(foundation.getValue()).toBe(64);

      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', 'translateX(64px)', Thumb.END);
    });

    it('range: #setValueStart updates end thumb value and UI', () => {
      const {foundation, mockAdapter} = setUpAndInit(
          {isDiscrete: true, valueStart: 10, value: 40, isRange: true});

      foundation.setValueStart(3);
      expect(foundation.getValueStart()).toBe(3);

      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.setThumbStyleProperty)
          .toHaveBeenCalledWith('transform', 'translateX(3px)', Thumb.START);
    });
  });

  describe('input synchronization: ', () => {
    it('updates input value attribute and property on value update', () => {
      const {foundation, mockAdapter} = setUpAndInit(
          {isDiscrete: true, valueStart: 10, value: 40, isRange: true});

      mockAdapter.getInputValue.withArgs(Thumb.START).and.returnValue(10);
      foundation.setValueStart(3);
      expect(mockAdapter.setInputAttribute)
          .toHaveBeenCalledWith(attributes.INPUT_VALUE, '3', Thumb.START);
      expect(mockAdapter.setInputValue).toHaveBeenCalledWith('3', Thumb.START);
      // The min attribute for end input should also be updated.
      expect(mockAdapter.setInputAttribute)
          .toHaveBeenCalledWith(attributes.INPUT_MIN, '3', Thumb.END);

      mockAdapter.getInputValue.withArgs(Thumb.END).and.returnValue(40);
      foundation.setValue(30);
      expect(mockAdapter.setInputAttribute)
          .toHaveBeenCalledWith(attributes.INPUT_VALUE, '30', Thumb.END);
      expect(mockAdapter.setInputValue).toHaveBeenCalledWith('30', Thumb.END);
      // The max attribute for start input should also be updated.
      expect(mockAdapter.setInputAttribute)
          .toHaveBeenCalledWith(attributes.INPUT_MAX, '30', Thumb.START);
    });

    it('updates values on input change', () => {
      const {foundation, mockAdapter} =
          setUpAndInit({valueStart: 10, value: 40, isRange: true});

      mockAdapter.getInputValue.withArgs(Thumb.START).and.returnValue(5);
      foundation.handleInputChange(Thumb.START);
      expect(foundation.getValueStart()).toBe(5);

      mockAdapter.getInputValue.withArgs(Thumb.END).and.returnValue(45);
      foundation.handleInputChange(Thumb.END);
      expect(foundation.getValue()).toBe(45);
    });

    it('focuses input on thumb down event', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        value: 50,
      });

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 20,
      }));
      expect(mockAdapter.focusInput).toHaveBeenCalledWith(Thumb.END);
    });
  });

  describe('value indicator', () => {
    it('does not update value indicator for continuous slider', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        value: 50,
      });

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 20,
      }));
      expect(mockAdapter.setValueIndicatorText).not.toHaveBeenCalled();
    });

    it('updates value indicator for single point slider', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        value: 50,
        isDiscrete: true,
        step: 5,
      });

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 20,
      }));
      expect(mockAdapter.setValueIndicatorText)
          .toHaveBeenCalledWith(20, Thumb.END);
    });

    it('updates value indicator for range slider', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 30,
        value: 50,
        isDiscrete: true,
        step: 5,
        isRange: true,
      });

      // Update start thumb value.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 20,
      }));
      expect(mockAdapter.setValueIndicatorText)
          .toHaveBeenCalledWith(20, Thumb.START);

      // Update end thumb value.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 75,
      }));
      expect(mockAdapter.setValueIndicatorText)
          .toHaveBeenCalledWith(75, Thumb.END);
    });

    it('range slider: adds THUMB_WITH_INDICATOR class to both thumbs on ' +
           'thumb mouseenter',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           isDiscrete: true,
           isRange: true,
         });

         foundation.handleThumbMouseenter(createMouseEvent('mouseenter'));
         expect(mockAdapter.addThumbClass)
             .toHaveBeenCalledWith(
                 cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
         expect(mockAdapter.addThumbClass)
             .toHaveBeenCalledWith(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
       });

    it('range slider: removes THUMB_WITH_INDICATOR class from both thumbs ' +
           'on thumb mouseleave',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           isDiscrete: true,
           isRange: true,
         });

         mockAdapter.isInputFocused.withArgs(Thumb.START)
             .and.returnValue(false);
         mockAdapter.isInputFocused.withArgs(Thumb.END).and.returnValue(false);

         foundation.handleThumbMouseleave(createMouseEvent('mouseleave'));
         expect(mockAdapter.removeThumbClass)
             .toHaveBeenCalledWith(
                 cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
         expect(mockAdapter.removeThumbClass)
             .toHaveBeenCalledWith(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
       });

    it('range slider: does not remove THUMB_WITH_INDICATOR class on' +
           'thumb mouseleave if an input is still focused',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           isDiscrete: true,
           isRange: true,
         });

         mockAdapter.isInputFocused.withArgs(Thumb.END).and.returnValue(true);

         foundation.handleThumbMouseleave(createMouseEvent('mouseleave'));
         expect(mockAdapter.removeThumbClass)
             .not.toHaveBeenCalledWith(
                 cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
         expect(mockAdapter.removeThumbClass)
             .not.toHaveBeenCalledWith(
                 cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
       });
  });

  describe('tick marks', () => {
    it('single point slider: sets correct number of tick marks for value update',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           value: 50,
           isDiscrete: true,
           step: 10,
           hasTickMarks: true,
         });

         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: 0,
         }));
         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: 0,
         }));
         expect(mockAdapter.updateTickMarks).toHaveBeenCalledWith([
           TickMark.ACTIVE
         ].concat(Array.from<TickMark>({length: 10}).fill(TickMark.INACTIVE)));

         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: 100,
         }));
         expect(mockAdapter.updateTickMarks)
             .toHaveBeenCalledWith(
                 Array.from<TickMark>({length: 11}).fill(TickMark.ACTIVE));

         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: 33.5,
         }));
         expect(mockAdapter.updateTickMarks)
             .toHaveBeenCalledWith(Array.from<TickMark>({length: 4})
                                       .fill(TickMark.ACTIVE)
                                       .concat(Array.from<TickMark>({length: 7})
                                                   .fill(TickMark.INACTIVE)));
       });

    it('range slider: sets correct number of tick marks for value update',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           valueStart: 20,
           value: 40,
           isDiscrete: true,
           step: 10,
           hasTickMarks: true,
           isRange: true,
         });
         expect(mockAdapter.updateTickMarks).toHaveBeenCalledWith([
           TickMark.INACTIVE,
           TickMark.INACTIVE,
           TickMark.ACTIVE,
           TickMark.ACTIVE,
           TickMark.ACTIVE,
         ].concat(Array.from<TickMark>({length: 6}).fill(TickMark.INACTIVE)));

         // Update start thumb value to 0.
         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: 0,
         }));
         expect(mockAdapter.updateTickMarks)
             .toHaveBeenCalledWith(Array.from<TickMark>({length: 5})
                                       .fill(TickMark.ACTIVE)
                                       .concat(Array.from<TickMark>({length: 6})
                                                   .fill(TickMark.INACTIVE)));

         // Update end thumb value to 100.
         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: 100,
         }));
         expect(mockAdapter.updateTickMarks)
             .toHaveBeenCalledWith(
                 Array.from<TickMark>({length: 11}).fill(TickMark.ACTIVE));
       });
  });

  describe('range slider: overlapping thumbs', () => {
    it('when thumbs overlap, adds THUMB_TOP class to active thumb', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 12,
        value: 58,
        isRange: true,
      });

      // Down event on start thumb.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 10,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.addThumbClass)
          .not.toHaveBeenCalledWith(cssClasses.THUMB_TOP, Thumb.START);

      // Move start thumb to overlap with end thumb.
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 56,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.addThumbClass)
          .toHaveBeenCalledWith(cssClasses.THUMB_TOP, Thumb.START);
      expect(mockAdapter.removeThumbClass)
          .toHaveBeenCalledWith(cssClasses.THUMB_TOP, Thumb.END);
    });

    it('when thumbs do not overlap, removes THUMB_TOP class', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 12,
        value: 15,
        isRange: true,
      });

      // Down event on end thumb.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 15,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.

      // Move end thumb to not overlap with start thumb.
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 80,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.removeThumbClass)
          .toHaveBeenCalledWith(cssClasses.THUMB_TOP, Thumb.START);
      expect(mockAdapter.removeThumbClass)
          .toHaveBeenCalledWith(cssClasses.THUMB_TOP, Thumb.END);
    });

    it('RTL: when thumbs overlap, adds THUMB_TOP class to active thumb', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 10,  // Start thumb is at clientX == 90.
        value: 60,       // End thumb is at clientX == 40.
        isRange: true,
        isRTL: true,
      });

      // Down event on start thumb.
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 90,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.addThumbClass)
          .not.toHaveBeenCalledWith(cssClasses.THUMB_TOP, Thumb.START);

      // Move start thumb to overlap with end thumb.
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 40,
      }));
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(mockAdapter.addThumbClass)
          .toHaveBeenCalledWith(cssClasses.THUMB_TOP, Thumb.START);
      expect(mockAdapter.removeThumbClass)
          .toHaveBeenCalledWith(cssClasses.THUMB_TOP, Thumb.END);
    });

    it('when thumbs overlap, thumb to be moved is based on drag direction',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           valueStart: 10,
           value: 12,
           isRange: true,
         });
         // Reset calls from initial layout.
         mockAdapter.setThumbStyleProperty.calls.reset();

         // Down event on overlapping thumbs.
         const downEventClientX = 10;
         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: downEventClientX,
         }));
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(mockAdapter.setThumbStyleProperty).not.toHaveBeenCalled();

         // Move to left by less than THUMB_UPDATE_MIN_PX.
         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: downEventClientX - 3,
         }));
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(mockAdapter.setThumbStyleProperty).not.toHaveBeenCalled();

         // Move to left by more than THUMB_UPDATE_MIN_PX.
         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: downEventClientX - 7,
         }));
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(mockAdapter.setThumbStyleProperty)
             .toHaveBeenCalledWith(
                 'transform', `translateX(${downEventClientX - 7}px)`,
                 Thumb.START);
         expect(foundation.getValueStart()).toBe(3);
       });

    it('RTL: when thumbs overlap, thumb to be moved is based on drag ' +
           'direction, and reversed from LTR',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           valueStart: 10,  // clientX of 90.
           value: 12,       // clientX of 88.
           isRange: true,
           isRTL: true,
           isDiscrete: true,
         });
         // Reset calls from initial layout.
         mockAdapter.setThumbStyleProperty.calls.reset();

         // Down event on overlapping thumbs.
         const downEventClientX = 88;
         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: downEventClientX,
         }));
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(mockAdapter.setThumbStyleProperty).not.toHaveBeenCalled();

         // Move to left by more than THUMB_UPDATE_MIN_PX.
         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: downEventClientX - 6,
         }));
         jasmine.clock().tick(1);
         // Dragging to left in RTL mode moves the end thumb.
         expect(mockAdapter.setThumbStyleProperty)
             .toHaveBeenCalledWith(
                 'transform', `translateX(${downEventClientX - 6}px)`,
                 Thumb.END);
         expect(foundation.getValue()).toBe(18);
       });
  });

  describe('a11y support', () => {
    it('updates aria-valuetext on value update according to ' +
           '`Adapter#getValueToAriaValueTextFn`',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           valueStart: 12,
           value: 15,
           isRange: true,
         });
         mockAdapter.getValueToAriaValueTextFn.and.returnValue(
             (value: string) => `${value} value`);

         foundation.setValueStart(11);
         expect(mockAdapter.setInputAttribute)
             .toHaveBeenCalledWith(
                 attributes.ARIA_VALUETEXT, '11 value', Thumb.START);

         foundation.setValue(16);
         expect(mockAdapter.setInputAttribute)
             .toHaveBeenCalledWith(
                 attributes.ARIA_VALUETEXT, '16 value', Thumb.END);
       });
  });

  describe('disabled state', () => {
    it('updates class and input attributes according to disabled state',
       () => {
         const {foundation, mockAdapter} = setUpAndInit();
         expect(foundation.getDisabled()).toBe(false);

         foundation.setDisabled(true);
         expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.DISABLED);
         expect(mockAdapter.setInputAttribute)
             .toHaveBeenCalledWith(attributes.INPUT_DISABLED, '', Thumb.END);
         expect(foundation.getDisabled()).toBe(true);

         foundation.setDisabled(false);
         expect(mockAdapter.removeClass)
             .toHaveBeenCalledWith(cssClasses.DISABLED);
         expect(mockAdapter.removeInputAttribute)
             .toHaveBeenCalledWith(attributes.INPUT_DISABLED, Thumb.END);
         expect(foundation.getDisabled()).toBe(false);
       });

    it('range slider: updates inputs\' attrs according to disabled state',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({isRange: true});

         foundation.setDisabled(true);
         expect(mockAdapter.setInputAttribute)
             .toHaveBeenCalledWith(attributes.INPUT_DISABLED, '', Thumb.END);
         expect(mockAdapter.setInputAttribute)
             .toHaveBeenCalledWith(attributes.INPUT_DISABLED, '', Thumb.START);

         foundation.setDisabled(false);
         expect(mockAdapter.removeInputAttribute)
             .toHaveBeenCalledWith(attributes.INPUT_DISABLED, Thumb.START);
         expect(mockAdapter.removeInputAttribute)
             .toHaveBeenCalledWith(attributes.INPUT_DISABLED, Thumb.END);
       });

    it('events do not update slider value when disabled', () => {
      const {foundation} =
          setUpAndInit({value: 40, isDiscrete: true, isDisabled: true});
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 35,
      }));
      expect(foundation.getValue()).toBe(40);

      foundation.handleMove(createMouseEvent('mousedown', {
        clientX: 30,
      }));
      expect(foundation.getValue()).toBe(40);
    });
  });

  describe('events: ', () => {
    it('single point slider: fires `input` and `change` events for value changes',
       () => {
         const {foundation, mockAdapter} = setUpAndInit({
           value: 20,
           isDiscrete: true,
         });

         foundation.handleDown(createMouseEvent('mousedown', {
           clientX: 20,
         }));
         expect(mockAdapter.emitInputEvent).not.toHaveBeenCalled();
         expect(mockAdapter.emitChangeEvent).not.toHaveBeenCalled();

         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: 40,
         }));
         expect(mockAdapter.emitInputEvent).toHaveBeenCalledWith(40, Thumb.END);
         expect(mockAdapter.emitChangeEvent).not.toHaveBeenCalled();

         foundation.handleMove(createMouseEvent('mousemove', {
           clientX: 55,
         }));
         expect(mockAdapter.emitInputEvent).toHaveBeenCalledWith(55, Thumb.END);
         expect(mockAdapter.emitChangeEvent).not.toHaveBeenCalled();

         mockAdapter.emitInputEvent.calls.reset();
         foundation.handleUp(createMouseEvent('mouseup', {
           clientX: 55,
         }));
         expect(mockAdapter.emitInputEvent).not.toHaveBeenCalled();
         // `change` event should only be fired when value has been committed
         // (on pointer up).
         expect(mockAdapter.emitChangeEvent)
             .toHaveBeenCalledWith(55, Thumb.END);
       });

    it('range slider: fires `input`/`change` events on start thumb', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 20,
        value: 50,
        isRange: true,
        isDiscrete: true,
      });

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 20,
      }));
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 14,
      }));
      expect(mockAdapter.emitInputEvent).toHaveBeenCalledWith(14, Thumb.START);
      expect(mockAdapter.emitChangeEvent).not.toHaveBeenCalled();

      foundation.handleUp(createMouseEvent('mouseup'));
      expect(mockAdapter.emitChangeEvent).toHaveBeenCalledWith(14, Thumb.START);
    });

    it('range slider: fires `input`/`change` events on end thumb', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 20,
        value: 50,
        isRange: true,
        isDiscrete: true,
      });

      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 50,
      }));
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 77,
      }));
      expect(mockAdapter.emitInputEvent).toHaveBeenCalledWith(77, Thumb.END);
      expect(mockAdapter.emitChangeEvent).not.toHaveBeenCalled();

      foundation.handleUp(createMouseEvent('mouseup'));
      expect(mockAdapter.emitChangeEvent).toHaveBeenCalledWith(77, Thumb.END);
    });

    it('fires `dragStart`/`dragEnd` events across drag interaction', () => {
      const {foundation, mockAdapter} = setUpAndInit({
        valueStart: 20,
        value: 50,
        isRange: true,
        isDiscrete: true,
      });
      foundation.handleDown(createMouseEvent('mousedown', {
        clientX: 20,
      }));
      // Move thumb to value 5...
      foundation.handleMove(createMouseEvent('mousemove', {
        clientX: 5,
      }));
      foundation.handleUp(createMouseEvent('mouseup'));

      expect(mockAdapter.emitDragStartEvent)
          .toHaveBeenCalledWith(20, Thumb.START);
      expect(mockAdapter.emitDragStartEvent).toHaveBeenCalledTimes(1);
      expect(mockAdapter.emitDragEndEvent).toHaveBeenCalledWith(5, Thumb.START);
      expect(mockAdapter.emitDragEndEvent).toHaveBeenCalledTimes(1);
    });
  });
});

function setUpTest() {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCSliderFoundation);
  return {foundation, mockAdapter};
}

/*
 * Sets up foundation, mock adapter, and calls Foundation#init with the given
 * initialization options.
 * By default, sets up a continuous slider with the following properties:
 * - min: 0
 * - max: 100
 * - rect: {left: 0, right: 100, width: 100}
 */
function setUpAndInit({
  value,
  valueStart,
  min,
  max,
  rect,
  isDiscrete,
  isDisabled,
  step,
  hasTickMarks,
  isRange,
  isRTL,
}: {
  value?: number,
  valueStart?: number,
  min?: number,
  max?: number,
  rect?: Partial<ClientRect>,
  isDiscrete?: boolean,
  isDisabled?: boolean,
  step?: number,
  hasTickMarks?: boolean,
  isRange?: boolean,
  isRTL?: boolean,
} = {}) {
  const {foundation, mockAdapter} = setUpFoundationTest(MDCSliderFoundation);
  mockAdapter.hasClass.withArgs(cssClasses.DISCRETE)
      .and.returnValue(Boolean(isDiscrete));
  mockAdapter.hasClass.withArgs(cssClasses.DISABLED)
      .and.returnValue(Boolean(isDisabled));
  mockAdapter.hasClass.withArgs(cssClasses.TICK_MARKS)
      .and.returnValue(Boolean(hasTickMarks));
  mockAdapter.hasClass.withArgs(cssClasses.RANGE)
      .and.returnValue(Boolean(isRange));

  mockAdapter.getInputAttribute
      .withArgs(attributes.INPUT_MIN, isRange ? Thumb.START : Thumb.END)
      .and.returnValue(
          String(min !== undefined ? min : 0),
      );
  mockAdapter.getInputAttribute.withArgs(attributes.INPUT_MAX, Thumb.END)
      .and.returnValue(String(max !== undefined ? max : 100));

  valueStart = valueStart !== undefined ? valueStart : 20;
  value = value !== undefined ? value : 50;
  if (isRange) {
    mockAdapter.getInputAttribute.withArgs(attributes.INPUT_VALUE, Thumb.START)
        .and.returnValue(String(valueStart));
    mockAdapter.getInputAttribute.withArgs(attributes.INPUT_VALUE, Thumb.END)
        .and.returnValue(String(value));
  } else {
    mockAdapter.getInputAttribute.withArgs(attributes.INPUT_VALUE, Thumb.END)
        .and.returnValue(String(value));
  }

  mockAdapter.getInputAttribute.withArgs(attributes.INPUT_STEP, Thumb.END)
      .and.returnValue(step || numbers.STEP_SIZE);

  foundation.init();

  if (isRTL) {
    mockAdapter.isRTL.and.returnValue(true);
  }
  mockAdapter.getBoundingClientRect.and.returnValue(rect || {
    left: 0,
    right: 100,
    width: 100,
  });
  if (isRTL) {
    mockAdapter.getThumbBoundingClientRect.withArgs(Thumb.END).and.returnValue(
        {left: 100 - value - 5, right: 100 - value + 5});
  } else {
    mockAdapter.getThumbBoundingClientRect.withArgs(Thumb.END).and.returnValue(
        {left: value - 5, right: value + 5});
  }
  if (isRange) {
    if (isRTL) {
      mockAdapter.getThumbBoundingClientRect.withArgs(Thumb.START)
          .and.returnValue(
              {left: 100 - valueStart - 5, right: 100 - valueStart + 5});
    } else {
      mockAdapter.getThumbBoundingClientRect.withArgs(Thumb.START)
          .and.returnValue({left: valueStart - 5, right: valueStart + 5});
    }
    mockAdapter.getThumbKnobWidth.withArgs(Thumb.START).and.returnValue(10);
    mockAdapter.getThumbKnobWidth.withArgs(Thumb.END).and.returnValue(10);
  }

  foundation.layout();
  jasmine.clock().tick(1);  // Tick for RAF from UI update.

  return {foundation, mockAdapter};
}
