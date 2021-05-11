/**
 * @license
 * Copyright 2021 Google Inc.
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

import {MDCFoundation} from '@material/base/foundation';
import {mdcObserver} from '@material/base/observer';
import {MDCSwitchAdapter, MDCSwitchRenderAdapter} from './adapter';
import {CssClasses} from './constants';

const baseClass =
    mdcObserver<MDCFoundation<MDCSwitchAdapter>, typeof MDCFoundation>(
        MDCFoundation);
/**
 * `MDCSwitchFoundation` provides a state-only foundation for a switch
 * component.
 *
 * State observers and event handler entrypoints update a component's adapter's
 * state with the logic needed for switch to function.
 */
export class MDCSwitchFoundation extends baseClass {
  constructor(adapter: MDCSwitchAdapter) {
    super(adapter);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Initializes the foundation and starts observing state changes.
   */
  init() {
    this.observe(this.adapter.state, {
      disabled: this.stopProcessingIfDisabled,
      processing: this.stopProcessingIfDisabled,
    });
  }

  /**
   * Cleans up the foundation and stops observing state changes.
   */
  destroy() {
    this.unobserve();
  }

  /**
   * Event handler for switch click events. Clicking on a switch will toggle its
   * selected state.
   */
  handleClick() {
    if (this.adapter.state.disabled) {
      return;
    }

    this.adapter.state.selected = !this.adapter.state.selected;
  }

  protected stopProcessingIfDisabled() {
    if (this.adapter.state.disabled) {
      this.adapter.state.processing = false;
    }
  }
}
/**
 * `MDCSwitchRenderFoundation` provides a state and rendering foundation for a
 * switch component.
 *
 * State observers and event handler entrypoints update a component's
 * adapter's state with the logic needed for switch to function.
 *
 * In response to state changes, the rendering foundation uses the component's
 * render adapter to keep the component's DOM updated with the state.
 */
export class MDCSwitchRenderFoundation extends MDCSwitchFoundation {
  protected adapter!: MDCSwitchRenderAdapter;

  /**
   * Initializes the foundation and starts observing state changes.
   */
  init() {
    super.init();
    this.observe(this.adapter.state, {
      disabled: this.onDisabledChange,
      processing: this.onProcessingChange,
      selected: this.onSelectedChange,
    })
  }

  /**
   * Initializes the foundation from a server side rendered (SSR) component.
   * This will sync the adapter's state with the current state of the DOM.
   *
   * This method should be called after `init()`.
   */
  initFromDOM() {
    // Turn off observers while setting state
    this.setObserversEnabled(this.adapter.state, false);

    this.adapter.state.selected = this.adapter.hasClass(CssClasses.SELECTED);
    // Ensure aria-checked is set if attribute is not present
    this.onSelectedChange();
    this.adapter.state.disabled = this.adapter.isDisabled();
    this.adapter.state.processing =
        this.adapter.hasClass(CssClasses.PROCESSING);

    // Re-observe state
    this.setObserversEnabled(this.adapter.state, true);
    this.stopProcessingIfDisabled();
  }

  protected onDisabledChange() {
    this.adapter.setDisabled(this.adapter.state.disabled);
  }

  protected onProcessingChange() {
    this.toggleClass(this.adapter.state.processing, CssClasses.PROCESSING);
  }

  protected onSelectedChange() {
    this.adapter.setAriaChecked(String(this.adapter.state.selected));
    this.toggleClass(this.adapter.state.selected, CssClasses.SELECTED);
    this.toggleClass(!this.adapter.state.selected, CssClasses.UNSELECTED);
  }

  private toggleClass(addClass: boolean, className: CssClasses) {
    if (addClass) {
      this.adapter.addClass(className);
    } else {
      this.adapter.removeClass(className);
    }
  }
}
