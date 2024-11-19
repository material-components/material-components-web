/**
 * @license
 * Copyright 2021 Google Inc.
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

import 'jasmine';

import {ObserverRecord} from '../observer';
import {MDCObserverFoundation} from '../observer-foundation';

describe('MDCObserverFoundation', () => {
  class TestMDCObserverFoundation extends MDCObserverFoundation<{}> {
    override observe<T extends object>(
        target: T, observers: ObserverRecord<T, this>) {
      return super.observe(target, observers);
    }

    override setObserversEnabled(target: object, enabled: boolean) {
      super.setObserversEnabled(target, enabled);
    }

    override unobserve() {
      super.unobserve();
    }
  }

  let instance!: TestMDCObserverFoundation;
  const initialState = {stringProp: 'value', numberProp: 0};
  let state = {...initialState};
  const stringObserver = jasmine.createSpy('stringObserver');
  const numberObserver = jasmine.createSpy('numberObserver');

  beforeEach(() => {
    instance = new TestMDCObserverFoundation({});
    state = {...initialState};
    stringObserver.and.stub();
    stringObserver.calls.reset();
    numberObserver.and.stub();
    numberObserver.calls.reset();
  });

  it('#observe() should listen to multiple properties', () => {
    instance.observe(state, {
      stringProp: stringObserver,
      numberProp: numberObserver,
    });

    state.stringProp = 'newValue';
    state.numberProp = 1;
    // TODO(b/183749291): replace when jasmine typings issue resolved
    // expect(stringObserver)
    //     .toHaveBeenCalledOnceWith(state.stringProp, initialState.stringProp);
    expect(stringObserver).toHaveBeenCalledTimes(1);
    expect(stringObserver)
        .toHaveBeenCalledWith(state.stringProp, initialState.stringProp);
    // expect(numberObserver)
    //     .toHaveBeenCalledOnceWith(state.numberProp, initialState.numberProp);
    expect(numberObserver).toHaveBeenCalledTimes(1);
    expect(numberObserver)
        .toHaveBeenCalledWith(state.numberProp, initialState.numberProp);
  });

  it('#observe() should call Observers with instance as `this`', () => {
    let observerThis: unknown;
    stringObserver.and.callFake(function(this: unknown) {
      observerThis = this;
    });

    instance.observe(state, {
      stringProp: stringObserver,
    });

    state.stringProp = 'newValue';
    expect(observerThis).toBe(instance, 'observer `this` should be instance');
  });

  it('#observe() cleanup function stops Observers', () => {
    const unobserve = instance.observe(
        state, {stringProp: stringObserver, numberProp: numberObserver});

    state.stringProp = 'newValue';
    state.numberProp = 1;
    stringObserver.calls.reset();
    numberObserver.calls.reset();
    unobserve();
    state.stringProp = 'anotherValue';
    state.numberProp = 2;
    expect(stringObserver).not.toHaveBeenCalled();
    expect(numberObserver).not.toHaveBeenCalled();
  });

  it('#observe() cleanup function does not stop Observers from other invocations',
     () => {
       const otherStringObserver = jasmine.createSpy('otherStringObserver');
       const unobserve = instance.observe(
           state, {stringProp: stringObserver, numberProp: numberObserver});

       instance.observe(state, {stringProp: otherStringObserver});

       state.stringProp = 'newValue';
       state.numberProp = 1;
       unobserve();
       state.stringProp = 'anotherValue';
       state.numberProp = 2;
       expect(otherStringObserver).toHaveBeenCalledTimes(2);
     });

  it('#unobserve() stops Observers from all invocations', () => {
    const otherStringObserver = jasmine.createSpy('otherStringObserver');
    instance.observe(
        state, {stringProp: stringObserver, numberProp: numberObserver});
    instance.observe(state, {stringProp: otherStringObserver});
    state.stringProp = 'newValue';
    state.numberProp = 1;
    stringObserver.calls.reset();
    numberObserver.calls.reset();
    otherStringObserver.calls.reset();
    instance.unobserve();
    state.stringProp = 'anotherValue';
    state.numberProp = 2;
    expect(stringObserver).not.toHaveBeenCalled();
    expect(numberObserver).not.toHaveBeenCalled();
    expect(otherStringObserver).not.toHaveBeenCalled();
  });

  it('#setObserversEnabled() can disable and enable all Observers', () => {
    const otherStringObserver = jasmine.createSpy('otherStringObserver');
    instance.observe(
        state, {stringProp: stringObserver, numberProp: numberObserver});
    instance.observe(state, {stringProp: otherStringObserver});
    state.stringProp = 'newValue';
    state.numberProp = 1;
    stringObserver.calls.reset();
    numberObserver.calls.reset();
    otherStringObserver.calls.reset();
    // Test disabled
    instance.setObserversEnabled(state, false);
    state.stringProp = 'anotherValue';
    state.numberProp = 2;
    expect(stringObserver).not.toHaveBeenCalled();
    expect(numberObserver).not.toHaveBeenCalled();
    expect(otherStringObserver).not.toHaveBeenCalled();
    // Test enabled
    instance.setObserversEnabled(state, true);
    state.stringProp = 'thirdValue';
    state.numberProp = 3;
    // TODO(b/183749291): replace when jasmine typings issue resolved
    // expect(stringObserver)
    //     .toHaveBeenCalledOnceWith('thirdValue', 'anotherValue');
    expect(stringObserver).toHaveBeenCalledTimes(1);
    expect(stringObserver).toHaveBeenCalledWith('thirdValue', 'anotherValue');
    // expect(otherStringObserver)
    //     .toHaveBeenCalledOnceWith('thirdValue', 'anotherValue');
    expect(otherStringObserver).toHaveBeenCalledTimes(1);
    expect(otherStringObserver)
        .toHaveBeenCalledWith('thirdValue', 'anotherValue');
    // expect(numberObserver).toHaveBeenCalledOnceWith(3, 2);
    expect(numberObserver).toHaveBeenCalledTimes(1);
    expect(numberObserver).toHaveBeenCalledWith(3, 2);
  });

  it('#destroy() removes state observers', () => {
    spyOn(instance, 'unobserve').and.callThrough();
    instance.destroy();
    expect(instance.unobserve).toHaveBeenCalled();
  });
});
