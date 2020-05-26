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

import {cssClasses} from '../../mdc-ripple/constants';
import {MDCRipple} from '../../mdc-ripple/index';
import * as util from '../../mdc-ripple/util';
import {emitEvent} from '../../../testing/dom/events';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

function getFixture(unbounded = false) {
  const el = document.createElement('div');
  if (unbounded) {
    el.setAttribute('data-mdc-ripple-is-unbounded', '');
  }
  return el;
}

describe('MDCRipple', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns a ripple', () => {
    const root = getFixture();
    const component = MDCRipple.attachTo(root);
    expect(component instanceof MDCRipple).toBeTruthy();
  });

  it('attachTo makes ripple unbounded when given as an option', () => {
    const root = getFixture();
    const component = MDCRipple.attachTo(root, {isUnbounded: true});
    expect(component.unbounded).toBeTruthy();
  });

  it('attachTo does not override unbounded data attr when omitted', () => {
    const root = getFixture(true);
    const component = MDCRipple.attachTo(root);
    expect(component.unbounded).toBeTruthy();
  });

  it('attachTo overrides unbounded data attr when explicitly specified', () => {
    const root = getFixture(true);
    const component = MDCRipple.attachTo(root, {isUnbounded: false});
    expect(component.unbounded).toBeFalsy();
  });

  it('createAdapter() returns the same adapter used by default for the ripple',
     () => {
       const root = getFixture();
       const component = MDCRipple.attachTo(root);
       expect(Object.keys(MDCRipple.createAdapter({root})))
           .toEqual(Object.keys(component['foundation']['adapter_']));
     });

  function setupTest() {
    const root = getFixture();
    const component = new MDCRipple(root);
    return {root, component};
  }

  it(`set unbounded() adds ${cssClasses.UNBOUNDED} when truthy`, () => {
    const {root, component} = setupTest();
    component.unbounded = true;
    expect(root.classList.contains(cssClasses.UNBOUNDED)).toBeTruthy();
  });

  it(`set unbounded() removes ${cssClasses.UNBOUNDED} when falsy`, () => {
    const {root, component} = setupTest();
    root.classList.add(cssClasses.UNBOUNDED);
    component.unbounded = false;
    expect(root.classList.contains(cssClasses.UNBOUNDED)).toBeFalsy();
  });

  it('activate() delegates to the foundation', () => {
    const {component} = setupTest();
    component['foundation'].activate = jasmine.createSpy('');
    component.activate();
    expect(component['foundation'].activate).toHaveBeenCalled();
  });

  it('deactivate() delegates to the foundation', () => {
    const {component} = setupTest();
    component['foundation'].deactivate = jasmine.createSpy('');
    component.deactivate();
    expect(component['foundation'].deactivate).toHaveBeenCalled();
  });

  it('layout() delegates to the foundation', () => {
    const {component} = setupTest();
    component['foundation'].layout = jasmine.createSpy('');
    component.layout();
    expect(component['foundation'].layout).toHaveBeenCalled();
  });

  it('adapter#browserSupportsCssVars delegates to util', () => {
    const {component} = setupTest();
    expect((component.getDefaultFoundation() as any)
               .adapter_.browserSupportsCssVars(window))
        .toEqual(util.supportsCssVariables(window));
  });

  it('adapter#isUnbounded delegates to unbounded getter', () => {
    const {component} = setupTest();
    component.unbounded = true;
    expect((component.getDefaultFoundation() as any).adapter_.isUnbounded())
        .toBe(true);
  });

  it('adapter#isSurfaceDisabled delegates to component\'s disabled getter',
     () => {
       const {component} = setupTest();
       component.disabled = true;
       expect((component.getDefaultFoundation() as any)
                  .adapter_.isSurfaceDisabled())
           .toBe(true);
     });

  it('adapter#addClass adds a class to the root', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('adapter#removeClass removes a class from the root', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter_.removeClass('foo');
    expect(root.classList.contains('foo')).toBe(false);
  });

  it('adapter#containsEventTarget returns true if the passed element is a descendant of the root element',
     () => {
       const {root, component} = setupTest();
       const child = getFixture();
       const notChild = getFixture();
       root.appendChild(child);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.containsEventTarget(child))
           .toBe(true);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.containsEventTarget(notChild))
           .toBe(false);
     });

  it('adapter#registerInteractionHandler proxies to addEventListener on the root element',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('interactionHandler');
       (component.getDefaultFoundation() as any)
           .adapter_.registerInteractionHandler('foo', handler);
       emitEvent(root, 'foo');
       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('adapter#deregisterInteractionHandler proxies to removeEventListener on the root element',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('interactionHandler');
       root.addEventListener('foo', handler);
       (component.getDefaultFoundation() as any)
           .adapter_.deregisterInteractionHandler('foo', handler);
       emitEvent(root, 'foo');
       expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
     });

  it('adapter#registerDocumentInteractionHandler proxies to addEventListener on the documentElement',
     () => {
       const {component} = setupTest();
       const handler = jasmine.createSpy('interactionHandler');
       (component.getDefaultFoundation() as any)
           .adapter_.registerDocumentInteractionHandler('foo', handler);
       emitEvent(document.documentElement, 'foo');
       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('adapter#deregisterDocumentInteractionHandler proxies to removeEventListener on the documentElement',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('interactionHandler');
       root.addEventListener('foo', handler);
       (component.getDefaultFoundation() as any)
           .adapter_.deregisterDocumentInteractionHandler('foo', handler);
       emitEvent(document.documentElement, 'foo');
       expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
     });

  it('adapter#registerResizeHandler uses the handler as a window resize listener',
     () => {
       const {component} = setupTest();
       const handler = jasmine.createSpy('resizeHandler');
       (component.getDefaultFoundation() as any)
           .adapter_.registerResizeHandler(handler);
       emitEvent(window, 'resize');
       expect(handler).toHaveBeenCalledWith(jasmine.anything());
       window.removeEventListener('resize', handler);
     });

  it('adapter#deregisterResizeHandler unlistens the handler for window resize',
     () => {
       const {component} = setupTest();
       const handler = jasmine.createSpy('resizeHandler');
       window.addEventListener('resize', handler);
       (component.getDefaultFoundation() as any)
           .adapter_.deregisterResizeHandler(handler);
       emitEvent(window, 'resize');
       expect(handler).not.toHaveBeenCalledWith(jasmine.anything());
       // Just to be safe
       window.removeEventListener('resize', handler);
     });

  if (util.supportsCssVariables(window)) {
    it('adapter#updateCssVariable calls setProperty on root style with varName and value',
       () => {
         const {root, component} = setupTest();
         (component.getDefaultFoundation() as any)
             .adapter_.updateCssVariable('--foo', 'red');
         expect(root.style.getPropertyValue('--foo')).toEqual('red');
       });
  }

  it('adapter#computeBoundingRect calls getBoundingClientRect() on root',
     () => {
       const {root, component} = setupTest();
       document.body.appendChild(root);
       expect((component.getDefaultFoundation() as any)
                  .adapter_.computeBoundingRect())
           .toEqual(root.getBoundingClientRect());
       document.body.removeChild(root);
     });

  it('adapter#getWindowPageOffset returns page{X,Y}Offset as {x,y} respectively',
     () => {
       const {component} = setupTest();
       expect((component.getDefaultFoundation() as any)
                  .adapter_.getWindowPageOffset())
           .toEqual({
             x: window.pageXOffset,
             y: window.pageYOffset,
           });
     });

  it(`handleFocus() adds class ${cssClasses.BG_FOCUSED}`, () => {
    const {root, component} = setupTest();
    component['foundation'].handleFocus();
    jasmine.clock().tick(1);
    expect(root.classList.contains(cssClasses.BG_FOCUSED)).toBe(true);
  });

  it(`handleBlur() removes class ${cssClasses.BG_FOCUSED}`, () => {
    const {root, component} = setupTest();
    root.classList.add(cssClasses.BG_FOCUSED);
    component['foundation'].handleBlur();
    jasmine.clock().tick(1);
    expect(root.classList.contains(cssClasses.BG_FOCUSED)).toBe(false);
  });
});
