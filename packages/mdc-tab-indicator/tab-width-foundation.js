/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import MDCTabIndicatorFoundation from './foundation';

/* eslint-disable no-unused-vars */
import MDCTabDimensions from '@material/tab/dimensions';
/* eslint-ensable no-unused-vars */

/**
 * @extends {MDCTabIndicatorFoundation}
 * @final
 */
class MDCTabWidthIndicatorFoundation extends MDCTabIndicatorFoundation {
  /**
   * @param {!MDCTabDimensions} tabDimensions
   */
  layout(tabDimensions) {
    const translateX = tabDimensions.getRootOffsetLeft();
    const scaleX = tabDimensions.getRootOffsetWidth();
    this.adapter_.setRootStyleProperty('transform', `translateX(${translateX}px) scaleX(${scaleX})`);
  }
}

export default MDCTabWidthIndicatorFoundation;
