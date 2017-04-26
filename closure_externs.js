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

goog.provide('mdc.thirdparty.focusTrap')

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
mdc.thirdparty.focusTrap.default;
