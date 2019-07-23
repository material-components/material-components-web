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

import {EventType, SpecificEventListener} from '@material/base/types';
import {MDCRipplePoint} from './types';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCRippleAdapter {
  /**
   * Whether or not the given browser supports CSS Variables.
   */
  browserSupportsCssVars(): boolean;

  /**
   * Whether or not the ripple should be considered unbounded.
   */
  isUnbounded(): boolean;

  /**
   * Whether or not the surface the ripple is acting upon is
   * [active](https://www.w3.org/TR/css3-selectors/#useraction-pseudos).
   */
  isSurfaceActive(): boolean;

  /**
   * Whether or not the ripple is attached to a disabled component.
   */
  isSurfaceDisabled(): boolean;

  /**
   * Adds a class to the ripple surface.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the ripple surface.
   */
  removeClass(className: string): void;

  /**
   * Whether or not the ripple surface contains the given event target.
   * @param target
   */
  containsEventTarget(target: EventTarget | null): boolean;

  /**
   * Registers an event handler on the ripple surface.
   * @param evtType
   * @param handler
   */
  registerInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Unregisters an event handler on the ripple surface.
   * @param evtType
   * @param handler
   */
  deregisterInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Registers an event handler on the documentElement.
   * @param evtType
   * @param handler
   */
  registerDocumentInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Unregisters an event handler on the documentElement.
   * @param evtType
   * @param handler
   */
  deregisterDocumentInteractionHandler<K extends EventType>(evtType: K, handler: SpecificEventListener<K>): void;

  /**
   * Registers a handler to be called when the ripple surface (or its viewport) resizes.
   * @param handler
   */
  registerResizeHandler(handler: SpecificEventListener<'resize'>): void;

  /**
   * Unregisters a handler to be called when the ripple surface (or its viewport) resizes.
   * @param handler
   */
  deregisterResizeHandler(handler: SpecificEventListener<'resize'>): void;

  /**
   * Sets the CSS property `varName` on the ripple surface to the value specified.
   * @param varName
   * @param value
   */
  updateCssVariable(varName: string, value: string | null): void;

  /**
   * Returns the ClientRect for the surface.
   */
  computeBoundingRect(): ClientRect;

  /**
   * Returns the `page{X,Y}Offset` values for the window object.
   */
  getWindowPageOffset(): MDCRipplePoint;
}
