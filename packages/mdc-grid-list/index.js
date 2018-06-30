/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import {MDCComponent} from '@material/base/index';

import MDCGridListFoundation from './foundation';

export {MDCGridListFoundation};

export class MDCGridList extends MDCComponent {
  static attachTo(root) {
    return new MDCGridList(root);
  }

  getDefaultFoundation() {
    return new MDCGridListFoundation({
      getOffsetWidth: () => this.root_.offsetWidth,
      getNumberOfTiles: () => {
        return this.root_.querySelectorAll(MDCGridListFoundation.strings.TILE_SELECTOR).length;
      },
      getOffsetWidthForTileAtIndex: (index) => {
        return this.root_.querySelectorAll(MDCGridListFoundation.strings.TILE_SELECTOR)[index].offsetWidth;
      },
      setStyleForTilesElement: (property, value) => {
        this.root_.querySelector(MDCGridListFoundation.strings.TILES_SELECTOR).style[property] = value;
      },
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
    });
  }
}
