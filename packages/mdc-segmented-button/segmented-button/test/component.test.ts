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
import {createMockFoundation} from '../../../../testing/helpers/foundation';
// import {MDCSegmentedButtonSegmentFoundation} from '../../segment/index';
import {MDCSegmentedButton, MDCSegmentedButtonFoundation} from '../index';
import {strings} from '../constants';
import {test_strings, test_indices, test_segment_ids} from './constants';

const getFixtureMultiWithLabel = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="mdc-segmented-button" role="group">
      <button class="mdc-segmented-button__segment" aria-pressed="false">
        <div class="mdc-segmented-button__label">Segment Label</div>
      </button>
      <button class="mdc-segmented-button__segment" aria-pressed="false">
        <i class="material-icons mdc-segmented-button__icon">favorite</i>
      </button>
      <button class="mdc-segmented-button__segment" aria-pressed="false">
        <div class="mdc-segmented-button__label">Segment Label</div>
        <i class="material-icons mdc-segmented-button__icon">favorite</i>
      </button>
    </div>
  `;

  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

class FakeSegment {
  initialSyncWithDOM: jasmine.Spy;
  destroy: jasmine.Spy;
  getDefaultFoundation: jasmine.Spy;
  setIndex: jasmine.Spy;
  setIsSingleSelect: jasmine.Spy;
  isSelected: jasmine.Spy;
  setSelected: jasmine.Spy;
  setUnselected: jasmine.Spy;
  getSegmentId: jasmine.Spy;

  constructor(_el: HTMLElement) {
    this.initialSyncWithDOM = jasmine.createSpy('.initialSyncWithDOM');
    this.destroy = jasmine.createSpy('.destroy');
    this.getDefaultFoundation = jasmine.createSpy('.getDefaultFoundation');
    this.setIndex = jasmine.createSpy('.setIndex');
    this.setIsSingleSelect = jasmine.createSpy('.setIsSingleSelect');
    this.isSelected = jasmine.createSpy('.isSelected').and.returnValue(false);
    this.setSelected = jasmine.createSpy('.setSelected');
    this.setUnselected = jasmine.createSpy('.setUnselected');
    this.getSegmentId = jasmine.createSpy('.getSegmentId');
  }
}

const setupTest = () => {
  const root = getFixtureMultiWithLabel();
  const component = new MDCSegmentedButton(root, undefined, (el: HTMLElement) => new FakeSegment(el));
  return {root, component};
};

const setupMockFoundationTest = () => {
  const root = getFixtureMultiWithLabel();
  const mockFoundation = createMockFoundation(MDCSegmentedButtonFoundation);
  const component = new MDCSegmentedButton(root, mockFoundation, (el: HTMLElement) => new FakeSegment(el));

  return {root, component, mockFoundation};
};

describe('MDCSegmentedButton', () => {
  it('#attachTo returns an MDCSegmentedButton instance', () => {
    expect(MDCSegmentedButton.attachTo(getFixtureMultiWithLabel()) instanceof MDCSegmentedButton).toBeTruthy();
  });

  it('#constructor instantiates child segment components', () => {
    const {component} = setupTest();
    expect(component.segments.length).toEqual(3);
    expect(component.segments[0]).toEqual(jasmine.any(FakeSegment));
    expect(component.segments[1]).toEqual(jasmine.any(FakeSegment));
    expect(component.segments[2]).toEqual(jasmine.any(FakeSegment));
  });

  it('#destroy cleans up child segment componets', () => {
    const {component} = setupTest();
    component.destroy();
    expect(component.segments[0].destroy).toHaveBeenCalled();
    expect(component.segments[1].destroy).toHaveBeenCalled();
    expect(component.segments[2].destroy).toHaveBeenCalled();
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {root, mockFoundation} = setupMockFoundationTest();

    emitEvent(root, strings.SELECTED_EVENT);
    expect(mockFoundation.handleSelected).toHaveBeenCalledTimes(1);
  });

  it('#destroy removes event handlers', () => {
    const {root, component, mockFoundation} = setupMockFoundationTest();
    component.destroy();

    emitEvent(root, strings.SELECTED_EVENT);
    expect(mockFoundation.handleSelected).not.toHaveBeenCalled();
  });

  it('#initialSyncWithDOM calls child\'s foundation#setIndex and #setIsSingleSelect', () => {
    const {component} = setupTest();

    for (let i = 0; i < component.segments.length; i++) {
      expect(component.segments[i].setIndex).toHaveBeenCalledTimes(1);
      expect(component.segments[i].setIsSingleSelect).toHaveBeenCalledTimes(1);
    }
  });

  describe('Adapter', () => {
    it('#hasClass returns whether root element has class', () => {
      const {root, component} = setupTest();

      root.classList.add(test_strings.CLASS);
      expect((component.getDefaultFoundation() as any).adapter.hasClass(test_strings.CLASS)).toBeTrue();
      root.classList.remove(test_strings.CLASS);
      expect((component.getDefaultFoundation() as any).adapter.hasClass(test_strings.CLASS)).toBeFalse();
    });

    it('#getSegments returns child segments as readonly SegmentDetails array', () => {
      const {component} = setupTest();

      const segments = (component.getDefaultFoundation() as any).adapter.getSegments();
      expect(segments.length).toEqual(3);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[0].hasOwnProperty('index')).toBeTrue();
        expect(segments[0].hasOwnProperty('selected')).toBeTrue();
        expect(segments[0].hasOwnProperty('segmentId')).toBeTrue();
      }
    });

    it('#selectSegment calls identified child segment\s #setSelected', () => {
      // TODO: test that #setSelected is called on correct segment, and no other
      // TODO: test that no segment's #setSelected is called if there is no match
    });

    it('#unselectSegment calls identified child segment\s #setUnselected', () => {
      // TODO: test that #setUnselected is called on correct segment, and no other
      // TODO: test that no segment's #setUnselected is called if there is no match
    });

    it('#notifySelectedChange emits ' + strings.CHANGE_EVENT, () => {
      // TODO: test that method emits
    });
  });

  it('#getSelectedSegments proxies to foundation#getSelectedSegments', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    mockFoundation.getSelectedSegments.and.returnValue([]);

    const selectedSegments = component.getSelectedSegments();
    expect(mockFoundation.getSelectedSegments).toHaveBeenCalled();
    expect(selectedSegments).toEqual([]);
  });

  it('#selectSegment proxies to foundation#selectSegment', () => {
    const {component, mockFoundation} = setupMockFoundationTest();

    component.selectSegment(test_indices.SELECTED);
    expect(mockFoundation.selectSegment).toHaveBeenCalledWith(test_indices.SELECTED);
    component.selectSegment(test_segment_ids.SELECTED_SEGMENT_ID);
    expect(mockFoundation.selectSegment).toHaveBeenCalledWith(test_segment_ids.SELECTED_SEGMENT_ID);
  });

  it('#unselectSegment proxies to foundation#unselectSegment', () => {
    const {component, mockFoundation} = setupMockFoundationTest();

    component.unselectSegment(test_indices.SELECTED);
    expect(mockFoundation.unselectSegment).toHaveBeenCalledWith(test_indices.SELECTED);
    component.unselectSegment(test_segment_ids.SELECTED_SEGMENT_ID);
    expect(mockFoundation.unselectSegment).toHaveBeenCalledWith(test_segment_ids.SELECTED_SEGMENT_ID);
  });

  it('#isSegmentSelected proxies to foundation#isSegmentSelected', () => {
    const {component, mockFoundation} = setupMockFoundationTest();

    mockFoundation.isSegmentSelected.and.returnValue(true);
    let isSegmentSelected = component.isSegmentSelected(test_indices.SELECTED);
    expect(mockFoundation.isSegmentSelected).toHaveBeenCalledWith(test_indices.SELECTED);
    expect(isSegmentSelected).toBeTrue();

    mockFoundation.isSegmentSelected.and.returnValue(false);
    isSegmentSelected = component.isSegmentSelected(test_segment_ids.SELECTED_SEGMENT_ID);
    expect(mockFoundation.isSegmentSelected).toHaveBeenCalledWith(test_segment_ids.SELECTED_SEGMENT_ID);
    expect(isSegmentSelected).toBeFalse();
  });
});
