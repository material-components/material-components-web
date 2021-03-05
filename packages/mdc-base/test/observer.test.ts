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

import {mdcObserver as mdcObserverIE, observeProperty as observePropertyIE, setObserversEnabled as setObserversEnabledIE} from '../observer';
import {mdcObserver as mdcObserverProxy, observeProperty as observePropertyProxy, setObserversEnabled as setObserversEnabledProxy} from '../observer-proxy';

createObserverTests(mdcObserverIE, observePropertyIE, setObserversEnabledIE);

if (typeof Proxy === 'function') {
  createObserverTests(
      mdcObserverProxy, observePropertyProxy, setObserversEnabledProxy,
      'Proxy ');
}

function createObserverTests(
    mdcObserver: typeof mdcObserverIE,
    observeProperty: typeof observePropertyIE,
    setObserversEnabled: typeof setObserversEnabledIE, testPrefix = '') {
  describe(`${testPrefix}mdcObserver()`, () => {
    let baseClass!: ReturnType<typeof mdcObserver>;
    let instance!: InstanceType<typeof baseClass>;
    const initialState = {string: 'value', number: 0};
    let state = {...initialState};
    const stringObserver = jasmine.createSpy('stringObserver');
    const numberObserver = jasmine.createSpy('numberObserver');

    beforeEach(() => {
      baseClass = mdcObserver();
      instance = new baseClass();
      state = {...initialState};
      stringObserver.and.stub();
      stringObserver.calls.reset();
      numberObserver.and.stub();
      numberObserver.calls.reset();
    });

    it('should return MDCObserver class to extend from', () => {
      expect(instance.observe).toEqual(jasmine.any(Function));
      expect(instance.unobserve).toEqual(jasmine.any(Function));
      expect(instance.setObserversEnabled).toEqual(jasmine.any(Function));
    });

    it('should extend from provided base class', () => {
      class SuperClass {}
      baseClass = mdcObserver(SuperClass);
      instance = new baseClass();
      expect(instance).toBeInstanceOf(SuperClass);
    });

    it('#observe() should listen to multiple properties', () => {
      instance.observe(state, {
        string: stringObserver,
        number: numberObserver,
      });

      state.string = 'newValue';
      state.number = 1;
      expect(stringObserver)
          .toHaveBeenCalledOnceWith(state.string, initialState.string);
      expect(numberObserver)
          .toHaveBeenCalledOnceWith(state.number, initialState.number);
    });

    it('#observe() should call Observers with instance as `this`', () => {
      let observerThis: unknown;
      stringObserver.and.callFake(function(this: unknown) {
        observerThis = this;
      });

      instance.observe(state, {
        string: stringObserver,
      });

      state.string = 'newValue';
      expect(observerThis).toBe(instance, 'observer `this` should be instance');
    });

    it('#observe() cleanup function stops Observers', () => {
      const unobserve = instance.observe(
          state, {string: stringObserver, number: numberObserver});

      state.string = 'newValue';
      state.number = 1;
      stringObserver.calls.reset();
      numberObserver.calls.reset();
      unobserve();
      state.string = 'anotherValue';
      state.number = 2;
      expect(stringObserver).not.toHaveBeenCalled();
      expect(numberObserver).not.toHaveBeenCalled();
    });

    it('#observe() cleanup function does not stop Observers from other invocations',
       () => {
         const otherStringObserver = jasmine.createSpy('otherStringObserver');
         const unobserve = instance.observe(
             state, {string: stringObserver, number: numberObserver});

         instance.observe(state, {string: otherStringObserver});

         state.string = 'newValue';
         state.number = 1;
         unobserve();
         state.string = 'anotherValue';
         state.number = 2;
         expect(otherStringObserver).toHaveBeenCalledTimes(2);
       });

    it('#unobserve() stops Observers from all invocations', () => {
      const otherStringObserver = jasmine.createSpy('otherStringObserver');
      instance.observe(state, {string: stringObserver, number: numberObserver});
      instance.observe(state, {string: otherStringObserver});
      state.string = 'newValue';
      state.number = 1;
      stringObserver.calls.reset();
      numberObserver.calls.reset();
      otherStringObserver.calls.reset();
      instance.unobserve();
      state.string = 'anotherValue';
      state.number = 2;
      expect(stringObserver).not.toHaveBeenCalled();
      expect(numberObserver).not.toHaveBeenCalled();
      expect(otherStringObserver).not.toHaveBeenCalled();
    });

    it('#setObserversEnabled() can disable and enable all Observers', () => {
      const otherStringObserver = jasmine.createSpy('otherStringObserver');
      instance.observe(state, {string: stringObserver, number: numberObserver});
      instance.observe(state, {string: otherStringObserver});
      state.string = 'newValue';
      state.number = 1;
      stringObserver.calls.reset();
      numberObserver.calls.reset();
      otherStringObserver.calls.reset();
      // Test disabled
      instance.setObserversEnabled(state, false);
      state.string = 'anotherValue';
      state.number = 2;
      expect(stringObserver).not.toHaveBeenCalled();
      expect(numberObserver).not.toHaveBeenCalled();
      expect(otherStringObserver).not.toHaveBeenCalled();
      // Test enabled
      instance.setObserversEnabled(state, true);
      state.string = 'thirdValue';
      state.number = 3;
      expect(stringObserver)
          .toHaveBeenCalledOnceWith('thirdValue', 'anotherValue');
      expect(otherStringObserver)
          .toHaveBeenCalledOnceWith('thirdValue', 'anotherValue');
      expect(numberObserver).toHaveBeenCalledOnceWith(3, 2);
    });
  });

  describe(`${testPrefix}observeProperty()`, () => {
    it('should call Observer when property value changes', () => {
      const state = {foo: 'value'};
      const observer = jasmine.createSpy('observer');
      observeProperty(state, 'foo', observer);
      // observer should not be called before property changes
      expect(observer).not.toHaveBeenCalled();
      state.foo = 'newValue';
      expect(observer).toHaveBeenCalledOnceWith('newValue', 'value');
      observer.calls.reset();
      state.foo = 'newValue';
      // observer should not be called if property is set to a value that
      // does not change
      expect(observer).not.toHaveBeenCalled();
    });

    it('should stop observing when returned function is called', () => {
      const state = {foo: 'value'};
      const observer = jasmine.createSpy('observer');
      const unobserve = observeProperty(state, 'foo', observer);
      unobserve();
      state.foo = 'newValue';
      // observer should not be called after cleaning up
      expect(observer).not.toHaveBeenCalled();
    });

    it('should handle multiple Observers on the same property', () => {
      const state = {foo: 'value'};
      const observerOne = jasmine.createSpy('observerOne');
      const observerTwo = jasmine.createSpy('observerTwo');
      const unobserveOne = observeProperty(state, 'foo', observerOne);
      observeProperty(state, 'foo', observerTwo);
      state.foo = 'newValue';
      expect(observerOne).toHaveBeenCalledOnceWith('newValue', 'value');
      expect(observerTwo).toHaveBeenCalledOnceWith('newValue', 'value');
      unobserveOne();
      state.foo = 'anotherValue';
      // First observer should stop listening
      expect(observerOne).toHaveBeenCalledTimes(1);
      // Second observer should continue listening
      expect(observerTwo).toHaveBeenCalledTimes(2);
      expect(observerTwo).toHaveBeenCalledWith('anotherValue', 'newValue');
    });
  });

  describe(`${testPrefix}setObserversEnabled()`, () => {
    it('should disable or enable all observers for a target', () => {
      const state = {string: 'value', number: 0};
      const stringObserver = jasmine.createSpy('stringObserver');
      const numberObserver = jasmine.createSpy('numberObserver');
      observeProperty(state, 'string', stringObserver);
      observeProperty(state, 'number', numberObserver);
      state.string = 'newValue';
      state.number = 1;
      stringObserver.calls.reset();
      numberObserver.calls.reset();
      // Test disabled
      setObserversEnabled(state, false);
      state.string = 'anotherValue';
      state.number = 2;
      expect(stringObserver).not.toHaveBeenCalled();
      expect(numberObserver).not.toHaveBeenCalled();
      // Test disabled
      setObserversEnabled(state, true);
      state.string = 'thirdValue';
      state.number = 3;
      expect(stringObserver)
          .toHaveBeenCalledOnceWith('thirdValue', 'anotherValue');
      expect(numberObserver).toHaveBeenCalledOnceWith(3, 2);
    });
  });
}
