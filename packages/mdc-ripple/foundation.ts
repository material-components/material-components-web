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

interface EventHandlerNonNull {
  (event: Event): any;
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
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get numbers() {
    return numbers;
  }

  static override get defaultAdapter(): MDCRippleAdapter {
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

  private activationAnimationHasEnded = false;
  private activationState: ActivationStateType;
  private activationTimer = 0;
  private fgDeactivationRemovalTimer = 0;
  private fgScale = '0';
  private frame = {width: 0, height: 0};
  private initialSize = 0;
  private layoutFrame = 0;
  private maxRadius = 0;
  private unboundedCoords: Coordinates = {left: 0, top: 0};

  private readonly activationTimerCallback: () => void;
  private readonly activateHandler: EventHandlerNonNull;
  private readonly deactivateHandler: EventHandlerNonNull;
  private readonly focusHandler: EventHandlerNonNull;
  private readonly blurHandler: EventHandlerNonNull;
  private readonly resizeHandler: EventHandlerNonNull;

  private previousActivationEvent?: Event;

  constructor(adapter?: Partial<MDCRippleAdapter>) {
    super({...MDCRippleFoundation.defaultAdapter, ...adapter});

    this.activationState = this.defaultActivationState();

    this.activationTimerCallback = () => {
      this.activationAnimationHasEnded = true;
      this.runDeactivationUXLogicIfReady();
    };
    this.activateHandler = (e) => {
      this.activateImpl(e);
    };
    this.deactivateHandler = () => {
      this.deactivateImpl();
    };
    this.focusHandler = () => {
      this.handleFocus();
    };
    this.blurHandler = () => {
      this.handleBlur();
    };
    this.resizeHandler = () => {
      this.layout();
    };
  }

  override init() {
    const supportsPressRipple = this.supportsPressRipple();

    this.registerRootHandlers(supportsPressRipple);

    if (supportsPressRipple) {
      const {ROOT, UNBOUNDED} = MDCRippleFoundation.cssClasses;
      requestAnimationFrame(() => {
        this.adapter.addClass(ROOT);
        if (this.adapter.isUnbounded()) {
          this.adapter.addClass(UNBOUNDED);
          // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
          this.layoutInternal();
        }
      });
    }
  }

  override destroy() {
    if (this.supportsPressRipple()) {
      if (this.activationTimer) {
        clearTimeout(this.activationTimer);
        this.activationTimer = 0;
        this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
      }

      if (this.fgDeactivationRemovalTimer) {
        clearTimeout(this.fgDeactivationRemovalTimer);
        this.fgDeactivationRemovalTimer = 0;
        this.adapter.removeClass(
            MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
      }

      const {ROOT, UNBOUNDED} = MDCRippleFoundation.cssClasses;
      requestAnimationFrame(() => {
        this.adapter.removeClass(ROOT);
        this.adapter.removeClass(UNBOUNDED);
        this.removeCssVars();
      });
    }

    this.deregisterRootHandlers();
    this.deregisterDeactivationHandlers();
  }

  /**
   * @param evt Optional event containing position information.
   */
  activate(evt?: Event): void {
    this.activateImpl(evt);
  }

  deactivate(): void {
    this.deactivateImpl();
  }

  layout(): void {
    if (this.layoutFrame) {
      cancelAnimationFrame(this.layoutFrame);
    }
    this.layoutFrame = requestAnimationFrame(() => {
      this.layoutInternal();
      this.layoutFrame = 0;
    });
  }

  setUnbounded(unbounded: boolean): void {
    const {UNBOUNDED} = MDCRippleFoundation.cssClasses;
    if (unbounded) {
      this.adapter.addClass(UNBOUNDED);
    } else {
      this.adapter.removeClass(UNBOUNDED);
    }
  }

  handleFocus(): void {
    requestAnimationFrame(
        () => this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED));
  }

  handleBlur(): void {
    requestAnimationFrame(
        () => this.adapter.removeClass(
            MDCRippleFoundation.cssClasses.BG_FOCUSED));
  }

  /**
   * We compute this property so that we are not querying information about the client
   * until the point in time where the foundation requests it. This prevents scenarios where
   * client-side feature-detection may happen too early, such as when components are rendered on the server
   * and then initialized at mount time on the client.
   */
  private supportsPressRipple(): boolean {
    return this.adapter.browserSupportsCssVars();
  }

  private defaultActivationState(): ActivationStateType {
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
  private registerRootHandlers(supportsPressRipple: boolean) {
    if (supportsPressRipple) {
      for (const evtType of ACTIVATION_EVENT_TYPES) {
        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
      }
      if (this.adapter.isUnbounded()) {
        this.adapter.registerResizeHandler(this.resizeHandler);
      }
    }

    this.adapter.registerInteractionHandler('focus', this.focusHandler);
    this.adapter.registerInteractionHandler('blur', this.blurHandler);
  }

  private registerDeactivationHandlers(evt: Event) {
    if (evt.type === 'keydown') {
      this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
    } else {
      for (const evtType of POINTER_DEACTIVATION_EVENT_TYPES) {
        this.adapter.registerDocumentInteractionHandler(
            evtType, this.deactivateHandler);
      }
    }
  }

  private deregisterRootHandlers() {
    for (const evtType of ACTIVATION_EVENT_TYPES) {
      this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
    }
    this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
    this.adapter.deregisterInteractionHandler('blur', this.blurHandler);

    if (this.adapter.isUnbounded()) {
      this.adapter.deregisterResizeHandler(this.resizeHandler);
    }
  }

  private deregisterDeactivationHandlers() {
    this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
    for (const evtType of POINTER_DEACTIVATION_EVENT_TYPES) {
      this.adapter.deregisterDocumentInteractionHandler(
          evtType, this.deactivateHandler);
    }
  }

  private removeCssVars() {
    const rippleStrings = MDCRippleFoundation.strings;
    const keys = Object.keys(rippleStrings) as Array<keyof typeof rippleStrings>;
    keys.forEach((key) => {
      if (key.indexOf('VAR_') === 0) {
        this.adapter.updateCssVariable(rippleStrings[key], null);
      }
    });
  }

  private activateImpl(evt?: Event) {
    if (this.adapter.isSurfaceDisabled()) {
      return;
    }

    const activationState = this.activationState;
    if (activationState.isActivated) {
      return;
    }

    // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
    const previousActivationEvent = this.previousActivationEvent;
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

    const hasActivatedChild = evt !== undefined &&
        activatedTargets.length > 0 &&
        activatedTargets.some(
            (target) => this.adapter.containsEventTarget(target));
    if (hasActivatedChild) {
      // Immediately reset activation state, while preserving logic that prevents touch follow-on events
      this.resetActivationState();
      return;
    }

    if (evt !== undefined) {
      activatedTargets.push(evt.target);
      this.registerDeactivationHandlers(evt);
    }

    activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
    if (activationState.wasElementMadeActive) {
      this.animateActivation();
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
        activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
        if (activationState.wasElementMadeActive) {
          this.animateActivation();
        }
      }

      if (!activationState.wasElementMadeActive) {
        // Reset activation state immediately if element was not made active.
        this.activationState = this.defaultActivationState();
      }
    });
  }

  private checkElementMadeActive(evt?: Event) {
    return (evt !== undefined && evt.type === 'keydown') ?
        this.adapter.isSurfaceActive() :
        true;
  }

  private animateActivation() {
    const {VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END} = MDCRippleFoundation.strings;
    const {FG_DEACTIVATION, FG_ACTIVATION} = MDCRippleFoundation.cssClasses;
    const {DEACTIVATION_TIMEOUT_MS} = MDCRippleFoundation.numbers;

    this.layoutInternal();

    let translateStart = '';
    let translateEnd = '';

    if (!this.adapter.isUnbounded()) {
      const {startPoint, endPoint} = this.getFgTranslationCoordinates();
      translateStart = `${startPoint.x}px, ${startPoint.y}px`;
      translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
    }

    this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
    this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
    // Cancel any ongoing activation/deactivation animations
    clearTimeout(this.activationTimer);
    clearTimeout(this.fgDeactivationRemovalTimer);
    this.rmBoundedActivationClasses();
    this.adapter.removeClass(FG_DEACTIVATION);

    // Force layout in order to re-trigger the animation.
    this.adapter.computeBoundingRect();
    this.adapter.addClass(FG_ACTIVATION);
    this.activationTimer = setTimeout(() => {
      this.activationTimerCallback();
    }, DEACTIVATION_TIMEOUT_MS);
  }

  private getFgTranslationCoordinates(): FgTranslationCoordinates {
    const {activationEvent, wasActivatedByPointer} = this.activationState;

    let startPoint;
    if (wasActivatedByPointer) {
      startPoint = getNormalizedEventCoords(
          activationEvent,
          this.adapter.getWindowPageOffset(),
          this.adapter.computeBoundingRect(),
      );
    } else {
      startPoint = {
        x: this.frame.width / 2,
        y: this.frame.height / 2,
      };
    }
    // Center the element around the start point.
    startPoint = {
      x: startPoint.x - (this.initialSize / 2),
      y: startPoint.y - (this.initialSize / 2),
    };

    const endPoint = {
      x: (this.frame.width / 2) - (this.initialSize / 2),
      y: (this.frame.height / 2) - (this.initialSize / 2),
    };

    return {startPoint, endPoint};
  }

  private runDeactivationUXLogicIfReady() {
    // This method is called both when a pointing device is released, and when the activation animation ends.
    // The deactivation animation should only run after both of those occur.
    const {FG_DEACTIVATION} = MDCRippleFoundation.cssClasses;
    const {hasDeactivationUXRun, isActivated} = this.activationState;
    const activationHasEnded = hasDeactivationUXRun || !isActivated;

    if (activationHasEnded && this.activationAnimationHasEnded) {
      this.rmBoundedActivationClasses();
      this.adapter.addClass(FG_DEACTIVATION);
      this.fgDeactivationRemovalTimer = setTimeout(() => {
        this.adapter.removeClass(FG_DEACTIVATION);
      }, numbers.FG_DEACTIVATION_MS);
    }
  }

  private rmBoundedActivationClasses() {
    const {FG_ACTIVATION} = MDCRippleFoundation.cssClasses;
    this.adapter.removeClass(FG_ACTIVATION);
    this.activationAnimationHasEnded = false;
    this.adapter.computeBoundingRect();
  }

  private resetActivationState() {
    this.previousActivationEvent = this.activationState.activationEvent;
    this.activationState = this.defaultActivationState();
    // Touch devices may fire additional events for the same interaction within a short time.
    // Store the previous event until it's safe to assume that subsequent events are for new interactions.
    setTimeout(
        () => this.previousActivationEvent = undefined,
        MDCRippleFoundation.numbers.TAP_DELAY_MS);
  }

  private deactivateImpl(): void {
    const activationState = this.activationState;
    // This can happen in scenarios such as when you have a keyup event that blurs the element.
    if (!activationState.isActivated) {
      return;
    }

    const state: ActivationStateType = {...activationState};

    if (activationState.isProgrammatic) {
      requestAnimationFrame(() => {
        this.animateDeactivation(state);
      });
      this.resetActivationState();
    } else {
      this.deregisterDeactivationHandlers();
      requestAnimationFrame(() => {
        this.activationState.hasDeactivationUXRun = true;
        this.animateDeactivation(state);
        this.resetActivationState();
      });
    }
  }

  private animateDeactivation({wasActivatedByPointer, wasElementMadeActive}:
                                  ActivationStateType) {
    if (wasActivatedByPointer || wasElementMadeActive) {
      this.runDeactivationUXLogicIfReady();
    }
  }

  private layoutInternal() {
    this.frame = this.adapter.computeBoundingRect();
    const maxDim = Math.max(this.frame.height, this.frame.width);

    // Surface diameter is treated differently for unbounded vs. bounded ripples.
    // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
    // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
    // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
    // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
    // `overflow: hidden`.
    const getBoundedRadius = () => {
      const hypotenuse = Math.sqrt(
          Math.pow(this.frame.width, 2) + Math.pow(this.frame.height, 2));
      return hypotenuse + MDCRippleFoundation.numbers.PADDING;
    };

    this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();

    // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
    const initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
    // Unbounded ripple size should always be even number to equally center align.
    if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
      this.initialSize = initialSize - 1;
    } else {
      this.initialSize = initialSize;
    }
    this.fgScale = `${this.maxRadius / this.initialSize}`;

    this.updateLayoutCssVars();
  }

  private updateLayoutCssVars() {
    const {
      VAR_FG_SIZE, VAR_LEFT, VAR_TOP, VAR_FG_SCALE,
    } = MDCRippleFoundation.strings;

    this.adapter.updateCssVariable(VAR_FG_SIZE, `${this.initialSize}px`);
    this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);

    if (this.adapter.isUnbounded()) {
      this.unboundedCoords = {
        left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
        top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
      };

      this.adapter.updateCssVariable(
          VAR_LEFT, `${this.unboundedCoords.left}px`);
      this.adapter.updateCssVariable(VAR_TOP, `${this.unboundedCoords.top}px`);
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCRippleFoundation;
