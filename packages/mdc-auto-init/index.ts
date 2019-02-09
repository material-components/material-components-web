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

const registry = Object.create(null);

const CONSOLE_WARN = console.warn.bind(console); // tslint:disable-line:no-console

function _emit(evtType: string, evtData: object, shouldBubble = false) {
  let evt;
  if (typeof CustomEvent === 'function') {
    evt = new CustomEvent(evtType, {
      bubbles: shouldBubble,
      detail: evtData,
    });
  } else {
    evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(evtType, shouldBubble, false, evtData);
  }

  document.dispatchEvent(evt);
}

/**
 * Auto-initializes all MDC components on a page.
 */
function mdcAutoInit(root = document, warn = CONSOLE_WARN) {
  const components = [];
  const nodes: HTMLElement[] = [].slice.call(root.querySelectorAll<HTMLElement>('[data-mdc-auto-init]'));

  for (const node of nodes) {
    const ctorName = node.dataset.mdcAutoInit;
    if (!ctorName) {
      throw new Error('(mdc-auto-init) Constructor name must be given.');
    }

    const Ctor = registry[ctorName]; // tslint:disable-line:variable-name
    if (typeof Ctor !== 'function') {
      throw new Error(
        `(mdc-auto-init) Could not find constructor in registry for ${ctorName}`);
    }

    // @ts-ignore
    if (node[ctorName]) {
      warn(`(mdc-auto-init) Component already initialized for ${node}. Skipping...`);
      continue;
    }

    // TODO: Should we make an eslint rule for an attachTo() static method?
    const component = Ctor.attachTo(node);
    Object.defineProperty(node, ctorName, {
      configurable: true,
      enumerable: false,
      value: component,
      writable: false,
    });
    components.push(component);
  }

  _emit('MDCAutoInit:End', {});
  return components;
}

// tslint:disable-next-line:variable-name
mdcAutoInit.register = function(componentName: string, Ctor: Function, warn = CONSOLE_WARN) {
  if (typeof Ctor !== 'function') {
    throw new Error(`(mdc-auto-init) Invalid Ctor value ${Ctor}. Expected function`);
  }
  if (registry[componentName]) {
    warn(
      `(mdc-auto-init) Overriding registration for ${componentName} with ${Ctor}. ` +
      `Was: ${registry[componentName]}`);
  }
  registry[componentName] = Ctor;
};

mdcAutoInit.deregister = function(componentName: string) {
  delete registry[componentName];
};

mdcAutoInit.deregisterAll = function() {
  Object.keys(registry).forEach(this.deregister, this);
};

export {mdcAutoInit as default, mdcAutoInit};
