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
import {EventType, SpecificEventListener} from '@material/base/types';

import {MDCTooltipAdapter} from './adapter';
import {AnchorBoundaryType, CssClasses, events, PositionWithCaret, XPosition, YPosition} from './constants';
import {MDCTooltipFoundation} from './foundation';

export class MDCTooltip extends MDCComponent<MDCTooltipFoundation> {
  static override attachTo(root: Element) {
    return new MDCTooltip(root);
  }

  private anchorElem!: HTMLElement;       // assigned in initialize
  private isTooltipRich!: boolean;        // assigned in initialSyncWithDOM
  private isTooltipPersistent!: boolean;  // assigned in initialSyncWithDOM

  private handleMouseEnter!: SpecificEventListener<'mouseenter'>;
  private handleFocus!: SpecificEventListener<'focus'>;
  private handleMouseLeave!: SpecificEventListener<'mouseleave'>;
  private handleTransitionEnd!: SpecificEventListener<'transitionend'>;
  private handleClick!: SpecificEventListener<'click'>;
  private handleTouchstart!: SpecificEventListener<'touchstart'>;
  private handleTouchend!: SpecificEventListener<'touchend'>;

  override initialize() {
    const tooltipId = this.root.getAttribute('id');
    if (!tooltipId) {
      throw new Error('MDCTooltip: Tooltip component must have an id.');
    }

    const anchorElem = document.querySelector<HTMLElement>(
                           `[data-tooltip-id="${tooltipId}"]`) ||
        document.querySelector<HTMLElement>(
            `[aria-describedby="${tooltipId}"]`);
    if (!anchorElem) {
      throw new Error(
          'MDCTooltip: Tooltip component requires an anchor element annotated with [aria-describedby] or [data-tooltip-id].');
    }
    this.anchorElem = anchorElem;
  }

  override initialSyncWithDOM() {
    this.isTooltipRich = this.foundation.isRich();
    this.isTooltipPersistent = this.foundation.isPersistent();

    this.handleMouseEnter = () => {
      this.foundation.handleAnchorMouseEnter();
    };

    this.handleFocus = (evt) => {
      this.foundation.handleAnchorFocus(evt);
    };

    this.handleMouseLeave = () => {
      this.foundation.handleAnchorMouseLeave();
    };

    this.handleTransitionEnd = () => {
      this.foundation.handleTransitionEnd();
    };

    this.handleClick = () => {
      this.foundation.handleAnchorClick();
    };

    this.handleTouchstart = () => {
      this.foundation.handleAnchorTouchstart();
    };

    this.handleTouchend = () => {
      this.foundation.handleAnchorTouchend();
    };

    if (this.isTooltipRich && this.isTooltipPersistent) {
      this.anchorElem.addEventListener('click', this.handleClick);
    } else {
      this.anchorElem.addEventListener('mouseenter', this.handleMouseEnter);
      // TODO(b/157075286): Listening for a 'focus' event is too broad.
      this.anchorElem.addEventListener('focus', this.handleFocus);
      this.anchorElem.addEventListener('mouseleave', this.handleMouseLeave);
      this.anchorElem.addEventListener('touchstart', this.handleTouchstart);
      this.anchorElem.addEventListener('touchend', this.handleTouchend);
    }

    this.listen('transitionend', this.handleTransitionEnd);
  }

  override destroy() {
    if (this.anchorElem) {
      if (this.isTooltipRich && this.isTooltipPersistent) {
        this.anchorElem.removeEventListener('click', this.handleClick);
      } else {
        this.anchorElem.removeEventListener(
            'mouseenter', this.handleMouseEnter);
        this.anchorElem.removeEventListener('focus', this.handleFocus);
        this.anchorElem.removeEventListener(
            'mouseleave', this.handleMouseLeave);
        this.anchorElem.removeEventListener(
            'touchstart', this.handleTouchstart);
        this.anchorElem.removeEventListener('touchend', this.handleTouchend);
      }
    }

    this.unlisten('transitionend', this.handleTransitionEnd);
    super.destroy();
  }

  setTooltipPosition(position: {
    xPos?: XPosition,
    yPos?: YPosition,
    withCaretPos?: PositionWithCaret
  }) {
    this.foundation.setTooltipPosition(position);
  }

  setAnchorBoundaryType(type: AnchorBoundaryType) {
    this.foundation.setAnchorBoundaryType(type);
  }

  setShowDelay(delayMs: number) {
    this.foundation.setShowDelay(delayMs);
  }

  setHideDelay(delayMs: number) {
    this.foundation.setHideDelay(delayMs);
  }

  hide() {
    this.foundation.hide();
  }

  isShown() {
    return this.foundation.isShown();
  }

  /**
   * Method that allows user to specify additional elements that should have a
   * scroll event listener attached to it. This should be used in instances
   * where the anchor element is placed inside a scrollable container (that is
   * not the body element), and will ensure that the tooltip will stay attached
   * to the anchor on scroll.
   */
  attachScrollHandler(
      addEventListenerFn: <K extends EventType>(
          event: K, handler: SpecificEventListener<K>) => void) {
    this.foundation.attachScrollHandler(addEventListenerFn);
  }

  /**
   * Must be used in conjunction with #attachScrollHandler. Removes the scroll
   * event handler from elements on the page.
   */
  removeScrollHandler(
      removeEventHandlerFn: <K extends EventType>(
          event: K, handler: SpecificEventListener<K>) => void) {
    this.foundation.removeScrollHandler(removeEventHandlerFn);
  }

  override getDefaultFoundation() {
    const adapter: MDCTooltipAdapter = {
      getAttribute: (attr) => this.root.getAttribute(attr),
      setAttribute: (attr, value) => {
        this.root.setAttribute(attr, value);
      },
      removeAttribute: (attr) => {
        this.root.removeAttribute(attr);
      },
      addClass: (className) => {
        this.root.classList.add(className);
      },
      hasClass: (className) => this.root.classList.contains(className),
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      getComputedStyleProperty: (propertyName) => {
        return window.getComputedStyle(this.root).getPropertyValue(
            propertyName);
      },
      setStyleProperty: (propertyName, value) => {
        (this.root as HTMLElement).style.setProperty(propertyName, value);
      },
      setSurfaceAnimationStyleProperty: (propertyName, value) => {
        const surface = this.root.querySelector<HTMLElement>(
            `.${CssClasses.SURFACE_ANIMATION}`);
        surface?.style.setProperty(propertyName, value);
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
      getParentBoundingRect: () => {
        return this.root.parentElement?.getBoundingClientRect() ?? null;
      },
      getAnchorAttribute: (attr) => {
        return this.anchorElem ? this.anchorElem.getAttribute(attr) : null;
      },
      setAnchorAttribute: (attr, value) => {
        this.anchorElem?.setAttribute(attr, value);
      },
      isRTL: () => getComputedStyle(this.root).direction === 'rtl',
      anchorContainsElement: (element) => {
        return !!this.anchorElem?.contains(element);
      },
      tooltipContainsElement: (element) => {
        return this.root.contains(element);
      },
      focusAnchorElement: () => {
        this.anchorElem?.focus();
      },
      registerEventHandler: (evt, handler) => {
        if (this.root instanceof HTMLElement) {
          this.root.addEventListener(evt, handler);
        }
      },
      deregisterEventHandler: (evt, handler) => {
        if (this.root instanceof HTMLElement) {
          this.root.removeEventListener(evt, handler);
        }
      },
      registerAnchorEventHandler: (evt, handler) => {
        this.anchorElem?.addEventListener(evt, handler);
      },
      deregisterAnchorEventHandler: (evt, handler) => {
        this.anchorElem?.removeEventListener(evt, handler);
      },
      registerDocumentEventHandler: (evt, handler) => {
        document.body.addEventListener(evt, handler);
      },
      deregisterDocumentEventHandler: (evt, handler) => {
        document.body.removeEventListener(evt, handler);
      },
      registerWindowEventHandler: (evt, handler) => {
        window.addEventListener(evt, handler);
      },
      deregisterWindowEventHandler: (evt, handler) => {
        window.removeEventListener(evt, handler);
      },
      notifyHidden: () => {
        this.emit(events.HIDDEN, {});
      },
      notifyShown: () => {
        this.emit(events.SHOWN, {});
      },
      getTooltipCaretBoundingRect: () => {
        const caret = this.root.querySelector<HTMLElement>(
            `.${CssClasses.TOOLTIP_CARET_TOP}`);
        if (!caret) {
          return null;
        }
        return caret.getBoundingClientRect();
      },
      setTooltipCaretStyle: (propertyName, value) => {
        const topCaret = this.root.querySelector<HTMLElement>(
            `.${CssClasses.TOOLTIP_CARET_TOP}`);
        const bottomCaret = this.root.querySelector<HTMLElement>(
            `.${CssClasses.TOOLTIP_CARET_BOTTOM}`);

        if (!topCaret || !bottomCaret) {
          return;
        }

        topCaret.style.setProperty(propertyName, value);
        bottomCaret.style.setProperty(propertyName, value);
      },
      clearTooltipCaretStyles: () => {
        const topCaret = this.root.querySelector<HTMLElement>(
            `.${CssClasses.TOOLTIP_CARET_TOP}`);
        const bottomCaret = this.root.querySelector<HTMLElement>(
            `.${CssClasses.TOOLTIP_CARET_BOTTOM}`);

        if (!topCaret || !bottomCaret) {
          return;
        }
        topCaret.removeAttribute('style');
        bottomCaret.removeAttribute('style');
      },
      getActiveElement: () => {
        return document.activeElement;
      },
    };

    //tslint:enable:object-literal-sort-keys
    return new MDCTooltipFoundation(adapter);
  }
}
