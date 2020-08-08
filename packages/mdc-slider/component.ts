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
import {MDCRipple} from '@material/ripple/component';

import {MDCSliderAdapter} from './adapter';
import {cssClasses, events} from './constants';
import {MDCSliderFoundation} from './foundation';
import {MDCSliderChangeEventDetail, Thumb, TickMark} from './types';

/** Vanilla JS implementation of slider component. */
export class MDCSlider extends MDCComponent<MDCSliderFoundation> {
  static attachTo(root: Element) {
    return new MDCSlider(root);
  }

  root!: HTMLElement;                 // Assigned in MDCComponent constructor.
  private thumbs!: HTMLElement[];     // Assigned in #initialize.
  private trackActive!: HTMLElement;  // Assigned in #initialize.

  getDefaultFoundation() {
    // tslint:disable:object-literal-sort-keys Methods should be in the same
    // order as the adapter interface.
    const adapter: MDCSliderAdapter = {
      hasClass: (className) => this.root.classList.contains(className),
      addClass: (className) => {
        this.root.classList.add(className);
      },
      removeClass: (className) => {
        this.root.classList.remove(className);
      },
      addThumbClass: (className, thumb: Thumb) => {
        this.getThumbEl(thumb).classList.add(className);
      },
      removeThumbClass: (className, thumb: Thumb) => {
        this.getThumbEl(thumb).classList.remove(className);
      },
      getAttribute: (attribute) => this.root.getAttribute(attribute),
      getThumbAttribute: (attribute, thumb: Thumb) =>
          this.getThumbEl(thumb).getAttribute(attribute),
      setThumbAttribute: (attribute, value, thumb: Thumb) => {
        this.getThumbEl(thumb).setAttribute(attribute, value);
      },
      isThumbFocused: (thumb: Thumb) =>
          this.getThumbEl(thumb) === document.activeElement,
      focusThumb: (thumb: Thumb) => {
        this.getThumbEl(thumb).focus();
      },
      getThumbKnobWidth: (thumb: Thumb) => {
        return this.getThumbEl(thumb)
            .querySelector<HTMLElement>(`.${cssClasses.THUMB_KNOB}`)!
            .getBoundingClientRect()
            .width;
      },
      getThumbBoundingClientRect: (thumb: Thumb) =>
          this.getThumbEl(thumb).getBoundingClientRect(),
      getBoundingClientRect: () => this.root.getBoundingClientRect(),
      isRTL: () => getComputedStyle(this.root).direction === 'rtl',
      setThumbStyleProperty: (propertyName, value, thumb: Thumb) => {
        this.getThumbEl(thumb).style.setProperty(propertyName, value);
      },
      removeThumbStyleProperty: (propertyName, thumb: Thumb) => {
        this.getThumbEl(thumb).style.removeProperty(propertyName);
      },
      setTrackActiveStyleProperty: (propertyName, value) => {
        this.trackActive.style.setProperty(propertyName, value);
      },
      setValueIndicatorText: (value: number, thumb: Thumb) => {
        const valueIndicatorEl =
            this.getThumbEl(thumb).querySelector<HTMLElement>(
                `.${cssClasses.VALUE_INDICATOR_TEXT}`);
        valueIndicatorEl!.textContent = String(value);
      },
      updateTickMarks: (tickMarks: TickMark[]) => {
        let tickMarksContainer = this.root.querySelector<HTMLElement>(
            `.${cssClasses.TICK_MARKS_CONTAINER}`);
        if (!tickMarksContainer) {
          tickMarksContainer = document.createElement('div');
          tickMarksContainer.classList.add(cssClasses.TICK_MARKS_CONTAINER);
          const track =
              this.root.querySelector<HTMLElement>(`.${cssClasses.TRACK}`);
          track!.appendChild(tickMarksContainer);
        }

        if (tickMarks.length !== tickMarksContainer.children.length) {
          tickMarksContainer.innerHTML = '';
          this.addTickMarks(tickMarksContainer, tickMarks);
        } else {
          this.updateTickMarks(tickMarksContainer, tickMarks);
        }
      },
      setPointerCapture: (pointerId) => {
        this.root.setPointerCapture(pointerId);
      },
      emitChangeEvent: (value, thumb: Thumb) => {
        this.emit<MDCSliderChangeEventDetail>(events.CHANGE, {value, thumb});
      },
      emitInputEvent: (value, thumb: Thumb) => {
        this.emit<MDCSliderChangeEventDetail>(events.INPUT, {value, thumb});
      },
      registerEventHandler: (evtType, handler) => {
        this.listen(evtType, handler);
      },
      deregisterEventHandler: (evtType, handler) => {
        this.unlisten(evtType, handler);
      },
      registerThumbEventHandler: (thumb, evtType, handler) => {
        this.getThumbEl(thumb).addEventListener(evtType, handler);
      },
      deregisterThumbEventHandler: (thumb, evtType, handler) => {
        this.getThumbEl(thumb).removeEventListener(evtType, handler);
      },
      registerBodyEventHandler: (evtType, handler) => {
        document.body.addEventListener(evtType, handler);
      },
      deregisterBodyEventHandler: (evtType, handler) => {
        document.body.removeEventListener(evtType, handler);
      },
      registerWindowEventHandler: (evtType, handler) => {
        window.addEventListener(evtType, handler);
      },
      deregisterWindowEventHandler: (evtType, handler) => {
        window.removeEventListener(evtType, handler);
      },
      // tslint:enable:object-literal-sort-keys
    };
    return new MDCSliderFoundation(adapter);
  }

  initialize() {
    this.thumbs =
        [].slice.call(this.root.querySelectorAll(`.${cssClasses.THUMB}`)) as
        HTMLElement[];
    this.trackActive =
        this.root.querySelector(`.${cssClasses.TRACK_ACTIVE}`) as HTMLElement;
  }

  initialSyncWithDOM() {
    this.createRipples();
    this.foundation.layout();
  }

  /** Redraws UI based on DOM (e.g. element dimensions, RTL). */
  layout() {
    this.foundation.layout();
  }

  getValueStart(): number {
    return this.foundation.getValueStart();
  }

  setValueStart(valueStart: number) {
    this.foundation.setValueStart(valueStart);
  }

  getValue(): number {
    return this.foundation.getValue();
  }

  setValue(value: number) {
    this.foundation.setValue(value);
  }

  /** @return Slider disabled state. */
  getDisabled(): boolean {
    return this.foundation.getDisabled();
  }

  /** Sets slider disabled state. */
  setDisabled(disabled: boolean) {
    this.foundation.setDisabled(disabled);
  }

  private getThumbEl(thumb: Thumb) {
    return thumb === Thumb.END ? this.thumbs[this.thumbs.length - 1] :
                                 this.thumbs[0];
  }

  /** Adds tick mark elements to the given container. */
  private addTickMarks(tickMarkContainer: HTMLElement, tickMarks: TickMark[]) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < tickMarks.length; i++) {
      const div = document.createElement('div');
      const tickMarkClass = tickMarks[i] === TickMark.ACTIVE ?
          cssClasses.TICK_MARK_ACTIVE :
          cssClasses.TICK_MARK_INACTIVE;
      div.classList.add(tickMarkClass);
      fragment.appendChild(div);
    }
    tickMarkContainer.appendChild(fragment);
  }

  /** Updates tick mark elements' classes in the given container. */
  private updateTickMarks(
      tickMarkContainer: HTMLElement, tickMarks: TickMark[]) {
    const tickMarkEls = Array.from(tickMarkContainer.children);
    for (let i = 0; i < tickMarkEls.length; i++) {
      if (tickMarks[i] === TickMark.ACTIVE) {
        tickMarkEls[i].classList.add(cssClasses.TICK_MARK_ACTIVE);
        tickMarkEls[i].classList.remove(cssClasses.TICK_MARK_INACTIVE);
      } else {
        tickMarkEls[i].classList.add(cssClasses.TICK_MARK_INACTIVE);
        tickMarkEls[i].classList.remove(cssClasses.TICK_MARK_ACTIVE);
      }
    }
  }

  /** Initializes thumb ripples. */
  private createRipples() {
    const rippleSurfaces =
        [].slice.call(
            this.root.querySelectorAll(`.${cssClasses.THUMB}`));
    for (const rippleSurface of rippleSurfaces) {
      const ripple = new MDCRipple(rippleSurface);
      ripple.unbounded = true;
    }
  }
}
