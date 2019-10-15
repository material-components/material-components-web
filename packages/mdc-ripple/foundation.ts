/**
 * @license
 * Copyright 2016 Google Inc.
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
import {MDCRippleAdapter} from './adapter';
import {cssClasses, numbers, strings} from './constants';
import {MDCRipplePoint} from './types';
import {getNormalizedEventCoords} from './util';

interface ActivationStateType {
  isActivated?: boolean;
  hasDeactivationUXRun?: boolean;
  wasActivatedByPointer?: boolean;
  wasElementMadeActive?: boolean;
  activationEvent?: Event;
  isProgrammatic?: boolean;
}

interface FgTranslationCoordinates {
  startPoint: MDCRipplePoint;
  endPoint: MDCRipplePoint;
}

interface Coordinates {
  left: number;
  top: number;
}

type ActivationEventType = 'touchstart' | 'pointerdown' | 'mousedown' | 'keydown';
type DeactivationEventType = 'touchend' | 'pointerup' | 'mouseup' | 'contextmenu';

// Activation events registered on the root element of each instance for activation
const ACTIVATION_EVENT_TYPES: ActivationEventType[] = [
  'touchstart', 'pointerdown', 'mousedown', 'keydown',
];

// Deactivation events registered on documentElement when a pointer-related down event occurs
const POINTER_DEACTIVATION_EVENT_TYPES: DeactivationEventType[] = [
  'touchend', 'pointerup', 'mouseup', 'contextmenu',
];

// simultaneous nested activations
let activatedTargets: Array<EventTarget | null> = [];

export class MDCRippleFoundation extends MDCFoundation<MDCRippleAdapter> {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter(): MDCRippleAdapter {
    return {
      addClass: () => undefined,
      browserSupportsCssVars: () => true,
      computeBoundingRect: () => ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0}),
      containsEventTarget: () => true,
      deregisterDocumentInteractionHandler: () => undefined,
      deregisterInteractionHandler: () => undefined,
      deregisterResizeHandler: () => undefined,
      getWindowPageOffset: () => ({x: 0, y: 0}),
      isSurfaceActive: () => true,
      isSurfaceDisabled: () => true,
      isUnbounded: () => true,
      registerDocumentInteractionHandler: () => undefined,
      registerInteractionHandler: () => undefined,
      registerResizeHandler: () => undefined,
      removeClass: () => undefined,
      updateCssVariable: () => undefined,
    };
  }

  private activationAnimationHasEnded_ = false;
  private activationState_: ActivationStateType;
  private activationTimer_ = 0;
  private fgDeactivationRemovalTimer_ = 0;
  private fgScale_ = '0';
  private frame_ = {width: 0, height: 0};
  private initialSize_ = 0;
  private layoutFrame_ = 0;
  private maxRadius_ = 0;
  private unboundedCoords_: Coordinates = {left: 0, top: 0};

  private readonly activationTimerCallback_: () => void;
  private readonly activateHandler_: EventHandlerNonNull;
  private readonly deactivateHandler_: EventHandlerNonNull;
  private readonly focusHandler_: EventHandlerNonNull;
  private readonly blurHandler_: EventHandlerNonNull;
  private readonly resizeHandler_: EventHandlerNonNull;

  private previousActivationEvent_?: Event;

  constructor(adapter?: Partial<MDCRippleAdapter>) {
    super({...MDCRippleFoundation.defaultAdapter, ...adapter});

    this.activationState_ = this.defaultActivationState_();

    this.activationTimerCallback_ = () => {
      this.activationAnimationHasEnded_ = true;
      this.runDeactivationUXLogicIfReady_();
    };
    this.activateHandler_ = (e) => this.activate_(e);
    this.deactivateHandler_ = () => this.deactivate_();
    this.focusHandler_ = () => this.handleFocus();
    this.blurHandler_ = () => this.handleBlur();
    this.resizeHandler_ = () => this.layout();
  }

  init() {
    const supportsPressRipple = this.supportsPressRipple_();

    this.registerRootHandlers_(supportsPressRipple);

    if (supportsPressRipple) {
      const {ROOT, UNBOUNDED} = MDCRippleFoundation.cssClasses;
      requestAnimationFrame(() => {
        this.adapter_.addClass(ROOT);
        if (this.adapter_.isUnbounded()) {
          this.adapter_.addClass(UNBOUNDED);
          // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
          this.layoutInternal_();
        }
      });
    }
  }

  destroy() {
    if (this.supportsPressRipple_()) {
      if (this.activationTimer_) {
        clearTimeout(this.activationTimer_);
        this.activationTimer_ = 0;
        this.adapter_.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
      }

      if (this.fgDeactivationRemovalTimer_) {
        clearTimeout(this.fgDeactivationRemovalTimer_);
        this.fgDeactivationRemovalTimer_ = 0;
        this.adapter_.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
      }

      const {ROOT, UNBOUNDED} = MDCRippleFoundation.cssClasses;
      requestAnimationFrame(() => {
        this.adapter_.removeClass(ROOT);
        this.adapter_.removeClass(UNBOUNDED);
        this.removeCssVars_();
      });
    }

    this.deregisterRootHandlers_();
    this.deregisterDeactivationHandlers_();
  }

  /**
   * @param evt Optional event containing position information.
   */
  activate(evt?: Event): void {
    this.activate_(evt);
  }

  deactivate(): void {
    this.deactivate_();
  }

  layout(): void {
    if (this.layoutFrame_) {
      cancelAnimationFrame(this.layoutFrame_);
    }
    this.layoutFrame_ = requestAnimationFrame(() => {
      this.layoutInternal_();
      this.layoutFrame_ = 0;
    });
  }

  setUnbounded(unbounded: boolean): void {
    const {UNBOUNDED} = MDCRippleFoundation.cssClasses;
    if (unbounded) {
      this.adapter_.addClass(UNBOUNDED);
    } else {
      this.adapter_.removeClass(UNBOUNDED);
    }
  }

  handleFocus(): void {
    requestAnimationFrame(() =>
        this.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED));
  }

  handleBlur(): void {
    requestAnimationFrame(() =>
        this.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED));
  }

  /**
   * We compute this property so that we are not querying information about the client
   * until the point in time where the foundation requests it. This prevents scenarios where
   * client-side feature-detection may happen too early, such as when components are rendered on the server
   * and then initialized at mount time on the client.
   */
  private supportsPressRipple_(): boolean {
    return this.adapter_.browserSupportsCssVars();
  }

  private defaultActivationState_(): ActivationStateType {
    return {
      activationEvent: undefined,
      hasDeactivationUXRun: false,
      isActivated: false,
      isProgrammatic: false,
      wasActivatedByPointer: false,
      wasElementMadeActive: false,
    };
  }

  /**
   * supportsPressRipple Passed from init to save a redundant function call
   */
  private registerRootHandlers_(supportsPressRipple: boolean) {
    if (supportsPressRipple) {
      ACTIVATION_EVENT_TYPES.forEach((evtType) => {
        this.adapter_.registerInteractionHandler(evtType, this.activateHandler_);
      });
      if (this.adapter_.isUnbounded()) {
        this.adapter_.registerResizeHandler(this.resizeHandler_);
      }
    }

    this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
    this.adapter_.registerInteractionHandler('blur', this.blurHandler_);
  }

  private registerDeactivationHandlers_(evt: Event) {
    if (evt.type === 'keydown') {
      this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);
    } else {
      POINTER_DEACTIVATION_EVENT_TYPES.forEach((evtType) => {
        this.adapter_.registerDocumentInteractionHandler(evtType, this.deactivateHandler_);
      });
    }
  }

  private deregisterRootHandlers_() {
    ACTIVATION_EVENT_TYPES.forEach((evtType) => {
      this.adapter_.deregisterInteractionHandler(evtType, this.activateHandler_);
    });
    this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
    this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);

    if (this.adapter_.isUnbounded()) {
      this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    }
  }

  private deregisterDeactivationHandlers_() {
    this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);
    POINTER_DEACTIVATION_EVENT_TYPES.forEach((evtType) => {
      this.adapter_.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler_);
    });
  }

  private removeCssVars_() {
    const rippleStrings = MDCRippleFoundation.strings;
    const keys = Object.keys(rippleStrings) as Array<keyof typeof rippleStrings>;
    keys.forEach((key) => {
      if (key.indexOf('VAR_') === 0) {
        this.adapter_.updateCssVariable(rippleStrings[key], null);
      }
    });
  }

  private activate_(evt?: Event) {
    if (this.adapter_.isSurfaceDisabled()) {
      return;
    }

    const activationState = this.activationState_;
    if (activationState.isActivated) {
      return;
    }

    // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
    const previousActivationEvent = this.previousActivationEvent_;
    const isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
    if (isSameInteraction) {
      return;
    }

    activationState.isActivated = true;
    activationState.isProgrammatic = evt === undefined;
    activationState.activationEvent = evt;
    activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (
        evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown'
    );

    const hasActivatedChild = evt !== undefined && activatedTargets.length > 0 && activatedTargets.some(
        (target) => this.adapter_.containsEventTarget(target));
    if (hasActivatedChild) {
      // Immediately reset activation state, while preserving logic that prevents touch follow-on events
      this.resetActivationState_();
      return;
    }

    if (evt !== undefined) {
      activatedTargets.push(evt.target);
      this.registerDeactivationHandlers_(evt);
    }

    activationState.wasElementMadeActive = this.checkElementMadeActive_(evt);
    if (activationState.wasElementMadeActive) {
      this.animateActivation_();
    }

    requestAnimationFrame(() => {
      // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
      activatedTargets = [];

      if (!activationState.wasElementMadeActive
          && evt !== undefined
          && ((evt as KeyboardEvent).key === ' ' || (evt as KeyboardEvent).keyCode === 32)) {
        // If space was pressed, try again within an rAF call to detect :active, because different UAs report
        // active states inconsistently when they're called within event handling code:
        // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
        // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
        // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
        // variable is set within a rAF callback for a submit button interaction (#2241).
        activationState.wasElementMadeActive = this.checkElementMadeActive_(evt);
        if (activationState.wasElementMadeActive) {
          this.animateActivation_();
        }
      }

      if (!activationState.wasElementMadeActive) {
        // Reset activation state immediately if element was not made active.
        this.activationState_ = this.defaultActivationState_();
      }
    });
  }

  private checkElementMadeActive_(evt?: Event) {
    return (evt !== undefined && evt.type === 'keydown') ? this.adapter_.isSurfaceActive() : true;
  }

  private animateActivation_() {
    const {VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END} = MDCRippleFoundation.strings;
    const {FG_DEACTIVATION, FG_ACTIVATION} = MDCRippleFoundation.cssClasses;
    const {DEACTIVATION_TIMEOUT_MS} = MDCRippleFoundation.numbers;

    this.layoutInternal_();

    let translateStart = '';
    let translateEnd = '';

    if (!this.adapter_.isUnbounded()) {
      const {startPoint, endPoint} = this.getFgTranslationCoordinates_();
      translateStart = `${startPoint.x}px, ${startPoint.y}px`;
      translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
    }

    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
    // Cancel any ongoing activation/deactivation animations
    clearTimeout(this.activationTimer_);
    clearTimeout(this.fgDeactivationRemovalTimer_);
    this.rmBoundedActivationClasses_();
    this.adapter_.removeClass(FG_DEACTIVATION);

    // Force layout in order to re-trigger the animation.
    this.adapter_.computeBoundingRect();
    this.adapter_.addClass(FG_ACTIVATION);
    this.activationTimer_ = setTimeout(() => this.activationTimerCallback_(), DEACTIVATION_TIMEOUT_MS);
  }

  private getFgTranslationCoordinates_(): FgTranslationCoordinates {
    const {activationEvent, wasActivatedByPointer} = this.activationState_;

    let startPoint;
    if (wasActivatedByPointer) {
      startPoint = getNormalizedEventCoords(
          activationEvent,
          this.adapter_.getWindowPageOffset(),
          this.adapter_.computeBoundingRect(),
      );
    } else {
      startPoint = {
        x: this.frame_.width / 2,
        y: this.frame_.height / 2,
      };
    }
    // Center the element around the start point.
    startPoint = {
      x: startPoint.x - (this.initialSize_ / 2),
      y: startPoint.y - (this.initialSize_ / 2),
    };

    const endPoint = {
      x: (this.frame_.width / 2) - (this.initialSize_ / 2),
      y: (this.frame_.height / 2) - (this.initialSize_ / 2),
    };

    return {startPoint, endPoint};
  }

  private runDeactivationUXLogicIfReady_() {
    // This method is called both when a pointing device is released, and when the activation animation ends.
    // The deactivation animation should only run after both of those occur.
    const {FG_DEACTIVATION} = MDCRippleFoundation.cssClasses;
    const {hasDeactivationUXRun, isActivated} = this.activationState_;
    const activationHasEnded = hasDeactivationUXRun || !isActivated;

    if (activationHasEnded && this.activationAnimationHasEnded_) {
      this.rmBoundedActivationClasses_();
      this.adapter_.addClass(FG_DEACTIVATION);
      this.fgDeactivationRemovalTimer_ = setTimeout(() => {
        this.adapter_.removeClass(FG_DEACTIVATION);
      }, numbers.FG_DEACTIVATION_MS);
    }
  }

  private rmBoundedActivationClasses_() {
    const {FG_ACTIVATION} = MDCRippleFoundation.cssClasses;
    this.adapter_.removeClass(FG_ACTIVATION);
    this.activationAnimationHasEnded_ = false;
    this.adapter_.computeBoundingRect();
  }

  private resetActivationState_() {
    this.previousActivationEvent_ = this.activationState_.activationEvent;
    this.activationState_ = this.defaultActivationState_();
    // Touch devices may fire additional events for the same interaction within a short time.
    // Store the previous event until it's safe to assume that subsequent events are for new interactions.
    setTimeout(() => this.previousActivationEvent_ = undefined, MDCRippleFoundation.numbers.TAP_DELAY_MS);
  }

  private deactivate_(): void {
    const activationState = this.activationState_;
    // This can happen in scenarios such as when you have a keyup event that blurs the element.
    if (!activationState.isActivated) {
      return;
    }

    const state: ActivationStateType = {...activationState};

    if (activationState.isProgrammatic) {
      requestAnimationFrame(() => this.animateDeactivation_(state));
      this.resetActivationState_();
    } else {
      this.deregisterDeactivationHandlers_();
      requestAnimationFrame(() => {
        this.activationState_.hasDeactivationUXRun = true;
        this.animateDeactivation_(state);
        this.resetActivationState_();
      });
    }
  }

  private animateDeactivation_({wasActivatedByPointer, wasElementMadeActive}: ActivationStateType) {
    if (wasActivatedByPointer || wasElementMadeActive) {
      this.runDeactivationUXLogicIfReady_();
    }
  }

  private layoutInternal_() {
    this.frame_ = this.adapter_.computeBoundingRect();
    const maxDim = Math.max(this.frame_.height, this.frame_.width);

    // Surface diameter is treated differently for unbounded vs. bounded ripples.
    // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
    // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
    // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
    // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
    // `overflow: hidden`.
    const getBoundedRadius = () => {
      const hypotenuse = Math.sqrt(Math.pow(this.frame_.width, 2) + Math.pow(this.frame_.height, 2));
      return hypotenuse + MDCRippleFoundation.numbers.PADDING;
    };

    this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius();

    // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
    const initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
    // Unbounded ripple size should always be even number to equally center align.
    if (this.adapter_.isUnbounded() && initialSize % 2 !== 0) {
      this.initialSize_ = initialSize - 1;
    } else {
      this.initialSize_ = initialSize;
    }
    this.fgScale_ = `${this.maxRadius_ / this.initialSize_}`;

    this.updateLayoutCssVars_();
  }

  private updateLayoutCssVars_() {
    const {
      VAR_FG_SIZE, VAR_LEFT, VAR_TOP, VAR_FG_SCALE,
    } = MDCRippleFoundation.strings;

    this.adapter_.updateCssVariable(VAR_FG_SIZE, `${this.initialSize_}px`);
    this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);

    if (this.adapter_.isUnbounded()) {
      this.unboundedCoords_ = {
        left: Math.round((this.frame_.width / 2) - (this.initialSize_ / 2)),
        top: Math.round((this.frame_.height / 2) - (this.initialSize_ / 2)),
      };

      this.adapter_.updateCssVariable(VAR_LEFT, `${this.unboundedCoords_.left}px`);
      this.adapter_.updateCssVariable(VAR_TOP, `${this.unboundedCoords_.top}px`);
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCRippleFoundation;
