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

/* eslint-disable */

/**
 * @fileoverview This file is where any externs for third party libraries we use should be placed
 * so that closure can type-check them.
 *
 * Closure historically works using "namespaces", e.g.
 *
 * // fileA.js
 * goog.provide('app.a');
 * app.a.return5 = () => 5;
 *
 * // fileB.js
 *
 * goog.provide('app.b');
 * goog.require('app.a');
 * app.b.return10 = () => app.a.return5() * 2;
 *
 * The way that closure reconciles this with path-based module loading systems
 * such as CommonJS and ES2015 is by using the `goog:` prefix to load any modules exported via
 * `goog.provide()` using path-based module loading methods.
 *
 * For example, given this source file:
 *
 * goog.provide('app.util');
 * app.util.someMethod = () => // ...
 *
 * It can be imported using ES2015 in closure via the following:
 *
 * import {someMethod} from 'goog:app.util';
 * // use someMethod
 *
 * Our convention here is as follows:
 *
 * - All third party modules should exported via `goog.provide()` using the namespace
 *   `mdc.thirdparty.<CAMEL_CASE_MODULE_NAME>`. E.g. 'focus-trap' is provided as
 *   `goog.provide('mdc.thirdparty.focusTrap')`.
 * - Any default exports from a module MUST be attached to the namespace as a property
 *   named `default`. This is so our module rewrite script can handle default exports from
 *   third-party modules.
 *
 * @see https://developers.google.com/closure/compiler/docs/api-tutorial3
 */

/**
 * Externs for focus-trap. Used by mdc-dialog.
 * @see http://npmjs.com/focus-trap
 */

goog.provide('mdc.thirdparty.focusTrap');

/**
 * @typedef {{
 *   onActivate: (!Function|undefined),
 *   onDeactivate: (!Function|undefined),
 *   initialFocus: (!Element|string|!Function|undefined),
 *   fallbackFocus: (!Element|string|!Function|undefined),
 *   escapeDeactivates: (boolean|undefined),
 *   clickOutsideDeactivates: (boolean|undefined),
 *   returnFocusOnDeactivate: (boolean|undefined),
 * }}
 */
let FocusTrapCreateOptions;

/**
 * @typedef {{
 *   returnFocus: (boolean|undefined),
 *   onDeactivate: (?Function|boolean|undefined),
 * }}
 */
let FocusTrapDeactivateOptions;

/** @record */
class FocusTrapInstance {
  activate() {}

  /**
   * @param {FocusTrapDeactivateOptions=} deactivateOptions
   */
  deactivate(deactivateOptions = undefined) {}

  pause() {}

  unpause() {}
}

/**
 * The createFocusTrap function.
 * @param {!Element} element
 * @param {FocusTrapCreateOptions=} createOptions
 */
mdc.thirdparty.focusTrap;
