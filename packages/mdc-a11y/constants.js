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

/**
 * @fileoverview
 */


/**
 * ARIA state values for LivePriority.
 * @enum {string}
 */
export const AriaLivePriority = {
  // Updates to the region will not be presented to the user
  // unless the assitive technology is currently focused on that region.
  OFF: 'off',

  // (Background change) Assistive technologies SHOULD announce
  // updates at the next graceful opportunity, such as at the end of
  // speaking the current sentence or when the user pauses typing.
  POLITE: 'polite',

  // This information has the highest priority and assistive
  // technologies SHOULD notify the user immediately.
  // Because an interruption may disorient users or cause them to not complete
  // their current task, authors SHOULD NOT use the assertive value unless the
  // interruption is imperative.
  ASSERTIVE: 'assertive',
};
