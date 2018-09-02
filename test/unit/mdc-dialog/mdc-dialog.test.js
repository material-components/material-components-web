/**
 * @license
 * Copyright 2017 Google Inc.
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

import {assert} from 'chai';
import bel from 'bel';
import domEvents from 'dom-events';
import td from 'testdouble';
import {createMockRaf} from '../helpers/raf';
import {strings} from '../../../packages/mdc-dialog/constants';
import {MDCDialog} from '../../../packages/mdc-dialog';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';

function getFixture() {
  return bel`
    <div>
      <button class="open-dialog-button">click</button>
      <div id="test-dialog"
           class="mdc-dialog"
           role="alertdialog"
           aria-hidden="true"
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
            <footer class="mdc-dialog__actions">
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel"
                      type="button">Cancel</button>
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no"
                      type="button">No</button>
              <button class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                      type="button">Yes</button>
            </footer>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
    </div>`;
}

function setupTest() {
  const fixture = getFixture();
  const openDialogButton = fixture.querySelector('.open-dialog-button');
  const root = fixture.querySelector('.mdc-dialog');
  const component = new MDCDialog(root);
  const scrim = fixture.querySelector('.mdc-dialog__scrim');
  const container = fixture.querySelector('.mdc-dialog__container');
  const surface = fixture.querySelector('.mdc-dialog__surface');
  const title = fixture.querySelector('.mdc-dialog__title');
  const content = fixture.querySelector('.mdc-dialog__content');
  const actions = fixture.querySelector('.mdc-dialog__actions');
  const yesButton = fixture.querySelector('[data-mdc-dialog-action="yes"]');
  const noButton = fixture.querySelector('[data-mdc-dialog-action="no"]');
  const cancelButton = fixture.querySelector('[data-mdc-dialog-action="cancel"]');
  return {
    openDialogButton,
    component,
    root, scrim, container, surface, title, content, actions, yesButton, noButton, cancelButton,
  };
}

function hasClassMatcher(className) {
  return td.matchers.argThat((el) => el.classList && el.classList.contains(className));
}

suite('MDCDialog');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCDialog.attachTo(getFixture().querySelector('.mdc-dialog')) instanceof MDCDialog);
});

if (supportsCssVariables(window)) {
  test('#initialize attaches ripple elements to all footer buttons', () => {
    const raf = createMockRaf();
    const {yesButton, noButton, cancelButton} = setupTest();
    raf.flush();

    assert.isTrue(yesButton.classList.contains('mdc-ripple-upgraded'));
    assert.isTrue(noButton.classList.contains('mdc-ripple-upgraded'));
    assert.isTrue(cancelButton.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });

  test('#destroy cleans up all ripples on footer buttons', () => {
    const raf = createMockRaf();
    const {component, yesButton, noButton, cancelButton} = setupTest();
    raf.flush();

    component.destroy();
    raf.flush();

    assert.isFalse(yesButton.classList.contains('mdc-ripple-upgraded'));
    assert.isFalse(noButton.classList.contains('mdc-ripple-upgraded'));
    assert.isFalse(cancelButton.classList.contains('mdc-ripple-upgraded'));
    raf.restore();
  });
}

test('#show opens the dialog', () => {
  const {component} = setupTest();

  component.show();
  const wasOpen = component.open;
  // Deactivate focus trapping, preventing other tests that use focus from failing
  component.destroy();
  assert.isTrue(wasOpen);
});

test('#close hides the dialog', () => {
  const {component} = setupTest();

  component.close();
  assert.isFalse(component.open);
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isOk(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isNotOk(root.classList.contains('foo'));
});

test('adapter#addBodyClass adds a class to the body, locking the background scroll', () => {
  const {component} = setupTest();
  component.getDefaultFoundation().adapter_.addBodyClass('mdc-dialog--scroll-lock');
  assert.isOk(document.querySelector('body').classList.contains('mdc-dialog--scroll-lock'));
});

test('adapter#removeBodyClass adds a class to the body, locking the background scroll', () => {
  const {component} = setupTest();
  const body = document.querySelector('body');

  body.classList.add('mdc-dialog--scroll-lock');
  component.getDefaultFoundation().adapter_.removeBodyClass('mdc-dialog--scroll-lock');
  assert.isNotOk(body.classList.contains('mdc-dialog--scroll-lock'));
});

test('adapter#eventTargetHasClass returns whether or not the className is in the target\'s classList', () => {
  const {component} = setupTest();
  const target = bel`<div class="existent-class"></div>`;
  const {adapter_: adapter} = component.getDefaultFoundation();

  assert.isTrue(adapter.eventTargetHasClass(target, 'existent-class'));
  assert.isFalse(adapter.eventTargetHasClass(target, 'non-existent-class'));
});

test('adapter#eventTargetMatchesSelector returns whether or not the className is in the target\'s classList', () => {
  const {component} = setupTest();
  const target = bel`<div data-existent-attr></div>`;
  const {adapter_: adapter} = component.getDefaultFoundation();

  assert.isTrue(adapter.eventTargetMatchesSelector(target, '[data-existent-attr]'));
  assert.isFalse(adapter.eventTargetMatchesSelector(target, '[data-non-existent-attr]'));
});

test('adapter#registerInteractionHandler adds an event listener to the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterInteractionHandler removes an event listener from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');
  root.addEventListener('click', handler);

  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerDocumentHandler attaches an event listener to the document', () => {
  const {component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerDocumentHandler('keydown', handler);
  domEvents.emit(document, 'keydown');

  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterDocumentHandler detaches an event listener from the document', () => {
  const {component} = setupTest();
  const handler = td.func('eventHandler');

  document.addEventListener('keydown', handler);
  component.getDefaultFoundation().adapter_.deregisterDocumentHandler('keydown', handler);
  domEvents.emit(document, 'keydown');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('adapter#registerWindowHandler attaches an event handler to the window', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');

  component.getDefaultFoundation().adapter_.registerWindowHandler('resize', handler);
  domEvents.emit(window, 'resize');
  td.verify(handler(td.matchers.anything()));
});

test('adapter#deregisterWindowHandler detaches an event handler from the window', () => {
  const {component} = setupTest();
  const handler = td.func('resizeHandler');

  window.addEventListener('resize', handler);
  component.getDefaultFoundation().adapter_.deregisterWindowHandler('resize', handler);
  domEvents.emit(window, 'resize');
  td.verify(handler(td.matchers.anything()), {times: 0});
});

test(`adapter#notifyOpening emits ${strings.OPENING_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyOpeningHandler');

  component.listen(strings.OPENING_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyOpening();

  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyOpened emits ${strings.OPENED_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyOpenedHandler');

  component.listen(strings.OPENED_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyOpened();

  td.verify(handler(td.matchers.anything()));
});

test(`adapter#notifyClosing emits ${strings.CLOSING_EVENT} without action`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyClosingHandler');

  component.listen(strings.CLOSING_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosing();

  td.verify(handler(td.matchers.contains({detail: {action: undefined}})));
});

test(`adapter#notifyClosing emits ${strings.CLOSING_EVENT} with action`, () => {
  const {component} = setupTest();

  const handler = td.func('notifyClosingHandler');

  component.listen(strings.CLOSING_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyClosing('foo');

  td.verify(handler(td.matchers.contains({detail: {action: 'foo'}})));
});

test('adapter#trapFocusOnSurface calls activate() on a properly configured focus trap instance', () => {
  const {component} = setupTest();
  component.util_.createFocusTrapInstance = td.func('component.util_.createFocusTrapInstance');

  const fakeFocusTrapInstance = td.object({
    activate: td.func('focusTrap#activate'),
    deactivate: td.func('focusTrap#deactivate'),
  });

  td.when(component.util_.createFocusTrapInstance(hasClassMatcher('mdc-dialog__container')))
    .thenReturn(fakeFocusTrapInstance);

  component.initialize();
  component.getDefaultFoundation().adapter_.trapFocusOnSurface();

  td.verify(fakeFocusTrapInstance.activate());
});

test('adapter#untrapFocusOnSurface calls deactivate() on a properly configured focus trap instance', () => {
  const {component} = setupTest();
  component.util_.createFocusTrapInstance = td.func('component.util_.createFocusTrapInstance');

  const fakeFocusTrapInstance = td.object({
    activate: () => {},
    deactivate: () => {},
  });

  td.when(component.util_.createFocusTrapInstance(hasClassMatcher('mdc-dialog__container')))
    .thenReturn(fakeFocusTrapInstance);

  component.initialize();
  component.getDefaultFoundation().adapter_.untrapFocusOnSurface();

  td.verify(fakeFocusTrapInstance.deactivate());
});

test('adapter#fixOverflowIE calls util method with surface element', () => {
  const {component, surface} = setupTest();
  const callback = td.func('callback');
  component.util_.fixFlexItemMaxHeightBug = td.func('component.util_.fixFlexItemMaxHeightBug');

  component.getDefaultFoundation().adapter_.fixOverflowIE(callback);

  td.verify(component.util_.fixFlexItemMaxHeightBug(surface, callback));
});

test('adapter#isContentScrollable returns false when there is no content element', () => {
  const {component, content} = setupTest();
  content.parentElement.removeChild(content);
  const isContentScrollable = component.getDefaultFoundation().adapter_.isContentScrollable();
  assert.isFalse(isContentScrollable);
});

test('adapter#isContentScrollable returns false when content does not require scrolling', () => {
  const {component} = setupTest();
  const isContentScrollable = component.getDefaultFoundation().adapter_.isContentScrollable();
  assert.isFalse(isContentScrollable);
});

test('adapter#isContentScrollable returns true when content requires scrolling', () => {
  const {component, content} = setupTest();
  component.util_.isScrollable = td.func('component.util_.isScrollable');
  td.when(component.util_.isScrollable(content)).thenReturn(true);

  const isContentScrollable = component.getDefaultFoundation().adapter_.isContentScrollable();

  assert.isTrue(isContentScrollable);
});

test('adapter#areButtonsStacked returns false when tops are aligned', () => {
  const {component} = setupTest();
  const areButtonsStacked = component.getDefaultFoundation().adapter_.areButtonsStacked();
  assert.isFalse(areButtonsStacked);
});

test('adapter#areButtonsStacked returns true when tops are misaligned', () => {
  const {component} = setupTest();
  component.util_.areTopsMisaligned = td.func('component.util_.areTopsMisaligned');
  td.when(component.util_.areTopsMisaligned(td.matchers.anything())).thenReturn(true);

  const areButtonsStacked = component.getDefaultFoundation().adapter_.areButtonsStacked();

  assert.isTrue(areButtonsStacked);
});

test('adapter#getAction returns attribute value', () => {
  const {component, yesButton} = setupTest();
  const action = component.getDefaultFoundation().adapter_.getAction(yesButton);
  assert.equal(action, 'yes');
});

test('adapter#getAction returns null when attribute is not present', () => {
  const {component, title} = setupTest();
  const action = component.getDefaultFoundation().adapter_.getAction(title);
  assert.isNull(action);
});

test('#layout proxies to foundation', () => {
  const {component} = setupTest();
  component.foundation_.layout = td.func('component.foundation_.layout');
  component.layout();
  td.verify(component.foundation_.layout());
});
