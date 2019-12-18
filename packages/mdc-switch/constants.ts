/**
 * @license
 * Copyright 2018 Google Inc.
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

/** CSS classes used by the switch. */
const cssClasses = {
  /** Class used for a switch that is in the "checked" (on) position. */
  CHECKED: 'mdc-switch--checked',
  /** Class used for a switch that is disabled. */
  DISABLED: 'mdc-switch--disabled',
};

/** String constants used by the switch. */
const strings = {
  /** Aria attribute for checked or unchecked state of switch */
  ARIA_CHECKED_ATTR: 'aria-checked',
  /** Aria attribute value for checked state of switch */
  ARIA_CHECKED_CHECKED_VALUE: 'true',
  /** Aria attribute value for unchecked state of switch */
  ARIA_CHECKED_UNCHECKED_VALUE: 'false',
  /** A CSS selector used to locate the native HTML control for the switch.  */
  NATIVE_CONTROL_SELECTOR: '.mdc-switch__native-control',
  /** A CSS selector used to locate the ripple surface element for the switch. */
  RIPPLE_SURFACE_SELECTOR: '.mdc-switch__thumb-underlay',
};

export {cssClasses, strings};
