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

import MDCFoundation from '@material/base/foundation';
import {strings} from './constants';

export default class MDCGridListFoundation extends MDCFoundation {
  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      getOffsetWidth: () => /* number */ 0,
      getNumberOfTiles: () => /* number */ 0,
      getOffsetWidthForTileAtIndex: (/* index: number */) => /* number */ 0,
      setStyleForTilesElement: (/* property: string, value: string */) => {},
      registerResizeHandler: (/* handler: EventListener */) => {},
      deregisterResizeHandler: (/* handler: EventListener */) => {},
    };
  }
  constructor(adapter) {
    super(Object.assign(MDCGridListFoundation.defaultAdapter, adapter));
    this.resizeHandler_ = () => this.alignCenter();
    this.resizeFrame_ = 0;
  }
  init() {
    this.alignCenter();
    this.adapter_.registerResizeHandler(this.resizeHandler_);
  }
  destroy() {
    this.adapter_.deregisterResizeHandler(this.resizeHandler_);
  }
  alignCenter() {
    if (this.resizeFrame_ !== 0) {
      cancelAnimationFrame(this.resizeFrame_);
    }
    this.resizeFrame_ = requestAnimationFrame(() => {
      this.alignCenter_();
      this.resizeFrame_ = 0;
    });
  }
  alignCenter_() {
    if (this.adapter_.getNumberOfTiles() == 0) {
      return;
    }
    const gridWidth = this.adapter_.getOffsetWidth();
    const itemWidth = this.adapter_.getOffsetWidthForTileAtIndex(0);
    const tilesWidth = itemWidth * Math.floor(gridWidth / itemWidth);
    this.adapter_.setStyleForTilesElement('width', `${tilesWidth}px`);
  }
}
