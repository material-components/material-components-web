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

const transformStyleProperties = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'MSTransform'];

const cssPropertyNameMap: CssVendorPropertyMap = {
  [StandardCssPropertyName.ANIMATION]: {
    prefixed: PrefixedCssPropertyName.WEBKIT_ANIMATION,
    standard: StandardCssPropertyName.ANIMATION,
  },
  [StandardCssPropertyName.TRANSFORM]: {
    prefixed: PrefixedCssPropertyName.WEBKIT_TRANSFORM,
    standard: StandardCssPropertyName.TRANSFORM,
  },
  [StandardCssPropertyName.TRANSITION]: {
    prefixed: PrefixedCssPropertyName.WEBKIT_TRANSITION,
    standard: StandardCssPropertyName.TRANSITION,
  },
};

const jsEventTypeMap: JsVendorPropertyMap = {
  [StandardJsEventType.ANIMATION_END]: {
    cssProperty: StandardCssPropertyName.ANIMATION,
    prefixed: PrefixedJsEventType.WEBKIT_ANIMATION_END,
    standard: StandardJsEventType.ANIMATION_END,
  },
  [StandardJsEventType.ANIMATION_ITERATION]: {
    cssProperty: StandardCssPropertyName.ANIMATION,
    prefixed: PrefixedJsEventType.WEBKIT_ANIMATION_ITERATION,
    standard: StandardJsEventType.ANIMATION_ITERATION,
  },
  [StandardJsEventType.ANIMATION_START]: {
    cssProperty: StandardCssPropertyName.ANIMATION,
    prefixed: PrefixedJsEventType.WEBKIT_ANIMATION_START,
    standard: StandardJsEventType.ANIMATION_START,
  },
  [StandardJsEventType.TRANSITION_END]: {
    cssProperty: StandardCssPropertyName.TRANSITION,
    prefixed: PrefixedJsEventType.WEBKIT_TRANSITION_END,
    standard: StandardJsEventType.TRANSITION_END,
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
  transformStyleProperties,
};
