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

import {MDCAttachable, mdcAutoInit} from '../index';

class FakeComponent {
  static attachTo(node: HTMLElement) {
    return new this(node);
  }

  constructor(readonly node: HTMLElement) {
    this.node = node;
  }
}

class InvalidComponent {
  constructor(readonly node: HTMLElement) {
    this.node = node;
  }
}

interface FakeHTMLElement extends HTMLElement {
  FakeComponent: FakeComponent;
}

const createFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <div id="root">
    <p data-mdc-auto-init="FakeComponent" class="mdc-fake">Fake Element</p>
  </div>
`;
  const el = wrapper.firstElementChild as unknown as Document;
  wrapper.removeChild(el);
  return el;
};

const setupTest = () => {
  mdcAutoInit.deregisterAll();
  mdcAutoInit.register(
      'FakeComponent', FakeComponent as unknown as MDCAttachable);
  return createFixture();
};

const setupInvalidTest = () => {
  mdcAutoInit.deregisterAll();
  mdcAutoInit.register(
      'InvalidComponent', InvalidComponent as unknown as MDCAttachable);
  return createFixture();
};

describe('MDCAutoInit', () => {
  it('calls attachTo() on components registered for identifier on nodes w/ data-mdc-auto-init attr',
     () => {
       const root = setupTest();
       mdcAutoInit(root);

       expect(
           (root.querySelector('.mdc-fake') as FakeHTMLElement)
               .FakeComponent instanceof
           FakeComponent)
           .toBeTruthy();
     });

  it('throws when attachTo() is missing', () => {
    const root = setupInvalidTest();
    expect(() => mdcAutoInit(root)).toThrow();
  });

  it('passes the node where "data-mdc-auto-init" was found to attachTo()',
     () => {
       const root = setupTest();
       mdcAutoInit(root);

       const fake = root.querySelector('.mdc-fake') as FakeHTMLElement;
       expect(fake.FakeComponent.node).toEqual(fake);
     });

  it('throws when no constructor name is specified within "data-mdc-auto-init"',
     () => {
       const root = setupTest();
       (root.querySelector('.mdc-fake') as HTMLElement).dataset['mdcAutoInit'] =
           '';

       expect(() => mdcAutoInit(root)).toThrow();
     });

  it('throws when constructor is not registered', () => {
    const root = setupTest();
    (root.querySelector('.mdc-fake') as HTMLElement).dataset['mdcAutoInit'] =
        'MDCUnregisteredComponent';

    expect(() => mdcAutoInit(root)).toThrow();
  });

  it('#register warns when registered key is being overridden', () => {
    setupTest();
    const warn = jasmine.createSpy('warn');
    mdcAutoInit.register(
        'FakeComponent',
        (() => ({overridden: true})) as unknown as MDCAttachable, warn);
    expect(warn).toHaveBeenCalledWith(
        jasmine.stringMatching(/Overriding registration/));
  });

  it('#dispatches a MDCAutoInit:End event when all components are initialized',
     () => {
       const handler = jasmine.createSpy('eventHandler');
       const type = 'MDCAutoInit:End';

       document.addEventListener(type, handler);
       mdcAutoInit(document);

       expect(handler).toHaveBeenCalledWith(jasmine.objectContaining({type}));
     });

  interface WindowWithCustomEvent extends Window {
    CustomEvent: typeof CustomEvent;
  }

  it('#dispatches a MDCAutoInit:End event when all components are initialized - custom events not supported',
     () => {
       const handler = jasmine.createSpy('eventHandler');
       const type = 'MDCAutoInit:End';

       document.addEventListener(type, handler);

       const customEvent = CustomEvent;
       (window as unknown as WindowWithCustomEvent).CustomEvent = undefined!;
       try {
         mdcAutoInit(document);
       } finally {
         (window as unknown as WindowWithCustomEvent).CustomEvent = customEvent;
       }

       expect(handler).toHaveBeenCalledWith(jasmine.objectContaining({type}));
     });

  it('#returns the initialized components', () => {
    const root = setupTest();
    const components = mdcAutoInit(root);

    expect(components.length).toEqual(1);
    expect(components[0] instanceof FakeComponent).toBeTruthy();
  });

  it('does not register any components if element has data-mdc-auto-init-state="initialized"',
     () => {
       const root = setupTest();
       root.querySelector('[data-mdc-auto-init]')!.setAttribute(
           'data-mdc-auto-init-state', 'initialized');
       mdcAutoInit(root);

       expect(
           (root.querySelector('.mdc-fake') as FakeHTMLElement)
               .FakeComponent instanceof
           FakeComponent)
           .toBe(false);
     });

  it('does not return any new components after calling autoInit a second time',
     () => {
       const root = setupTest();

       let components = mdcAutoInit(root);
       expect(components.length).toEqual(1);
       components = mdcAutoInit(root);
       expect(components.length).toEqual(0);
     });
});
