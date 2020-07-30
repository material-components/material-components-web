/**
 * @license
 * Copyright 2020 Google Inc.
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

import {MDCComponent} from '@material/base/component';
import {SpecificEventListener} from '@material/base/types';

import {MDCTooltipAdapter} from './adapter';
import {AnchorBoundaryType, events, Position} from './constants';
import {MDCTooltipFoundation} from './foundation';

export class MDCTooltip extends MDCComponent<MDCTooltipFoundation> {
  static attachTo(root: Element) {
    return new MDCTooltip(root);
  }

  private anchorElem!: HTMLElement|null;  // assigned in initialSyncWithDOM

  private handleMouseEnter!: SpecificEventListener<'mouseenter'>;
  private handleFocus!: SpecificEventListener<'focus'>;
  private handleMouseLeave!: SpecificEventListener<'mouseleave'>;
  private handleBlur!: SpecificEventListener<'blur'>;
  private handleTransitionEnd!: SpecificEventListener<'transitionend'>;

  initialSyncWithDOM() {
    const tooltipId = this.root.getAttribute('id');
    if (!tooltipId) {
      throw new Error('MDCTooltip: Tooltip component must have an id.');
    }

    this.anchorElem = document.querySelector<HTMLElement>(
        `[aria-describedby="${tooltipId}"]`);
    if (!this.anchorElem) {
      throw new Error(
          'MDCTooltip: Tooltip component requries an [aria-describedby] anchor element.');
    }

    this.handleMouseEnter = () => {
      this.foundation.handleAnchorMouseEnter();
    };

    this.handleFocus = () => {
      this.foundation.handleAnchorFocus();
    };

    this.handleMouseLeave = () => {
      this.foundation.handleAnchorMouseLeave();
    };

    this.handleBlur = () => {
      this.foundation.handleAnchorBlur();
    };

    this.handleTransitionEnd = () => {
      this.foundation.handleTransitionEnd();
    };

    this.anchorElem.addEventListener('mouseenter', this.handleMouseEnter);
    // TODO(b/157075286): Listening for a 'focus' event is too broad.
    this.anchorElem.addEventListener('focus', this.handleFocus);
    this.anchorElem.addEventListener('mouseleave', this.handleMouseLeave);
    this.anchorElem.addEventListener('blur', this.handleBlur);

    this.listen('transitionend', this.handleTransitionEnd);
  }

  destroy() {
    if (this.anchorElem) {
      this.anchorElem.removeEventListener('mouseenter', this.handleMouseEnter);
      this.anchorElem.removeEventListener('focus', this.handleFocus);
      this.anchorElem.removeEventListener('mouseleave', this.handleMouseLeave);
      this.anchorElem.removeEventListener('blur', this.handleBlur);
    }

    this.unlisten('transitionend', this.handleTransitionEnd);
    super.destroy();
  }

  setTooltipPosition(pos: Position) {
    this.foundation.setTooltipPosition(pos);
  }

  setAnchorBoundaryType(type: AnchorBoundaryType) {
    this.foundation.setAnchorBoundaryType(type);
  }

  getDefaultFoundation() {
    const adapter: MDCTooltipAdapter = {
      getAttribute: (attr) => this.root.getAttribute(attr),
      setAttribute: (attr, value) => {
        this.root.setAttribute(attr, value);
      },
      addClass: (className) => {
        this.root.classList.add(className);
      },
      hasClass: (className) => this.root.classList.contains(className),
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      setStyleProperty: (propertyName, value) => {
        (this.root as HTMLElement).style.setProperty(propertyName, value);
      },
      getViewportWidth: () => window.innerWidth,
      getViewportHeight: () => window.innerHeight,
      getTooltipSize: () => {
        return {
          width: (this.root as HTMLElement).offsetWidth,
          height: (this.root as HTMLElement).offsetHeight
        };
      },
      getAnchorBoundingRect: () => {
        return this.anchorElem ? this.anchorElem.getBoundingClientRect() : null;
      },
      isRTL: () => getComputedStyle(this.root).direction === 'rtl',
      registerDocumentEventHandler: (evt, handler) => {
        document.body.addEventListener(evt, handler);
      },
      deregisterDocumentEventHandler: (evt, handler) => {
        document.body.removeEventListener(evt, handler);
      },
      notifyHidden: () => {
        this.emit(events.HIDDEN, {});
      },
    };

    //tslint:enable:object-literal-sort-keys
    return new MDCTooltipFoundation(adapter);
  }
}
