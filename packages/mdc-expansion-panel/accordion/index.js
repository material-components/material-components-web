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

import {strings, cssClasses} from './constants';

import MDCComponent from '@material/base/component';
import MDCExpansionPanelAccordionFoundation from './foundation';
import * as util from '../util';

/**
 * @extends MDCComponent<!MDCExpansionPanelAccordionFoundation>
 */
class MDCExpansionPanelAccordion extends MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCExpansionPanelAccordion}
   */
  static attachTo(root) {
    return new MDCExpansionPanelAccordion(root);
  }

  /**
   * The component instance that is currently expanded.
   * @return {?{collapse: Function}}
   */
  get expandedChild() {
    return this.foundation_.expandedChild;
  }

  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);

    /**
     * Contains all the expansion panels that are children of the root element,
     * minus those that have the excluded class applied.
     * @private {Array<{collapse: Function, addEventListener: Function, removeEventListener: Function}>}
     */
    this.childrenExpansionPanels_;
  }

  initialize() {
    this.childrenExpansionPanels_ = util.toArray(this.root_.querySelectorAll(strings.CHILD_SELECTOR)).filter((e) =>
      !e.classList.contains(cssClasses.EXCLUDED));
  }

  destroy() {
    this.childrenExpansionPanels_ = [];
  }

  /**
   * @return {!MDCExpansionPanelAccordionFoundation}
   */
  getDefaultFoundation() {
    return new MDCExpansionPanelAccordionFoundation({
      notifyChange: () => this.emit(strings.CHANGE_EVENT, this),
      getComponentInstanceFromEvent: (event) => event.detail,
      registerChildrenExpansionPanelInteractionListener: (type, handler) =>
        this.childrenExpansionPanels_.forEach((panel) => panel.addEventListener(type, handler)),
      deregisterChildrenExpansionPanelInteractionListener: (type, handler) =>
        this.childrenExpansionPanels_.forEach((panel) => panel.removeEventListener(type, handler)),
    });
  }
}

export {MDCExpansionPanelAccordion, MDCExpansionPanelAccordionFoundation};
