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

function getDirectionality(element) {
  const ancestor = element.closest('[dir]');
  return (ancestor && ancestor.getAttribute('dir') === Directionality.RTL)
    ? Directionality.RTL
    : Directionality.LTR;
}

function computeRectOffset(targetRect, originRect) {
  const offsetRect = {};
  offsetRect.top = offsetRect.y = targetRect.top - originRect.top;
  offsetRect.left = offsetRect.x = targetRect.left - originRect.left;
  offsetRect.right = offsetRect.left + targetRect.width;
  offsetRect.bottom = offsetRect.top + targetRect.height;
  offsetRect.width = targetRect.width;
  offsetRect.height = targetRect.height;
  return offsetRect;
}

// Adapted from https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame
class ResizeListener {
  constructor() {
    this.handlers_ = [];
    this.isRunning_ = false;
    this.timer_ = null;
  }

  registerResizeHandler(callback) {
    if (!this.handlers_.length) {
      window.addEventListener('resize', (e) => this.handleResize_(e), {
        capture: true,
        passive: true,
      });
    }
    this.handlers_.push(callback);
  }

  deregisterResizeHandler(callback) {
    const index = this.handlers_.indexOf(callback);
    if (index === -1) {
      return;
    }
    this.handlers_.splice(index, 1);
  }

  /**
   * Handles all window `resize` events.
   * @param {!Event} e
   * @private
   */
  handleResize_(e) {
    if (this.isRunning_) {
      return;
    }

    this.isRunning_ = true;
    clearTimeout(this.timer_);
    this.timer_ = this.createTimeout_(() => this.invokeHandlers_(e));
  }

  createTimeout_(fn) {
    return setTimeout(() => window.requestAnimationFrame(fn), RESIZE_EVENT_DELAY_MS);
  }

  /**
   * Invokes all registered event handlers.
   * @param {!Event} e
   * @private
   */
  invokeHandlers_(e) {
    this.handlers_.forEach((callback) => {
      callback(e);
    });
    this.isRunning_ = false;
  }
}

export function isLTR(element) {
  return getDirectionality(element) === Directionality.LTR;
}

export function getRelativeOffset(targetEl, originEl) {
  const targetRect = targetEl.getBoundingClientRect();
  const originRect = originEl.getBoundingClientRect();
  return computeRectOffset(targetRect, originRect);
}

export function getPointerPositionInViewport(e) {
  const originalEvent = e.originalEvent;
  const nativePointerEvent = originalEvent.touches ? originalEvent.touches[0] : originalEvent;
  return {
    x: nativePointerEvent.clientX,
    y: nativePointerEvent.clientY,
  };
}

/**
 * Emulates Element.closest() for browsers that don't support it natively (namely IE 11).
 * @param {?Element} el
 * @param {string} selector
 * @returns {?Element}
 */
export function closest(el, selector) {
  if (el.closest) {
    return el.closest(selector);
  }

  if (!document.documentElement.contains(el)) {
    return null;
  }

  while (el !== null) {
    if (el.matches(selector)) {
      return el;
    }
    el = el.parentElement;
  }

  return null;
}

export function pointIntersectsRect(point, rect) {
  return !(
    isPointAboveRect(point, rect) ||
    isPointBelowRect(point, rect) ||
    isPointLeftOfRect(point, rect) ||
    isPointRightOfRect(point, rect)
  );
}

export const resizeListener = new ResizeListener();
