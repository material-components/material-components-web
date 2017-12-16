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
export const Directionality = {
  LTR: 'ltr',
  RTL: 'rtl',
};

/** @enum {string} */
export const InputModality = {
  UNKNOWN: 'UNKNOWN',
  POINTER: 'POINTER',
  KEYBOARD: 'KEYBOARD',
};

/** @enum {string} */
export const EventPrefix = {
  UNKNOWN: 'unknown',
  POINTER: 'pointer',
  MOUSE: 'mouse',
  TOUCH: 'touch',
  KEY: 'key',
};

export const EventMap = {
  pointer: {
    down: 'pointerdown',
    up: 'pointerup',
    move: 'pointermove',
    cancel: 'pointercancel',
  },
  touch: {
    down: 'touchstart',
    up: 'touchend',
    move: 'touchmove',
    cancel: 'touchcancel',
  },
  mouse: {
    down: 'mousedown',
    up: 'mouseup',
    move: 'mousemove',
    cancel: null,
  },
  key: {
    down: 'keydown',
    up: 'keyup',
    move: null,
    cancel: null,
  },
};

/** @enum {string} */
export const MouseButton = {
  /** Main button pressed, usually the left button or the un-initialized state. */
  LEFT: 0,

  /** Auxiliary button pressed, usually the wheel button or the middle button (if present). */
  MIDDLE: 1,

  /** Secondary button pressed, usually the right button. */
  RIGHT: 2,

  /** Fourth button, typically the Browser Back button. */
  BACK: 3,

  /** Fifth button, typically the Browser Forward button. */
  FORWARD: 4,
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

export function getDirectionality(element) {
  return getComputedStyle(element).direction;
}

export function isLTR(element) {
  return getDirectionality(element) === Directionality.LTR;
}

export function computeRectOffset(targetRect, originRect) {
  const offsetRect = {};
  offsetRect.top = offsetRect.y = targetRect.top - originRect.top;
  offsetRect.left = offsetRect.x = targetRect.left - originRect.left;
  offsetRect.right = offsetRect.left + targetRect.width;
  offsetRect.bottom = offsetRect.top + targetRect.height;
  offsetRect.width = targetRect.width;
  offsetRect.height = targetRect.height;
  return offsetRect;
}

export function computePointOffset(targetPoint, originPoint) {
  return {
    y: targetPoint.y - originPoint.y,
    x: targetPoint.x - originPoint.x,
  };
}

export function getPointerPositionInViewport(e) {
  const originalEvent = e.originalEvent || e.detail.originalEvent || e;
  const nativePointerEvent = originalEvent.touches ? originalEvent.touches[0] : originalEvent;
  return {
    x: nativePointerEvent.clientX,
    y: nativePointerEvent.clientY,
  };
}

export function getPointerOffsetFromViewportRect(e, originViewportRect) {
  const pointerPositionInViewport = getPointerPositionInViewport(e);
  return computePointOffset(pointerPositionInViewport, originViewportRect);
}

export function getPointerOffsetFromElement(e, originEl) {
  return getPointerOffsetFromViewportRect(e, originEl.getBoundingClientRect());
}

export function getElementOffset(targetEl, originEl) {
  const targetRect = targetEl.getBoundingClientRect();
  const originRect = originEl.getBoundingClientRect();
  return computeRectOffset(targetRect, originRect);
}

export function matches(el, selector) {
  const matches =
    el.matches ||
    el.matchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector ||
    el.oMatchesSelector ||
    el.webkitMatchesSelector;
  return matches.call(el, selector);
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
    if (matches(el, selector)) {
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

export function getEventPrefix(e) {
  for (const eventPrefix of Object.values(EventPrefix)) {
    if (e.type.indexOf(eventPrefix) === 0) {
      return eventPrefix;
    }
  }
  return EventPrefix.UNKNOWN;
}

export function getInputModality(e) {
  const eventPrefix = getEventPrefix(e);
  if (eventPrefix === EventPrefix.UNKNOWN) {
    return InputModality.UNKNOWN;
  }
  if (eventPrefix === EventPrefix.KEY) {
    return InputModality.KEYBOARD;
  }
  return InputModality.POINTER;
}

export const resizeListener = new ResizeListener();
