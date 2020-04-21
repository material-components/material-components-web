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

import {getCorrectEventName} from '../../mdc-animation/index';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {cssClasses} from '../constants';

import {setupEventTest as setupTest, TRANSFORM_PROP} from './helpers';

describe('MDCSliderFoundation - pointer events', () => {
  setUpMdcTestEnvironment();

  const TRANSITION_END_EVT = getCorrectEventName(window, 'transitionend');

  const hasPointer = !!window.PointerEvent;

  if (hasPointer) {
    createTestSuiteForPointerEvents('pointerdown', 'pointermove', 'pointerup');
  } else {
    createTestSuiteForPointerEvents('mousedown', 'mousemove', 'mouseup');
    createTestSuiteForPointerEvents(
        'touchstart', 'touchmove', 'touchend',
        (clientX: number) => ({targetTouches: [{clientX}]}));
  }

  function createTestSuiteForPointerEvents(
      downEvt: string, moveEvt: string, upEvt: string,
      clientXObj: Function = (clientX: number) => ({clientX})) {
    it(`on ${
           downEvt} sets the value of the slider using the X coordinate of the event`,
       () => {
         const {foundation, mockAdapter, rootHandlers} = setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(50));
         jasmine.clock().tick(1);

         expect(foundation.getValue()).toEqual(50);
         expect(mockAdapter.setThumbContainerStyleProperty)
             .toHaveBeenCalledWith(
                 TRANSFORM_PROP, 'translateX(50px) translateX(-50%)');
         expect(mockAdapter.setTrackStyleProperty)
             .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.5)');
       });

    it(`on ${
           downEvt} offsets the value by the X position of the slider element`,
       () => {
         const {foundation, mockAdapter, rootHandlers} = setupTest();

         mockAdapter.computeBoundingRect.and.returnValue(
             {left: 10, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(50));
         jasmine.clock().tick(1);

         expect(foundation.getValue()).toEqual(40);
         expect(mockAdapter.setThumbContainerStyleProperty)
             .toHaveBeenCalledWith(
                 TRANSFORM_PROP, 'translateX(40px) translateX(-50%)');
         expect(mockAdapter.setTrackStyleProperty)
             .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.4)');
       });

    it(`on ${
           downEvt} takes RTL into account when computing the slider\'s value using the X ` +
           'coordinate of the event',
       () => {
         const {foundation, mockAdapter, rootHandlers} = setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         mockAdapter.isRTL.and.returnValue(true);
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(25));
         jasmine.clock().tick(1);

         expect(foundation.getValue()).toEqual(75);
         expect(mockAdapter.setThumbContainerStyleProperty)
             .toHaveBeenCalledWith(
                 TRANSFORM_PROP, 'translateX(25px) translateX(-50%)');
         expect(mockAdapter.setTrackStyleProperty)
             .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.75)');
       });

    it(`on ${downEvt} adds the mdc-slider--active class to the root element`,
       () => {
         const {foundation, mockAdapter, rootHandlers} = setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(50));
         jasmine.clock().tick(1);

         expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.ACTIVE);
       });

    it(`on ${
           downEvt} adds mdc-slider--in-transit class to the root element if the thumb container ` +
           'isn\'t the target',
       () => {
         const {foundation, mockAdapter, rootHandlers} = setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(50));
         jasmine.clock().tick(1);

         expect(mockAdapter.addClass)
             .toHaveBeenCalledWith(cssClasses.IN_TRANSIT);
       });

    it(`on ${
           downEvt} does not add mdc-slider--in-transit class to the root element if the thumb container ` +
           'is the target',
       () => {
         const {foundation, mockAdapter, thumbContainerHandlers} = setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         thumbContainerHandlers[downEvt](clientXObj(2));
         jasmine.clock().tick(1);

         expect(mockAdapter.addClass)
             .not.toHaveBeenCalledWith(cssClasses.IN_TRANSIT);
       });

    it(`on ${
           downEvt} removes the mdc-slider--in-transit class when the thumb container finishes transitioning`,
       () => {
         const {foundation, mockAdapter, rootHandlers, thumbContainerHandlers} =
             setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(2));
         jasmine.clock().tick(1);

         // Sanity check
         expect(mockAdapter.addClass)
             .toHaveBeenCalledWith(cssClasses.IN_TRANSIT);

         thumbContainerHandlers[TRANSITION_END_EVT]();
         expect(mockAdapter.removeClass)
             .toHaveBeenCalledWith(cssClasses.IN_TRANSIT);
       });

    it(`on ${downEvt} notifies the client of an input event`, () => {
      const {foundation, mockAdapter, rootHandlers} = setupTest();

      mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
      foundation.init();
      jasmine.clock().tick(1);

      rootHandlers[downEvt](clientXObj(50));
      jasmine.clock().tick(1);

      expect(mockAdapter.notifyInput).toHaveBeenCalled();
    });

    it(`on ${
           downEvt} notifies discrete slider pin value marker to change value`,
       () => {
         const {foundation, mockAdapter, rootHandlers} = setupTest();
         const isA = jasmine.any;

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
             .and.returnValue(true);
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(50));
         jasmine.clock().tick(1);

         expect(mockAdapter.setMarkerValue).toHaveBeenCalledWith(isA(Number));
       });

    it(`on ${downEvt} attaches event handlers for ${
           moveEvt} and all *up/end events to the document body`,
       () => {
         const {foundation, mockAdapter, rootHandlers} = setupTest();
         const isA = jasmine.any;

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(50));
         jasmine.clock().tick(1);

         if (hasPointer) {
           expect(mockAdapter.registerBodyInteractionHandler)
               .toHaveBeenCalledWith('pointerup', isA(Function));
         } else {
           expect(mockAdapter.registerBodyInteractionHandler)
               .toHaveBeenCalledWith('mouseup', isA(Function));
           expect(mockAdapter.registerBodyInteractionHandler)
               .toHaveBeenCalledWith('touchend', isA(Function));
         }

         expect(mockAdapter.registerBodyInteractionHandler)
             .toHaveBeenCalledWith(moveEvt, isA(Function));
       });

    it(`on ${downEvt} does nothing if the component is disabled`, () => {
      const {foundation, mockAdapter, rootHandlers} = setupTest();

      mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
      foundation.init();
      jasmine.clock().tick(1);

      const valueBeforeEvent = foundation.getValue();
      foundation.setDisabled(true);

      rootHandlers[downEvt](clientXObj(50));
      jasmine.clock().tick(1);

      expect(foundation.getValue()).toEqual(valueBeforeEvent);
      expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.ACTIVE);
      // These should only happen once during initialization
      expect(mockAdapter.setThumbContainerStyleProperty).toHaveBeenCalled();
      expect(mockAdapter.setThumbContainerStyleProperty)
          .toHaveBeenCalledTimes(1);
      expect(mockAdapter.setTrackStyleProperty).toHaveBeenCalled();
      expect(mockAdapter.setTrackStyleProperty).toHaveBeenCalledTimes(1);
    });

    it(`on body ${moveEvt} prevents default behavior`, () => {
      const {foundation, mockAdapter, rootHandlers, bodyHandlers} = setupTest();
      const preventDefault = jasmine.createSpy('evt.preventDefault');

      mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
      foundation.init();
      jasmine.clock().tick(1);

      rootHandlers[downEvt](clientXObj(49));
      bodyHandlers[moveEvt]({preventDefault, ...clientXObj(50)});
      jasmine.clock().tick(1);

      expect(preventDefault).toHaveBeenCalled();
    });

    it(`on body ${
           moveEvt} updates the slider\'s value based on the X coordinate of the event`,
       () => {
         const {foundation, mockAdapter, rootHandlers, bodyHandlers} =
             setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(49));
         bodyHandlers[moveEvt]({
           preventDefault: () => {},
           ...clientXObj(50),
         });
         jasmine.clock().tick(1);

         expect(foundation.getValue()).toEqual(50);
         expect(mockAdapter.setThumbContainerStyleProperty)
             .toHaveBeenCalledWith(
                 TRANSFORM_PROP, 'translateX(50px) translateX(-50%)');
         expect(mockAdapter.setTrackStyleProperty)
             .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.5)');
       });

    it(`on body ${moveEvt} notifies the client of an input event`, () => {
      const {foundation, mockAdapter, rootHandlers, bodyHandlers} = setupTest();

      mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
      foundation.init();
      jasmine.clock().tick(1);

      rootHandlers[downEvt](clientXObj(49));
      bodyHandlers[moveEvt]({
        preventDefault: () => {},
        ...clientXObj(50),
      });
      jasmine.clock().tick(1);

      // Once on mousedown, once on mousemove
      expect(mockAdapter.notifyInput).toHaveBeenCalledTimes(2);
    });

    it(`on body ${
           moveEvt} notifies discrete slider pin value marker to change value`,
       () => {
         const {foundation, mockAdapter, rootHandlers, bodyHandlers} =
             setupTest();
         const isA = jasmine.any;

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
             .and.returnValue(true);
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(49));
         bodyHandlers[moveEvt]({
           preventDefault: () => {},
           ...clientXObj(50),
         });
         jasmine.clock().tick(1);

         // Once on mousedown, once on mousemove
         expect(mockAdapter.setMarkerValue).toHaveBeenCalledWith(isA(Number));
         expect(mockAdapter.setMarkerValue).toHaveBeenCalledTimes(2);
       });

    it(`on body ${
           upEvt} removes the mdc-slider--active class from the component`,
       () => {
         const {foundation, mockAdapter, rootHandlers, bodyHandlers} =
             setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(50));
         jasmine.clock().tick(1);
         bodyHandlers[upEvt]();

         expect(mockAdapter.removeClass)
             .toHaveBeenCalledWith(cssClasses.ACTIVE);
       });

    it(`on body ${upEvt} removes the ${
           moveEvt} and all *up/end event handlers from the document body`,
       () => {
         const {foundation, mockAdapter, rootHandlers, bodyHandlers} =
             setupTest();
         const isA = jasmine.any;

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         foundation.init();
         jasmine.clock().tick(1);

         rootHandlers[downEvt](clientXObj(50));
         jasmine.clock().tick(1);
         bodyHandlers[upEvt]();

         if (hasPointer) {
           expect(mockAdapter.deregisterBodyInteractionHandler)
               .toHaveBeenCalledWith('pointerup', isA(Function));
         } else {
           expect(mockAdapter.deregisterBodyInteractionHandler)
               .toHaveBeenCalledWith('mouseup', isA(Function));
           expect(mockAdapter.deregisterBodyInteractionHandler)
               .toHaveBeenCalledWith('touchend', isA(Function));
         }
         expect(mockAdapter.deregisterBodyInteractionHandler)
             .toHaveBeenCalledWith(moveEvt, isA(Function));
       });

    it(`on body ${upEvt} notifies the client of a change event`, () => {
      const {foundation, mockAdapter, rootHandlers, bodyHandlers} = setupTest();

      mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
      foundation.init();
      jasmine.clock().tick(1);

      rootHandlers[downEvt](clientXObj(50));
      jasmine.clock().tick(1);
      bodyHandlers[upEvt]();

      expect(mockAdapter.notifyChange).toHaveBeenCalled();
    });

    it(`on body ${
           moveEvt} discrete slider avoids "-0" pin value marker`,
       () => {
         const {foundation, mockAdapter, rootHandlers, bodyHandlers} =
             setupTest();

         mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
         mockAdapter.hasClass.withArgs(cssClasses.IS_DISCRETE)
             .and.returnValue(true);
         foundation.init();
         foundation.setMin(-50);
         foundation.setMax(50);
         jasmine.clock().tick(1);

         // Simulate barely moving the pointer to the left of "0"
         rootHandlers[downEvt](clientXObj(50));
         bodyHandlers[moveEvt]({
           preventDefault: () => {},
           ...clientXObj(49.9),
         });
         jasmine.clock().tick(1);

         const stringValue = mockAdapter.setMarkerValue.calls.mostRecent().args[0].toLocaleString();
         expect(stringValue).toEqual('0');
       });
  }
});
