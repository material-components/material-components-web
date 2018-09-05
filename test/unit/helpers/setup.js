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

import td from 'testdouble';

/**
 * Returns a foundation configured to use a mock object with the same API as a default adapter,
 * as well as that adapter itself.
 * The trailing `.` in the `@param` type below is intentional: It indicates a reference to the class itself instead of
 * an instance of the class.
 * See https://youtrack.jetbrains.com/issue/WEB-10214#focus=streamItem-27-1305930-0-0
 * @param {!MDCFoundation.} FoundationClass
 * @return {{mockAdapter: !Object, foundation: !MDCFoundation}}
 */
export function setupFoundationTest(FoundationClass) {
  const mockAdapter = td.object(FoundationClass.defaultAdapter);
  const foundation = new FoundationClass(mockAdapter);
  return {mockAdapter, foundation};
}
