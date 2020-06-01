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
    targetEl: Element|Window|Document, eventName: string,
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

/** Creates mouse event, with IE11 support. */
export function createMouseEvent(
    eventName: string, eventInit: MouseEventInit = {}) {
  const eventDefaults = {
    bubbles: false,
    cancelable: false,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: null,
  };

  let event;
  if (typeof (MouseEvent) === 'function') {
    eventInit = {...eventDefaults, ...eventInit};
    event = new MouseEvent(eventName, eventInit);
  } else {
    // IE11 support.
    event = document.createEvent('MouseEvent');
    event.initMouseEvent(
        eventName, eventInit.bubbles || eventDefaults.bubbles,
        eventInit.cancelable || eventDefaults.cancelable, window, 0,
        eventInit.screenX || eventDefaults.screenX,
        eventInit.screenY || eventDefaults.screenX,
        eventInit.clientX || eventDefaults.clientX,
        eventInit.clientY || eventDefaults.clientY,
        eventInit.ctrlKey || eventDefaults.ctrlKey,
        eventInit.altKey || eventDefaults.altKey,
        eventInit.shiftKey || eventDefaults.shiftKey,
        eventInit.metaKey || eventDefaults.metaKey,
        eventInit.button || eventDefaults.button,
        eventInit.relatedTarget || eventDefaults.relatedTarget);
  }
  return event;
}
