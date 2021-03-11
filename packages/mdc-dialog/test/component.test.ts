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

import {supportsCssVariables} from '../../mdc-ripple/util';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {strings, numbers} from '../constants';
import {MDCDialog, MDCDialogFoundation, util} from '../index';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div>
      <button class="open-dialog-button">click</button>
      <div id="test-dialog"
           class="mdc-dialog"
           role="alertdialog"
           aria-labelledby="test-dialog-label"
           aria-describedby="test-dialog-description">
        <div class="mdc-dialog__container">
          <div class="mdc-dialog__surface">
            <h2 class="mdc-dialog__title">
              Use Google's location service?
            </h2>
            <section class="mdc-dialog__content">
              Let Google help apps determine location.
            </section>
            <div class="mdc-dialog__actions">
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel" type="button">
                <span class="mdc-button__label">Cancel</span>
              </button>
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no" type="button">
                <span class="mdc-button__label">No</span>
              </button>
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes" type="button" ${strings.INITIAL_FOCUS_ATTRIBUTE}>
                <span class="mdc-button__label">Yes</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
    </div>`;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function setupTest(fixture = getFixture()) {
  const root = fixture.querySelector('.mdc-dialog') as HTMLElement;
  const component = new MDCDialog(root);
  const title = fixture.querySelector('.mdc-dialog__title') as HTMLElement;
  const content = fixture.querySelector('.mdc-dialog__content') as HTMLElement;
  const actions = fixture.querySelector('.mdc-dialog__actions') as HTMLElement;
  const yesButton =
      fixture.querySelector('[data-mdc-dialog-action="yes"]') as HTMLElement;
  const noButton =
      fixture.querySelector('[data-mdc-dialog-action="no"]') as HTMLElement;
  const cancelButton =
      fixture.querySelector('[data-mdc-dialog-action="cancel"]') as HTMLElement;
  return {
    root,
    component,
    title,
    content,
    actions,
    yesButton,
    noButton,
    cancelButton
  };
}

function setupTestWithMocks() {
  const root = getFixture();

  const mockFoundation = createMockFoundation(MDCDialogFoundation);
  const mockFocusTrapInstance =
      jasmine.createSpyObj('focusTrap', ['trapFocus', 'releaseFocus']);

  const component =
      new MDCDialog(root, mockFoundation, () => mockFocusTrapInstance);
  return {root, component, mockFoundation, mockFocusTrapInstance};
}

describe('MDCDialog', () => {
  setUpMdcTestEnvironment();

  it('attachTo returns a component instance', () => {
    expect(MDCDialog.attachTo(
               getFixture().querySelector('.mdc-dialog') as HTMLElement))
        .toEqual(jasmine.any(MDCDialog));
  });

  it('attachTo throws an error when container element is missing', () => {
    const fixture = getFixture();
    const container =
        fixture.querySelector('.mdc-dialog__container') as HTMLElement;
    container.parentElement!.removeChild(container);
    expect(
        () => MDCDialog.attachTo(
            fixture.querySelector('.mdc-dialog') as HTMLElement))
        .toThrow();
  });

  it('#initialSyncWithDOM registers click handler on the root element', () => {
    const {root, component, mockFoundation} = setupTestWithMocks();
    emitEvent(root, 'click');
    expect(mockFoundation.handleClick).toHaveBeenCalledWith(jasmine.any(Event));
    expect(mockFoundation.handleClick).toHaveBeenCalledTimes(1);
    component.destroy();
  });

  it('#initialSyncWithDOM registers keydown handler on the root element',
     () => {
       const {root, component, mockFoundation} = setupTestWithMocks();
       emitEvent(root, 'keydown');
       expect(mockFoundation.handleKeydown)
           .toHaveBeenCalledWith(jasmine.any(Event));
       expect(mockFoundation.handleKeydown).toHaveBeenCalledTimes(1);
       component.destroy();
     });

  it('#destroy deregisters click handler on the root element', () => {
    const {root, component, mockFoundation} = setupTestWithMocks();
    component.destroy();
    emitEvent(root, 'click');
    expect(mockFoundation.handleClick)
        .not.toHaveBeenCalledWith(jasmine.any(Event));
  });

  it('#destroy deregisters keydown handler on the root element', () => {
    const {root, component, mockFoundation} = setupTestWithMocks();
    component.destroy();
    emitEvent(root, 'keydown');
    expect(mockFoundation.handleKeydown)
        .not.toHaveBeenCalledWith(jasmine.any(Event));
  });

  it(`${strings.OPENING_EVENT} registers document keydown handler and ${
         strings.CLOSING_EVENT} deregisters it`,
     () => {
       const {root, mockFoundation} = setupTestWithMocks();
       emitEvent(root, strings.OPENING_EVENT);
       emitEvent(document, 'keydown');
       expect(mockFoundation.handleDocumentKeydown)
           .toHaveBeenCalledWith(jasmine.any(Event));
       expect(mockFoundation.handleDocumentKeydown).toHaveBeenCalledTimes(1);

       emitEvent(root, strings.CLOSING_EVENT);
       emitEvent(document, 'keydown');
       expect(mockFoundation.handleDocumentKeydown)
           .toHaveBeenCalledWith(jasmine.any(Event));
       expect(mockFoundation.handleDocumentKeydown).toHaveBeenCalledTimes(1);
     });

  it('#initialize attaches ripple elements to all footer buttons', function() {
    if (!supportsCssVariables(window, true)) {
      return;
    }

    const {yesButton, noButton, cancelButton} = setupTest();
    jasmine.clock().tick(1);

    expect(yesButton.classList.contains('mdc-ripple-upgraded')).toBe(true);
    expect(noButton.classList.contains('mdc-ripple-upgraded')).toBe(true);
    expect(cancelButton.classList.contains('mdc-ripple-upgraded')).toBe(true);
  });

  it('#destroy cleans up all ripples on footer buttons', function() {
    if (!supportsCssVariables(window, true)) {
      return;
    }

    const {component, yesButton, noButton, cancelButton} = setupTest();
    jasmine.clock().tick(1);

    component.destroy();
    jasmine.clock().tick(1);

    expect(yesButton.classList.contains('mdc-ripple-upgraded')).toBe(false);
    expect(noButton.classList.contains('mdc-ripple-upgraded')).toBe(false);
    expect(cancelButton.classList.contains('mdc-ripple-upgraded')).toBe(false);
  });

  it('#open forwards to MDCDialogFoundation#open', () => {
    const {component, mockFoundation} = setupTestWithMocks();

    component.open();
    expect(mockFoundation.open).toHaveBeenCalled();
  });

  it('#close forwards to MDCDialogFoundation#close', () => {
    const {component, mockFoundation} = setupTestWithMocks();
    const action = 'action';

    component.close(action);
    expect(mockFoundation.close).toHaveBeenCalledWith(action);

    component.close();
    expect(mockFoundation.close).toHaveBeenCalledWith('');
  });

  it('get isOpen forwards to MDCDialogFoundation#isOpen', () => {
    const {component, mockFoundation} = setupTestWithMocks();

    component.isOpen;
    expect(mockFoundation.isOpen).toHaveBeenCalled();
  });

  it('get escapeKeyAction forwards to MDCDialogFoundation#getEscapeKeyAction',
     () => {
       const {component, mockFoundation} = setupTestWithMocks();

       component.escapeKeyAction;
       expect(mockFoundation.getEscapeKeyAction).toHaveBeenCalled();
     });

  it('set escapeKeyAction forwards to MDCDialogFoundation#setEscapeKeyAction',
     () => {
       const {component, mockFoundation} = setupTestWithMocks();

       component.escapeKeyAction = 'action';
       expect(mockFoundation.setEscapeKeyAction).toHaveBeenCalledWith('action');
     });

  it('get scrimClickAction forwards to MDCDialogFoundation#getScrimClickAction',
     () => {
       const {component, mockFoundation} = setupTestWithMocks();

       component.scrimClickAction;
       expect(mockFoundation.getScrimClickAction).toHaveBeenCalled();
     });

  it('set scrimClickAction forwards to MDCDialogFoundation#setScrimClickAction',
     () => {
       const {component, mockFoundation} = setupTestWithMocks();

       component.scrimClickAction = 'action';
       expect(mockFoundation.setScrimClickAction)
           .toHaveBeenCalledWith('action');
     });

  it('get autoStackButtons forwards to MDCDialogFoundation#getAutoStackButtons',
     () => {
       const {component, mockFoundation} = setupTestWithMocks();

       component.autoStackButtons;
       expect(mockFoundation.getAutoStackButtons).toHaveBeenCalled();
     });

  it('set autoStackButtons forwards to MDCDialogFoundation#setAutoStackButtons',
     () => {
       const {component, mockFoundation} = setupTestWithMocks();

       component.autoStackButtons = false;
       expect(mockFoundation.setAutoStackButtons).toHaveBeenCalledWith(false);
     });

  it('autoStackButtons adds scrollable class', () => {
    const fixture = getFixture();
    const root = fixture.querySelector('.mdc-dialog') as HTMLElement;
    const content = root.querySelector('.mdc-dialog__content') as HTMLElement;

    // Simulate a scrollable content area
    content.innerHTML = new Array(100).join(`<p>${content.textContent}</p>`);
    content.style.height = '50px';
    content.style.overflow = 'auto';

    document.body.appendChild(fixture);

    try {
      const component = new MDCDialog(root);
      component.autoStackButtons = false;
      component.open();
      jasmine.clock().tick(1);
      jasmine.clock().tick(1);

      expect(root.classList.contains('mdc-dialog--scrollable')).toBe(true);
    } finally {
      document.body.removeChild(fixture);
    }
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

  it('adapter#hasClass returns whether a class exists on the root element',
     () => {
       const {root, component} = setupTest();
       root.classList.add('foo');
       expect(
           (component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(true);
       expect((component.getDefaultFoundation() as any)
                  .adapter.hasClass('does-not-exist'))
           .toBe(false);
     });

  it('adapter#addBodyClass adds a class to the body', () => {
    const {component} = setupTest();
    (component.getDefaultFoundation() as any)
        .adapter.addBodyClass('mdc-dialog--scroll-lock');
    expect((document.querySelector('body') as HTMLElement)
               .classList.contains('mdc-dialog--scroll-lock'))
        .toBe(true);
  });

  it('adapter#removeBodyClass removes a class from the body', () => {
    const {component} = setupTest();
    const body = document.querySelector('body') as HTMLElement;

    body.classList.add('mdc-dialog--scroll-lock');
    (component.getDefaultFoundation() as any)
        .adapter.removeBodyClass('mdc-dialog--scroll-lock');
    expect(body.classList.contains('mdc-dialog--scroll-lock')).toBe(false);
  });

  it('adapter#eventTargetMatches returns whether or not the target matches the selector',
     () => {
       const {component} = setupTest();
       const target = document.createElement('div');
       target.classList.add('existent-class');
       const {adapter: adapter} = component.getDefaultFoundation() as any;

       expect(adapter.eventTargetMatches(target, '.existent-class')).toBe(true);
       expect(adapter.eventTargetMatches(target, '.non-existent-class'))
           .toBe(false);
       expect(adapter.eventTargetMatches(null, '.existent-class')).toBe(false);
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

  it(`adapter#notifyClosing emits ${strings.CLOSING_EVENT} with action`, () => {
    const {component} = setupTest();
    const action = 'action';

    const handler = jasmine.createSpy('notifyClosingHandler');

    component.listen(strings.CLOSING_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyClosing(action);
    component.unlisten(strings.CLOSING_EVENT, handler);

    expect(handler).toHaveBeenCalledWith(
        jasmine.objectContaining({detail: {action}}));
  });

  it(`adapter#notifyClosed emits ${
         strings.CLOSED_EVENT} without action if passed action is empty string`,
     () => {
       const {component} = setupTest();

       const handler = jasmine.createSpy('notifyClosedHandler');

       component.listen(strings.CLOSED_EVENT, handler);
       (component.getDefaultFoundation() as any).adapter.notifyClosed('');
       component.unlisten(strings.CLOSED_EVENT, handler);

       expect(handler).toHaveBeenCalledWith(
           jasmine.objectContaining({detail: {}}));
     });

  it(`adapter#notifyClosed emits ${strings.CLOSED_EVENT} with action`, () => {
    const {component} = setupTest();
    const action = 'action';

    const handler = jasmine.createSpy('notifyClosedHandler');

    component.listen(strings.CLOSED_EVENT, handler);
    (component.getDefaultFoundation() as any).adapter.notifyClosed(action);
    component.unlisten(strings.CLOSED_EVENT, handler);

    expect(handler).toHaveBeenCalledWith(
        jasmine.objectContaining({detail: {action}}));
  });

  it('adapter#trapFocus calls trapFocus() on a properly configured focus trap instance',
     () => {
       const {component, mockFocusTrapInstance} = setupTestWithMocks();
       component.initialize();
       (component.getDefaultFoundation() as any).adapter.trapFocus();

       expect(mockFocusTrapInstance.trapFocus).toHaveBeenCalled();
     });

  it('adapter#releaseFocus calls releaseFocus() on a properly configured focus trap instance',
     () => {
       const {component, mockFocusTrapInstance} = setupTestWithMocks();
       component.initialize();
       (component.getDefaultFoundation() as any).adapter.releaseFocus();

       expect(mockFocusTrapInstance.releaseFocus).toHaveBeenCalled();
     });

  it('adapter#isContentScrollable returns false when there is no content element',
     () => {
       const {component, content} = setupTest();
       content.parentElement!.removeChild(content);
       const isContentScrollable = (component.getDefaultFoundation() as any)
                                       .adapter.isContentScrollable();
       expect(isContentScrollable).toBe(false);
     });

  it('adapter#isContentScrollable returns result of util.isScrollable', () => {
    const {component, content} = setupTest();
    expect((component.getDefaultFoundation() as any)
               .adapter.isContentScrollable())
        .toBe(util.isScrollable(content));
  });

  it('adapter#areButtonsStacked returns result of util.areTopsMisaligned',
     () => {
       const {component, yesButton, noButton, cancelButton} = setupTest();
       expect((component.getDefaultFoundation() as any)
                  .adapter.areButtonsStacked())
           .toBe(util.areTopsMisaligned([yesButton, noButton, cancelButton]));
     });

  it('adapter#getActionFromEvent returns an empty string when no event target is present',
     () => {
       const {component} = setupTest();
       const action = (component.getDefaultFoundation() as any)
                          .adapter.getActionFromEvent({});
       expect(action).toEqual('');
     });

  it('adapter#getActionFromEvent returns attribute value on event target',
     () => {
       const {component, yesButton} = setupTest();
       const action = (component.getDefaultFoundation() as any)
                          .adapter.getActionFromEvent({target: yesButton});
       expect(action).toEqual('yes');
     });

  it('adapter#getActionFromEvent returns attribute value on parent of event target',
     () => {
       const {component, yesButton} = setupTest();
       const childEl = document.createElement('span');
       yesButton.appendChild(childEl);
       const action = (component.getDefaultFoundation() as any)
                          .adapter.getActionFromEvent({target: childEl});
       expect(action).toEqual('yes');
     });

  it('adapter#getActionFromEvent returns null when attribute is not present',
     () => {
       const {component, title} = setupTest();
       const action = (component.getDefaultFoundation() as any)
                          .adapter.getActionFromEvent({target: title});
       expect(action).toBe(null);
     });

  it(`adapter#clickDefaultButton invokes click() on button matching ${
         strings.BUTTON_DEFAULT_ATTRIBUTE}`,
     () => {
       const fixture = getFixture();
       const yesButton = fixture.querySelector(
                             '[data-mdc-dialog-action="yes"]') as HTMLElement;
       yesButton.setAttribute(strings.BUTTON_DEFAULT_ATTRIBUTE, 'true');

       const {component} = setupTest(fixture);
       yesButton.click = jasmine.createSpy('click');

       (component.getDefaultFoundation() as any).adapter.clickDefaultButton();
       expect(yesButton.click).toHaveBeenCalled();
     });

  it(`adapter#clickDefaultButton does nothing if nothing matches ${
         strings.BUTTON_DEFAULT_ATTRIBUTE}`,
     () => {
       const {component, yesButton, noButton} = setupTest();
       yesButton.click = jasmine.createSpy('click');
       noButton.click = jasmine.createSpy('click');

       expect(
           () => (component.getDefaultFoundation() as any)
                     .adapter.clickDefaultButton)
           .not.toThrow();
       expect(yesButton.click).not.toHaveBeenCalled();
       expect(noButton.click).not.toHaveBeenCalled();
     });

  it('adapter#reverseButtons reverses the order of children under the actions element',
     () => {
       const {component, actions, yesButton, noButton, cancelButton} =
           setupTest();
       (component.getDefaultFoundation() as any).adapter.reverseButtons();
       expect([
         yesButton, noButton, cancelButton
       ]).toEqual([].slice.call(actions.children));
     });

  it('#layout proxies to foundation', () => {
    const {component} = setupTest();
    (component as any).foundation.layout =
        jasmine.createSpy('component.foundation.layout');
    component.layout();
    expect((component as any).foundation.layout).toHaveBeenCalled();
  });

  it(`Button with ${strings.INITIAL_FOCUS_ATTRIBUTE} will be focused when the dialog is opened, with multiple initial focus buttons in DOM`, () => {
    const {root: root1, component: component1, yesButton: yesButton1} = setupTest();
    const {root: root2, component: component2, yesButton: yesButton2} = setupTest();

    expect(yesButton1.hasAttribute(strings.INITIAL_FOCUS_ATTRIBUTE)).toBe(true);
    expect(yesButton2.hasAttribute(strings.INITIAL_FOCUS_ATTRIBUTE)).toBe(true);

    try {
      document.body.appendChild(root1)
      document.body.appendChild(root2)

      component1.open()
      jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS + 10);
      expect(document.activeElement).toEqual(yesButton1);
      component1.close()
      jasmine.clock().tick(numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);

      component2.open()
      jasmine.clock().tick(numbers.DIALOG_ANIMATION_OPEN_TIME_MS + 10);
      expect(document.activeElement).toEqual(yesButton2);
      component2.close()
      jasmine.clock().tick(numbers.DIALOG_ANIMATION_CLOSE_TIME_MS);
    } finally {
      document.body.removeChild(root1)
      document.body.removeChild(root2)
    }
  });
});
