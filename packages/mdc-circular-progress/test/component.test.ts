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


import {MDCCircularProgress, MDCCircularProgressFoundation} from '../../mdc-circular-progress/index';
const RADIUS = 18;
function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <div class="mdc-circular-progress" role="progressbar" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1">
    <div class="mdc-circular-progress__determ-container">
      <svg class="mdc-circular-progress__determ-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle class="mdc-circular-progress__determ-circle" cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="113.097"/>
      </svg>
    </div>
    <div class="mdc-circular-progress__indeterm-container">
      <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-1">
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div>
      </div>

      <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-2">
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div>
      </div>

      <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-3">
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div>
      </div>

      <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-4">
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterm-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function setupTest() {
  const root = getFixture();
  const component = new MDCCircularProgress(root);
  return {root, component};
}

describe('MDCCircularProgress', () => {
  it('attachTo initializes and returns a MDCCircularProgress instance', () => {
    expect(
        MDCCircularProgress.attachTo(getFixture()) instanceof
        MDCCircularProgress)
        .toBeTruthy();
  });

  it('set indeterminate', () => {
    const {root, component} = setupTest();

    component.determinate = false;
    expect(root.classList.contains('mdc-circular-progress--indeterminate'))
        .toBeTruthy();
    expect(
        root.getAttribute(MDCCircularProgressFoundation.strings.ARIA_VALUENOW))
        .toEqual(null);
  });

  it('set progress', () => {
    const {root, component} = setupTest();
    const progressTestValue = 0.5;
    component.progress = progressTestValue;
    const determCircle =
        root.querySelector(
            MDCCircularProgressFoundation.strings.DETERM_CIRCLE_SELECTOR) as
        HTMLElement;

    expect(
        root.getAttribute(MDCCircularProgressFoundation.strings.ARIA_VALUENOW))
        .toEqual(progressTestValue.toString());
    const strokeDashoffset = Number(determCircle.getAttribute(
        MDCCircularProgressFoundation.strings.STROKE_DASHOFFSET));
    const expectedVal = progressTestValue * 2 * Math.PI * RADIUS;
    expect(strokeDashoffset).toBeLessThan(expectedVal + .001);
    expect(strokeDashoffset).toBeGreaterThan(expectedVal - .001);
  });

  it('open and close', () => {
    const {root, component} = setupTest();

    component.close();
    expect(root.classList.contains('mdc-circular-progress--closed'))
        .toBeTruthy();
    expect(component.isClosed).toBe(true);

    component.open();
    expect(root.classList.contains('mdc-circular-progress--closed'))
        .toBeFalsy();
    expect(component.isClosed).toBe(false);
  });
});
