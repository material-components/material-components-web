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

//  import {MDCRipple} from '../../../mdc-ripple/index';
import {emitEvent} from '../../../../testing/dom/events';
import {createMockFoundation} from '../../../../testing/helpers/foundation';
import {MDCSegmentedButtonSegment, MDCSegmentedButtonSegmentFoundation} from '../index';
import {strings} from '../constants';
import {test_strings} from './constants';

const getFixtureMultiSelectWithLabel = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button class="mdc-segmented-button__segment" aria-pressed="false">
      <div class="mdc-segmented-button__label">Segment Label</div>
    </button>
  `;

  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

const setupTest = () => {
  const root = getFixtureMultiSelectWithLabel();
  const component = new MDCSegmentedButtonSegment(root);
  return {root, component};
};

const setupMockFoundationTest = (root = getFixtureMultiSelectWithLabel()) => {
  const mockFoundation = createMockFoundation(MDCSegmentedButtonSegmentFoundation);
  const component = new MDCSegmentedButtonSegment(root, mockFoundation);
  return {root, component, mockFoundation};
}

/**
 * Still need tests for:
 *  - ripple
 *  - touch
 *  - having icon?
 */
describe('MDCSegmentedButtonSegment', () => {
  it('attachTo return an MDCSegmentedButtonSegment instance', () => {
    expect(MDCSegmentedButtonSegment.attachTo(getFixtureMultiSelectWithLabel()) instanceof MDCSegmentedButtonSegment).toBeTruthy();
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {root, mockFoundation} = setupMockFoundationTest();

    emitEvent(root, strings.CLICK_EVENT);
    expect(mockFoundation.handleClick).toHaveBeenCalledTimes(1);
  });

  it('#destroy removes event handlers', () => {
    const {root, component, mockFoundation} = setupMockFoundationTest();
    component.destroy();

    emitEvent(root, strings.CLICK_EVENT);
    expect(mockFoundation.handleClick).not.toHaveBeenCalled();
  });

  describe('Adapter', () => {
    it('#isSingleSelect returns value of isSingleSelect', () => {
      const {component} = setupTest();

      component.setIsSingleSelect(true);
      expect((component.getDefaultFoundation() as any).adapter.isSingleSelect()).toBeTruthy();

      component.setIsSingleSelect(false);
      expect((component.getDefaultFoundation() as any).adapter.isSingleSelect()).toBeFalsy();
    });

    it('#getAttr returns value of attribute of root element', () => {
      const {root, component} = setupTest();

      root.setAttribute('aria-pressed', 'false');
      expect((component.getDefaultFoundation() as any).adapter.getAttr('aria-pressed')).toEqual('false');
      root.setAttribute('aria-pressed', 'true');
      expect((component.getDefaultFoundation() as any).adapter.getAttr('aria-pressed')).toEqual('true');
      root.removeAttribute('aria-pressed');
      expect((component.getDefaultFoundation() as any).adapter.getAttr('aria-pressed')).toEqual(null);
    });

    it('#setAttr sets the value of attribute of root element', () => {
      const {root, component} = setupTest();

      (component.getDefaultFoundation() as any).adapter.setAttr('aria-pressed', 'true');
      expect(root.getAttribute('aria-pressed')).toEqual('true');
      (component.getDefaultFoundation() as any).adapter.setAttr('aria-pressed', 'false');
      expect(root.getAttribute('aria-pressed')).toEqual('false');
    });

    it('#addClass adds class to root element', () => {
      const {root, component} = setupTest();

      root.classList.remove(test_strings.CLASS);
      (component.getDefaultFoundation() as any).adapter.addClass(test_strings.CLASS);
      expect(root.classList.contains(test_strings.CLASS)).toBeTruthy();
    });

    it('#removeClass removes class from root element', () => {
      const {root, component} = setupTest();

      root.classList.add(test_strings.CLASS);
      (component.getDefaultFoundation() as any).adapter.removeClass(test_strings.CLASS);
      expect(root.classList.contains(test_strings.CLASS)).toBeFalsy();
    });

    it('#hasClass returns whether root element has class', () => {
      const {root, component} = setupTest();

      root.classList.add(test_strings.CLASS);
      expect((component.getDefaultFoundation() as any).adapter.hasClass(test_strings.CLASS)).toBeTruthy();
      root.classList.remove(test_strings.CLASS);
      expect((component.getDefaultFoundation() as any).adapter.hasClass(test_strings.CLASS)).toBeFalsy();
    });

    it('#notifySelectedChange emits ' + strings.SELECTED_EVENT, () => {
      const {component} = setupTest();
      const handler = jasmine.createSpy('selected handler');

      component.listen(strings.SELECTED_EVENT, handler);

      (component.getDefaultFoundation() as any).adapter.notifySelectedChange(true);
      expect(handler).toHaveBeenCalledWith(jasmine.anything());
      expect(handler.calls.mostRecent().args[0].detail.selected).toBeTruthy();

      (component.getDefaultFoundation() as any).adapter.notifySelectedChange(false);
      expect(handler.calls.mostRecent().args[0].detail.selected).toBeFalsy();
    });
  });

  it('#isSelected proxies to foundation#isSelected', () => {
    const {component, mockFoundation} = setupMockFoundationTest();

    mockFoundation.isSelected.and.returnValue(true);
    const isSelected = component.isSelected();
    expect(mockFoundation.isSelected).toHaveBeenCalled();
    expect(isSelected).toBeTrue();

    mockFoundation.isSelected.and.returnValue(false);
    expect(component.isSelected()).toBeFalse();
  });

  it('#setSelected proxies to foundation#setSelected', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.setSelected();
    expect(mockFoundation.setSelected).toHaveBeenCalled();
  });

  it('#setUnselected proxies to foundation#setUnselected', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.setUnselected();
    expect(mockFoundation.setUnselected).toHaveBeenCalled();
  });

  it('#getSegmentId proxies to foundation#getSegmentId', () => {
    const {component, mockFoundation} = setupMockFoundationTest();

    mockFoundation.getSegmentId.and.returnValue(test_strings.SEGMENT_ID);
    const segmentId = component.getSegmentId();
    expect(mockFoundation.getSegmentId).toHaveBeenCalled();
    expect(segmentId).toEqual(test_strings.SEGMENT_ID);

    mockFoundation.getSegmentId.and.returnValue(undefined);
    expect(component.getSegmentId()).toEqual(undefined);
  });
});
