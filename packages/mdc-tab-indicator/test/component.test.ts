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

import {createMockFoundation} from '../../../testing/helpers/foundation';
import {MDCFadingTabIndicatorFoundation, MDCSlidingTabIndicatorFoundation, MDCTabIndicator, MDCTabIndicatorFoundation,} from '../index';

const getFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <span class="mdc-tab-indicator">
    <span class="mdc-tab-indicator__content"></span>
  </span>
`;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

const getFadingFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <span class="mdc-tab-indicator mdc-tab-indicator--fade">
    <span class="mdc-tab-indicator__content"></span>
  </span>
`;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

describe('MDCTabIndicator', () => {
  it('attachTo returns an MDCTabIndicator instance', () => {
    expect(MDCTabIndicator.attachTo(getFixture()) instanceof MDCTabIndicator)
        .toBe(true);
  });

  it('attachTo an icon returns an MDCTabIndicator instance', () => {
    expect(
        MDCTabIndicator.attachTo(getFadingFixture()) instanceof MDCTabIndicator)
        .toBe(true);
  });

  function setupTest() {
    const root = getFixture();
    const component = new MDCTabIndicator(root);
    const content =
        root.querySelector(
            MDCTabIndicatorFoundation.strings.CONTENT_SELECTOR) as HTMLElement;
    return {root, component, content};
  }

  it('#adapter.addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('#adapter.removeClass removes a class to the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter_.removeClass('foo');
    expect(root.classList.contains('foo')).toBe(false);
  });

  it('#adapter.computeContentClientRect returns the root element client rect',
     () => {
       const {component, root, content} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.computeContentClientRect())
           .toEqual(content.getBoundingClientRect());
       document.body.removeChild(root);
     });

  it('#adapter.setContentStyleProperty sets a style property on the root element',
     () => {
       const {component, content} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter_.setContentStyleProperty('background-color', 'red');
       expect(content.style.backgroundColor).toBe('red');
     });

  function setupMockSlidingFoundationTest(root = getFixture()) {
    const mockFoundation =
        createMockFoundation(MDCSlidingTabIndicatorFoundation);
    const component = new MDCTabIndicator(root, mockFoundation);
    return {root, component, mockFoundation};
  }

  function setupMockFadingFoundationTest(root = getFadingFixture()) {
    const mockFoundation =
        createMockFoundation(MDCFadingTabIndicatorFoundation);
    const component = new MDCTabIndicator(root, mockFoundation);
    return {root, component, mockFoundation};
  }

  it('#activate sliding indicator calls activate with passed args', () => {
    const {component, mockFoundation} = setupMockSlidingFoundationTest();
    component.activate({width: 100, left: 0} as ClientRect);
    expect(mockFoundation.activate).toHaveBeenCalledWith({width: 100, left: 0});
  });

  it('#activate icon indicator calls activate with passed args', () => {
    const {component, mockFoundation} = setupMockFadingFoundationTest();
    component.activate({width: 1, left: 2} as ClientRect);
    expect(mockFoundation.activate).toHaveBeenCalledWith({width: 1, left: 2});
  });

  it('#deactivate sliding indicator calls deactivate', () => {
    const {component, mockFoundation} = setupMockSlidingFoundationTest();
    component.deactivate();
    expect(mockFoundation.deactivate).toHaveBeenCalledTimes(1);
  });

  it('#deactivate icon indicator calls deactivate', () => {
    const {component, mockFoundation} = setupMockFadingFoundationTest();
    component.deactivate();
    expect(mockFoundation.deactivate).toHaveBeenCalledTimes(1);
  });

  it('#computeContentClientRect calls computeClientRect', () => {
    const {component, mockFoundation} = setupMockSlidingFoundationTest();
    component.computeContentClientRect();
    expect(mockFoundation.computeContentClientRect).toHaveBeenCalledTimes(1);
  });
});
