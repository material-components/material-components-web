/**
 * @license
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

import MDCFoundation from '@material/base/foundation';
import MDCTextFieldOutlineAdapter from './adapter';
import {strings} from './constants';

/**
 * @extends {MDCFoundation<!MDCTextFieldOutlineAdapter>}
 * @final
 */
class MDCTextFieldOutlineFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * {@see MDCTextFieldOutlineAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTextFieldOutlineAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTextFieldOutlineAdapter} */ ({
      setOutlinePathAttr: () => {},
    });
  }

  /**
   * @param {!MDCTextFieldOutlineAdapter=} adapter
   */
  constructor(adapter = /** @type {!MDCTextFieldOutlineAdapter} */ ({})) {
    super(Object.assign(MDCTextFieldOutlineFoundation.defaultAdapter, adapter));
  }

  /**
   * Updates the SVG path of the focus outline element based on the given width and height
   * of the text field element, the width of the label element, the corner radius, and
   * the RTL context.
   * @param {number} width
   * @param {number} height
   * @param {number} labelWidth
   * @param {number} radius
   * @param {boolean=} isRtl
   */
  updateSvgPath(width, height, labelWidth, radius, isRtl = false) {
    let path;
    if (!isRtl) {
      path = 'M' + (radius + 1.5 + Math.abs(10 - radius) + labelWidth + 8) + ',' + 1
        + 'h' + (width - (2 * (radius + 1.5)) - labelWidth - 8.5 - Math.abs(10 - radius))
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius
        + 'v' + (height - 2 * (radius + 1.5))
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + radius
        + 'h' + (-width + 2 * (radius + 1.5))
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius
        + 'v' + (-height + 2 * (radius + 1.5))
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius
        + 'h' + Math.abs(10 - radius);
    } else {
      path = 'M' + (width - radius - 1.5 - Math.abs(10 - radius)) + ',' + 1
        + 'h' + Math.abs(10 - radius)
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius
        + 'v' + (height - 2 * (radius + 1.5))
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + radius
        + 'h' + (-width + 2 * (radius + 1.5))
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius
        + 'v' + (-height + 2 * (radius + 1.5))
        + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius
        + 'h' + (width - (2 * (radius + 1.5)) - labelWidth - 8.5 - Math.abs(10 - radius));
    }

    this.adapter_.setOutlinePathAttr(path);
  }
}

export default MDCTextFieldOutlineFoundation;
