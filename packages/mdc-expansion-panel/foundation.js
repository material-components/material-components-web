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
import MDCExpansionPanelAdapter from './adapter';
import {cssClasses, strings, numbers} from './constants';

/**
 * @extends {MDCFoundation<!MDCExpansionPanelAdapter>}
 */
class MDCExpansionPanelFoundation extends MDCFoundation {
  /**
   * @return {!MDCExpansionPanelAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCExpansionPanelAdapter} */ ({
      blur: () => {},
      hasClass: (/* className: string */) => false,
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      setAttribute: (/* attributeName: string, value: string */) => {},
      setStyle: (/* styleName: string, value: string */) => {},
      getStyle: (/* styleName: string */) => {},
      getComputedHeight: () => {},
      offsetHeight: () => {},
      registerInteractionHandler: (/* type: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* type: string, handler: EventListener */) => {},
      notifyChange: () => {},
      notifyExpand: () => {},
      notifyCollapse: () => {},
      setExpansionIconInnerHTML: (/* innerHTML: string */) => {},
      shouldRespondToClickEvent: (/* event: MouseEvent */) => true,
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

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /**
   * Checks whether the root element has the expanded class.
   * @return {boolean}
   */
  get expanded() {
    return this.adapter_.hasClass(cssClasses.EXPANDED);
  }

  /**
   * @param {!MDCExpansionPanelAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCExpansionPanelFoundation.defaultAdapter, adapter));

    /**
     * The class to add at the end of the expansion or collapse transition.
     * @private {?string}
     */
    this.classToAddAtTransitionEnd_ = null;

    /**
     * Handles a click.
     * Blurs the root element, since we don't want background color sticking around for mouse inputs,
     * then toggles the expansion state of the panel.
     * @private {!EventListener}
     */
    this.clickHandler_ = /** @type {!EventListener} */ ((event) => {
      this.adapter_.blur();
      this.toggleExpansion(event);
    });

    /**
     * Handles the end of the transition.
     * Responsible for setting height to auto when the panel is done expanding and also
     * for adding and removing the proper classes when expansion or collapse has completed.
     * @private {!EventListener}
     */
    this.transitionEndHandler_ = /** @type {!EventListener} */ ((event) => {
      if (event.propertyName === 'height' && this.expanded) this.adapter_.setStyle('height', 'auto');

      // if this transitionend is for the end of collapsing or expanding event, ensure that block will run only once
      if (this.classToAddAtTransitionEnd_) {
        this.adapter_.removeClass(cssClasses.COLLAPSING);
        this.adapter_.removeClass(cssClasses.EXPANDING);
        this.adapter_.addClass(this.classToAddAtTransitionEnd_);
        this.classToAddAtTransitionEnd_ = null;
      }
    });

    /**
     * Handles a key press.
     * Used to implement the keyboard accessibility the spec requires.
     * It will toggle expansion on the Enter keypress.
     * TODO: Investigate whether it should also toggle on Space keypress.
     * @private {!EventListener}
     */
    this.keyPressHandler_ = /** @type {!EventListener} */ ((event) => {
      if (event.key === 'Enter') this.toggleExpansion(event);
    });
  }

  init() {
    if (!this.expanded) {
      this.adapter_.addClass(cssClasses.COLLAPSED);
      this.setCollapsedHeight_();
    }
    // needed for keyboard navigation
    this.adapter_.setAttribute('tabindex', '0');

    this.adapter_.setExpansionIconInnerHTML('expand_more');
    this.adapter_.registerInteractionHandler('click', this.clickHandler_);
    this.adapter_.registerInteractionHandler('transitionend', this.transitionEndHandler_);
    this.adapter_.registerInteractionHandler('keypress', this.keyPressHandler_);
  }

  destroy() {
    this.adapter_.deregisterInteractionHandler('click', this.clickHandler_);
    this.adapter_.deregisterInteractionHandler('transitionend', this.transitionEndHandler_);
    this.adapter_.deregisterInteractionHandler('keypress', this.keyPressHandler_);
  }

  /**
   * Collapses the panel.
   */
  collapse() {
    this.adapter_.notifyCollapse();

    this.classToAddAtTransitionEnd_ = cssClasses.COLLAPSED;
    this.adapter_.removeClass(cssClasses.EXPANDED);
    this.adapter_.addClass(cssClasses.COLLAPSING);

    this.setCollapsedHeight_();
  }

  /**
   * Expands the panel.
   */
  expand() {
    this.adapter_.notifyExpand();

    this.classToAddAtTransitionEnd_ = cssClasses.EXPANDED;
    this.adapter_.removeClass(cssClasses.COLLAPSED);
    this.adapter_.addClass(cssClasses.EXPANDING);

    this.setExpandedHeight_();
  }

  /**
   * Toggles the expansion state of the panel if the adapter says that it should respond to the provided event.
   * @param {?Event} event
   */
  toggleExpansion(event) {
    if (this.adapter_.shouldRespondToClickEvent(event)) {
      this.adapter_.notifyChange();
      if (this.expanded) this.collapse(); else this.expand();
    }
  }

  /**
   * Ugly hack section.
   *
   * Browsers can't do transitions to and from auto and fixed heights,
   * so you need these ugly hacks to make the transition appear smooth
   * since the panel has a fixed height when collapsed.
   * See http://n12v.com/css-transition-to-from-auto/.
   * It basically works by setting the height to auto long enough to calculate
   * the height that the panel would be at the end of its transition.
   * It then sets the panel's hieght to that fixed amount until the transition finishes,
   * at which point the height is set back to auto to accomdate content that might change height.
   * Note that currently there are no height transitions implemented here for when the content changes
   * so if you want a pretty and smooth height transition, implement on your content that is changing.
   *
   * TODO: Have the panel's height always be auto and implement the transition by growing the panel content.
   */

  /**
   * Adds the vertical margin to the computed height since apparently it can't compute the margin automatically.
   * @return {string}
   * @private
   */
  get expandedHeightStyle_() {
    return `${Number(this.computedHeight_.replace('px', '')) + numbers.EXPANDED_VERTICAL_MARGIN}px`;
  }

  /**
   * Safely gets the computed height from the adapter.
   * @return {string | number}
   * @private
   */
  get computedHeight_() {
    return this.adapter_.getComputedHeight() || '';
  }

  /**
   * Sets collapsed height styles.
   * Needed so that transition from auto to fixed height will appear smooth.
   * @private
   */
  setCollapsedHeight_() {
    this.adapter_.setStyle('height', this.computedHeight_.toString());
    this.adapter_.offsetHeight();
    this.adapter_.setStyle('height', `${numbers.COLLAPSED_HEIGHT}px`);
  }

  /**
   * Sets expanded height styles.
   * Needed so that transition from fixed to auto height will appear smooth.
   * @private
   */
  setExpandedHeight_() {
    const prevHeight = this.adapter_.getStyle('height');
    this.adapter_.setStyle('height', 'auto');
    const endHeight = this.expandedHeightStyle_;
    this.adapter_.setStyle('height', prevHeight);
    this.adapter_.offsetHeight();
    this.adapter_.setStyle('height', endHeight);
  }
}

export default MDCExpansionPanelFoundation;
