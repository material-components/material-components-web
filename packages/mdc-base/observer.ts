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

import {Constructor} from './types';

/**
 * A class that can observe targets and perform cleanup logic. Classes may
 * implement this using the `mdcObserver()` mixin.
 */
export interface MDCObserver {
  /**
   * Observe a target's properties for changes using the provided map of
   * property names and observer functions.
   *
   * @template T The target type.
   * @param {T} target - The target to observe.
   * @param {ObserverMap<T>} observers - An object whose keys are target
   *     properties and values are observer functions that are called when the
   *     associated property changes.
   * @return {Function} A cleanup function that can be called to unobserve the
   *     target.
   */
  observe<T extends object>(target: T, observers: ObserverMap<T, this>):
      () => void;
  /**
   * Clean up all observers and stop listening for property changes.
   */
  unobserve(): void;
}

/**
 * Mixin to add `MDCObserver` functionality.
 *
 * @return {Constructor<MDCObserver>} A class with `MDCObserver` functionality.
 */
export function mdcObserver(): Constructor<MDCObserver>;
/**
 * Mixin to add `MDCObserver` functionality to a base class.
 *
 * @template T Base class instance type. Specify this generic if the base class
 *     itself has generics that cannot be inferred.
 * @template C Base class constructor type.
 * @param {C} baseClass - Base class.
 * @return {Constructor<MDCObserver> & C} A class that extends the optional base
 *     class with `MDCObserver` functionality.
 */
export function mdcObserver<T, C extends Constructor<T>>(baseClass: C):
    Constructor<MDCObserver>&Constructor<T>&C;
/**
 * Mixin to add `MDCObserver` functionality to an optional base class.
 *
 * @template C Optional base class constructor type.
 * @param {C} baseClass - Optional base class.
 * @return {Constructor<MDCObserver> & C} A class that extends the optional base
 *     class with `MDCObserver` functionality.
 */
export function mdcObserver<C extends Constructor>(
    baseClass: C = class {} as C) {
  return class MDCObserver extends baseClass implements MDCObserver {
    private unregisterObservers: Function[] = [];

    observe<T extends object>(target: T, observers: ObserverMap<T, this>) {
      const cleanup: Function[] = [];
      for (const property of Object.keys(observers) as Array<keyof T>) {
        const observer = observers[property]!.bind(this);
        cleanup.push(observeProperty(target, property, observer));
      }

      const unobserve = () => {
        cleanup.forEach(cleanupFn => cleanupFn());
        const index = this.unregisterObservers.indexOf(unobserve);
        if (index > -1) {
          this.unregisterObservers.splice(index, 1);
        }
      };

      this.unregisterObservers.push(unobserve);
      return unobserve;
    }

    unobserve() {
      for (const unregisterObserver of this.unregisterObservers) {
        unregisterObserver();
      }

      this.unregisterObservers = [];
    }
  };
}

/**
 * A function used to observe property changes on a target.
 *
 * @template T The observed target type.
 * @template K The observed property.
 * @template This The `this` context of the observer function.
 * @param {T[K]} current - The current value of the property.
 * @param {T[K]} previous - The previous value of the property.
 */
export type Observer<T extends object, K extends keyof T, This = unknown> =
    (this: This, current: T[K], previous: T[K]) => void;

/**
 * An object map whose keys are properties of a target to observe and values
 * are `Observer` functions for each property.
 *
 * @template T The observed target type.
 * @template This The `this` context of observer functions.
 */
export type ObserverMap<T extends object, This = unknown> = {
  [K in keyof T]?: Observer<T, K, This>;
};

/**
 * Observe a target's property for changes. When a property changes, the
 * provided `Observer` function will be invoked with the properties current and
 * previous values.
 *
 * The returned cleanup function will restore any previous descriptors of the
 * property.
 *
 * @template T The observed target type.
 * @template K The observed property.
 * @param {T} target - The target to observe.
 * @param {K} property - The property of the target to observe.
 * @param {Observer<T, K>} - An observer function to invoke each time the
 *     property changes.
 * @return {Function} A cleanup function that will restore the original property
 *     descriptor and stop observing changes.
 */
export function observeProperty<T extends object, K extends keyof T>(
    target: T, property: K, observer: Observer<T, K>) {
  const descriptor = Object.getOwnPropertyDescriptor(target, property) ||
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), property);
  const restoreDescriptor = descriptor ?
      {...descriptor} :
      {configurable: true, enumerable: true, value: undefined};

  const observedDescriptor = {...restoreDescriptor};
  if ('value' in observedDescriptor) {
    let value: T[K] = observedDescriptor.value;
    delete observedDescriptor.value;
    delete observedDescriptor.writable;

    observedDescriptor.get = function(this: T) {
      return value;
    };

    observedDescriptor.set = function(this: T, newValue: T[K]) {
      const previous = value;
      value = newValue;
      restoreDescriptor.value = value;
      if (newValue !== previous) {
        observer(newValue, previous);
      }
    };
  } else {
    const {get: getter, set: setter} = observedDescriptor;
    if (getter) {
      observedDescriptor.get = function(this: T) {
        return getter.call(this);
      };
    }

    if (setter) {
      observedDescriptor.set = function(this: T, newValue: T[K]) {
        setter.call(this, newValue);
        const previous = getter ? getter.call(this) : newValue;
        if (!getter || newValue !== previous) {
          observer(newValue, previous);
        }
      };
    }
  }

  Object.defineProperty(target, property, observedDescriptor);
  return () => {
    Object.defineProperty(target, property, restoreDescriptor);
  };
}
