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

import {MDCIconButtonToggle, MDCIconButtonToggleFoundation} from '../../mdc-icon-button/index';
import {cssClasses} from '../../mdc-ripple/constants';
import {MDCRipple} from '../../mdc-ripple/index';
import {supportsCssVariables} from '../../mdc-ripple/util';
import {createFixture, html} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation as mockFoundationCreator} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

function getFixture() {
  return createFixture(html`
    <button></button>
  `);
}

function setupTest({createMockFoundation = false} = {}) {
  const root = getFixture();

  let mockFoundation;
  if (createMockFoundation) {
    mockFoundation = mockFoundationCreator(MDCIconButtonToggleFoundation);
  }
  const component = new MDCIconButtonToggle(root, mockFoundation);
  return {root, component, mockFoundation};
}

describe('MDCIconButtonToggle', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns a MDCIconButtonToggle instance', () => {
    expect(
        MDCIconButtonToggle.attachTo(document.createElement('i')) instanceof
        MDCIconButtonToggle)
        .toBe(true);
  });

  if (supportsCssVariables(window)) {
    it('#constructor initializes the ripple on the root element', () => {
      const {root} = setupTest();
      jasmine.clock().tick(1);
      expect(root.classList.contains('mdc-ripple-upgraded')).toBe(true);
    });

    it('#destroy removes the ripple', () => {
      const {root, component} = setupTest();
      jasmine.clock().tick(1);
      component.destroy();
      jasmine.clock().tick(1);
      expect(root.classList.contains('mdc-ripple-upgraded')).toBe(false);
    });
  }

  it('set/get on', () => {
    const {root, component} = setupTest();
    component.on = true;
    expect(component.on).toBe(true);
    expect(root.getAttribute('aria-pressed')).toEqual('true');

    component.on = false;
    expect(component.on).toBe(false);
    expect(root.getAttribute('aria-pressed')).toEqual('false');
  });

  it('get ripple returns a MDCRipple instance', () => {
    const {component} = setupTest();
    expect(component.ripple instanceof MDCRipple).toBe(true);
  });

  it('#adapter.addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('#adapter.removeClass removes a class from the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root.classList.contains('foo')).toBe(false);
  });

  it('#adapter.setAttr sets an attribute on the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any)
        .adapter.setAttr('aria-label', 'hello');
    expect(root.getAttribute('aria-label')).toEqual('hello');
  });

  it(`#adapter.notifyChange broadcasts a ${
         MDCIconButtonToggleFoundation.strings.CHANGE_EVENT} custom event`,
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('custom event handler');
       root.addEventListener(
           MDCIconButtonToggleFoundation.strings.CHANGE_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter.notifyChange({});
       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('assert keydown does not trigger ripple', () => {
    const {root} = setupTest();
    emitEvent(root, 'keydown');
    expect(root.classList.contains(cssClasses.FG_ACTIVATION)).toBe(false);
  });

  it('assert keyup does not trigger ripple', () => {
    const {root} = setupTest();
    emitEvent(root, 'keyup');
    expect(root.classList.contains(cssClasses.FG_ACTIVATION)).toBe(false);
  });

  it('click handler is added to root element', () => {
    const {root, mockFoundation} = setupTest({createMockFoundation: true});
    emitEvent(root, 'click');
    expect(mockFoundation!.handleClick).toHaveBeenCalledTimes(1);
  });

  it('click handler is removed from the root element on destroy', () => {
    const {root, component, mockFoundation} =
        setupTest({createMockFoundation: true});
    component.destroy();
    emitEvent(root, 'click');
    expect(mockFoundation!.handleClick).not.toHaveBeenCalled();
  });
});
