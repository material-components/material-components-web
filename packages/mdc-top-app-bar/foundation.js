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

import {strings, cssClasses} from './constants';
import MDCTopAppBarAdapter from './adapter';
import MDCFoundation from '@material/base/foundation';

/**
 * @extends {MDCFoundation<!MDCTopAppBarAdapter>}
 */
class MDCTopAppBarFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCTopAppBarAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTopAppBarAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTopAppBarAdapter} */ ({
      hasClass: (/* className: string */) => {},
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      registerNavigationIconInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterNavigationIconInteractionHandler: (/* type: string, handler: EventListener */) => {},
      notifyNavigationIconClicked: () => {},
      registerScrollHandler: (/* handler: EventListener */) => {},
      deregisterScrollHandler: (/* handler: EventListener */) => {},
      getViewportScrollY: () => /* number */ 0,
      getTotalActionItems: () => /* number */ 0,
    });
  }

  /**
   * @param {!MDCTopAppBarAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCTopAppBarFoundation.defaultAdapter, adapter));

    this.navClickHandler_ = () => this.adapter_.notifyNavigationIconClicked();
  }

  init() {
    this.adapter_.registerNavigationIconInteractionHandler('click', this.navClickHandler_);
  }

  destroy() {
    this.adapter_.deregisterNavigationIconInteractionHandler('click', this.navClickHandler_);
  }
}

export default MDCTopAppBarFoundation;
