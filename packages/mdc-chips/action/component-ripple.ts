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
 * Computes the ripple client rect for the primary action given the raw client
 * rect and the selected width graphic style property.
 */
export function computePrimaryActionRippleClientRect(
    clientRect: ClientRect, graphicSelectedWidthStyleValue: string): ClientRect {
  // parseInt is banned so we need to manually format and parse the string.
  const graphicWidth = Number(graphicSelectedWidthStyleValue.replace('px', ''));
  if (Number.isNaN(graphicWidth)) {
    return clientRect;
  }
  // Can't use the spread operator because it has internal problems
  return {
    width: clientRect.width + graphicWidth,
    height: clientRect.height,
    top: clientRect.top,
    right: clientRect.right,
    bottom: clientRect.bottom,
    left: clientRect.left,
  };
}

/**
 * Provides the CSS custom property whose value is read by
 * computePrimaryRippleClientRect. The CSS custom property provides the width
 * of the chip graphic when selected. It is only set for the unselected chip
 * variant without a leadinc icon. In all other cases, it will have no value.
 */
export const GRAPHIC_SELECTED_WIDTH_STYLE_PROP =
    '--mdc-chip-graphic-selected-width';
