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

import {getDescriptor, MDCObserver, Observer, ObserverRecord} from './observer';
import {Constructor} from './types';

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
  const unobserves = Symbol();
  return class MDCObserver extends baseClass implements MDCObserver {
    [unobserves]: Function[] = [];

    observe<T extends object>(target: T, observers: ObserverRecord<T, this>) {
      const cleanup: Function[] = [];
      for (const property of Object.keys(observers) as Array<keyof T>) {
        const observer = observers[property]!.bind(this);
        cleanup.push(observeProperty(target, property, observer));
      }

      const unobserve = () => {
        for (const cleanupFn of cleanup) {
          cleanupFn();
        }
        const index = this[unobserves].indexOf(unobserve);
        if (index > -1) {
          this[unobserves].splice(index, 1);
        }
      };

      this[unobserves].push(unobserve);
      return unobserve;
    }

    setObserversEnabled(target: object, enabled: boolean) {
      setObserversEnabled(target, enabled);
    }

    unobserve() {
      // Iterate over a copy since unobserve() will remove themselves from the
      // array
      for (const unobserve of [...this[unobserves]]) {
        unobserve();
      }
    }
  };
}

const isTargetObservers = Symbol();
const isEnabled = Symbol();
const getObservers = Symbol();

/**
 * A manager for observers listening to a target. A target's `prototype` is its
 * `TargetObservers` instance.
 *
 * @template T The observed target type.
 */
interface TargetObservers<T extends object> {
  /**
   * Indicates that the prototype is a `TargetObservers` instance.
   */
  [isTargetObservers]: true;

  /**
   * Indicates whether or not observers for this target are enabled. If
   * disabled, observers will not be called in response to target property
   * changes.
   */
  [isEnabled]: boolean;

  /**
   * Retrieves all observers for a given target property.
   *
   * @template K The target property key.
   * @param {K} key - The property to retrieve observers for.
   * @return An array of observers for the provided target property.
   */
  [getObservers]: <K extends keyof T>(key: K) => Array<Observer<T, K>>;
}

/**
 * Observe a target's property for changes. When a property changes, the
 * provided `Observer` function will be invoked with the properties current and
 * previous values.
 *
 * The returned cleanup function will stop listening to changes for the
 * provided `Observer`.
 *
 * @template T The observed target type.
 * @template K The observed property.
 * @param {T} target - The target to observe.
 * @param {K} property - The property of the target to observe.
 * @param {Observer<T, K>} - An observer function to invoke each time the
 *     property changes.
 * @return {Function} A cleanup function that will stop observing changes for
 *     the provided `Observer`.
 */
export function observeProperty<T extends object, K extends keyof T>(
    target: T, property: K, observer: Observer<T, K>) {
  const observerPrototype = installObserver(target);
  const observers = observerPrototype[getObservers](property);
  observers.push(observer);
  return () => {
    observers.splice(observers.indexOf(observer), 1);
  };
}

/**
 * Installs a `TargetObservers` for the provided target (if not already
 * installed).
 *
 * A target's `TargetObservers` is installed as a Proxy on the target's
 * prototype.
 *
 * @template T The observed target type.
 * @param {T} target - The target to observe.
 * @return {TargetObservers<T>} The installed `TargetObservers` for the provided
 *     target.
 */
function installObserver<T extends object>(target: T): TargetObservers<T> {
  const prototype = Object.getPrototypeOf(target);
  if (prototype[isTargetObservers]) {
    return prototype as TargetObservers<T>;
  }

  // Proxy prototypes will not trap plain properties (not a getter/setter) that
  // are already defined. They only work on new plain properties.
  // We can work around this by deleting the properties, installing the Proxy,
  // then re-setting the properties.
  const existingKeyValues = new Map<keyof T, T[keyof T]>();
  const keys = Object.getOwnPropertyNames(target) as Array<keyof T>;
  for (const key of keys) {
    const descriptor = getDescriptor(target, key);
    if (descriptor && descriptor.writable) {
      existingKeyValues.set(key, descriptor.value);
      delete target[key];
    }
  }

  const proxy =
      new Proxy<T>(Object.create(prototype), {
        get(target, key, receiver) {
          return Reflect.get(target, key, receiver);
        },
        set(target, key, newValue, receiver) {
          const isTargetObserversKey = key === isTargetObservers ||
              key === isEnabled || key === getObservers;
          const previous = Reflect.get(target, key, receiver);
          // Do not use receiver when setting the target's key. We do not want
          // to change whatever the target's inherent receiver is.
          Reflect.set(target, key, newValue);
          if (!isTargetObserversKey && proxy[isEnabled] &&
              newValue !== previous) {
            for (const observer of proxy[getObservers](key as keyof T)) {
              observer(newValue, previous);
            }
          }

          return true;
        }
      }) as TargetObservers<T>;

  proxy[isTargetObservers] = true;
  proxy[isEnabled] = true;
  const observersMap = new Map<keyof T, Array<Observer<T>>>();
  proxy[getObservers] = (key: keyof T) => {
    const observers = observersMap.get(key) || [];
    if (!observersMap.has(key)) {
      observersMap.set(key, observers);
    }

    return observers;
  };

  Object.setPrototypeOf(target, proxy);
  // Re-set plain pre-existing properties so that the Proxy can trap them
  for (const [key, value] of existingKeyValues.entries()) {
    target[key] = value;
  }

  return proxy;
}

/**
 * Enables or disables all observers for a provided target. Changes to observed
 * properties will not call any observers when disabled.
 *
 * @template T The observed target type.
 * @param {T} target - The target to enable or disable observers for.
 * @param {Boolean} enabled - True to enable or false to disable observers.
 */
export function setObserversEnabled<T extends object>(
    target: T, enabled: boolean) {
  const prototype = Object.getPrototypeOf(target);
  if (prototype[isTargetObservers]) {
    (prototype as TargetObservers<T>)[isEnabled] = enabled;
  }
}
