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

interface VendorPropertyMap {
  [key: string]: VendorProperty;
}

interface VendorProperty {
  noPrefix: string;
  styleProperty?: string;
  webkitPrefix: string;
}

const transformStyleProperties = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'MSTransform'];

const eventTypeMap: VendorPropertyMap = {
  animationend: {
    noPrefix: 'animationend',
    styleProperty: 'animation',
    webkitPrefix: 'webkitAnimationEnd',
  },
  animationiteration: {
    noPrefix: 'animationiteration',
    styleProperty: 'animation',
    webkitPrefix: 'webkitAnimationIteration',
  },
  animationstart: {
    noPrefix: 'animationstart',
    styleProperty: 'animation',
    webkitPrefix: 'webkitAnimationStart',
  },
  transitionend: {
    noPrefix: 'transitionend',
    styleProperty: 'transition',
    webkitPrefix: 'webkitTransitionEnd',
  },
};

const cssPropertyMap: VendorPropertyMap = {
  animation: {
    noPrefix: 'animation',
    webkitPrefix: '-webkit-animation',
  },
  transform: {
    noPrefix: 'transform',
    webkitPrefix: '-webkit-transform',
  },
  transition: {
    noPrefix: 'transition',
    webkitPrefix: '-webkit-transition',
  },
};

function isWindow(windowObj: Window): boolean {
  return Boolean(windowObj.document) && typeof windowObj.document.createElement === 'function';
}

function getCorrectEventName(windowObj: Window, eventType: string): string {
  if (isWindow(windowObj) && eventType in eventTypeMap) {
    const el = windowObj.document.createElement('div');
    const {noPrefix, webkitPrefix, styleProperty} = eventTypeMap[eventType];
    const isStandard = styleProperty in el.style;
    return isStandard ? noPrefix : webkitPrefix;
  }
  return eventType;
}

function getCorrectPropertyName(windowObj: Window, cssProperty: string): string {
  if (isWindow(windowObj) && cssProperty in cssPropertyMap) {
    const el = windowObj.document.createElement('div');
    const {noPrefix, webkitPrefix} = cssPropertyMap[cssProperty];
    const isStandard = noPrefix in el.style;
    return isStandard ? noPrefix : webkitPrefix;
  }
  return cssProperty;
}

export {transformStyleProperties, getCorrectEventName, getCorrectPropertyName};
