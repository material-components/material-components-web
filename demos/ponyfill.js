/**
 * @license
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
