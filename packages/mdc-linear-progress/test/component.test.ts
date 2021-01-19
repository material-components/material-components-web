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
import {MDCLinearProgress, MDCLinearProgressFoundation} from '../../mdc-linear-progress/index';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

interface WithObserverFoundation {
  foundation: {observer: null|ResizeObserver};
}

const roundPixelsToTwoDecimals = (val: string) => {
  const numberVal = Number(val.split('px')[0]);
  return Math.floor(numberVal * 100) / 100;
};

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div role="progressbar" class="mdc-linear-progress" aria-label="Unit Test Progress Bar" aria-valuemin="0"
      aria-valuemax="1" aria-valuenow="0" style="width: 100px">
      <div class="mdc-linear-progress__buffer">
        <div class="mdc-linear-progress__buffer-bar"></div>
        <div class="mdc-linear-progress__buffer-dots"></div>
      </div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
    </div>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

const originalResizeObserver = window.ResizeObserver;

function setupTest(hasMockFoundation = false) {
  const root = getFixture();
  const mockFoundation = createMockFoundation(MDCLinearProgressFoundation);
  const component = new MDCLinearProgress(
      root, hasMockFoundation ? mockFoundation : undefined);
  return {root, component, mockFoundation};
}

describe('MDCLinearProgress', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns a MDCLinearProgress instance', () => {
    expect(
        MDCLinearProgress.attachTo(getFixture()) instanceof MDCLinearProgress)
        .toBeTruthy();
  });

  it('transitionend event calls foundation transitionend handler', () => {
    const {root, mockFoundation} = setupTest(true);
    emitEvent(root, 'transitionend');
    expect(mockFoundation.handleTransitionEnd).toHaveBeenCalledTimes(1);
  });

  it('set indeterminate', () => {
    const {root, component} = setupTest();

    component.determinate = false;
    expect(root.classList.contains('mdc-linear-progress--indeterminate'))
        .toBeTruthy();
    expect(root.getAttribute(MDCLinearProgressFoundation.strings.ARIA_VALUENOW))
        .toEqual(null);
    expect(root.getAttribute(MDCLinearProgressFoundation.strings.ARIA_VALUEMAX))
        .toEqual(null);
    expect(root.getAttribute(MDCLinearProgressFoundation.strings.ARIA_VALUEMIN))
        .toEqual(null);
  });

  it('set progress', () => {
    const {root, component} = setupTest();

    component.progress = 0.5;
    const primaryBar =
        root.querySelector(
            MDCLinearProgressFoundation.strings.PRIMARY_BAR_SELECTOR) as
        HTMLElement;
    // External GitHub TS compiler insists that `buffer.style.transform` could
    // be null
    // tslint:disable-next-line:no-unnecessary-type-assertion
    expect('scaleX(0.5)').toEqual(primaryBar.style.transform as string);
    expect(root.getAttribute(MDCLinearProgressFoundation.strings.ARIA_VALUENOW))
        .toEqual('0.5');
  });

  it('set buffer', () => {
    const {root, component} = setupTest();

    component.buffer = 0.5;
    const buffer =
        root.querySelector(
            MDCLinearProgressFoundation.strings.BUFFER_BAR_SELECTOR) as
        HTMLElement;
    // External GitHub TS compiler insists that `buffer.style.transform` could
    // be null
    // tslint:disable-next-line:no-unnecessary-type-assertion
    expect('50%').toEqual(buffer.style.flexBasis as string);
  });

  it('open and close', () => {
    const {root, component} = setupTest();

    component.close();
    expect(root.classList.contains('mdc-linear-progress--closed')).toBeTrue();
    emitEvent(root, 'transitionend');
    expect(root.classList.contains('mdc-linear-progress--closed-animation-off'))
        .toBeTrue();

    component.open();
    expect(root.classList.contains('mdc-linear-progress--closed')).toBeFalse();
    expect(root.classList.contains('mdc-linear-progress--closed-animation-off'))
        .toBeFalse();
  });

  describe('attach to dom', () => {
    let root: HTMLElement|undefined;
    let component: MDCLinearProgress|undefined;

    beforeEach(() => {
      root = undefined;
      component = undefined;
    });

    afterEach(() => {
      if (root) {
        document.body.removeChild(root);
      }
      window.ResizeObserver = originalResizeObserver;
    });

    it('will not error if there is no resize observer', () => {
      (window.ResizeObserver as unknown as null) = null;
      component = setupTest().component;

      const foundation =
          (component as unknown as WithObserverFoundation).foundation;
      const observer = foundation.observer;

      expect(observer).toBeNull();
    });

    it('will update size on resize', async () => {
      if (!window.ResizeObserver) {
        // skip tests on IE which wouldn't run these anyway
        return;
      }

      let mockObserverInstance: MockObserver|null = null;
      // we need to mock resize observer to prevent external test infrastructure
      // flakyness as resize observer is not very consistent in timings and
      // calls across browsers and dom structures
      class MockObserver {
        observedElement: HTMLElement|null = null;

        constructor(public callback: ResizeObserverCallback) {
          this.callback = callback;
        }

        observe(element: HTMLElement) {
          this.observedElement = element;
          this.triggerResize(element.offsetWidth);
          mockObserverInstance = this;
        }

        disconnect() {}

        triggerResize(width: number) {
          const fakeEntry = {contentRect: {width}};
          this.callback(
              [fakeEntry as unknown as ResizeObserverEntry],
              this as unknown as ResizeObserver);
        }
      }

      window.ResizeObserver = MockObserver as unknown as typeof ResizeObserver;
      ({root, component} = setupTest());
      document.body.appendChild(root);
      component.determinate = false;

      expect(root.style.width).toBe('100px');

      let actualRounded = roundPixelsToTwoDecimals(
          root.style.getPropertyValue('--mdc-linear-progress-primary-half'));
      let expected =
          roundPixelsToTwoDecimals(`${percentages.PRIMARY_HALF * 100}px`);
      expect(actualRounded).toEqual(expected);
      expect(mockObserverInstance).toBeTruthy();

      root.style.setProperty('width', '200px');

      mockObserverInstance!.triggerResize(200);
      actualRounded = roundPixelsToTwoDecimals(
          root.style.getPropertyValue('--mdc-linear-progress-primary-half'));
      expected =
          roundPixelsToTwoDecimals(`${percentages.PRIMARY_HALF * 200}px`);
      expect(actualRounded).toEqual(expected);
    });
  });
});
