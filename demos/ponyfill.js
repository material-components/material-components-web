/**
 * @license
 * Copyright 2017 Google Inc.
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

/*
 * Object ponyfills from TC39 proposal (MIT license).
 * https://github.com/tc39/proposal-object-values-entries/blob/7c2a54c56a529af1925a881e1b4c9e8b2d885a6c/polyfill.js
 */

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Object.keys;

/**
 * @param {!Object} obj
 * @return {!Array<*>} An array of [key, value] pairs.
 */
export function objectValues(obj) {
  return reduce(keys(obj), (v, k) => concat(v, typeof k === 'string' && isEnumerable(obj, k) ? [obj[k]] : []), []);
}

/**
 * @param {!Object} obj
 * @return {!Array<!Array<*>>} An array of [key, value] pairs.
 */
export function objectEntries(obj) {
  return reduce(keys(obj), (e, k) => concat(e, typeof k === 'string' && isEnumerable(obj, k) ? [[k, obj[k]]] : []), []);
}

/*
 * DOM ponyfills
 */

/**
 * @param {!Element} elem
 * @param {string} selector
 * @return {boolean}
 */
export function matches(elem, selector) {
  const nativeMatches = elem.matches
    || elem.webkitMatchesSelector
    || elem.mozMatchesSelector
    || elem.msMatchesSelector
    || elem.oMatchesSelector;
  return nativeMatches.call(elem, selector);
}

/**
 * @param {!Element} elem
 * @param {string} selector
 * @return {?Element}
 */
export function closest(elem, selector) {
  if (elem.closest) {
    return elem.closest(selector);
  }
  while (elem) {
    if (matches(elem, selector)) {
      return elem;
    }
    elem = elem.parentElement;
  }
  return null;
}
