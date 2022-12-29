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

import {createFixture, html} from '../../../../testing/dom';
import {emitEvent} from '../../../../testing/dom/events';
import {attributes} from '../../segment/constants';
import {MDCSegmentedButtonSegment} from '../../segment/index';
import {cssClasses, events} from '../constants';
import {MDCSegmentedButton} from '../index';

import {testCssClasses, testIndices, testSegmentIds, testSelectors} from './constants';

const getFixtureMultiWithLabel = () => {
  return createFixture(html`
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
  `);
};

const setupTest = () => {
  const root = getFixtureMultiWithLabel();
  const component = new MDCSegmentedButton(root);
  const adapter = (component.getDefaultFoundation() as any).adapter;
  return {root, component, adapter};
};

const setAllSelected =
    (els: NodeListOf<Element>) => {
      Array.from(els).forEach((el: Element) => {
        el.classList.add(testCssClasses.SELECTED);
      });
    }

const setAllUnselected =
    (els: NodeListOf<Element>) => {
      Array.from(els).forEach((el: Element) => {
        el.classList.remove(testCssClasses.SELECTED);
      });
    }

describe('MDCSegmentedButton', () => {
  it('#attachTo returns an MDCSegmentedButton instance', () => {
    expect(
        MDCSegmentedButton.attachTo(getFixtureMultiWithLabel()) instanceof
        MDCSegmentedButton)
        .toBeTruthy();
  });

  it('#constructor instantiates child segment components', () => {
    const {component} = setupTest();
    expect(component.segments.length).toEqual(3);
    expect(component.segments[0])
        .toEqual(jasmine.any(MDCSegmentedButtonSegment));
    expect(component.segments[1])
        .toEqual(jasmine.any(MDCSegmentedButtonSegment));
    expect(component.segments[2])
        .toEqual(jasmine.any(MDCSegmentedButtonSegment));
    component.destroy();
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

    component.unlisten(events.CHANGE, handler);
    component.destroy();
  });

  it('#destroy removes event handlers', () => {
    const {root, component} = setupTest();
    const handler = jasmine.createSpy('handle change');
    component.listen(events.CHANGE, handler);
    component.destroy();

    emitEvent(root, events.SELECTED);
    expect(handler).not.toHaveBeenCalled();

    component.unlisten(events.CHANGE, handler);
  });

  it('#initialSyncWithDOM sets children\'s \'index\' and \'isSingleSelect\' values',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('handle selected');
       component.listen(events.SELECTED, handler);
       const isSingleSelect = root.classList.contains(cssClasses.SINGLE_SELECT);

       for (let i = 0; i < component.segments.length; i++) {
         const segmentAdapter =
             (component.segments[i].getDefaultFoundation() as any).adapter
         segmentAdapter.notifySelectedChange(true);

         expect(handler.calls.mostRecent().args[0].detail.index).toEqual(i);
         expect(segmentAdapter.isSingleSelect()).toEqual(isSingleSelect);
       }

       component.destroy();
     });

  describe('Adapter', () => {
    it('#hasClass returns whether root element has test class', () => {
      const {root, component, adapter} = setupTest();

      root.classList.add(testCssClasses.TEST_CLASS);
      expect(adapter.hasClass(testCssClasses.TEST_CLASS)).toBeTrue();
      root.classList.remove(testCssClasses.TEST_CLASS);
      expect(adapter.hasClass(testCssClasses.TEST_CLASS)).toBeFalse();

      component.destroy();
    });

    it('#getSegments returns child segments as readonly SegmentDetails array',
       () => {
         const {component, adapter} = setupTest();

         const segments = adapter.getSegments();
         expect(segments.length).toEqual(3);
         for (let i = 0; i < segments.length; i++) {
           expect(segments[i].index).toEqual(i);
           expect(segments[i].hasOwnProperty('selected')).toBeTrue();
           expect(segments[i].hasOwnProperty('segmentId')).toBeTrue();
         }

         component.destroy();
       });

    it('#selectSegment selects identified child segment if found', () => {
      const {root, component, adapter} = setupTest();

      const segments = root.querySelectorAll(testSelectors.SEGMENT);
      segments[testIndices.SELECTED].setAttribute(
          attributes.DATA_SEGMENT_ID, testSegmentIds.SELECTED_SEGMENT_ID);

      setAllUnselected(segments);
      adapter.selectSegment(testIndices.SELECTED);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(testCssClasses.SELECTED))
            .toEqual(i === testIndices.SELECTED);
      }

      setAllUnselected(segments);
      adapter.selectSegment(testSegmentIds.SELECTED_SEGMENT_ID);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(testCssClasses.SELECTED))
            .toEqual(i === testIndices.SELECTED);
      }

      component.destroy();
    });

    it('#selectSegment selects no child segment if none is identified', () => {
      const {root, component, adapter} = setupTest();

      const segments = root.querySelectorAll(testSelectors.SEGMENT);
      setAllUnselected(segments);

      adapter.selectSegment(testIndices.NOT_PRESENT);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(testCssClasses.SELECTED))
            .toBeFalse();
      }

      adapter.selectSegment(testSegmentIds.NOT_PRESENT_SEGMENT_ID);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(testCssClasses.SELECTED))
            .toBeFalse();
      }

      component.destroy();
    });

    it('#unselectSegment unselectes identified child segment if found', () => {
      const {root, component, adapter} = setupTest();

      const segments = root.querySelectorAll(testSelectors.SEGMENT);
      segments[testIndices.UNSELECTED].setAttribute(
          attributes.DATA_SEGMENT_ID, testSegmentIds.UNSELECTED_SEGMENT_ID);

      setAllSelected(segments);
      adapter.unselectSegment(testIndices.UNSELECTED);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(testCssClasses.SELECTED))
            .toEqual(i !== testIndices.UNSELECTED);
      }

      setAllSelected(segments);
      adapter.unselectSegment(testSegmentIds.UNSELECTED_SEGMENT_ID);
      for (let i = 0; i < segments.length; i++) {
        expect(segments[i].classList.contains(testCssClasses.SELECTED))
            .toEqual(i !== testIndices.UNSELECTED);
      }

      component.destroy();
    });

    it('#unselectSegment unselects no child segment if none is identified',
       () => {
         const {root, component, adapter} = setupTest();

         const segments = root.querySelectorAll(testSelectors.SEGMENT);
         setAllSelected(segments);

         adapter.unselectSegment(testIndices.NOT_PRESENT);
         for (let i = 0; i < segments.length; i++) {
           expect(segments[i].classList.contains(testCssClasses.SELECTED))
               .toBeTrue();
         }

         adapter.unselectSegment(testSegmentIds.NOT_PRESENT_SEGMENT_ID);
         for (let i = 0; i < segments.length; i++) {
           expect(segments[i].classList.contains(testCssClasses.SELECTED))
               .toBeTrue();
         }

         component.destroy();
       });

    it(`#notifySelectedChange emits ${events.CHANGE} with SegmentDetail`,
       () => {
         const {component, adapter} = setupTest();
         const handler = jasmine.createSpy('change handler');

         component.listen(events.CHANGE, handler);

         adapter.notifySelectedChange({
           index: testIndices.SELECTED,
           selected: true,
           segmentId: testSegmentIds.SELECTED_SEGMENT_ID
         });
         expect(handler).toHaveBeenCalledWith(jasmine.anything());
         expect(handler.calls.mostRecent().args[0].detail.index)
             .toEqual(testIndices.SELECTED);
         expect(handler.calls.mostRecent().args[0].detail.selected).toBeTrue();
         expect(handler.calls.mostRecent().args[0].detail.segmentId)
             .toEqual(testSegmentIds.SELECTED_SEGMENT_ID);

         component.unlisten(events.CHANGE, handler);
         component.destroy();
       });
  });

  it('#getSelectedSegments returns selected child segments as a SegmentDetail list',
     () => {
       const {root, component} = setupTest();

       const segments = root.querySelectorAll(testSelectors.SEGMENT);
       setAllSelected(segments);

       const selectedSegments = component.getSelectedSegments();
       expect(selectedSegments.length).toEqual(segments.length);
       for (let i = 0; i < selectedSegments.length; i++) {
         expect(selectedSegments[i].index).toEqual(i);
         expect(selectedSegments[i].selected).toBeTrue();
         expect(selectedSegments[i].hasOwnProperty('segmentId')).toBeTrue();
       }

       setAllUnselected(segments);
       expect(component.getSelectedSegments().length).toEqual(0);

       component.destroy();
     });

  it('#selectSegment selects identified child segment', () => {
    const {root, component} = setupTest();

    const segments = root.querySelectorAll(testSelectors.SEGMENT);
    const selectedSegment = segments[testIndices.SELECTED];
    selectedSegment.setAttribute(
        attributes.DATA_SEGMENT_ID, testSegmentIds.SELECTED_SEGMENT_ID);

    setAllUnselected(segments);
    component.selectSegment(testIndices.SELECTED);
    expect(selectedSegment.classList.contains(testCssClasses.SELECTED))
        .toBeTrue();

    setAllUnselected(segments);
    component.selectSegment(testSegmentIds.SELECTED_SEGMENT_ID);
    expect(selectedSegment.classList.contains(testCssClasses.SELECTED))
        .toBeTrue();

    component.destroy();
  });

  it('#unselectSegment unselects identified child segment', () => {
    const {root, component} = setupTest();

    const segments = root.querySelectorAll(testSelectors.SEGMENT);
    const unselectedSegment = segments[testIndices.UNSELECTED];
    unselectedSegment.setAttribute(
        attributes.DATA_SEGMENT_ID, testSegmentIds.UNSELECTED_SEGMENT_ID);

    setAllSelected(segments);
    component.unselectSegment(testIndices.UNSELECTED);
    expect(unselectedSegment.classList.contains(testCssClasses.SELECTED))
        .toBeFalse();

    setAllSelected(segments);
    component.unselectSegment(testSegmentIds.UNSELECTED_SEGMENT_ID);
    expect(unselectedSegment.classList.contains(testCssClasses.SELECTED))
        .toBeFalse();

    component.destroy();
  });

  it('#isSegmentSelected returns whether identified child segment is selected',
     () => {
       const {root, component} = setupTest();

       const segments = root.querySelectorAll(testSelectors.SEGMENT);
       const selectedSegment = segments[testIndices.SELECTED];
       const unselectedSegment = segments[testIndices.UNSELECTED];
       selectedSegment.classList.add(testCssClasses.SELECTED);
       selectedSegment.setAttribute(
           attributes.DATA_SEGMENT_ID, testSegmentIds.SELECTED_SEGMENT_ID);
       unselectedSegment.classList.remove(testCssClasses.SELECTED);
       unselectedSegment.setAttribute(
           attributes.DATA_SEGMENT_ID, testSegmentIds.UNSELECTED_SEGMENT_ID);

       expect(component.isSegmentSelected(testIndices.SELECTED)).toBeTrue();
       expect(component.isSegmentSelected(testSegmentIds.SELECTED_SEGMENT_ID))
           .toBeTrue();
       expect(component.isSegmentSelected(testIndices.UNSELECTED)).toBeFalse();
       expect(component.isSegmentSelected(testSegmentIds.UNSELECTED_SEGMENT_ID))
           .toBeFalse();
       expect(component.isSegmentSelected(testIndices.NOT_PRESENT)).toBeFalse();
       expect(
           component.isSegmentSelected(testSegmentIds.NOT_PRESENT_SEGMENT_ID))
           .toBeFalse();

       component.destroy();
     });
});
