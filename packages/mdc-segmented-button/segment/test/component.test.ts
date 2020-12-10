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
import {attributes, booleans, cssClasses, events} from '../constants';
import {MDCSegmentedButtonSegment} from '../index';

import {testStrings} from './constants';

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
    expect(
        MDCSegmentedButtonSegment.attachTo(getFixtureMultiSelectWithLabel())
            instanceof MDCSegmentedButtonSegment)
        .toBeTruthy();
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle selected');
    component.listen(events.SELECTED, handler);

    emitEvent(root, events.CLICK);
    expect(handler).toHaveBeenCalledTimes(1);

    component.unlisten(events.SELECTED, handler);
    component.destroy();
  });

  it('#destroy removes event handlers', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle selected');
    component.listen(events.SELECTED, handler);
    component.destroy();

    emitEvent(root, events.CLICK);
    expect(handler).not.toHaveBeenCalled();

    component.unlisten(events.SELECTED, handler);
  });

  describe('Adapter', () => {
    it('#isSingleSelect returns value of isSingleSelect', () => {
      const {component, adapter} = setupTest();

      component.setIsSingleSelect(true);
      expect(adapter.isSingleSelect()).toBeTrue();

      component.setIsSingleSelect(false);
      expect(adapter.isSingleSelect()).toBeFalse();

      component.destroy();
    });

    it('#getAttr returns value of attribute of root element', () => {
      const {root, component, adapter} = setupTest();

      root.setAttribute(testStrings.ATTRIBUTE, booleans.FALSE);
      expect(adapter.getAttr(testStrings.ATTRIBUTE)).toEqual(booleans.FALSE);
      root.setAttribute(testStrings.ATTRIBUTE, booleans.TRUE);
      expect(adapter.getAttr(testStrings.ATTRIBUTE)).toEqual(booleans.TRUE);
      root.removeAttribute(testStrings.ATTRIBUTE);
      expect(adapter.getAttr(testStrings.ATTRIBUTE)).toEqual(null);

      component.destroy();
    });

    it('#setAttr sets the value of attribute of root element', () => {
      const {root, component, adapter} = setupTest();

      adapter.setAttr(testStrings.ATTRIBUTE, booleans.TRUE);
      expect(root.getAttribute(testStrings.ATTRIBUTE)).toEqual(booleans.TRUE);
      adapter.setAttr(testStrings.ATTRIBUTE, booleans.FALSE);
      expect(root.getAttribute(testStrings.ATTRIBUTE)).toEqual(booleans.FALSE);

      component.destroy();
    });

    it('#addClass adds class to root element', () => {
      const {root, component, adapter} = setupTest();

      root.classList.remove(testStrings.CLASS);
      adapter.addClass(testStrings.CLASS);
      expect(root.classList.contains(testStrings.CLASS)).toBeTrue();

      component.destroy();
    });

    it('#removeClass removes class from root element', () => {
      const {root, component, adapter} = setupTest();

      root.classList.add(testStrings.CLASS);
      adapter.removeClass(testStrings.CLASS);
      expect(root.classList.contains(testStrings.CLASS)).toBeFalse();

      component.destroy();
    });

    it('#hasClass returns whether root element has class', () => {
      const {root, component, adapter} = setupTest();

      root.classList.add(testStrings.CLASS);
      expect(adapter.hasClass(testStrings.CLASS)).toBeTrue();
      root.classList.remove(testStrings.CLASS);
      expect(adapter.hasClass(testStrings.CLASS)).toBeFalse();

      component.destroy();
    });

    it(`#notifySelectedChange emits ${
           events.SELECTED} event with SegmentDetail`,
       () => {
         const {root, component, adapter} = setupTest();
         const handler = jasmine.createSpy('selected handler');
         component.listen(events.SELECTED, handler);

         const index = 0;
         component.setIndex(index);
         root.setAttribute(attributes.DATA_SEGMENT_ID, testStrings.SEGMENT_ID);

         adapter.notifySelectedChange(true);
         expect(handler).toHaveBeenCalledWith(jasmine.anything());
         expect(handler.calls.mostRecent().args[0].detail.index).toEqual(index);
         expect(handler.calls.mostRecent().args[0].detail.selected).toBeTrue();
         expect(handler.calls.mostRecent().args[0].detail.segmentId)
             .toEqual(testStrings.SEGMENT_ID);

         adapter.notifySelectedChange(false);
         expect(handler.calls.mostRecent().args[0].detail.index).toEqual(index);
         expect(handler.calls.mostRecent().args[0].detail.selected).toBeFalse();
         expect(handler.calls.mostRecent().args[0].detail.segmentId)
             .toEqual(testStrings.SEGMENT_ID);

         component.unlisten(events.SELECTED, handler);
         component.destroy();
       });
  });

  it('#isSelected returns whether segment is selected', () => {
    const {root, component} = setupTest();

    root.classList.add(cssClasses.SELECTED);
    expect(component.isSelected()).toBeTrue();

    root.classList.remove(cssClasses.SELECTED);
    expect(component.isSelected()).toBeFalse();

    component.destroy();
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

    component.destroy();
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

    component.destroy();
  });

  it('#getSegmentId returns segment\'s segmentId if it has one', () => {
    const {root, component} = setupTest();

    root.setAttribute(attributes.DATA_SEGMENT_ID, testStrings.SEGMENT_ID);
    expect(component.getSegmentId()).toEqual(testStrings.SEGMENT_ID);

    root.removeAttribute(attributes.DATA_SEGMENT_ID);
    expect(component.getSegmentId()).toEqual(undefined);

    component.destroy();
  });
});
