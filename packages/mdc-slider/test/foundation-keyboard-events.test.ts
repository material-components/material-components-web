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


import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

import {setupEventTest as setupTest, TRANSFORM_PROP} from './helpers';

describe('MDCSliderFoundation - keyboard events', () => {
  setUpMdcTestEnvironment();

  function createFakeEvent(info = {}) {
    return Object.assign(
        {
          preventDefault: jasmine.createSpy('evt.preventDefault'),
        },
        info);
  }

  it('on arrow left keydown prevents the default behavior', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'ArrowLeft'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);
    jasmine.clock().tick(1);

    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('on arrow left keydown decreases the slider value by 1 when no step given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'ArrowLeft'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(49);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(49px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.49)');
     });

  it('on arrow left keydown decreases the slider value by the step amount when a step value is given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setStep(10);
       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'ArrowLeft'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(40);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(40px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.4)');
     });

  it('on arrow left increases the slider value when in an RTL context', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    mockAdapter.isRTL.and.returnValue(true);
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({key: 'ArrowLeft'}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(51);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(49px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.51)');
  });

  it('on arrow left keydown works with keyCode', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({keyCode: 37}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(49);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(49px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.49)');
  });

  it('on arrow left keydown works with non-standard IE key propery backed with proper keyCode',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'Left', keyCode: 37}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(49);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(49px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.49)');
     });


  it('on arrow up keydown prevents the default behavior', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'ArrowUp'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);
    jasmine.clock().tick(1);

    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('on arrow up keydown increases the slider value by 1 when no step given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'ArrowUp'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(51);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(51px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.51)');
     });

  it('on arrow up keydown increases the slider value by the step amount when a step value is given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setStep(10);
       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'ArrowUp'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(60);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(60px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.6)');
     });

  it('on arrow up keydown works with keyCode', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({keyCode: 38}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(51);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(51px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.51)');
  });

  it('on arrow up keydown works with non-standard IE key propery backed with proper keyCode',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'Up', keyCode: 38}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(51);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(51px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.51)');
     });


  it('on arrow right keydown prevents the default behavior', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'ArrowRight'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);
    jasmine.clock().tick(1);

    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('on arrow right keydown increases the slider value by 1 when no step given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'ArrowRight'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(51);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(51px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.51)');
     });

  it('on arrow right keydown increases the slider value by the step amount when a step value is given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setStep(10);
       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'ArrowRight'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(60);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(60px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.6)');
     });

  it('on arrow right decreases the slider value when in an RTL context', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    mockAdapter.isRTL.and.returnValue(true);
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({key: 'ArrowRight'}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(49);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(51px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.49)');
  });

  it('on arrow right keydown works with keyCode', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({keyCode: 39}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(51);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(51px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.51)');
  });

  it('on arrow right keydown works with non-standard IE key propery backed with proper keyCode',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'Right', keyCode: 39}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(51);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(51px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.51)');
     });


  it('on arrow down keydown prevents the default behavior', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'ArrowDown'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);
    jasmine.clock().tick(1);

    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('on arrow down keydown decreases the slider value by 1 when no step given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'ArrowDown'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(49);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(49px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.49)');
     });

  it('on arrow down keydown decreases the slider value by the step amount when a step value is given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setStep(10);
       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'ArrowDown'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(40);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(40px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.4)');
     });

  it('on arrow down keydown works with keyCode', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({keyCode: 40}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(49);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(49px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.49)');
  });

  it('on arrow down keydown works with non-standard IE key propery backed with proper keyCode',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'Down', keyCode: 40}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(49);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(49px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.49)');
     });


  it('on home keydown prevents default', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'Home'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);
    jasmine.clock().tick(1);

    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('on home keydown sets the slider to the minimum value', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({key: 'Home'}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(0);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(0px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0)');
  });

  it('on home keydown works with keyCode', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({keyCode: 36}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(0);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(0px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0)');
  });

  it('on end keydown prevents default', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'End'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);
    jasmine.clock().tick(1);

    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('on end keydown sets the slider to the maximum value', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({key: 'End'}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(100);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(100px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(1)');
  });

  it('on end keydown works with keyCode', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({keyCode: 35}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(100);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(100px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(1)');
  });

  it('on page up keydown prevents default', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'PageUp'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);
    jasmine.clock().tick(1);

    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('on page up keydown increases the slider by 4 when no step given', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({key: 'PageUp'}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(54);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(54px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.54)');
  });

  it('on page up keydown increases the slider by 4 * the step value when a step is given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       foundation.setStep(5);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'PageUp'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(70);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(70px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.7)');
     });

  it('on page up keydown works with keyCode', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({keyCode: 33}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(54);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(54px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.54)');
  });

  it('on page down keydown prevents default', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'PageDown'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);
    jasmine.clock().tick(1);

    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('on page down keydown increases the slider by 4 when no step given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'PageDown'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(46);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(46px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.46)');
     });

  it('on page down keydown increases the slider by 4 * the step value when a step is given',
     () => {
       const {foundation, mockAdapter, rootHandlers} = setupTest();

       mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
       foundation.init();
       jasmine.clock().tick(1);

       foundation.setValue(50);
       foundation.setStep(5);
       jasmine.clock().tick(1);

       rootHandlers['keydown'](createFakeEvent({key: 'PageDown'}));
       jasmine.clock().tick(1);

       expect(foundation.getValue()).toEqual(30);
       expect(mockAdapter.setThumbContainerStyleProperty)
           .toHaveBeenCalledWith(
               TRANSFORM_PROP, 'translateX(30px) translateX(-50%)');
       expect(mockAdapter.setTrackStyleProperty)
           .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.3)');
     });

  it('on page down keydown works with keyCode', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](createFakeEvent({keyCode: 34}));
    jasmine.clock().tick(1);

    expect(foundation.getValue()).toEqual(46);
    expect(mockAdapter.setThumbContainerStyleProperty)
        .toHaveBeenCalledWith(
            TRANSFORM_PROP, 'translateX(46px) translateX(-50%)');
    expect(mockAdapter.setTrackStyleProperty)
        .toHaveBeenCalledWith(TRANSFORM_PROP, 'scaleX(0.46)');
  });

  it('on any other keydown does nothing', () => {
    const {foundation, mockAdapter, rootHandlers} = setupTest();
    const evt = createFakeEvent({key: 'Enter'});

    mockAdapter.computeBoundingRect.and.returnValue({left: 0, width: 100});
    foundation.init();
    jasmine.clock().tick(1);

    foundation.setValue(50);
    jasmine.clock().tick(1);

    rootHandlers['keydown'](evt);

    expect(evt.preventDefault).not.toHaveBeenCalled();
    expect(foundation.getValue()).toEqual(50);
  });
});
