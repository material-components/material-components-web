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

import {emitEvent} from '../../../../testing/dom/events';
import {MDCSegmentedButtonSegment} from '../index';
import {events, attributes, booleans, cssClasses} from '../constants';
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
  const adapter = (component.getDefaultFoundation() as any).adapter;
  return {root, component, adapter};
};

/**
 * TODO: add tests for ripple, touch, and having icon
 */
describe('MDCSegmentedButtonSegment', () => {
  it('attachTo return an MDCSegmentedButtonSegment instance', () => {
    expect(MDCSegmentedButtonSegment.attachTo(getFixtureMultiSelectWithLabel()) instanceof MDCSegmentedButtonSegment).toBeTruthy();
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle selected');
    component.listen(events.SELECTED, handler);

    emitEvent(root, events.CLICK);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('#destroy removes event handlers', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle selected');
    component.listen(events.SELECTED, handler);
    component.destroy();

    emitEvent(root, events.CLICK);
    expect(handler).not.toHaveBeenCalled();
  });

  describe('Adapter', () => {
    it('#isSingleSelect returns value of isSingleSelect', () => {
      const {component, adapter} = setupTest();

      component.setIsSingleSelect(true);
      expect(adapter.isSingleSelect()).toBeTrue();

      component.setIsSingleSelect(false);
      expect(adapter.isSingleSelect()).toBeFalse();
    });

    it('#getAttr returns value of attribute of root element', () => {
      const {root, adapter} = setupTest();

      root.setAttribute(test_strings.ATTRIBUTE, booleans.FALSE);
      expect(adapter.getAttr(test_strings.ATTRIBUTE)).toEqual(booleans.FALSE);
      root.setAttribute(test_strings.ATTRIBUTE, booleans.TRUE);
      expect(adapter.getAttr(test_strings.ATTRIBUTE)).toEqual(booleans.TRUE);
      root.removeAttribute(test_strings.ATTRIBUTE);
      expect(adapter.getAttr(test_strings.ATTRIBUTE)).toEqual(null);
    });

    it('#setAttr sets the value of attribute of root element', () => {
      const {root, adapter} = setupTest();

      adapter.setAttr(test_strings.ATTRIBUTE, booleans.TRUE);
      expect(root.getAttribute(test_strings.ATTRIBUTE)).toEqual(booleans.TRUE);
      adapter.setAttr(test_strings.ATTRIBUTE, booleans.FALSE);
      expect(root.getAttribute(test_strings.ATTRIBUTE)).toEqual(booleans.FALSE);
    });

    it('#addClass adds class to root element', () => {
      const {root, adapter} = setupTest();

      root.classList.remove(test_strings.CLASS);
      adapter.addClass(test_strings.CLASS);
      expect(root.classList.contains(test_strings.CLASS)).toBeTrue();
    });

    it('#removeClass removes class from root element', () => {
      const {root, adapter} = setupTest();

      root.classList.add(test_strings.CLASS);
      adapter.removeClass(test_strings.CLASS);
      expect(root.classList.contains(test_strings.CLASS)).toBeFalse();
    });

    it('#hasClass returns whether root element has class', () => {
      const {root, adapter} = setupTest();

      root.classList.add(test_strings.CLASS);
      expect(adapter.hasClass(test_strings.CLASS)).toBeTrue();
      root.classList.remove(test_strings.CLASS);
      expect(adapter.hasClass(test_strings.CLASS)).toBeFalse();
    });

    it(`#notifySelectedChange emits ${events.SELECTED} event with SegmentDetail`, () => {
      const {root, component, adapter} = setupTest();
      const handler = jasmine.createSpy('selected handler');
      component.listen(events.SELECTED, handler);

      const index = 0;
      component.setIndex(index);
      root.setAttribute(attributes.DATA_SEGMENT_ID, test_strings.SEGMENT_ID);

      adapter.notifySelectedChange(true);
      expect(handler).toHaveBeenCalledWith(jasmine.anything());
      expect(handler.calls.mostRecent().args[0].detail.index).toEqual(index);
      expect(handler.calls.mostRecent().args[0].detail.selected).toBeTrue();
      expect(handler.calls.mostRecent().args[0].detail.segmentId).toEqual(test_strings.SEGMENT_ID);

      adapter.notifySelectedChange(false);
      expect(handler.calls.mostRecent().args[0].detail.index).toEqual(index);
      expect(handler.calls.mostRecent().args[0].detail.selected).toBeFalse();
      expect(handler.calls.mostRecent().args[0].detail.segmentId).toEqual(test_strings.SEGMENT_ID);
    });
  });

  it('#isSelected returns whether segment is selected', () => {
    const {root, component} = setupTest();

    root.classList.add(cssClasses.SELECTED);
    expect(component.isSelected()).toBeTrue();

    root.classList.remove(cssClasses.SELECTED);
    expect(component.isSelected()).toBeFalse();
  });

  it('#setSelected sets segment to be selected', () => {
    const {root, component} = setupTest();

    root.classList.remove(cssClasses.SELECTED);
    root.setAttribute(attributes.ARIA_PRESSED, booleans.FALSE);
    component.setIsSingleSelect(false);
    component.setSelected();
    expect(root.classList.contains(cssClasses.SELECTED)).toBeTrue();
    expect(root.getAttribute(attributes.ARIA_PRESSED)).toEqual(booleans.TRUE);

    root.classList.remove(cssClasses.SELECTED);
    root.setAttribute(attributes.ARIA_CHECKED, booleans.FALSE);
    component.setIsSingleSelect(true);
    component.setSelected();
    expect(root.classList.contains(cssClasses.SELECTED)).toBeTrue();
    expect(root.getAttribute(attributes.ARIA_CHECKED)).toEqual(booleans.TRUE);
  });

  it('#setUnselected sets segment to be not selected', () => {
    const {root, component} = setupTest();

    component.setUnselected();
    expect(root.classList.contains(cssClasses.SELECTED)).toBeFalse();

    root.classList.add(cssClasses.SELECTED);
    root.setAttribute(attributes.ARIA_PRESSED, booleans.TRUE);
    component.setIsSingleSelect(false);
    component.setUnselected();
    expect(root.classList.contains(cssClasses.SELECTED)).toBeFalse();
    expect(root.getAttribute(attributes.ARIA_PRESSED)).toEqual(booleans.FALSE);

    root.classList.add(cssClasses.SELECTED);
    root.setAttribute(attributes.ARIA_CHECKED, booleans.TRUE);
    component.setIsSingleSelect(true);
    component.setUnselected();
    expect(root.classList.contains(cssClasses.SELECTED)).toBeFalse();
    expect(root.getAttribute(attributes.ARIA_CHECKED)).toEqual(booleans.FALSE);
  });

  it('#getSegmentId returns segment\'s segmentId if it has one', () => {
    const {root, component} = setupTest();

    root.setAttribute(attributes.DATA_SEGMENT_ID, test_strings.SEGMENT_ID);
    expect(component.getSegmentId()).toEqual(test_strings.SEGMENT_ID);

    root.removeAttribute(attributes.DATA_SEGMENT_ID);
    expect(component.getSegmentId()).toEqual(undefined);
  });
});
