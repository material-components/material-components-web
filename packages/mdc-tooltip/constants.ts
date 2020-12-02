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

enum CssClasses {
  RICH = 'mdc-tooltip--rich',
  SHOWN = 'mdc-tooltip--shown',
  SHOWING = 'mdc-tooltip--showing',
  SHOWING_TRANSITION = 'mdc-tooltip--showing-transition',
  HIDE = 'mdc-tooltip--hide',
  HIDE_TRANSITION = 'mdc-tooltip--hide-transition',
  MULTILINE_TOOLTIP = 'mdc-tooltip--multiline',
}

const numbers = {
  BOUNDED_ANCHOR_GAP: 4,
  UNBOUNDED_ANCHOR_GAP: 8,
  MIN_VIEWPORT_TOOLTIP_THRESHOLD: 8,
  HIDE_DELAY_MS: 600,
  SHOW_DELAY_MS: 500,
  // LINT.IfChange(tooltip-dimensions)
  MIN_HEIGHT: 24,
  MAX_WIDTH: 200,
  // LINT.ThenChange(_tooltip.scss:tooltip-dimensions)
};

const attributes = {
  PERSISTENT: 'data-mdc-tooltip-persistent',
};

const events = {
  HIDDEN: 'MDCTooltip:hidden',
};

/** Enum for possible tooltip positioning relative to its anchor element. */
enum XPosition {
  DETECTED = 0,
  START = 1,
  CENTER = 2,
  END = 3,
}

enum YPosition {
  DETECTED = 0,
  ABOVE = 1,
  BELOW = 2,
}

/**
 * Enum for possible anchor boundary types. This determines the gap between the
 * bottom of the anchor and the tooltip element.
 * Bounded anchors have an identifiable boundary (e.g. buttons).
 * Unbounded anchors don't have a visually declared boundary (e.g. plain text).
 */
enum AnchorBoundaryType {
  BOUNDED = 0,
  UNBOUNDED = 1,
}

export {
  CssClasses,
  numbers,
  attributes,
  events,
  XPosition,
  AnchorBoundaryType,
  YPosition
};
