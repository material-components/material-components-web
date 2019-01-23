/**
 * @license
 * Copyright 2016 Google Inc.
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

enum StandardCssPropertyName {
  ANIMATION = 'animation',
  TRANSFORM = 'transform',
  TRANSITION = 'transition',
}

enum PrefixedCssPropertyName {
  WEBKIT_ANIMATION = '-webkit-animation',
  WEBKIT_TRANSFORM = '-webkit-transform',
  WEBKIT_TRANSITION = '-webkit-transition',
}

enum StandardJsEventType {
  ANIMATION_END = 'animationend',
  ANIMATION_ITERATION = 'animationiteration',
  ANIMATION_START = 'animationstart',
  TRANSITION_END = 'transitionend',
}

enum PrefixedJsEventType {
  WEBKIT_ANIMATION_END = 'webkitAnimationEnd',
  WEBKIT_ANIMATION_ITERATION = 'webkitAnimationIteration',
  WEBKIT_ANIMATION_START = 'webkitAnimationStart',
  WEBKIT_TRANSITION_END = 'webkitTransitionEnd',
}

interface CssVendorPropertyMap {
  [key: string]: CssVendorProperty;
}

interface JsVendorPropertyMap {
  [key: string]: JsVendorProperty;
}

interface CssVendorProperty {
  prefixed: PrefixedCssPropertyName;
  standard: StandardCssPropertyName;
}

interface JsVendorProperty {
  cssProperty: StandardCssPropertyName;
  prefixed: PrefixedJsEventType;
  standard: StandardJsEventType;
}

// Destructure enum members to make their usages more readable.
const {WEBKIT_ANIMATION, WEBKIT_TRANSFORM, WEBKIT_TRANSITION} = PrefixedCssPropertyName;
const {ANIMATION, TRANSFORM, TRANSITION} = StandardCssPropertyName;
const {
  WEBKIT_ANIMATION_END,
  WEBKIT_ANIMATION_ITERATION,
  WEBKIT_ANIMATION_START,
  WEBKIT_TRANSITION_END,
} = PrefixedJsEventType;
const {ANIMATION_END, ANIMATION_ITERATION, ANIMATION_START, TRANSITION_END} = StandardJsEventType;

const cssPropertyNameMap: CssVendorPropertyMap = {
  [ANIMATION]: {
    prefixed: WEBKIT_ANIMATION,
    standard: ANIMATION,
  },
  [TRANSFORM]: {
    prefixed: WEBKIT_TRANSFORM,
    standard: TRANSFORM,
  },
  [TRANSITION]: {
    prefixed: WEBKIT_TRANSITION,
    standard: TRANSITION,
  },
};

const jsEventTypeMap: JsVendorPropertyMap = {
  [ANIMATION_END]: {
    cssProperty: ANIMATION,
    prefixed: WEBKIT_ANIMATION_END,
    standard: ANIMATION_END,
  },
  [ANIMATION_ITERATION]: {
    cssProperty: ANIMATION,
    prefixed: WEBKIT_ANIMATION_ITERATION,
    standard: ANIMATION_ITERATION,
  },
  [ANIMATION_START]: {
    cssProperty: ANIMATION,
    prefixed: WEBKIT_ANIMATION_START,
    standard: ANIMATION_START,
  },
  [TRANSITION_END]: {
    cssProperty: TRANSITION,
    prefixed: WEBKIT_TRANSITION_END,
    standard: TRANSITION_END,
  },
};

function isWindow(windowObj: Window): boolean {
  return Boolean(windowObj.document) && typeof windowObj.document.createElement === 'function';
}

function getCorrectPropertyName(windowObj: Window, cssProperty: StandardCssPropertyName):
    StandardCssPropertyName | PrefixedCssPropertyName {
  if (isWindow(windowObj) && cssProperty in cssPropertyNameMap) {
    const el = windowObj.document.createElement('div');
    const {standard, prefixed} = cssPropertyNameMap[cssProperty];
    const isStandard = standard in el.style;
    return isStandard ? standard : prefixed;
  }
  return cssProperty;
}

function getCorrectEventName(windowObj: Window, eventType: StandardJsEventType):
    StandardJsEventType | PrefixedJsEventType {
  if (isWindow(windowObj) && eventType in jsEventTypeMap) {
    const el = windowObj.document.createElement('div');
    const {standard, prefixed, cssProperty} = jsEventTypeMap[eventType];
    const isStandard = cssProperty in el.style;
    return isStandard ? standard : prefixed;
  }
  return eventType;
}

export {
  PrefixedCssPropertyName,
  StandardCssPropertyName,
  PrefixedJsEventType,
  StandardJsEventType,
  getCorrectEventName,
  getCorrectPropertyName,
};
