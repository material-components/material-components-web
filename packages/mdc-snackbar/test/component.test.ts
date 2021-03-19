/**
 * @license
 * Copyright 2018 Google Inc.
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

import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {numbers, strings} from '../constants';
import {MDCSnackbar, MDCSnackbarFoundation} from '../index';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div>
      <aside class="mdc-snackbar">
        <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
          <div class="mdc-snackbar__label" aria-atomic="false">
            Can't send photo. Retry in 5 seconds.</div>
          <div class="mdc-snackbar__actions" aria-atomic="true">
            <button type="button" class="mdc-button mdc-snackbar__action">Retry</button>
            <button class="mdc-icon-button mdc-snackbar__dismiss material-icons" title="Dismiss">close</button>
          </div>
        </div>
      </aside>
    </div>`;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function setupTest(fixture = getFixture()) {
  const root = fixture;
  const surface = fixture.querySelector(strings.SURFACE_SELECTOR)!;
  const label = fixture.querySelector(strings.LABEL_SELECTOR)!;
  const actions = fixture.querySelector('.mdc-snackbar__actions')!;
  const actionButton = fixture.querySelector(strings.ACTION_SELECTOR)!;
  const actionIcon = fixture.querySelector(strings.DISMISS_SELECTOR)!;
  const announce = jasmine.createSpy('announce');
  const component = new MDCSnackbar(root, undefined, () => announce);
  return {
    component,
    announce,
    root,
    surface,
    label,
    actions,
    actionButton,
    actionIcon
  };
}

function setupTestWithMocks(fixture = getFixture()) {
  const root = fixture;
  const surface = fixture.querySelector(strings.SURFACE_SELECTOR)!;
  const label = fixture.querySelector(strings.LABEL_SELECTOR)!;
  const actions = fixture.querySelector('.mdc-snackbar__actions')!;
  const actionButton = fixture.querySelector(strings.ACTION_SELECTOR)!;
  const actionIcon = fixture.querySelector(strings.DISMISS_SELECTOR)!;

  const mockFoundation = createMockFoundation(MDCSnackbarFoundation);
  const announce = jasmine.createSpy('announce');
  const component = new MDCSnackbar(root, mockFoundation, () => announce);

  return {
    component,
    mockFoundation,
    announce,
    root,
    surface,
    label,
    actions,
    actionButton,
    actionIcon
  };
}

describe('MDCSnackbar', () => {
  it('attachTo returns a component instance', () => {
    expect(MDCSnackbar.attachTo(getFixture()))
        .toEqual(jasmine.any(MDCSnackbar));
  });

  it('#initialSyncWithDOM registers click handlers for action button and action icon',
     () => {
       const {component, mockFoundation, actionButton, actionIcon} =
           setupTestWithMocks();
       component.open();
       emitEvent(actionButton, 'click', {bubbles: true});
       expect(mockFoundation.handleActionButtonClick)
           .toHaveBeenCalledWith(jasmine.any(Event));
       expect(mockFoundation.handleActionButtonClick).toHaveBeenCalledTimes(1);
       emitEvent(actionIcon, 'click', {bubbles: true});
       expect(mockFoundation.handleActionIconClick)
           .toHaveBeenCalledWith(jasmine.any(Event));
       expect(mockFoundation.handleActionIconClick).toHaveBeenCalledTimes(1);
       component.destroy();
     });

  it('#initialSyncWithDOM registers keydown handler on the root element',
     () => {
       const {component, mockFoundation, root} = setupTestWithMocks();
       component.open();
       emitEvent(root, 'keydown');
       expect(mockFoundation.handleKeyDown)
           .toHaveBeenCalledWith(jasmine.any(Event));
       expect(mockFoundation.handleKeyDown).toHaveBeenCalledTimes(1);
       component.destroy();
     });

  it('#destroy deregisters click handler on the root element', () => {
    const {component, mockFoundation, actionButton, actionIcon} =
        setupTestWithMocks();
    component.open();
    component.destroy();
    emitEvent(actionButton, 'click', {bubbles: true});
    expect(mockFoundation.handleActionButtonClick)
        .not.toHaveBeenCalledWith(jasmine.any(Event));
    emitEvent(actionIcon, 'click', {bubbles: true});
    expect(mockFoundation.handleActionIconClick)
        .not.toHaveBeenCalledWith(jasmine.any(Event));
  });

  it('#destroy deregisters keydown handler on the root element', () => {
    const {component, mockFoundation, root} = setupTestWithMocks();
    component.open();
    component.destroy();
    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeyDown)
        .not.toHaveBeenCalledWith(jasmine.any(Event));
  });

  it('clicking on surface does nothing', () => {
    const {component, mockFoundation, surface} = setupTestWithMocks();
    component.open();
    emitEvent(surface, 'click', {bubbles: true});
    expect(mockFoundation.handleActionButtonClick)
        .not.toHaveBeenCalledWith(jasmine.any(Event));
    expect(mockFoundation.handleActionIconClick)
        .not.toHaveBeenCalledWith(jasmine.any(Event));
    expect(mockFoundation.close).not.toHaveBeenCalledWith(jasmine.anything());
    component.destroy();
  });

  it('#open announces to screen readers', () => {
    const {component, announce, label} = setupTest();

    component.open();
    expect(announce).toHaveBeenCalledWith(label);
    expect(announce).toHaveBeenCalledTimes(1);
  });

  it('#open forwards to MDCSnackbarFoundation#open', () => {
    const {component, mockFoundation} = setupTestWithMocks();

    component.open();
    expect(mockFoundation.open).toHaveBeenCalled();
  });

  it('#close forwards to MDCSnackbarFoundation#close', () => {
    const {component, mockFoundation} = setupTestWithMocks();
    const reason = 'reason';

    component.open();
    component.close(reason);
    expect(mockFoundation.close).toHaveBeenCalledWith(reason);

    component.close();
    expect(mockFoundation.close).toHaveBeenCalledWith('');
  });

  it('get isOpen forwards to MDCSnackbarFoundation#isOpen', () => {
    const {component, mockFoundation} = setupTestWithMocks();

    component.isOpen;
    expect(mockFoundation.isOpen).toHaveBeenCalled();
  });

  it('get closeOnEscape forwards to MDCSnackbarFoundation#getCloseOnEscape',
     () => {
       const {component, mockFoundation} = setupTestWithMocks();

       component.closeOnEscape;
       expect(mockFoundation.getCloseOnEscape).toHaveBeenCalled();
     });

  it('set closeOnEscape forwards to MDCSnackbarFoundation#setCloseOnEscape',
     () => {
       const {component, mockFoundation} = setupTestWithMocks();

       component.closeOnEscape = false;
       expect(mockFoundation.setCloseOnEscape).toHaveBeenCalledWith(false);
       component.closeOnEscape = true;
       expect(mockFoundation.setCloseOnEscape).toHaveBeenCalledWith(false);
     });

  it('get timeoutMs forwards to MDCSnackbarFoundation#getTimeoutMs', () => {
    const {component, mockFoundation} = setupTestWithMocks();

    component.timeoutMs;
    expect(mockFoundation.getTimeoutMs).toHaveBeenCalled();
  });

  it('set timeoutMs forwards to MDCSnackbarFoundation#setTimeoutMs', () => {
    const {component, mockFoundation} = setupTestWithMocks();

    component.timeoutMs = numbers.MAX_AUTO_DISMISS_TIMEOUT_MS;
    expect(mockFoundation.setTimeoutMs)
        .toHaveBeenCalledWith(numbers.MAX_AUTO_DISMISS_TIMEOUT_MS);
  });

  it('get labelText returns label textContent', () => {
    const {component, label} = setupTestWithMocks();

    expect(component.labelText).toEqual(label.textContent!);
  });

  it('set labelText forwards to MDCSnackbarFoundation#setActionButtonText',
     () => {
       const {component} = setupTestWithMocks();

       component.labelText = 'foo';
       expect(component.labelText).toEqual('foo');
     });

  it('get actionButtonText returns button textContent', () => {
    const {component, actionButton} = setupTestWithMocks();

    expect(component.actionButtonText).toEqual(actionButton.textContent!);
  });

  it('set actionButtonText forwards to MDCSnackbarFoundation#setActionButtonText',
     () => {
       const {component} = setupTestWithMocks();

       component.actionButtonText = 'foo';
       expect(component.actionButtonText).toEqual('foo');
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

  it(`adapter#notifyOpening emits ${strings.OPENING_EVENT}`, () => {
    const {component} = setupTest();

    const handler = jasmine.createSpy('notifyOpeningHandler');

    component.listen(strings.OPENING_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyOpening();
    component.unlisten(strings.OPENING_EVENT, handler);

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it(`adapter#notifyOpened emits ${strings.OPENED_EVENT}`, () => {
    const {component} = setupTest();

    const handler = jasmine.createSpy('notifyOpenedHandler');

    component.listen(strings.OPENED_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyOpened();
    component.unlisten(strings.OPENED_EVENT, handler);

    expect(handler).toHaveBeenCalledWith(jasmine.anything());
  });

  it(`adapter#notifyClosing emits ${
         strings
             .CLOSING_EVENT} without action if passed action is empty string`,
     () => {
       const {component} = setupTest();

       const handler = jasmine.createSpy('notifyClosingHandler');

       component.listen(strings.CLOSING_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter.notifyClosing('');
       component.unlisten(strings.CLOSING_EVENT, handler);

       expect(handler).toHaveBeenCalledWith(
           jasmine.objectContaining({detail: {}}));
     });

  it(`adapter#notifyClosing emits ${strings.CLOSING_EVENT} with reason`, () => {
    const {component} = setupTest();
    const reason = 'reason';

    const handler = jasmine.createSpy('notifyClosingHandler');

    component.listen(strings.CLOSING_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyClosing(reason);
    component.unlisten(strings.CLOSING_EVENT, handler);

    expect(handler).toHaveBeenCalledWith(
        jasmine.objectContaining({detail: {reason}}));
  });

  it(`adapter#notifyClosed emits ${
         strings.CLOSED_EVENT} without reason if passed reason is empty string`,
     () => {
       const {component} = setupTest();

       const handler = jasmine.createSpy('notifyClosedHandler');

       component.listen(strings.CLOSED_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter.notifyClosed('');
       component.unlisten(strings.CLOSED_EVENT, handler);

       expect(handler).toHaveBeenCalledWith(
           jasmine.objectContaining({detail: {}}));
     });

  it(`adapter#notifyClosed emits ${strings.CLOSED_EVENT} with reason`, () => {
    const {component} = setupTest();
    const reason = 'reason';

    const handler = jasmine.createSpy('notifyClosedHandler');

    component.listen(strings.CLOSED_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyClosed(reason);
    component.unlisten(strings.CLOSED_EVENT, handler);

    expect(handler).toHaveBeenCalledWith(
        jasmine.objectContaining({detail: {reason}}));
  });
});
