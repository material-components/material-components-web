/**
 * @license
 * Copyright 2020 Google Inc.
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
 * String constants for segmented button tests
 */
export const testCssClasses = {
  TEST_CLASS: 'test-class',
  SELECTED: 'mdc-segmented-button__segment--selected'
};

/**
 * CSS class selectors for segmented button tests
 */
export const testSelectors = {
  SEGMENT: '.mdc-segmented-button__segment'
}

/**
 * Indices for segments used in tests
 */
export enum testIndices {
  NOT_PRESENT = -1,
  UNSELECTED = 0,
  SELECTED = 1
}

/**
 * SegmentIds for segments used in tests
 */
export const testSegmentIds = {
  NOT_PRESENT_SEGMENT_ID: 'segment-1',
  UNSELECTED_SEGMENT_ID: 'segment0',
  SELECTED_SEGMENT_ID: 'segment1'
};
