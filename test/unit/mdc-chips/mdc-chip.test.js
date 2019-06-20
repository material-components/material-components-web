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

import bel from 'bel';
import {assert} from 'chai';
import domEvents from 'dom-events';
import td from 'testdouble';

import {MDCRipple} from '../../../packages/mdc-ripple/index';
import {MDCChip, MDCChipFoundation} from '../../../packages/mdc-chips/chip/index';

const {CHECKMARK_SELECTOR} = MDCChipFoundation.strings;

const getFixture = () => bel`
  <div class="mdc-chip" role="row">
    <span role="gridcell">
      <span role="button" tabindex="0" class="mdc-chip__text">Chip content</span>
    </span>
  </div>
`;

const getFixtureWithCheckmark = () => bel`
  <div class="mdc-chip">
    <div class="mdc-chip__checkmark" >
      <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
        <path class="mdc-chip__checkmark-path" fill="none" stroke="black"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
    </div>
    <div class="mdc-chip__text">Chip content</div>
  </div>
`;

const addLeadingIcon = (root) => {
  const icon = bel`<i class="material-icons mdc-chip__icon mdc-chip__icon--leading">face</i>`;
  root.insertBefore(icon, root.firstChild);
  return icon;
};

const addTrailingIcon = (root) => {
  const parent = bel`<span role="gridcell"></span>`;
  const icon = bel`
    <i tabindex="0" role="button" class="material-icons mdc-chip__icon mdc-chip__icon--trailing">cancel</i>
  `;
  parent.appendChild(icon);
  root.appendChild(parent);
  return icon;
};

class FakeRipple {
  constructor(root) {
    this.root = root;
    this.destroy = td.func('.destroy');
  }
}

function setupTest() {
  const root = getFixture();
  const component = new MDCChip(root);
  return {root, component};
}

function setupMockRippleTest() {
  const root = getFixture();
  const component = new MDCChip(root, undefined, () => new FakeRipple());
  return {root, component};
}

function setupMockFoundationTest(root = getFixture()) {
  const MockFoundationConstructor = td.constructor(MDCChipFoundation);
  const mockFoundation = new MockFoundationConstructor();
  const component = new MDCChip(root, mockFoundation);
  return {root, component, mockFoundation};
}

suite('MDCChip');

test('attachTo returns an MDCChip instance', () => {
  assert.isTrue(MDCChip.attachTo(getFixture()) instanceof MDCChip);
});

test('#initialSyncWithDOM sets up event handlers', () => {
  const {root, mockFoundation} = setupMockFoundationTest();

  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleInteraction(td.matchers.anything()), {times: 1});

  domEvents.emit(root, 'transitionend');
  td.verify(mockFoundation.handleTransitionEnd(td.matchers.anything()), {times: 1});

  domEvents.emit(root, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.anything()), {times: 1});
});

test('#initialSyncWithDOM sets up interaction event handler on trailing icon if present', () => {
  const root = getFixture();
  const icon = addTrailingIcon(root);
  const {mockFoundation} = setupMockFoundationTest(root);

  domEvents.emit(icon, 'click');
  td.verify(mockFoundation.handleTrailingIconInteraction(td.matchers.anything()), {times: 1});
});

test('#destroy removes event handlers', () => {
  const {root, component, mockFoundation} = setupMockFoundationTest();
  component.destroy();

  domEvents.emit(root, 'click');
  td.verify(mockFoundation.handleInteraction(td.matchers.anything()), {times: 0});

  domEvents.emit(root, 'transitionend');
  td.verify(mockFoundation.handleTransitionEnd(td.matchers.anything()), {times: 0});

  domEvents.emit(root, 'keydown');
  td.verify(mockFoundation.handleKeydown(td.matchers.anything()), {times: 0});
});

test('#destroy removes interaction event handler on trailing icon if present', () => {
  const root = getFixture();
  const icon = addTrailingIcon(root);
  const {component, mockFoundation} = setupMockFoundationTest(root);

  component.destroy();
  domEvents.emit(icon, 'click');
  td.verify(mockFoundation.handleTrailingIconInteraction(td.matchers.anything()), {times: 0});
});

test('#destroy destroys ripple', () => {
  const {component} = setupMockRippleTest();
  component.destroy();
  td.verify(component.ripple.destroy());
});

test('get ripple returns MDCRipple instance', () => {
  const {component} = setupTest();
  assert.isTrue(component.ripple instanceof MDCRipple);
});

test('sets id on chip if attribute exists', () => {
  const root = bel`
    <div class="mdc-chip" id="hello-chip">
      <div class="mdc-chip__text">Hello</div>
    </div>
  `;
  const component = new MDCChip(root);
  assert.equal(component.id, 'hello-chip');
});

test('adapter#hasClass returns true if class is set on chip set element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('adapter#addClass adds a class to the root element', () => {
  const {root, component} = setupTest();
  component.getDefaultFoundation().adapter_.addClass('foo');
  assert.isTrue(root.classList.contains('foo'));
});

test('adapter#removeClass removes a class from the root element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClass('foo');
  assert.isFalse(root.classList.contains('foo'));
});

test('adapter#addClassToLeadingIcon adds a class to the leading icon element', () => {
  const root = getFixtureWithCheckmark();
  const leadingIcon = addLeadingIcon(root);
  const component = new MDCChip(root);

  component.getDefaultFoundation().adapter_.addClassToLeadingIcon('foo');
  assert.isTrue(leadingIcon.classList.contains('foo'));
});

test('adapter#addClassToLeadingIcon does nothing if no leading icon element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.addClassToLeadingIcon('foo'));
});

test('adapter#removeClassFromLeadingIcon removes a class from the leading icon element', () => {
  const root = getFixtureWithCheckmark();
  const leadingIcon = addLeadingIcon(root);
  const component = new MDCChip(root);

  leadingIcon.classList.add('foo');
  component.getDefaultFoundation().adapter_.removeClassFromLeadingIcon('foo');
  assert.isFalse(leadingIcon.classList.contains('foo'));
});

test('adapter#removeClassFromLeadingIcon does nothing if no leading icon element is present', () => {
  const {component} = setupTest();
  assert.doesNotThrow(() => component.getDefaultFoundation().adapter_.removeClassFromLeadingIcon('foo'));
});

test('adapter#eventTargetHasClass returns true if given element has class', () => {
  const {component} = setupTest();
  const mockEventTarget = bel`<div class="foo">bar</div>`;

  assert.isTrue(component.getDefaultFoundation().adapter_.eventTargetHasClass(mockEventTarget, 'foo'));
});

test('adapter#notifyInteraction emits ' + MDCChipFoundation.strings.INTERACTION_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.INTERACTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyInteraction();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#notifySelection emits ' + MDCChipFoundation.strings.SELECTION_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('selection handler');

  component.listen(
    MDCChipFoundation.strings.SELECTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifySelection();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#notifyTrailingIconInteraction emits ' +
  MDCChipFoundation.strings.TRAILING_ICON_INTERACTION_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.TRAILING_ICON_INTERACTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyTrailingIconInteraction();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#notifyRemoval emits ' + MDCChipFoundation.strings.REMOVAL_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.REMOVAL_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyRemoval();

  td.verify(handler(td.matchers.anything()));
});

test('adapter#notifyNavigation emits ' + MDCChipFoundation.strings.NAVIGATION_EVENT, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(MDCChipFoundation.strings.NAVIGATION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyNavigation(MDCChipFoundation.strings.ARROW_LEFT_KEY);

  td.verify(handler(td.matchers.anything()));
});

test('adapter#getComputedStyleValue returns property value from root element styles', () => {
  const {root, component} = setupTest();
  assert.equal(
    component.getDefaultFoundation().adapter_.getComputedStyleValue('color'),
    window.getComputedStyle(root).getPropertyValue('color'));
});

test('adapter#setStyleProperty sets a style property on the root element', () => {
  const {root, component} = setupTest();
  const color = 'blue';
  component.getDefaultFoundation().adapter_.setStyleProperty('color', color);
  assert.equal(root.style.getPropertyValue('color'), color);
});

test('adapter#hasLeadingIcon returns true if the chip has a leading icon', () => {
  const root = getFixtureWithCheckmark();
  addLeadingIcon(root);
  const component = new MDCChip(root);

  assert.isTrue(component.getDefaultFoundation().adapter_.hasLeadingIcon());
});

test('adapter#hasLeadingIcon returns false if the chip does not have a leading icon', () => {
  const {component} = setupTest();
  assert.isFalse(component.getDefaultFoundation().adapter_.hasLeadingIcon());
});

test('adapter#getRootBoundingClientRect calls getBoundingClientRect on the root element', () => {
  const {root, component} = setupTest();
  root.getBoundingClientRect = td.func();
  component.getDefaultFoundation().adapter_.getRootBoundingClientRect();
  td.verify(root.getBoundingClientRect(), {times: 1});
});

test('adapter#getCheckmarkBoundingClientRect calls getBoundingClientRect on the checkmark element if it exists', () => {
  const root = getFixtureWithCheckmark();
  const component = new MDCChip(root);
  const checkmark = root.querySelector(CHECKMARK_SELECTOR);

  checkmark.getBoundingClientRect = td.func();
  component.getDefaultFoundation().adapter_.getCheckmarkBoundingClientRect();
  td.verify(checkmark.getBoundingClientRect(), {times: 1});
});

test('adapter#getCheckmarkBoundingClientRect returns null when there is no checkmark element', () => {
  const {component} = setupTest();
  assert.isNull(component.getDefaultFoundation().adapter_.getCheckmarkBoundingClientRect());
});

test('adapter#hasTrailingIcon returns false when no trailing icon is present', () => {
  const root = getFixture();
  const component = new MDCChip(root);
  assert.isFalse(component.getDefaultFoundation().adapter_.hasTrailingIcon());
});

test('adapter#hasTrailingIcon returns true when trailing icon is present', () => {
  const root = getFixture();
  addTrailingIcon(root);
  const component = new MDCChip(root);
  assert.isTrue(component.getDefaultFoundation().adapter_.hasTrailingIcon());
});

test('adapter#isRTL returns false if the text direction is not RTL', () => {
  const {component, root} = setupTest();
  document.documentElement.appendChild(root);
  assert.isFalse(component.getDefaultFoundation().adapter_.isRTL());
  document.documentElement.removeChild(root);
});

test('adapter#isRTL returns true if the text direction is RTL', () => {
  const {component, root} = setupTest();
  document.documentElement.appendChild(root);
  document.documentElement.setAttribute('dir', 'rtl');
  assert.isTrue(component.getDefaultFoundation().adapter_.isRTL());
  document.documentElement.removeAttribute('dir');
  document.documentElement.removeChild(root);
});

test('adapter#focusText gives focus to the root element', () => {
  const {component, root} = setupTest();
  document.documentElement.appendChild(root);
  component.getDefaultFoundation().adapter_.focusText();
  assert.equal(document.activeElement, root.querySelector('.mdc-chip__text'));
  document.documentElement.removeChild(root);
});

test('adapter#focusTrailingIcon gives focus to the trailing icon element', () => {
  const root = getFixture();
  const icon = addTrailingIcon(root);
  document.documentElement.appendChild(root);
  const component = new MDCChip(root);
  component.getDefaultFoundation().adapter_.focusTrailingIcon();
  assert.equal(document.activeElement, icon);
  document.documentElement.removeChild(root);
});

test('adapter#textHasFocus returns true if the text element has focus', () => {
  const {component, root} = setupTest();
  document.documentElement.appendChild(root);
  component.getDefaultFoundation().adapter_.focusText();
  assert.isTrue(component.getDefaultFoundation().adapter_.textHasFocus());
  document.documentElement.removeChild(root);
});

test('adapter#trailingIconHasFocus returns true if the trailing icon element has focus', () => {
  const root = getFixture();
  addTrailingIcon(root);
  document.documentElement.appendChild(root);
  const component = new MDCChip(root);
  component.getDefaultFoundation().adapter_.focusTrailingIcon();
  assert.isTrue(component.getDefaultFoundation().adapter_.trailingIconHasFocus());
  document.documentElement.removeChild(root);
});

test('adapter#trailingIconHasFocus returns false if no trailing icon element is present', () => {
  const {component, root} = setupTest();
  document.documentElement.appendChild(root);
  component.getDefaultFoundation().adapter_.focusText();
  assert.isFalse(component.getDefaultFoundation().adapter_.trailingIconHasFocus());
  document.documentElement.removeChild(root);
});

test('adapter#setTextAttr sets the attribute on the text element', () => {
  const {root, component} = setupTest();
  const text = root.querySelector('.mdc-chip__text');
  component.getDefaultFoundation().adapter_.setTextAttr('tabindex', '-1');
  assert.equal(text.getAttribute('tabindex'), '-1');
});

test('adapter#setTrailingIconAttr sets the attribute on the trailing icon element', () => {
  const root = getFixture();
  const icon = addTrailingIcon(root);
  const component = new MDCChip(root);
  component.getDefaultFoundation().adapter_.setTrailingIconAttr('tabindex', '-1');
  assert.equal(icon.getAttribute('tabindex'), '-1');
});

test('#get selected proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  assert.equal(component.selected, mockFoundation.isSelected());
});

test('#set selected proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.selected = true;
  td.verify(mockFoundation.setSelected(true));
});

test('#get shouldRemoveOnTrailingIconClick proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  assert.equal(component.shouldRemoveOnTrailingIconClick, mockFoundation.getShouldRemoveOnTrailingIconClick());
});

test('#set shouldRemoveOnTrailingIconClick proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.shouldRemoveOnTrailingIconClick = false;
  td.verify(mockFoundation.setShouldRemoveOnTrailingIconClick(false));
});

test('#beginExit proxies to foundation', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.beginExit();
  td.verify(mockFoundation.beginExit());
});

test('#focusAction proxies to the foundation#focusAction', () => {
  const {component, mockFoundation} = setupMockFoundationTest();
  component.focusAction('ArrowLeft', 0);
  td.verify(mockFoundation.focusAction('ArrowLeft', 0));
});

test('#remove removes the root from the DOM', () => {
  const {component, root} = setupTest();
  document.documentElement.appendChild(root);
  component.remove();
  assert.isNull(document.querySelector('.mdc-chip'));
});
