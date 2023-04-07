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

import {MDCFoundation} from './foundation';
import {observeProperty, Observer, ObserverRecord, setObserversEnabled} from './observer';

// @ts-ignore(go/ts48upgrade) Fix code and remove this comment. Error:
// TS2344: Type 'Adapter' does not satisfy the constraint '{}'.
export class MDCObserverFoundation<Adapter> extends MDCFoundation<Adapter> {
  /** A set of cleanup functions to unobserve changes. */
  protected unobserves = new Set<Function>();

  constructor(adapter: Adapter) {
    super(adapter);
  }

  override destroy() {
    super.destroy();
    this.unobserve();
  }

  /**
   * Observe a target's properties for changes using the provided map of
   * property names and observer functions.
   *
   * @template T The target type.
   * @param target - The target to observe.
   * @param observers - An object whose keys are target properties and values
   *     are observer functions that are called when the associated property
   *     changes.
   * @return A cleanup function that can be called to unobserve the
   *     target.
   */
  protected observe<T extends object>(
      target: T, observers: ObserverRecord<T, this>) {
    const cleanup: Function[] = [];
    for (const property of Object.keys(observers) as Array<keyof T>) {
      const observer = observers[property]!.bind(this);
      cleanup.push(this.observeProperty(target, property, observer));
    }

    const unobserve = () => {
      for (const cleanupFn of cleanup) {
        cleanupFn();
      }

      this.unobserves.delete(unobserve);
    };

    this.unobserves.add(unobserve);
    return unobserve;
  }

  /**
   * Observe a target's property for changes. When a property changes, the
   * provided `Observer` function will be invoked with the properties current
   * and previous values.
   *
   * The returned cleanup function will stop listening to changes for the
   * provided `Observer`.
   *
   * @template T The observed target type.
   * @template K The observed property.
   * @param target - The target to observe.
   * @param property - The property of the target to observe.
   * @param observer - An observer function to invoke each time the property
   *     changes.
   * @return A cleanup function that will stop observing changes for the
   *     provided `Observer`.
   */
  protected observeProperty<T extends object, K extends keyof T>(
      target: T, property: K, observer: Observer<T, K>) {
    return observeProperty(target, property, observer);
  }

  /**
   * Enables or disables all observers for the provided target. Disabling
   * observers will prevent them from being called until they are re-enabled.
   *
   * @param target - The target to enable or disable observers for.
   * @param enabled - Whether or not observers should be called.
   */
  protected setObserversEnabled(target: object, enabled: boolean) {
    setObserversEnabled(target, enabled);
  }

  /**
   * Clean up all observers and stop listening for property changes.
   */
  protected unobserve() {
    // Iterate over a copy since unobserve() will remove themselves from the set
    for (const unobserve of [...this.unobserves]) {
      unobserve();
    }
  }
}
