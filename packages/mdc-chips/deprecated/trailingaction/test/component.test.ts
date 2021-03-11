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

import {MDCRipple} from '../../../../mdc-ripple/index';
import {emitEvent} from '../../../../../testing/dom/events';
import {createMockFoundation} from '../../../../../testing/helpers/foundation';
import {MDCChipTrailingAction, MDCChipTrailingActionFoundation, trailingActionStrings as strings} from '../index';

const getFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <button class="mdc-chip-trailing-action" tabindex="-1">
    <span class="mdc-chip-trailing-action__ripple"></span>
    <span class="mdc-chip-trailing-action__touch-target"></span>
    <span class="mdc-chip-trailing-action__icon">X</span>
  </div>`;

  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

class FakeRipple {
  destroy: jasmine.Spy;

  constructor(readonly root: HTMLElement|null) {
    this.destroy = jasmine.createSpy('.destroy');
  }
}

function setupTest() {
  const root = getFixture();
  const component = new MDCChipTrailingAction(root);
  return {root, component};
}

function setupMockRippleTest() {
  const root = getFixture();
  const component =
      new MDCChipTrailingAction(root, undefined, () => new FakeRipple(null));
  return {root, component};
}

function setupMockFoundationTest(root = getFixture()) {
  const mockFoundation = createMockFoundation(MDCChipTrailingActionFoundation);
  const component = new MDCChipTrailingAction(root, mockFoundation);
  return {root, component, mockFoundation};
}

describe('MDCChipTrailingAction', () => {
  it('attachTo returns an MDCChipTrailingAction instance', () => {
    expect(
        MDCChipTrailingAction.attachTo(getFixture()) instanceof
        MDCChipTrailingAction)
        .toBe(true);
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {root, mockFoundation} = setupMockFoundationTest();

    emitEvent(root, 'click');
    expect(mockFoundation.handleClick).toHaveBeenCalledWith(jasmine.anything());
    expect(mockFoundation.handleClick).toHaveBeenCalledTimes(1);

    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeydown)
        .toHaveBeenCalledWith(jasmine.anything());
    expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
  });

  it('#destroy removes event handlers', () => {
    const {root, component, mockFoundation} = setupMockFoundationTest();
    component.destroy();

    emitEvent(root, 'click');
    expect(mockFoundation.handleClick)
        .not.toHaveBeenCalledWith(jasmine.anything());

    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeydown)
        .not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('#destroy destroys ripple', () => {
    const {component} = setupMockRippleTest();
    component.destroy();
    expect(component.ripple.destroy).toHaveBeenCalled();
  });

  it('get ripple returns MDCRipple instance', () => {
    const {component} = setupTest();
    expect(component.ripple instanceof MDCRipple).toBe(true);
  });

  it('adapter#focus gives focus to the root', () => {
    const {component, root} = setupTest();
    document.documentElement.appendChild(root);
    (component.getDefaultFoundation() as any).adapter.focus();
    expect(document.activeElement).toEqual(root);
    document.documentElement.removeChild(root);
  });

  it('adapter#getAttribute returns the attribute value if present', () => {
    const {root, component} = setupTest();
    root.setAttribute('data-foo', 'bar');
    expect((component.getDefaultFoundation() as any)
               .adapter.getAttribute('data-foo'))
        .toBe('bar');
  });

  it('adapter#getAttribute returns null if the attribute is absent', () => {
    const {component} = setupTest();
    expect((component.getDefaultFoundation() as any)
               .adapter.getAttribute('data-foo'))
        .toBe(null);
  });

  it(`adapter#notifyInteraction emits ${strings.INTERACTION_EVENT}`, () => {
    const {component} = setupTest();
    const handler = jasmine.createSpy('interaction handler');

    component.listen(strings.INTERACTION_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyInteraction(0);

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it(`adapter#notifyNavigation emits ${strings.NAVIGATION_EVENT}`, () => {
    const {component} = setupTest();
    const handler = jasmine.createSpy('navigation handler');

    component.listen(strings.NAVIGATION_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyNavigation('');

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it('#focus proxies to the foundation#focus', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.focus();
    expect(mockFoundation.focus).toHaveBeenCalled();
  });

  it('#removeFocus proxies to the foundation#removeFocus', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.removeFocus();
    expect(mockFoundation.removeFocus).toHaveBeenCalled();
  });

  it('#isNavigable proxies to the foundation#isNavigable', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.isNavigable();
    expect(mockFoundation.isNavigable).toHaveBeenCalled();
  });
});
