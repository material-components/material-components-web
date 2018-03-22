/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCFoundation from '@material/base/foundation';
import MDCExpansionPanelAccordionAdapter from './adapter';
import {cssClasses, strings} from './constants';
// I have to import the foundation to get the constants, because closure won't let me
// do import {strings as MDCExpansionPanelFoundation.strings}
import MDCExpansionPanelFoundation from '../foundation';

/**
 * @extends {MDCFoundation<!MDCExpansionPanelAccordionAdapter>}
 */
class MDCExpansionPanelAccordionFoundation extends MDCFoundation {
  /**
   * @return {!MDCExpansionPanelAccordionAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCExpansionPanelAccordionAdapter} */ ({
      notifyChange: () => {},
      getComponentInstanceFromEvent: (/* event: Event */) => {},
      registerChildrenExpansionPanelInteractionListener: (/* type: string, handler: EventListener */) => {},
      deregisterChildrenExpansionPanelInteractionListener: (/* type: string, handler: EventListener */) => {},
    });
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * The component instance that is currently expanded.
   * @return {?{collapse: Function}}
   */
  get expandedChild() {
    return this.expandedChild_;
  }

  /**
   * @param {!MDCExpansionPanelAccordionAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCExpansionPanelAccordionFoundation.defaultAdapter, adapter));

    /**
     * The currently expanded child.
     * @private {?{collapse: Function}}
     */
    this.expandedChild_ = null;

    /**
     * Collapses the expanded child when a child is expanded.
     * @private {!EventListener}
     */
    this.expansionHandler_ = /** @type {!EventListener} */ ((event) => {
      if (this.expandedChild_) this.expandedChild_.collapse();
      this.expandedChild_ = this.adapter_.getComponentInstanceFromEvent(event);
    });
  }

  init() {
    this.adapter_.registerChildrenExpansionPanelInteractionListener(MDCExpansionPanelFoundation.strings.EXPAND_EVENT,
      this.expansionHandler_);
  }

  destroy() {
    this.adapter_.deregisterChildrenExpansionPanelInteractionListener(MDCExpansionPanelFoundation.strings.EXPAND_EVENT,
      this.expansionHandler_);
  }
}

export default MDCExpansionPanelAccordionFoundation;
