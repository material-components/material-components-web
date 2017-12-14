/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Number of milliseconds to wait before executing window resize event handlers.
 * @type {number}
 */
const RESIZE_EVENT_DELAY_MS = 500;

/** @enum {string} */
const Directionality = {
  LTR: 'ltr',
  RTL: 'rtl',
};

export function getDirectionality(element) {
  const ancestor = element.closest('[dir]');
  return (ancestor && ancestor.getAttribute('dir') === Directionality.RTL)
    ? Directionality.RTL
    : Directionality.LTR;
}

export function isLTR(element) {
  return getDirectionality(element) === Directionality.LTR;
}

export function getOffset(elementRect, parentRect) {
  const offsetRect = {};
  offsetRect.top = offsetRect.y = elementRect.top - parentRect.top;
  offsetRect.left = offsetRect.x = elementRect.left - parentRect.left;
  offsetRect.right = offsetRect.left + elementRect.width;
  offsetRect.bottom = offsetRect.top + elementRect.height;
  offsetRect.width = elementRect.width;
  offsetRect.height = elementRect.height;
  return offsetRect;
}

export function getRelativeOffset(el, parent) {
  const elRect = el.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  return getOffset(elRect, parentRect);
}

export function getPointerPositionInViewport(e) {
  const originalEvent = e.originalEvent;
  const nativePointerEvent = originalEvent.touches ? originalEvent.touches[0] : originalEvent;
  return {
    x: nativePointerEvent.clientX,
    y: nativePointerEvent.clientY,
  };
}

export function closest(el, selector) {
  if (!document.documentElement.contains(el)) {
    return null;
  }

  do {
    if (el.matches(selector)) {
      return el;
    }
    el = el.parentElement;
  } while (el !== null);

  return null;
}

function isPointAboveRect(point, rect) {
  return point.y < rect.top;
}

function isPointBelowRect(point, rect) {
  return point.y > rect.bottom;
}

function isPointLeftOfRect(point, rect) {
  return point.x < rect.left;
}

function isPointRightOfRect(point, rect) {
  return point.x > rect.right;
}

export function pointIntersectsRect(point, rect) {
  return !(
    isPointAboveRect(point, rect) ||
    isPointBelowRect(point, rect) ||
    isPointLeftOfRect(point, rect) ||
    isPointRightOfRect(point, rect)
  );
}

// Adapted from https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame
class ResizeListener {
  constructor() {
    this.callbacks_ = [];
    this.isRunning_ = false;
    this.timer_ = null;
  }

  /**
   * Responds to window `resize` events.
   * @param {!Event} e
   * @private
   */
  handleResize_(e) {
    if (this.isRunning_) {
      return;
    }

    this.isRunning_ = true;
    clearTimeout(this.timer_);
    this.timer_ = setTimeout(() => window.requestAnimationFrame(() => this.runCallbacks_(e)), RESIZE_EVENT_DELAY_MS);
  }

  /**
   * Invokes all registered event handlers.
   * @param {!Event} e
   * @private
   */
  runCallbacks_(e) {
    this.callbacks_.forEach((callback) => {
      callback(e);
    });
    this.isRunning_ = false;
  }

  registerResizeHandler(callback) {
    if (!this.callbacks_.length) {
      window.addEventListener('resize', (e) => this.handleResize_(e), {
        capture: true,
        passive: true,
      });
    }
    this.callbacks_.push(callback);
  }

  deregisterResizeHandler(callback) {
    const index = this.callbacks_.indexOf(callback);
    if (index === -1) {
      return;
    }
    this.callbacks_.splice(index, 1);
  }
}

export const resizeListener = new ResizeListener();
