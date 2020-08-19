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

import {getFixture} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {CloseReason, cssClasses, events, numbers, selectors} from '../constants';
import {MDCBanner} from '../index';

function setupTest(fixture: HTMLElement) {
  const contentEl = fixture.querySelector(selectors.CONTENT)!;
  const textEl = fixture.querySelector(selectors.TEXT)!;
  const primaryActionEl = fixture.querySelector(selectors.PRIMARY_ACTION)!;
  const secondaryActionEl = fixture.querySelector(selectors.SECONDARY_ACTION)!;
  const component = new MDCBanner(fixture);

  return {
    component,
    contentEl,
    primaryActionEl,
    textEl,
    secondaryActionEl,
  };
}

describe('MDCBanner', () => {
  setUpMdcTestEnvironment();

  let fixture: HTMLElement;

  beforeEach(() => {
    fixture = getFixture(`<div>
      <div class="mdc-banner" role="banner">
        <div class="mdc-banner__content">
          <div class="mdc-banner__text"
               role="status"
               aria-live="assertive">
            Single line banner.
          </div>
          <div class="mdc-banner__actions">
            <button type="button" class="mdc-button mdc-banner__secondary-action">
              <div class="mdc-button__ripple"></div>
              <div class="mdc-button__label">Learn more</div>
            </button>
            <button type="button" class="mdc-button mdc-banner__primary-action">
              <div class="mdc-button__ripple"></div>
              <div class="mdc-button__label">Fix it</div>
            </button>
          </div>
        </div>
      </div>
    </div>`);
    document.body.appendChild(fixture);
  });

  afterEach(() => {
    document.body.removeChild(fixture);
  });

  it('attachTo returns a component instance', () => {
    expect(MDCBanner.attachTo(fixture)).toEqual(jasmine.any(MDCBanner));
  });

  it('#initialize registers click handlers for primary action button', () => {
    const {component, primaryActionEl} = setupTest(fixture);
    const handler = jasmine.createSpy('notifyClosingHandler');

    component.open();
    component.listen(events.CLOSING, handler);
    emitEvent(primaryActionEl, 'click', {bubbles: true});
    component.unlisten(events.CLOSING, handler);

    expect(handler).toHaveBeenCalledWith(
        jasmine.objectContaining({detail: {reason: CloseReason.PRIMARY}}));
  });

  it('#initialize registers click handlers for secondary action button', () => {
    const {component, secondaryActionEl} = setupTest(fixture);
    const handler = jasmine.createSpy('notifyClosingHandler');

    component.open();
    component.listen(events.CLOSING, handler);
    emitEvent(secondaryActionEl, 'click', {bubbles: true});
    component.unlisten(events.CLOSING, handler);

    expect(handler).toHaveBeenCalledWith(
        jasmine.objectContaining({detail: {reason: CloseReason.SECONDARY}}));
  });

  it('#initialSyncWithDom adds a click event listener on the content element',
     () => {
       const contentEl =
           fixture.querySelector('.mdc-banner__content') as HTMLElement;
       spyOn(contentEl, 'addEventListener').and.callThrough();
       const component = MDCBanner.attachTo(fixture);

       component.open();
       expect(contentEl.addEventListener)
           .toHaveBeenCalledWith('click', jasmine.any(Function));
     });

  it('#destroy removes the click event listener on the content element', () => {
    const {component, contentEl} = setupTest(fixture);
    spyOn(contentEl, 'removeEventListener').and.callThrough();

    component.destroy();
    expect(contentEl.removeEventListener)
        .toHaveBeenCalledWith('click', jasmine.any(Function));
  });

  it('clicking on content element does nothing', () => {
    const {component, contentEl} = setupTest(fixture);
    const handler = jasmine.createSpy('notifyClosingHandler');

    component.open();
    component.listen(events.CLOSING, handler);
    emitEvent(contentEl, 'click', {bubbles: true});
    component.unlisten(events.CLOSING, handler);

    expect(handler).not.toHaveBeenCalled();
  });

  it('#open emits opening animation events and adds/removes necessary classes',
     () => {
       const {component} = setupTest(fixture);
       const openingHandler = jasmine.createSpy('notifyOpeningHandler');
       const openedHandler = jasmine.createSpy('notifyOpenedHandler');

       component.listen(events.OPENING, openingHandler);
       component.listen(events.OPENED, openedHandler);
       component.open();
       expect(openingHandler).toHaveBeenCalled();
       expect(fixture.classList.contains(cssClasses.OPENING)).toBe(true);
       expect(fixture.classList.contains(cssClasses.CLOSING)).toBe(false);
       jasmine.clock().tick(1);
       expect(fixture.classList.contains(cssClasses.OPEN)).toBe(true);
       jasmine.clock().tick(numbers.BANNER_ANIMATION_OPEN_TIME_MS);
       expect(openedHandler).toHaveBeenCalled();
       expect(fixture.classList.contains(cssClasses.OPENING)).toBe(false);
       component.unlisten(events.OPENING, openingHandler);
       component.unlisten(events.OPENED, openedHandler);
     });

  it('#close emits closing animation events and adds/removes necessary classes',
     () => {
       const {component} = setupTest(fixture);
       component.open();
       const closingHandler = jasmine.createSpy('notifyClosingHandler');
       const closedHandler = jasmine.createSpy('notifyClosedHandler');

       component.listen(events.CLOSING, closingHandler);
       component.listen(events.CLOSED, closedHandler);
       component.close(CloseReason.UNSPECIFIED);
       expect(closingHandler).toHaveBeenCalled();
       expect(fixture.classList.contains(cssClasses.CLOSING)).toBe(true);
       expect(fixture.classList.contains(cssClasses.OPEN)).toBe(false);
       expect(fixture.classList.contains(cssClasses.OPENING)).toBe(false);
       jasmine.clock().tick(numbers.BANNER_ANIMATION_CLOSE_TIME_MS);
       expect(closedHandler).toHaveBeenCalled();
       expect(fixture.classList.contains(cssClasses.CLOSING)).toBe(false);
       component.unlisten(events.CLOSING, closingHandler);
       component.unlisten(events.CLOSED, closedHandler);
     });

  it('#open sets the root element height to the content element height', () => {
    const {component, contentEl} = setupTest(fixture);

    component.open();
    jasmine.clock().tick(1);
    expect(fixture.offsetHeight)
        .toEqual((contentEl as HTMLElement).offsetHeight);
  });

  it('#close sets the root element height back to 0', () => {
    const {component} = setupTest(fixture);
    component.open();

    component.close(CloseReason.UNSPECIFIED);
    expect(fixture.offsetHeight).toEqual(0);
  });

  it('get isOpen returns true when open', () => {
    const {component} = setupTest(fixture);

    component.open();
    expect(component.isOpen).toBe(true);
  });

  it('get isOpen returns false when not open', () => {
    const {component} = setupTest(fixture);

    expect(component.isOpen).toBe(false);
  });

  it('getText returns textContent', () => {
    const {component, textEl} = setupTest(fixture);

    expect(component.getText()).toEqual(textEl.textContent!);
  });

  it('setText sets the text textContent', () => {
    const {component} = setupTest(fixture);

    component.setText('foo');
    expect(component.getText()).toEqual('foo');
  });

  it('getPrimaryActionText returns the primary button textContent', () => {
    const {component, primaryActionEl} = setupTest(fixture);

    expect(component.getPrimaryActionText())
        .toEqual(primaryActionEl.textContent!);
  });

  it('setPrimaryActionText sets the primary button textContent', () => {
    const {component} = setupTest(fixture);

    component.setPrimaryActionText('foo');
    expect(component.getPrimaryActionText()).toEqual('foo');
  });

  it('getSecondaryActionText returns the secondary button textContent', () => {
    const {component, secondaryActionEl} = setupTest(fixture);

    expect(component.getSecondaryActionText())
        .toEqual(secondaryActionEl.textContent!);
  });

  it('getSecondaryActionText returns null if no secondary action', () => {
    fixture = getFixture(`<div>
      <div class="mdc-banner" role="banner">
        <div class="mdc-banner__content">
          <div class="mdc-banner__text"
               role="status"
               aria-live="assertive">
            Single line banner.
          </div>
          <div class="mdc-banner__actions">
            <button type="button" class="mdc-button mdc-banner__primary-action">
              <div class="mdc-button__ripple"></div>
              <div class="mdc-button__label">Fix it</div>
            </button>
          </div>
        </div>
      </div>
    </div>`);
    document.body.appendChild(fixture);
    const component = MDCBanner.attachTo(fixture);

    expect(component.getSecondaryActionText()).toEqual(null);
  });

  it('setSecondaryActionText sets the secondary button textContent', () => {
    const {component} = setupTest(fixture);

    component.setSecondaryActionText('foo');
    expect(component.getSecondaryActionText()).toEqual('foo');
  });
});
