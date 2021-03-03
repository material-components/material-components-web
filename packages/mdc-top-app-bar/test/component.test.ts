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

import {MDCRipple} from '../../mdc-ripple/component';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {strings} from '../constants';
import {MDCFixedTopAppBarFoundation} from '../fixed/foundation';
import {MDCTopAppBar} from '../index';
import {MDCShortTopAppBarFoundation} from '../short/foundation';
import {MDCTopAppBarFoundation} from '../standard/foundation';

function getFixture(removeIcon = false) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div>
      <header class="mdc-top-app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
          <span class="mdc-top-app-bar__title">Title</span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
        role="top-app-bar">
          <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Download" alt="Download">
          file_download</a>
          <a href="#" class="material-icons mdc-top-app-bar__action-item"
             aria-label="Print this page" alt="Print this page">
          print</a>
          <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Bookmark this page"
          alt="Bookmark this page">bookmark</a>
          <div class="mdc-menu-anchor">
            <div class="mdc-menu" tabindex="-1" id="demo-menu">
              <ul class="mdc-menu__items mdc-list" role="menu" aria-hidden="true" style="transform: scale(1, 1);">
              </ul>
            </div>
          </section>
        </div>
      </header>
      <main class="mdc-top-app-bar-fixed-adjust">
      </main>
    </div>
  `;

  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);

  if (removeIcon) {
    const icon =
        el.querySelector(strings.NAVIGATION_ICON_SELECTOR) as HTMLElement;
    (icon.parentNode as HTMLElement).removeChild(icon);
  }

  return el;
}

class FakeRipple {
  destroy: Function = jasmine.createSpy('.destroy');
  unbounded: boolean|null = null;
}

function setupTest(
    removeIcon = false,
    rippleFactory = () => new FakeRipple()) {
  const fixture = getFixture(removeIcon);
  const root = fixture.querySelector(strings.ROOT_SELECTOR) as HTMLElement;
  const mockFoundation = createMockFoundation(MDCTopAppBarFoundation);
  mockFoundation.handleNavigationClick = jasmine.createSpy();
  mockFoundation.handleTargetScroll = jasmine.createSpy();
  mockFoundation.handleWindowResize = jasmine.createSpy();

  const icon =
      root.querySelector(strings.NAVIGATION_ICON_SELECTOR) as HTMLElement;
  const component = new MDCTopAppBar(root, mockFoundation, rippleFactory);

  return {root, component, icon, mockFoundation, fixture};
}

describe('MDCTopAppBar', () => {
  it('attachTo initializes and returns an MDCTopAppBar instance', () => {
    expect(MDCTopAppBar.attachTo(getFixture()) instanceof MDCTopAppBar)
        .toBe(true);
  });

  it('constructor instantiates icon ripples for all icons', () => {
    const rippleFactory = jasmine.createSpy('');
    rippleFactory.withArgs(jasmine.anything())
        .and.callFake(() => new FakeRipple());
    setupTest(/** removeIcon */ false, rippleFactory);
  });

  it('constructor does not instantiate ripple for nav icon when not present',
     () => {
       const rippleFactory = jasmine.createSpy('');
       rippleFactory.withArgs(jasmine.anything())
           .and.callFake(() => new FakeRipple());
       setupTest(/** removeIcon */ true, rippleFactory);
     });

  it('navIcon click event calls #foundation.handleNavigationClick', () => {
    const {root, mockFoundation} = setupTest();
    const navIcon =
        root.querySelector('.mdc-top-app-bar__navigation-icon') as HTMLElement;
    emitEvent(navIcon, 'click');
    expect(mockFoundation.handleNavigationClick).toHaveBeenCalledTimes(1);
  });

  it('scroll event triggers #foundation.handleTargetScroll', () => {
    const {mockFoundation} = setupTest();
    emitEvent(window, 'scroll');
    expect(mockFoundation.handleTargetScroll).toHaveBeenCalledTimes(1);
  });

  it('resize event triggers #foundation.handleWindowResize', () => {
    const {mockFoundation} = setupTest();
    emitEvent(window, 'resize');
    expect(mockFoundation.handleWindowResize).toHaveBeenCalledTimes(1);
  });

  it('destroy destroys icon ripples', () => {
    const {component} = setupTest();
    component.destroy();
    (component as any).iconRipples_.forEach((icon: MDCRipple) => {
      expect(icon.destroy).toHaveBeenCalled();
    });
  });

  it('destroy destroys scroll event handler', () => {
    const {mockFoundation, component} = setupTest();
    component.destroy();
    emitEvent(window, 'scroll');
    expect(mockFoundation.handleTargetScroll).not.toHaveBeenCalled();
  });

  it('destroy destroys resize event handler', () => {
    const {mockFoundation, component} = setupTest();
    component.destroy();
    emitEvent(window, 'resize');
    expect(mockFoundation.handleWindowResize).not.toHaveBeenCalled();
  });

  it('destroy destroys handleNavigationClick handler', () => {
    const {mockFoundation, component, root} = setupTest();
    const navIcon =
        root.querySelector('.mdc-top-app-bar__navigation-icon') as HTMLElement;
    component.destroy();
    emitEvent(navIcon, 'resize');
    expect(mockFoundation.handleNavigationClick).not.toHaveBeenCalled();
  });

  it('#setScrollTarget deregisters and registers scroll handler on provided target',
     () => {
       const {component} = setupTest();
       const fakeTarget1 = document.createElement('div');
       const fakeTarget2 = document.createElement('div');

       component.setScrollTarget(fakeTarget1);
       expect((component as any).scrollTarget_).toEqual(fakeTarget1);

       component.setScrollTarget(fakeTarget2);

       expect((component as any).scrollTarget_).toEqual(fakeTarget2);
     });

  it('getDefaultFoundation returns the appropriate foundation for default',
     () => {
       const fixture = getFixture();
       const root = fixture.querySelector(strings.ROOT_SELECTOR) as HTMLElement;
       const component = new MDCTopAppBar(
           root, undefined, () => new FakeRipple());
       expect((component as any).foundation instanceof MDCTopAppBarFoundation)
           .toBe(true);
       expect(
           (component as any).foundation instanceof
           MDCShortTopAppBarFoundation)
           .toBe(false);
       expect(
           (component as any).foundation instanceof
           MDCFixedTopAppBarFoundation)
           .toBe(false);
     });

  it('getDefaultFoundation returns the appropriate foundation for fixed',
     () => {
       const fixture = getFixture();
       const root = fixture.querySelector(strings.ROOT_SELECTOR) as HTMLElement;
       root.classList.add(MDCTopAppBarFoundation.cssClasses.FIXED_CLASS);
       const component = new MDCTopAppBar(
           root, undefined, () => new FakeRipple());
       expect(
           (component as any).foundation instanceof
           MDCShortTopAppBarFoundation)
           .toBe(false);
       expect(
           (component as any).foundation instanceof
           MDCFixedTopAppBarFoundation)
           .toBe(true);
     });

  it('getDefaultFoundation returns the appropriate foundation for short',
     () => {
       const fixture = getFixture();
       const root = fixture.querySelector(strings.ROOT_SELECTOR) as HTMLElement;
       root.classList.add(MDCTopAppBarFoundation.cssClasses.SHORT_CLASS);
       const component = new MDCTopAppBar(
           root, undefined, () => new FakeRipple());
       expect(
           (component as any).foundation instanceof
           MDCShortTopAppBarFoundation)
           .toBe(true);
       expect(
           (component as any).foundation instanceof
           MDCFixedTopAppBarFoundation)
           .toBe(false);
     });

  it('adapter#hasClass returns true if the root element has specified class',
     () => {
       const {root, component} = setupTest();
       root.classList.add('foo');
       expect(
           (component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(true);
     });

  it('adapter#hasClass returns false if the root element does not have specified class',
     () => {
       const {component} = setupTest();
       expect(
           (component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(false);
     });

  it('adapter#addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter.addClass('foo');
    expect(root.classList.contains('foo')).toBe(true);
  });

  it('adapter#removeClass removes a class from the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter.removeClass('foo');
    expect(root.classList.contains('foo')).toBe(false);
  });

  it('adapter#setStyle sets a style attribute on the root element', () => {
    const {root, component} = setupTest();
    expect(root.style.getPropertyValue('top') === '1px').toBe(false);
    (component.getDefaultFoundation() as any).adapter.setStyle('top', '1px');
    expect(root.style.getPropertyValue('top') === '1px').toBe(true);
  });

  it('adapter#getViewportScrollY returns scroll distance', () => {
    const {component} = setupTest();
    expect(
        (component.getDefaultFoundation() as any).adapter.getViewportScrollY())
        .toEqual(window.pageYOffset);
  });

  it('adapter#getViewportScrollY returns scroll distance when scrollTarget_ is not window',
     () => {
       const {component} = setupTest();
       const mockContent = {addEventListener: () => {}, scrollTop: 20} as any;
       component.setScrollTarget(mockContent);
       expect((component.getDefaultFoundation() as any)
                  .adapter.getViewportScrollY())
           .toEqual(mockContent.scrollTop);
     });

  it('adapter#getTotalActionItems returns the number of action items on the opposite side of the menu',
     () => {
       const {root, component} = setupTest();
       const adapterReturn = (component.getDefaultFoundation() as any)
                                 .adapter.getTotalActionItems();
       const actual =
           root.querySelectorAll(strings.ACTION_ITEM_SELECTOR).length;
       expect(adapterReturn).toEqual(actual);
     });

  it('adapter#notifyNavigationIconClicked emits the NAVIGATION_EVENT', () => {
    const {component} = setupTest();
    const callback = jasmine.createSpy('');
    component.listen(strings.NAVIGATION_EVENT, callback);
    (component.getDefaultFoundation() as any)
        .adapter.notifyNavigationIconClicked();
    expect(callback).toHaveBeenCalledWith(jasmine.any(Object));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
