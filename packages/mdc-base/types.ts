/**
 * @license
 * Copyright 2019 Google Inc.
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

export type EventType = keyof GlobalEventHandlersEventMap;
export type SpecificEventListener<K extends EventType> =
    (event: GlobalEventHandlersEventMap[K]) => void;
export type CustomEventListener<E extends Event> = (event: E) => void;
export type WindowEventType = keyof WindowEventMap;
export type SpecificWindowEventListener<K extends WindowEventType> =
    (event: WindowEventMap[K]) => void;

// `any` is required for mixin constructors
// tslint:disable:no-any
/**
 * A generic type for the constructor of an instance type. Note that this type
 * does not preserve accurate constructor parameters.
 *
 * @template T The instance type.
 */
export type Constructor<T = any> = {
  new (...args: any[]): T;
};
// tslint:enable:no-any
