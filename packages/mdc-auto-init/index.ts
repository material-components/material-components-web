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

// tslint:disable:only-arrow-functions

import {MDCComponent} from '@material/base/component';
import {MDCFoundation} from '@material/base/foundation';

import {strings} from './constants';

const {AUTO_INIT_ATTR, DATASET_AUTO_INIT_STATE, INITIALIZED_STATE} = strings;

/** MDC Attachable */
export interface MDCAttachable extends Function {
  attachTo(root: HTMLElement): MDCComponent<MDCFoundation>;
}

interface InternalComponentRegistry {
  [key: string]: MDCAttachable;
}

const registry: InternalComponentRegistry = {};

// tslint:disable-next-line:no-console
const CONSOLE_WARN = console.warn.bind(console);

function emit<T extends object>(
    eventType: string, eventData: T, shouldBubble = false) {
  let event;
  if (typeof CustomEvent === 'function') {
    event = new CustomEvent<T>(eventType, {
      bubbles: shouldBubble,
      detail: eventData,
    });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventType, shouldBubble, false, eventData);
  }

  document.dispatchEvent(event);
}

/* istanbul ignore next: optional argument is not a branch statement */
/**
 * Auto-initializes all MDC components on a page.
 */
function mdcAutoInit(root: ParentNode = document) {
  const components = [];
  let nodes =
      Array.from(root.querySelectorAll<HTMLElement>(`[${AUTO_INIT_ATTR}]`));
  nodes = nodes.filter(
      (node) => node.dataset[DATASET_AUTO_INIT_STATE] !== INITIALIZED_STATE);

  for (const node of nodes) {
    const ctorName = node.getAttribute(AUTO_INIT_ATTR);
    if (!ctorName) {
      throw new Error('(mdc-auto-init) Constructor name must be given.');
    }

    // tslint:disable-next-line:enforce-name-casing
    const Constructor = registry[ctorName];
    if (typeof Constructor !== 'function') {
      throw new Error(
          `(mdc-auto-init) Could not find constructor in registry for ${
              ctorName}`);
    }

    // TODO: Should we make an eslint rule for an attachTo() static method?
    // See https://github.com/Microsoft/TypeScript/issues/14600 for discussion
    // of static interface support in TS
    const component = Constructor.attachTo(node);
    Object.defineProperty(node, ctorName, {
      configurable: true,
      enumerable: false,
      value: component,
      writable: false,
    });
    components.push(component);
    node.dataset[DATASET_AUTO_INIT_STATE] = INITIALIZED_STATE;
  }

  emit('MDCAutoInit:End', {});
  return components;
}

// Constructor is PascalCased because it is a direct reference to a class,
// rather than an instance of a class.
mdcAutoInit.register = function(
    componentName: string,
    // tslint:disable-next-line:enforce-name-casing
    Constructor: MDCAttachable, warn = CONSOLE_WARN) {
  if (typeof Constructor !== 'function') {
    throw new Error(`(mdc-auto-init) Invalid Constructor value: ${
        Constructor}. Expected function.`);
  }
  const registryValue = registry[componentName];
  if (registryValue) {
    warn(`(mdc-auto-init) Overriding registration for ${componentName} with ${
        Constructor}. Was: ${registryValue}`);
  }
  registry[componentName] = Constructor;
};

mdcAutoInit.deregister = function(componentName: string) {
  delete registry[componentName];
};

/** @nocollapse */
mdcAutoInit.deregisterAll = function() {
  for (const componentName of Object.keys(registry)) {
    mdcAutoInit.deregister(componentName);
  }
};

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default mdcAutoInit;
export {mdcAutoInit};
