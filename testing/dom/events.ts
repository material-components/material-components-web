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

/**
 * Dispatches an event on a target element, for testing purposes.
 * Necessary for IE11 compatibility, as the `Event` constructor is not
 * supported.
 */
export function emitEvent(
    targetEl: Element|Window, eventName: string,
    {bubbles, cancelable, detail}: CustomEventInit = {
      bubbles: false,
      cancelable: false,
    }) {
  let event;
  if (typeof(Event) === 'function') {
    event = new CustomEvent(eventName, {bubbles, cancelable, detail});
  } else {
    // IE11 support.
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(
        eventName, Boolean(bubbles), Boolean(cancelable), detail);
  }
  targetEl.dispatchEvent(event);
}
