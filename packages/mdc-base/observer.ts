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
   * @param {ObserverRecord<T>} observers - An object whose keys are target
   *     properties and values are observer functions that are called when the
   *     associated property changes.
   * @return {Function} A cleanup function that can be called to unobserve the
   *     target.
   */
  observe<T extends object>(target: T, observers: ObserverRecord<T, this>):
      () => void;

  /**
   * Enables or disables all observers for the provided target. Disabling
   * observers will prevent them from being called until they are re-enabled.
   *
   * @param {object} target - The target to enable or disable observers for.
   * @param {Boolean} enabled - Whether or not observers should be called.
   */
  setObserversEnabled(target: object, enabled: boolean): void;

  /**
   * Clean up all observers and stop listening for property changes.
   */
  unobserve(): void;
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
export type Observer<T extends object, K extends keyof T = keyof T,
                                                 This = unknown> =
    (this: This, current: T[K], previous: T[K]) => void;

/**
 * An object map whose keys are properties of a target to observe and values
 * are `Observer` functions for each property.
 *
 * @template T The observed target type.
 * @template This The `this` context of observer functions.
 */
export type ObserverRecord<T extends object, This = unknown> = {
  [K in keyof T]?: Observer<T, K, This>;
};

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
  // Mixin classes cannot use private members and Symbol() cannot be used in 3P
  // for IE11.
  const unobserveMap = new WeakMap<MDCObserver, Function[]>();
  return class MDCObserver extends baseClass implements MDCObserver {
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
        const unobserves = unobserveMap.get(this) || [];
        const index = unobserves.indexOf(unobserve);
        if (index > -1) {
          unobserves.splice(index, 1);
        }
      };

      let unobserves = unobserveMap.get(this);
      if (!unobserves) {
        unobserves = [];
        unobserveMap.set(this, unobserves);
      }

      unobserves.push(unobserve);
      return unobserve;
    }

    setObserversEnabled(target: object, enabled: boolean) {
      setObserversEnabled(target, enabled);
    }

    unobserve() {
      // Iterate over a copy since unobserve() will remove themselves from the
      // array
      const unobserves = unobserveMap.get(this) || [];
      for (const unobserve of [...unobserves]) {
        unobserve();
      }
    }
  };
}

/**
 * A manager for observers listening to a target. A target's `prototype` is its
 * `TargetObservers` instance.
 *
 * @template T The observed target type.
 */
interface TargetObservers<T extends object> {
  /**
   * Indicates whether or not observers for this target are enabled. If
   * disabled, observers will not be called in response to target property
   * changes.
   */
  isEnabled: boolean;

  /**
   * Retrieves all observers for a given target property.
   *
   * @template K The target property key.
   * @param {K} key - The property to retrieve observers for.
   * @return An array of observers for the provided target property.
   */
  getObservers<K extends keyof T>(key: K): Array<Observer<T, K>>;

  /**
   * A Set of properties that have been installed (their getter/setter) replaced
   * to connect with the `TargetObservers`. This prevents multiple installations
   * of the same property.
   */
  installedProperties: Set<keyof T>;
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
  const targetObservers = installObserver(target, property);
  const observers = targetObservers.getObservers(property);
  observers.push(observer);
  return () => {
    observers.splice(observers.indexOf(observer), 1);
  };
}

/**
 * A Map of all `TargetObservers` that have been installed.
 */
const allTargetObservers = new WeakMap<object, TargetObservers<any>>();

/**
 * Installs a `TargetObservers` for the provided target (if not already
 * installed), and replaces the given property with a getter and setter that
 * will respond to changes and call `TargetObservers`.
 *
 * Subsequent calls to `installObserver()` with the same target and property
 * will not override the property's previously installed getter/setter.
 *
 * @template T The observed target type.
 * @template K The observed property to create a getter/setter for.
 * @param {T} target - The target to observe.
 * @param {K} property - The property to create a getter/setter for, if needed.
 * @return {TargetObservers<T>} The installed `TargetObservers` for the provided
 *     target.
 */
function installObserver<T extends object, K extends keyof T>(
    target: T, property: K): TargetObservers<T> {
  const observersMap = new Map<keyof T, Array<Observer<T>>>();

  if (!allTargetObservers.has(target)) {
    allTargetObservers.set(target, {
      isEnabled: true,
      getObservers(key) {
        const observers = observersMap.get(key) || [];
        if (!observersMap.has(key)) {
          observersMap.set(key, observers);
        }

        return observers;
      },
      installedProperties: new Set()
    } as TargetObservers<T>);
  }

  const targetObservers = allTargetObservers.get(target)!;
  if (targetObservers.installedProperties.has(property)) {
    // The getter/setter has already been replaced for this property
    return targetObservers;
  }

  // Retrieve (or create if it's a plain property) the original descriptor from
  // the target...
  const descriptor = getDescriptor(target, property) || {
    configurable: true,
    enumerable: true,
    value: target[property],
    writable: true
  };

  // ...and create a copy that will be used for the observer.
  const observedDescriptor = {...descriptor};
  let {get: descGet, set: descSet} = descriptor;
  if ('value' in descriptor) {
    // The descriptor is a simple value (not a getter/setter).
    // For our observer descriptor that we copied, delete the value/writable
    // properties, since they are incompatible with the get/set properties
    // for descriptors.
    delete observedDescriptor.value;
    delete observedDescriptor.writable;

    // Set up a simple getter...
    let value = descriptor.value;
    descGet = function(this: T) {
      return value;
    };

    // ...and setter (if the original property was writable).
    if (descriptor.writable) {
      descSet = function(this: T, newValue: T[K]) {
        value = newValue;
      };
    }
  }

  if (descGet) {
    const getter = descGet;
    observedDescriptor.get = function(this: T) {
      return getter.call(this);
    };
  }

  if (descSet) {
    const setter = descSet;
    observedDescriptor.set = function(this: T, newValue: T[K]) {
      const previous = descGet ? descGet.call(this) : newValue;
      setter.call(this, newValue);
      if (targetObservers.isEnabled && (!descGet || newValue !== previous)) {
        for (const observer of targetObservers.getObservers(property)) {
          observer(newValue, previous);
        }
      }
    };
  }

  targetObservers.installedProperties.add(property);
  Object.defineProperty(target, property, observedDescriptor);
  return targetObservers;
}

/**
 * Retrieves the descriptor for a property from the provided target. This
 * function will walk up the target's prototype chain to search for the
 * descriptor.
 *
 * @template T The target type.
 * @template K The property type.
 * @param {T} target - The target to retrieve a descriptor from.
 * @param {K} property - The name of the property to retrieve a descriptor for.
 * @return the descriptor, or undefined if it does not exist. Keep in mind that
 *     plain properties may not have a descriptor defined.
 */
export function getDescriptor<T extends object, K extends keyof T>(
    target: T, property: K) {
  let descriptorTarget: object|null = target;
  let descriptor: PropertyDescriptor|undefined;
  while (descriptorTarget) {
    descriptor = Object.getOwnPropertyDescriptor(descriptorTarget, property);
    if (descriptor) {
      break;
    }

    // Walk up the instance's prototype chain in case the property is declared
    // on a superclass.
    descriptorTarget = Object.getPrototypeOf(descriptorTarget);
  }

  return descriptor;
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
  const targetObservers = allTargetObservers.get(target);
  if (targetObservers) {
    targetObservers.isEnabled = enabled;
  }
}
