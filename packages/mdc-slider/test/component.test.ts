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

import {KEY} from '../../mdc-dom/keyboard';
import {getFixture} from '../../../testing/dom';
import {createKeyboardEvent, createMouseEvent, emitEvent} from '../../../testing/dom/events';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {attributes, cssClasses, events, MDCSlider, MDCSliderFoundation, Thumb} from '../index';

describe('MDCSlider', () => {
  setUpMdcTestEnvironment();

  let root: HTMLElement;
  let component: MDCSlider;

  beforeAll(() => {
    // Mock #setPointerCapture as it throws errors on FF without a
    // real pointerId.
    spyOn(Element.prototype, 'setPointerCapture');
  });

  afterEach(() => {
    if (root && document.body.contains(root)) {
      document.body.removeChild(root);
    }
  });

  createTestSuiteForSliderEvents('pointer');
  createTestSuiteForSliderEvents('mouse');
  createTestSuiteForSliderEvents('touch');

  /**
   * Creates test suite for any tests that should be tested across
   * pointer, mouse, and touch events.
   */
  function createTestSuiteForSliderEvents(eventType: 'pointer'|'mouse'|
                                          'touch') {
    // Don't run tests with pointer events if the test browser does not
    // support pointer events.
    if (eventType === 'pointer' && !window.PointerEvent) return;
    // Don't run tests with touch events if the test browser does not
    // support touch events.
    if (eventType === 'touch' && !('ontouchstart' in window)) {
      return;
    }

    describe(`slider events for ${eventType} event types`, () => {
      let thumb: HTMLElement;
      let trackActive: HTMLElement;

      beforeEach(() => {
        if (eventType !== 'pointer') {
          MDCSliderFoundation.SUPPORTS_POINTER_EVENTS = false;
        }

        ({root, component, endThumb: thumb, trackActive} = setUpTest());
      });

      afterEach(() => {
        // Reset to actual value.
        MDCSliderFoundation.SUPPORTS_POINTER_EVENTS =
            Boolean(window.PointerEvent);

        document.body.removeChild(root);
      });

      it('down event sets the slider value based on x coordinate', () => {
        const event = createEventFrom(eventType, 'down', {clientX: 50});
        root.dispatchEvent(event);
        jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
        expect(thumb.style.transform).toBe('translateX(50px)');
        expect(trackActive!.style.transform).toBe('scaleX(0.5)');
      });

      it('move event after down event sets the slider value based on x coordinate',
         () => {
           const downEvent = createEventFrom(eventType, 'down', {clientX: 0});
           root.dispatchEvent(downEvent);
           jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
           expect(thumb.style.transform).toBe('translateX(0px)');
           expect(trackActive!.style.transform).toBe('scaleX(0)');

           const moveEvent = createEventFrom(eventType, 'move', {clientX: 50});
           const el = eventType === 'pointer' ? root : document.body;
           el.dispatchEvent(moveEvent);
           jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
           expect(thumb.style.transform).toBe('translateX(50px)');
           expect(trackActive!.style.transform).toBe('scaleX(0.5)');
         });

      it('move event after up event doesn\'t update slider value', () => {
        const downEvent = createEventFrom(eventType, 'down', {clientX: 0});
        root.dispatchEvent(downEvent);
        jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
        expect(thumb.style.transform).toBe('translateX(0px)');
        expect(trackActive!.style.transform).toBe('scaleX(0)');

        const upEvent = createEventFrom(eventType, 'up', {clientX: 0});
        const upEl = eventType === 'pointer' ? root : document.body;
        upEl.dispatchEvent(upEvent);

        const moveEvent = createEventFrom(eventType, 'move', {clientX: 0});
        const moveEl = eventType === 'pointer' ? root : document.body;
        moveEl.dispatchEvent(moveEvent);
        jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
        expect(thumb.style.transform).toBe('translateX(0px)');
        expect(trackActive!.style.transform).toBe('scaleX(0)');
      });

      it('Event listeners are destroyed when component is destroyed.', () => {
        spyOn(root, 'removeEventListener').and.callThrough();
        spyOn(thumb, 'removeEventListener').and.callThrough();

        component.destroy();

        if (eventType === 'pointer') {
          expect(root.removeEventListener)
              .toHaveBeenCalledWith(
                  'pointerdown', jasmine.any(Function), undefined);
          expect(root.removeEventListener)
              .toHaveBeenCalledWith(
                  'pointerup', jasmine.any(Function), undefined);
        } else {
          expect(root.removeEventListener)
              .toHaveBeenCalledWith(
                  'mousedown', jasmine.any(Function), undefined);
          expect(root.removeEventListener)
              .toHaveBeenCalledWith(
                  'touchstart', jasmine.any(Function), undefined);
        }

        const thumbEvents =
            ['keydown', 'focus', 'mouseenter', 'blur', 'mouseleave'];
        for (const event of thumbEvents) {
          expect(thumb.removeEventListener)
              .toHaveBeenCalledWith(event, jasmine.any(Function));
        }
      });
    });
  }

  describe('range slider', () => {
    let startThumb: HTMLElement;
    let endThumb: HTMLElement;
    const initialValueStart = 30;
    const initialValueEnd = 70;

    beforeEach(() => {
      ({root, component, startThumb, endThumb} =
           setUpTest({
             isRange: true,
             valueStart: initialValueStart,
             value: initialValueEnd
           }) as {
             root: HTMLElement,
             component: MDCSlider,
             startThumb: HTMLElement,
             endThumb: HTMLElement
           });

      spyOn(startThumb, 'getBoundingClientRect').and.returnValue({
        left: initialValueStart - 3,
        right: initialValueStart + 3,
      } as DOMRect);
      spyOn(endThumb, 'getBoundingClientRect').and.returnValue({
        left: initialValueEnd - 3,
        right: initialValueEnd + 3,
      } as DOMRect);
    });

    it('press + move on start thumb updates start thumb value', () => {
      const downEvent =
          createEventFrom('pointer', 'down', {clientX: initialValueStart + 2});
      root.dispatchEvent(downEvent);
      jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
      // Start thumb value should be the same as initial value, since press
      // was in the middle of the range.
      expect(startThumb.style.transform)
          .toBe(`translateX(${initialValueStart}px)`);

      const moveEvent = createEventFrom('pointer', 'move', {clientX: 50});
      root.dispatchEvent(moveEvent);
      jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
      expect(startThumb.style.transform).toBe('translateX(50px)');
    });

    it('press + move on end thumb updates start thumb value', () => {
      const downEvent =
          createEventFrom('pointer', 'down', {clientX: initialValueEnd - 2});
      root.dispatchEvent(downEvent);
      jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
      // End thumb value should be the same as initial value, since press
      // was in the middle of the range.
      expect(endThumb.style.transform).toBe(`translateX(${initialValueEnd}px)`);

      const moveEvent = createEventFrom('pointer', 'move', {clientX: 40});
      root.dispatchEvent(moveEvent);
      jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
      expect(endThumb.style.transform).toBe('translateX(40px)');
    });

    it('down event between min and start thumb updates start thumb value',
       () => {
         const downEvent = createEventFrom(
             'pointer', 'down', {clientX: initialValueStart - 10});
         root.dispatchEvent(downEvent);
         jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
         expect(startThumb.style.transform)
             .toBe(`translateX(${initialValueStart - 10}px)`);
         expect(endThumb.style.transform)
             .toBe(`translateX(${initialValueEnd}px)`);
       });

    it('down event between end thumb and max updates end thumb value', () => {
      const downEvent =
          createEventFrom('pointer', 'down', {clientX: initialValueEnd + 10});
      root.dispatchEvent(downEvent);
      jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.
      expect(endThumb.style.transform)
          .toBe(`translateX(${initialValueEnd + 10}px)`);
      expect(startThumb.style.transform)
          .toBe(`translateX(${initialValueStart}px)`);
    });

    it('Thumb event listeners are destroyed when component is destroyed.',
       () => {
         spyOn(startThumb, 'removeEventListener').and.callThrough();
         spyOn(endThumb, 'removeEventListener').and.callThrough();

         component.destroy();
         expect(startThumb.removeEventListener)
             .toHaveBeenCalledWith('keydown', jasmine.any(Function));
         expect(endThumb.removeEventListener)
             .toHaveBeenCalledWith('keydown', jasmine.any(Function));
       });
  });

  describe('thumb states', () => {
    it('single point slider: thumb is focused after value update', () => {
      let thumb;
      ({root, endThumb: thumb} =
           setUpTest({isDiscrete: true, hasTickMarks: true}));

      const downEvent = createEventFrom('pointer', 'down', {clientX: 65.3});
      root.dispatchEvent(downEvent);
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(document.activeElement).toBe(thumb);
    });

    it('range slider: thumb is focused after value update', () => {
      let startThumb, endThumb;
      const valueStart = 10;
      const value = 40;
      ({root, startThumb, endThumb} =
           setUpTest({isDiscrete: true, isRange: true, valueStart, value}));

      spyOn(startThumb as HTMLElement, 'getBoundingClientRect')
          .and.returnValue({
            left: valueStart - 3,
            right: valueStart + 3,
          } as DOMRect);
      spyOn(endThumb, 'getBoundingClientRect').and.returnValue({
        left: value - 3,
        right: value + 3,
      } as DOMRect);

      // Update start thumb value.
      const downEventStart = createEventFrom('pointer', 'down', {clientX: 3});
      root.dispatchEvent(downEventStart);
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(document.activeElement).toBe(startThumb);

      // Update end thumb value.
      const downEventEnd = createEventFrom('pointer', 'down', {clientX: 92});
      root.dispatchEvent(downEventEnd);
      jasmine.clock().tick(1);  // Tick for RAF.
      expect(document.activeElement).toBe(endThumb);
    });
  });

  describe('value indicator', () => {
    it('single point slider: updates value indicator after value update',
       () => {
         let thumb;
         ({root, endThumb: thumb} =
              setUpTest({isDiscrete: true, hasTickMarks: true, step: 10}));
         expect(thumb.textContent!.trim()).not.toBe('70');

         const downEvent = createEventFrom('pointer', 'down', {clientX: 65.3});
         root.dispatchEvent(downEvent);
         expect(thumb.textContent!.trim()).toBe('70');
       });

    it('range slider: updates value indicator after value update', () => {
      let startThumb, endThumb;
      const valueStart = 10;
      const value = 40;
      ({root, startThumb, endThumb} = setUpTest(
           {isDiscrete: true, isRange: true, valueStart, value, step: 10}));

      spyOn(startThumb as HTMLElement, 'getBoundingClientRect')
          .and.returnValue({
            left: valueStart - 3,
            right: valueStart + 3,
          } as DOMRect);
      spyOn(endThumb, 'getBoundingClientRect').and.returnValue({
        left: value - 3,
        right: value + 3,
      } as DOMRect);

      expect(startThumb!.textContent!.trim()).not.toBe('0');
      expect(endThumb.textContent!.trim()).not.toBe('90');

      // Update start thumb value.
      const downEventStart = createEventFrom('pointer', 'down', {clientX: 3});
      root.dispatchEvent(downEventStart);
      expect(startThumb!.textContent!.trim()).toBe('0');

      // Update end thumb value.
      const downEventEnd = createEventFrom('pointer', 'down', {clientX: 92});
      root.dispatchEvent(downEventEnd);
      expect(endThumb.textContent!.trim()).toBe('90');
    });
  });

  describe('tick marks', () => {
    beforeEach(() => {
      ({root} = setUpTest({isDiscrete: true, hasTickMarks: true, step: 10}));
    });

    it('adds tick mark elements on component initialization', () => {
      const tickMarks =
          root.querySelector(`.${cssClasses.TICK_MARKS_CONTAINER}`)!.children;
      expect(tickMarks.length).toBe(11);
      for (let i = 0; i < tickMarks.length; i++) {
        const tickMarkClass = i === 0 ? cssClasses.TICK_MARK_ACTIVE :
                                        cssClasses.TICK_MARK_INACTIVE;
        expect(tickMarks[i].classList.contains(tickMarkClass)).toBe(true);
      }
    });

    it('updates tick mark classes after slider update', () => {
      // Sanity check that tick mark classes are as we expect on component init.
      let tickMarks =
          root.querySelector(`.${cssClasses.TICK_MARKS_CONTAINER}`)!.children;
      expect(tickMarks.length).toBe(11);
      for (let i = 0; i < tickMarks.length; i++) {
        const tickMarkClass = i === 0 ? cssClasses.TICK_MARK_ACTIVE :
                                        cssClasses.TICK_MARK_INACTIVE;
        expect(tickMarks[i].classList.contains(tickMarkClass)).toBe(true);
      }

      const downEvent = createEventFrom('pointer', 'down', {clientX: 55.3});
      root.dispatchEvent(downEvent);
      jasmine.clock().tick(1);  // Tick for RAF from slider UI updates.

      tickMarks =
          root.querySelector(`.${cssClasses.TICK_MARKS_CONTAINER}`)!.children;
      expect(tickMarks.length).toBe(11);
      for (let i = 0; i < tickMarks.length; i++) {
        // 55.3 rounds up to 60, since step value is 10.
        const tickMarkClass = i <= 6 ? cssClasses.TICK_MARK_ACTIVE :
                                       cssClasses.TICK_MARK_INACTIVE;
        expect(tickMarks[i].classList.contains(tickMarkClass)).toBe(true);
      }
    });
  });

  describe('a11y support', () => {
    let startThumb: HTMLElement|null, endThumb: HTMLElement;

    it('updates aria-valuenow on thumb value updates', () => {
      ({root, endThumb} = setUpTest({isDiscrete: true, value: 30, step: 10}));
      expect(endThumb.getAttribute(attributes.ARIA_VALUENOW)).toBe('30');

      const downEvent = createEventFrom('pointer', 'down', {clientX: 90});
      root.dispatchEvent(downEvent);
      expect(endThumb.getAttribute(attributes.ARIA_VALUENOW)).toBe('90');
    });

    it('updates aria-valuetext on thumb value updates according to ' +
           '`valueToAriaValueTextFn`',
       () => {
         let component: MDCSlider;
         ({component, root, endThumb} =
              setUpTest({isDiscrete: true, value: 30, step: 10}));
         component.setValueToAriaValueTextFn(
             (value: number) => `${value} value`);
         expect(endThumb.getAttribute(attributes.ARIA_VALUETEXT)).toBe(null);

         const downEvent = createEventFrom('pointer', 'down', {clientX: 90});
         root.dispatchEvent(downEvent);
         expect(endThumb.getAttribute(attributes.ARIA_VALUETEXT))
             .toBe('90 value');
       });

    it('increments/decrements correct thumb value on keydown', () => {
      ({root, startThumb, endThumb} = setUpTest({
         isDiscrete: true,
         valueStart: 10,
         value: 50,
         isRange: true,
         step: 10
       }));
      expect(startThumb!.getAttribute(attributes.ARIA_VALUENOW)).toBe('10');
      expect(endThumb.getAttribute(attributes.ARIA_VALUENOW)).toBe('50');

      const keyUpEvent = createKeyboardEvent('keydown', {key: KEY.ARROW_UP});
      startThumb!.dispatchEvent(keyUpEvent);
      expect(startThumb!.getAttribute(attributes.ARIA_VALUENOW)).toBe('20');

      const keyDownEvent =
          createKeyboardEvent('keydown', {key: KEY.ARROW_DOWN});
      endThumb.dispatchEvent(keyDownEvent);
      expect(endThumb.getAttribute(attributes.ARIA_VALUENOW)).toBe('40');
    });
  });

  describe('disabled state', () => {
    let startThumb: HTMLElement|null, endThumb: HTMLElement;

    it('updates disabled class when setting disabled state', () => {
      ({root, component} = setUpTest());
      expect(root.classList.contains(cssClasses.DISABLED)).toBe(false);

      component.setDisabled(true);
      expect(component.getDisabled()).toBe(true);
      expect(root.classList.contains(cssClasses.DISABLED)).toBe(true);

      component.setDisabled(false);
      expect(component.getDisabled()).toBe(false);
      expect(root.classList.contains(cssClasses.DISABLED)).toBe(false);
    });

    it('updates thumb attrs when setting disabled state', () => {
      ({root, component, endThumb} = setUpTest());
      expect(endThumb.tabIndex).toBe(0);

      component.setDisabled(true);
      expect(endThumb.tabIndex).toBe(-1);
      expect(endThumb.getAttribute('aria-disabled')).toBe('true');

      component.setDisabled(false);
      expect(endThumb.tabIndex).toBe(0);
      expect(endThumb.getAttribute('aria-disabled')).toBe('false');
    });

    it('range slider: updates thumbs\' attrs when setting disabled state',
       () => {
         ({root, component, startThumb, endThumb} = setUpTest({isRange: true}));
         expect(startThumb!.tabIndex).toBe(0);
         expect(endThumb.tabIndex).toBe(0);

         component.setDisabled(true);
         expect(startThumb!.tabIndex).toBe(-1);
         expect(endThumb.tabIndex).toBe(-1);
         expect(startThumb!.getAttribute('aria-disabled')).toBe('true');
         expect(endThumb.getAttribute('aria-disabled')).toBe('true');

         component.setDisabled(false);
         expect(startThumb!.tabIndex).toBe(0);
         expect(endThumb.tabIndex).toBe(0);
         expect(startThumb!.getAttribute('aria-disabled')).toBe('false');
         expect(endThumb.getAttribute('aria-disabled')).toBe('false');
       });
  });

  describe('change/input events', () => {
    it('emits `change`/`input` events across an interaction', () => {
      ({root, component} = setUpTest({value: 25, isDiscrete: true}));
      spyOn(component, 'emit');

      const downEvent = createEventFrom('pointer', 'down', {clientX: 28});
      root.dispatchEvent(downEvent);
      expect(component.emit)
          .toHaveBeenCalledWith(events.INPUT, {value: 28, thumb: Thumb.END});
      expect(component.emit)
          .not.toHaveBeenCalledWith(events.CHANGE, jasmine.any(Object));

      const moveEvent = createEventFrom('pointer', 'move', {clientX: 48});
      root.dispatchEvent(moveEvent);
      expect(component.emit)
          .toHaveBeenCalledWith(events.INPUT, {value: 48, thumb: Thumb.END});
      expect(component.emit)
          .not.toHaveBeenCalledWith(events.CHANGE, jasmine.any(Object));

      root.dispatchEvent(createEventFrom('pointer', 'up', {clientX: 48}));
      expect(component.emit)
          .toHaveBeenCalledWith(events.CHANGE, {value: 48, thumb: Thumb.END});
    });
  });

  describe('#get/setValue, #get/setValueStart', () => {
    it('single pointer slider: #getValue returns correct value', () => {
      ({component} = setUpTest({value: 25}));
      expect(component.getValue()).toBe(25);
    });

    it('range slider: #getValue/#getValueStart returns correct values', () => {
      ({component} = setUpTest({valueStart: 3, value: 25, isRange: true}));
      expect(component.getValueStart()).toBe(3);
      expect(component.getValue()).toBe(25);
    });

    it('single pointer slider: #setValue moves thumb to correct position',
       () => {
         let endThumb;
         ({root, component, endThumb} =
              setUpTest({value: 25, isDiscrete: true}));
         component.setValue(75);

         jasmine.clock().tick(1);  // Tick for RAF.
         expect(endThumb.style.transform).toBe(`translateX(75px)`);
         expect(document.activeElement).not.toBe(endThumb);
       });

    it('range slider: #setValueStart/#setValue move thumbs to correct positions',
       () => {
         let startThumb, endThumb;
         ({root, component, startThumb, endThumb} = setUpTest(
              {valueStart: 20, value: 53, isDiscrete: true, isRange: true}));

         component.setValueStart(5);
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(startThumb!.style.transform).toBe(`translateX(5px)`);
         expect(document.activeElement).not.toBe(startThumb);

         component.setValue(75);
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(endThumb.style.transform).toBe(`translateX(75px)`);
         expect(document.activeElement).not.toBe(endThumb);
       });
  });

  describe('resize handling:', () => {
    it('adjusts layout calculations on window resize', () => {
      jasmine.getEnv().allowRespy(true);

      let endThumb;
      ({root, component, endThumb} = setUpTest({value: 24, isDiscrete: true}));

      expect(component.getValue()).toBe(24);
      expect(endThumb.style.transform).toBe('translateX(24px)');

      // Mock out client rect to half the size of the original.
      spyOn(root, 'getBoundingClientRect').and.returnValue({
        left: 0,
        right: 50,
        width: 50,
      } as DOMRect);
      emitEvent(window, 'resize');

      jasmine.clock().tick(1);  // Tick for RAF.
      // Value should be the same...
      expect(component.getValue()).toBe(24);
      // Thumb position should be different.
      expect(endThumb.style.transform).toBe('translateX(12px)');

      component.setValue(12);
      jasmine.clock().tick(1);  // Tick for RAF.
      // Subsequent updates should take into account new client rect.
      expect(endThumb.style.transform).toBe('translateX(6px)');

      jasmine.getEnv().allowRespy(false);
    });
  });

  describe('setting slider position before component initialization', () => {
    let root: HTMLElement, thumb: HTMLElement, trackActive: HTMLElement;

    beforeEach(() => {
      root = getFixture(`
        <div class="mdc-slider mdc-slider--discrete" data-step="10">
          <div class="mdc-slider__track">
            <div class="mdc-slider__track--active">
              <div class="mdc-slider__track--active_fill"
                   style="transform:scaleX(70%)">
              </div>
            </div>
            <div class="mdc-slider__track--inactive"></div>
          </div>
          <div class="mdc-slider__thumb" tabindex="0" role="slider" aria-valuemin="0"
               aria-valuemax="100" aria-valuenow="70" style="left:calc(70% - 24px)">
            <div class="mdc-slider__value-indicator-container">
              <div class="mdc-slider__value-indicator">
                <span class="mdc-slider__value-indicator-text">70</span>
              </div>
            </div>
            <div class="mdc-slider__thumb-knob"></div>
          </div>
        </div>`);

      thumb = root.querySelector(`.${cssClasses.THUMB}`) as HTMLElement;
      trackActive =
          root.querySelector(`.${cssClasses.TRACK_ACTIVE}`) as HTMLElement;

      spyOn(root, 'getBoundingClientRect').and.returnValue({
        left: 0,
        right: 100,
        width: 100,
      } as DOMRect);

      document.body.appendChild(root);  // Removed in #afterEach.
    });

    it('does not update thumb styles in initial layout', () => {
      MDCSlider.attachTo(root, {skipInitialUIUpdate: true});
      jasmine.clock().tick(1);  // Tick for RAF.

      expect(thumb.style.left).toBe('calc(70% - 24px)');
      expect(thumb.style.transform).toBe('');
    });

    it('removes thumb `left` styles on initial down event that changes value',
       () => {
         MDCSlider.attachTo(root, {skipInitialUIUpdate: true});
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(thumb.style.left).not.toBe('');
         expect(thumb.style.transform).not.toBe('translateX(30px)');

         root.dispatchEvent(createEventFrom('pointer', 'down', {clientX: 30}));
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(thumb.style.left).toBe('');
         expect(thumb.style.transform).toBe('translateX(30px)');
       });

    it('removes thumb/track animation on initial down event that changes value',
       () => {
         MDCSlider.attachTo(root, {skipInitialUIUpdate: true});
         jasmine.clock().tick(1);  // Tick for RAF.

         root.dispatchEvent(createEventFrom('pointer', 'down', {clientX: 30}));
         jasmine.clock().tick(1);  // Tick for RAF.
         expect(thumb.style.transition).toMatch(/all/);
         expect(trackActive.style.transition).toMatch(/all/);

         jasmine.clock().tick(1);  // Tick for RAF.
         expect(thumb.style.transition).toBe('');
         expect(trackActive.style.transition).toBe('');
       });
  });
});

function setUpTest(
    {isDiscrete, hasTickMarks, isRange, valueStart, value, step}: {
      isDiscrete?: boolean,
      isRange?: boolean,
      hasTickMarks?: boolean,
      valueStart?: number,
      value?: number,
      step?: number,
    } = {}): {
  root: HTMLElement,
  component: MDCSlider,
  startThumb: HTMLElement|null,
  endThumb: HTMLElement,
  trackActive: HTMLElement
} {
  const discreteClass = isDiscrete ? cssClasses.DISCRETE : '';
  const rangeClass = isRange ? cssClasses.RANGE : '';
  const dataStepAttr =
      isDiscrete ? `${attributes.DATA_ATTR_STEP}="${step || 1}"` : '';
  const tickMarksClass = hasTickMarks ? cssClasses.TICK_MARKS : '';

  const valueIndicator = (valueNum: number) => `
      <div class="mdc-slider__value-indicator-container">
        <div class="mdc-slider__value-indicator">
          <span class="mdc-slider__value-indicator-text">
            ${valueNum}
            </span>
          </div>
        </div>`;
  const valueIndicatorStart = isDiscrete ? valueIndicator(valueStart || 0) : '';
  const valueIndicatorEnd = isDiscrete ? valueIndicator(valueStart || 0) : '';
  const startThumbHtml = isRange ? `
      <div class="mdc-slider__thumb" tabindex="0" role="slider" aria-valuemin="0"
           aria-valuemax="100" aria-valuenow="${valueStart || 0}">
        ${valueIndicatorStart}
        <div class="mdc-slider__thumb-knob"></div>
      </div>` :
                                   '';

  const root = getFixture(`
    <div class="mdc-slider ${discreteClass} ${rangeClass} ${tickMarksClass}" ${
      dataStepAttr}>
      <div class="mdc-slider__track">
        <div class="mdc-slider__track--active">
          <div class="mdc-slider__track--active_fill"></div>
        </div>
        <div class="mdc-slider__track--inactive"></div>
      </div>
      ${startThumbHtml}
      <div class="mdc-slider__thumb" tabindex="0" role="slider" aria-valuemin="0"
           aria-valuemax="100" aria-valuenow="${value || 0}">
        ${valueIndicatorEnd}
        <div class="mdc-slider__thumb-knob"></div>
      </div>
    </div>`);
  const thumbs = root.querySelectorAll(`.${cssClasses.THUMB}`);
  const startThumb = isRange ? thumbs[0] as HTMLElement : null;
  const endThumb = thumbs[thumbs.length - 1] as HTMLElement;
  const trackActive =
      root.querySelector(`.${cssClasses.TRACK_ACTIVE}`) as HTMLElement;

  spyOn(root, 'getBoundingClientRect').and.returnValue({
    left: 0,
    right: 100,
    width: 100,
  } as DOMRect);

  document.body.appendChild(root);  // Removed in #afterEach.
  const component = MDCSlider.attachTo(root);
  jasmine.clock().tick(1);  // Tick for RAF.

  return {root, component, startThumb, endThumb, trackActive};
}

/**
 * Returns an event based on the event type and phase, e.g. given 'touch'
 * and 'up', returns a `touchend` event.
 */
function createEventFrom(
    eventType: 'pointer'|'mouse'|'touch', phase: 'down'|'move'|'up',
    {clientX}: {clientX: number}): PointerEvent|MouseEvent|TouchEvent {
  let event;
  let type;
  switch (eventType) {
    case 'pointer':
      type = 'pointerdown';
      if (phase !== 'down') {
        type = phase === 'move' ? 'pointermove' : 'pointerup';
      }
      // PointerEvent constructor is not supported in IE. Use a MouseEvent in
      // IE, since PointerEvent inherits from MouseEvent.
      const isIe = navigator.userAgent.indexOf('MSIE') !== -1 ||
          navigator.userAgent.indexOf('Trident') !== -1;
      event = isIe ? createMouseEvent(type, {clientX}) :
                     new PointerEvent(type, {clientX, pointerId: 1});
      break;
    case 'mouse':
      type = 'mousedown';
      if (phase !== 'down') {
        type = phase === 'move' ? 'mousemove' : 'mouseup';
      }
      event = createMouseEvent(type, {clientX});
      break;
    default:
      type = 'touchstart';
      if (phase !== 'down') {
        type = phase === 'move' ? 'touchmove' : 'touchend';
      }
      event = new TouchEvent(type, {
        touches: [{clientX}] as Touch[],
      });
  }
  return event;
}
