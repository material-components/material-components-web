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
import {MDCSegmentedButton} from '../index';
import {MDCSegmentedButtonSegment} from '../../segment/index';
import {events, cssClasses} from '../constants';
import {test_css_classes, test_indices, test_segment_ids, test_selectors} from './constants';
import {attributes} from '../../segment/constants';

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

const setupTest = () => {
  const root = getFixtureMultiWithLabel();
  const component = new MDCSegmentedButton(root);
  const adapter = (component.getDefaultFoundation() as any).adapter;
  return {root, component, adapter};
};

const setAllSelected = (els: NodeListOf<Element>) => {
  els.forEach((el) => {
    el.classList.add(test_css_classes.SELECTED);
  });
}

const setAllUnselected = (els: NodeListOf<Element>) => {
  els.forEach((el) => {
    el.classList.remove(test_css_classes.SELECTED);
  });
}

describe('MDCSegmentedButton', () => {
  it('#attachTo returns an MDCSegmentedButton instance', () => {
    expect(MDCSegmentedButton.attachTo(getFixtureMultiWithLabel()) instanceof MDCSegmentedButton).toBeTruthy();
  });

  it('#constructor instantiates child segment components', () => {
    const {component} = setupTest();
    expect(component.segments.length).toEqual(3);
    expect(component.segments[0]).toEqual(jasmine.any(MDCSegmentedButtonSegment));
    expect(component.segments[1]).toEqual(jasmine.any(MDCSegmentedButtonSegment));
    expect(component.segments[2]).toEqual(jasmine.any(MDCSegmentedButtonSegment));
    component.destroy()
  });

  it('#destroy cleans up child segment components', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle click')
    for (let i = 0; i < component.segments.length; i++) {
      component.segments[i].listen('click', handler);
    }
    component.destroy();
    emitEvent(root, 'click');
    expect(handler).not.toHaveBeenCalled();
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle change');
    component.listen(events.CHANGE, handler);

    emitEvent(root, events.SELECTED);
    expect(handler).toHaveBeenCalled();
  });

  it('#destroy removes event handlers', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle change');
    component.listen(events.CHANGE, handler);
    component.destroy();

    emitEvent(root, events.SELECTED);
    expect(handler).not.toHaveBeenCalled();
  });

  it('#initialSyncWithDOM sets children\'s \'index\' and \'isSingleSelect\' values', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle selected');
    component.listen(events.SELECTED, handler);
    const isSingleSelect = root.classList.contains(cssClasses.SINGLE_SELECT);

    for (let i = 0; i < component.segments.length; i++) {
      const segment_adapter = (component.segments[i].getDefaultFoundation() as any).adapter
      segment_adapter.notifySelectedChange(true);

      expect(handler.calls.mostRecent().args[0].detail.index).toEqual(i);
      expect(segment_adapter.isSingleSelect()).toEqual(isSingleSelect);
    }

    component.destroy()
  });

  describe('Adapter', () => {
    it('#hasClass returns whether root element has test class', () => {
      const {root, adapter} = setupTest();

      root.classList.add(test_css_classes.TEST_CLASS);
      expect(adapter.hasClass(test_css_classes.TEST_CLASS)).toBeTrue();
      root.classList.remove(test_css_classes.TEST_CLASS);
      expect(adapter.hasClass(test_css_classes.TEST_CLASS)).toBeFalse();
    });

    it('#getSegments returns child segments as readonly SegmentDetails array', () => {
      const {adapter} = setupTest();

      const segments = adapter.getSegments();
      expect(segments.length).toEqual(3);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].index).toEqual(i);
        expect(segments[i].hasOwnProperty('selected')).toBeTrue();
        expect(segments[i].hasOwnProperty('segmentId')).toBeTrue();
      }
    });

    it('#selectSegment selects identified child segment if found', () => {
      const {root, adapter} = setupTest();

      const segments = root.querySelectorAll(test_selectors.SEGMENT);
      segments[test_indices.SELECTED].setAttribute(attributes.DATA_SEGMENT_ID, test_segment_ids.SELECTED_SEGMENT_ID);

      setAllUnselected(segments);
      adapter.selectSegment(test_indices.SELECTED);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(test_css_classes.SELECTED)).toEqual(i === test_indices.SELECTED);
      }

      setAllUnselected(segments);
      adapter.selectSegment(test_segment_ids.SELECTED_SEGMENT_ID);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(test_css_classes.SELECTED)).toEqual(i === test_indices.SELECTED);
      }
    });

    it('#selectSegment selects no child segment if none is identified', () => {
      const {root, adapter} = setupTest();

      const segments = root.querySelectorAll(test_selectors.SEGMENT);
      setAllUnselected(segments);

      adapter.selectSegment(test_indices.NOT_PRESENT);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(test_css_classes.SELECTED)).toBeFalse();
      }

      adapter.selectSegment(test_segment_ids.NOT_PRESENT_SEGMENT_ID);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(test_css_classes.SELECTED)).toBeFalse();
      }
    });

    it('#unselectSegment unselectes identified child segment if found', () => {
      const {root, adapter} = setupTest();

      const segments = root.querySelectorAll(test_selectors.SEGMENT);
      segments[test_indices.UNSELECTED].setAttribute(attributes.DATA_SEGMENT_ID, test_segment_ids.UNSELECTED_SEGMENT_ID);

      setAllSelected(segments);
      adapter.unselectSegment(test_indices.UNSELECTED);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(test_css_classes.SELECTED)).toEqual(i !== test_indices.UNSELECTED);
      }

      setAllSelected(segments);
      adapter.unselectSegment(test_segment_ids.UNSELECTED_SEGMENT_ID);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(test_css_classes.SELECTED)).toEqual(i !== test_indices.UNSELECTED);
      }
    });

    it('#unselectSegment unselects no child segment if none is identified', () => {
      const {root, adapter} = setupTest();

      const segments = root.querySelectorAll(test_selectors.SEGMENT);
      setAllSelected(segments);

      adapter.unselectSegment(test_indices.NOT_PRESENT);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(test_css_classes.SELECTED)).toBeTrue();
      }

      adapter.unselectSegment(test_segment_ids.NOT_PRESENT_SEGMENT_ID);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(test_css_classes.SELECTED)).toBeTrue();
      }
    });

    it(`#notifySelectedChange emits ${events.CHANGE} with SegmentDetail`, () => {
      const {component, adapter} = setupTest();
      const handler = jasmine.createSpy('change handler');

      component.listen(events.CHANGE, handler);

      adapter.notifySelectedChange({
        index: test_indices.SELECTED,
        selected: true,
        segmentId: test_segment_ids.SELECTED_SEGMENT_ID
      });
      expect(handler).toHaveBeenCalledWith(jasmine.anything());
      expect(handler.calls.mostRecent().args[0].detail.index).toEqual(test_indices.SELECTED);
      expect(handler.calls.mostRecent().args[0].detail.selected).toBeTrue();
      expect(handler.calls.mostRecent().args[0].detail.segmentId).toEqual(test_segment_ids.SELECTED_SEGMENT_ID);
    });
  });

  it('#getSelectedSegments returns selected child segments as a SegmentDetail list', () => {
    const {root, component} = setupTest();

    const segments = root.querySelectorAll(test_selectors.SEGMENT);
    setAllSelected(segments);

    const selected_segments = component.getSelectedSegments();
    expect(selected_segments.length).toEqual(segments.length);
    for (let i = 0; i < selected_segments.length; i++) {
      expect(selected_segments[i].index).toEqual(i);
      expect(selected_segments[i].selected).toBeTrue();
      expect(selected_segments[i].hasOwnProperty('segmentId')).toBeTrue();
    }

    setAllUnselected(segments);
    expect(component.getSelectedSegments().length).toEqual(0);
  });

  it('#selectSegment selects identified child segment', () => {
    const {root, component} = setupTest();

    const segments = root.querySelectorAll(test_selectors.SEGMENT);
    const selected_segment = segments[test_indices.SELECTED];
    selected_segment.setAttribute(attributes.DATA_SEGMENT_ID, test_segment_ids.SELECTED_SEGMENT_ID);
    
    setAllUnselected(segments);
    component.selectSegment(test_indices.SELECTED);
    expect(selected_segment.classList.contains(test_css_classes.SELECTED)).toBeTrue();

    setAllUnselected(segments);
    component.selectSegment(test_segment_ids.SELECTED_SEGMENT_ID);
    expect(selected_segment.classList.contains(test_css_classes.SELECTED)).toBeTrue();
  });

  it('#unselectSegment unselects identified child segment', () => {
    const {root, component} = setupTest();

    const segments = root.querySelectorAll(test_selectors.SEGMENT);
    const unselected_segment = segments[test_indices.UNSELECTED];
    unselected_segment.setAttribute(attributes.DATA_SEGMENT_ID, test_segment_ids.UNSELECTED_SEGMENT_ID);

    setAllSelected(segments);
    component.unselectSegment(test_indices.UNSELECTED);
    expect(unselected_segment.classList.contains(test_css_classes.SELECTED)).toBeFalse();

    setAllSelected(segments);
    component.unselectSegment(test_segment_ids.UNSELECTED_SEGMENT_ID);
    expect(unselected_segment.classList.contains(test_css_classes.SELECTED)).toBeFalse();
  });

  it('#isSegmentSelected returns whether identified child segment is selected', () => {
    const {root, component} = setupTest();

    const segments = root.querySelectorAll(test_selectors.SEGMENT);
    const selected_segment = segments[test_indices.SELECTED];
    const unselected_segment = segments[test_indices.UNSELECTED];
    selected_segment.classList.add(test_css_classes.SELECTED);
    selected_segment.setAttribute(attributes.DATA_SEGMENT_ID, test_segment_ids.SELECTED_SEGMENT_ID);
    unselected_segment.classList.remove(test_css_classes.SELECTED);
    unselected_segment.setAttribute(attributes.DATA_SEGMENT_ID, test_segment_ids.UNSELECTED_SEGMENT_ID);

    expect(component.isSegmentSelected(test_indices.SELECTED)).toBeTrue();
    expect(component.isSegmentSelected(test_segment_ids.SELECTED_SEGMENT_ID)).toBeTrue();
    expect(component.isSegmentSelected(test_indices.UNSELECTED)).toBeFalse();
    expect(component.isSegmentSelected(test_segment_ids.UNSELECTED_SEGMENT_ID)).toBeFalse();
    expect(component.isSegmentSelected(test_indices.NOT_PRESENT)).toBeFalse();
    expect(component.isSegmentSelected(test_segment_ids.NOT_PRESENT_SEGMENT_ID)).toBeFalse();
  });
});
