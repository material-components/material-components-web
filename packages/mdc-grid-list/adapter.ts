/**
 * @license
 * Copyright 2019 Google Inc.
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
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCGridListAdapter {
  /**
   * Unregisters a handler to be called when the surface (or its viewport) resizes. Our default implementation
   * removes the handler as a listener to the window's `resize()` event.
   * @param handler callback function on resize event.
   */
  deregisterResizeHandler(handler: EventListener): void;
  /**
   * Get the number of mdc-grid-tile elements contained within the grid list.
   */
  getNumberOfTiles(): number;
  /**
   * Get root element `mdc-grid-list` offsetWidth.
   */
  getOffsetWidth(): number;
  /**
   * Get offsetWidth of `mdc-grid-tile` at specified index.
   * @param index grid list item index
   */
  getOffsetWidthForTileAtIndex(index: number): number;
  /**
   * Registers a handler to be called when the surface (or its viewport)
   * resizes. Our default implementation adds the handler as a listener to the window's `resize()` event.
   * @param handler callback function on resize event.
   */
  registerResizeHandler(handler: EventListener): void;
  /**
   * Set `mdc-grid-list__tiles` style property to provided value.
   * @param property css property name
   * @param value value to be set on css property
   */
  setStyleForTilesElement(
      property: Exclude<keyof CSSStyleDeclaration, ('length' | 'parentRule')>, value: string | null,
  ): void;
}
