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

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';

import {MDCSelectFoundation} from '../../../packages/mdc-select/foundation';
import {cssClasses, strings, numbers} from '../../../packages/mdc-select/constants';

const LABEL_WIDTH = 100;
suite('MDCSelectFoundation');

test('exports cssClasses', () => {
  assert.deepEqual(MDCSelectFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCSelectFoundation.numbers, numbers);
});

test('exports strings', () => {
  assert.deepEqual(MDCSelectFoundation.strings, strings);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSelectFoundation, [
    'addClass', 'removeClass', 'hasClass',
    'floatLabel', 'activateBottomLine', 'deactivateBottomLine', 'getValue',
    'getLabelWidth', 'hasOutline', 'notchOutline', 'closeOutline', 'isMenuOpen', 'openMenu',
    'closeMenu', 'setDisabled', 'setSelectedText', 'setSelectedTextAttr',
    'setAttributeAtIndex', 'removeAttributeAtIndex', 'getMenuItemValues', 'getMenuItemTextAtIndex',
    'toggleClassAtIndex', 'setRippleCenter', 'notifyChange',
    'checkValidity', 'setValid',
  ]);
});

function setupTest(hasLeadingIcon = true, hasHelperText = false) {
  const mockAdapter = td.object(MDCSelectFoundation.defaultAdapter);
  const leadingIcon = td.object({
    setDisabled: () => {},
    setAriaLabel: () => {},
    setContent: () => {},
    registerInteractionHandler: () => {},
    deregisterInteractionHandler: () => {},
    handleInteraction: () => {},
  });
  const helperText = td.object({
    setContent: () => {},
    setPersistent: () => {},
    setValidation: () => {},
    showToScreenReader: () => {},
    setValidity: () => {},
  });
  const foundationMap = {
    leadingIcon: hasLeadingIcon ? leadingIcon : undefined,
    helperText: hasHelperText ? helperText : undefined,
  };

  td.when(mockAdapter.getValue()).thenReturn('');

  const foundation = new MDCSelectFoundation(mockAdapter, foundationMap);
  return {foundation, mockAdapter, leadingIcon, helperText};
}

test('#setDisabled(true) calls adapter.addClass', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setDisabled(true));
  td.verify(mockAdapter.addClass(cssClasses.DISABLED));
});

test('#setDisabled(false) calls adapter.removeClass', () => {
  const {mockAdapter, foundation} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.setDisabled(false));
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED));
});

test('#setDisabled sets disabled on leading icon', () => {
  const {foundation, leadingIcon} = setupTest();
  foundation.setDisabled(true);
  td.verify(leadingIcon.setDisabled(true));
});

test('#notchOutline updates the width of the outline element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.getLabelWidth()).thenReturn(LABEL_WIDTH);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(LABEL_WIDTH * numbers.LABEL_SCALE));
});

test('#notchOutline does nothing if no outline is present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(false);
  td.when(mockAdapter.getLabelWidth()).thenReturn(LABEL_WIDTH);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(td.matchers.anything()), {times: 0});
});

test('#notchOutline width is set to 0 if no label is present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.getLabelWidth()).thenReturn(0);

  foundation.notchOutline(true);
  td.verify(mockAdapter.notchOutline(0), {times: 1});
});

test('#notchOutline(false) closes the outline', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.getLabelWidth()).thenReturn(LABEL_WIDTH);

  foundation.notchOutline(false);
  td.verify(mockAdapter.closeOutline());
});

test('#notchOutline does not close the notch if the select is still focused', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasOutline()).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.FOCUSED)).thenReturn(true);
  td.when(mockAdapter.getLabelWidth()).thenReturn(LABEL_WIDTH);

  foundation.notchOutline(false);
  td.verify(mockAdapter.closeOutline(), {times: 0});
});

test(`#handleMenuOpened adds ${cssClasses.ACTIVATED} class name`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleMenuOpened();
  td.verify(mockAdapter.addClass(cssClasses.ACTIVATED), {times: 1});
});

test(`#handleMenuClosed removes ${cssClasses.ACTIVATED} class name`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleMenuClosed();
  td.verify(mockAdapter.removeClass(cssClasses.ACTIVATED), {times: 1});
});

test('#handleChange calls adapter.floatLabel(true) when there is a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getValue()).thenReturn('value');

  foundation.handleChange();
  td.verify(mockAdapter.floatLabel(true), {times: 1});
});

test('#handleChange calls adapter.floatLabel(false) when there is no value and the select is not focused', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getValue()).thenReturn('');

  foundation.handleChange();
  td.verify(mockAdapter.floatLabel(false), {times: 1});
});

test('#handleChange does not call adapter.floatLabel(false) when there is no value if the select is focused', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getValue()).thenReturn('');
  td.when(mockAdapter.hasClass(cssClasses.FOCUSED)).thenReturn(true);

  foundation.handleChange();
  td.verify(mockAdapter.floatLabel(false), {times: 0});
});

test('#handleChange calls foundation.notchOutline(true) when there is a value', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.notchOutline = td.func();
  td.when(mockAdapter.getValue()).thenReturn('value');

  foundation.handleChange();
  td.verify(foundation.notchOutline(true), {times: 1});
});

test('#handleChange calls foundation.notchOutline(false) when there is no value', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.notchOutline = td.func();
  td.when(mockAdapter.getValue()).thenReturn('');

  foundation.handleChange();
  td.verify(foundation.notchOutline(false), {times: 1});
});

test('#handleChange calls adapter.notifyChange() if didChange is true', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getValue()).thenReturn('value');

  foundation.handleChange(/* didChange */ true);
  td.verify(mockAdapter.notifyChange(td.matchers.anything()), {times: 1});
});

test('#handleFocus calls adapter.floatLabel(true)', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleFocus();
  td.verify(mockAdapter.floatLabel(true), {times: 1});
});

test('#handleFocus calls foundation.notchOutline(true)', () => {
  const {foundation} = setupTest();
  foundation.notchOutline = td.func();
  foundation.handleFocus();
  td.verify(foundation.notchOutline(true), {times: 1});
});

test('#handleFocus calls adapter.activateBottomLine()', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleFocus();
  td.verify(mockAdapter.activateBottomLine(), {times: 1});
});

test('#handleFocus calls helperText.showToScreenReader', () => {
  const hasIcon = true;
  const hasHelperText = true;
  const {foundation, helperText} = setupTest(hasIcon, hasHelperText);
  foundation.handleFocus();
  td.verify(helperText.showToScreenReader(), {times: 1});
});

test('#handleFocus calls adapter.activateBottomLine() if isMenuOpen=true', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isMenuOpen()).thenReturn(true);
  foundation.handleFocus();
  td.verify(mockAdapter.activateBottomLine(), {times: 1});
});

test('#handleBlur calls foundation.handleChange()', () => {
  const {foundation} = setupTest();
  foundation.handleChange = td.func();
  foundation.handleBlur();
  td.verify(foundation.handleChange(false), {times: 1});
});

test('#handleBlur calls adapter.deactivateBottomLine()', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleBlur();
  td.verify(mockAdapter.deactivateBottomLine(), {times: 1});
});

test('#handleBlur does not call deactivateBottomLine if isMenuOpen=true', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isMenuOpen()).thenReturn(true);
  foundation.handleBlur();
  td.verify(mockAdapter.deactivateBottomLine(), {times: 0});
});

test('#handleBlur calls helperText.setValidity(true) if menu is not open', () => {
  const hasIcon = true;
  const hasHelperText = true;
  const {foundation, mockAdapter, helperText} = setupTest(hasIcon, hasHelperText);
  td.when(mockAdapter.hasClass(cssClasses.REQUIRED)).thenReturn(true);
  td.when(mockAdapter.isMenuOpen()).thenReturn(false);
  td.when(mockAdapter.checkValidity()).thenReturn(true);
  foundation.handleBlur();
  td.verify(helperText.setValidity(true), {times: 1});
});

test('#handleClick does nothing if isMenuOpen=true', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isMenuOpen()).thenReturn(true);
  foundation.handleClick(0);
  td.verify(mockAdapter.setRippleCenter(0), {times: 0});
});

test('#handleClick sets the ripple center if isMenuOpen=false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isMenuOpen()).thenReturn(false);
  foundation.handleClick(0);
  td.verify(mockAdapter.setRippleCenter(0), {times: 1});
});

test('#handleClick opens the menu if the select is focused and isMenuOpen=false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.isMenuOpen()).thenReturn(false);
  td.when(mockAdapter.hasClass(cssClasses.FOCUSED)).thenReturn(true);
  foundation.handleClick(0);
  td.verify(mockAdapter.openMenu(), {times: 1});
});

test('#handleKeydown calls adapter.openMenu if valid keys are pressed, menu is not open and select is focused',
  () => {
    const {foundation, mockAdapter} = setupTest();
    const preventDefault = td.func();
    const event = {key: 'Enter', preventDefault};
    td.when(mockAdapter.isMenuOpen()).thenReturn(false);
    td.when(mockAdapter.hasClass('mdc-select--focused')).thenReturn(true);
    foundation.handleKeydown(event);
    event.key = 'Space';
    foundation.handleKeydown(event);
    event.key = 'ArrowUp';
    foundation.handleKeydown(event);
    event.key = 'ArrowDown';
    foundation.handleKeydown(event);
    event.key = '';
    event.keyCode = 13; // Enter
    foundation.handleKeydown(event);
    event.keyCode = 32; // Space
    foundation.handleKeydown(event);
    event.keyCode = 38; // Up
    foundation.handleKeydown(event);
    event.keyCode = 40; // Down
    foundation.handleKeydown(event);
    td.verify(mockAdapter.openMenu(), {times: 8});
    td.verify(preventDefault(), {times: 8});
  });

test('#handleKeydown does not call adapter.openMenu if Enter/Space key is pressed, and select is not focused', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func();
  const event = {key: 'Enter', preventDefault};
  td.when(mockAdapter.isMenuOpen()).thenReturn(false);
  td.when(mockAdapter.hasClass('mdc-select--focused')).thenReturn(false);
  foundation.handleKeydown(event);
  event.key = 'Space';
  foundation.handleKeydown(event);
  event.key = 'ArrowUp';
  foundation.handleKeydown(event);
  event.key = 'ArrowDown';
  foundation.handleKeydown(event);
  event.key = '';
  event.keyCode = 13; // Enter
  foundation.handleKeydown(event);
  event.keyCode = 32; // Space
  foundation.handleKeydown(event);
  event.keyCode = 38; // Up
  foundation.handleKeydown(event);
  event.keyCode = 40; // Down
  foundation.handleKeydown(event);
  td.verify(mockAdapter.openMenu(), {times: 0});
  td.verify(preventDefault(), {times: 0});
});

test('#handleKeydown does not call adapter.openMenu if menu is opened', () => {
  const {foundation, mockAdapter} = setupTest();
  const preventDefault = td.func();
  const event = {key: 'Enter', preventDefault};
  td.when(mockAdapter.isMenuOpen()).thenReturn(true);
  foundation.handleKeydown(event);
  event.key = 'Space';
  foundation.handleKeydown(event);
  event.key = 'ArrowUp';
  foundation.handleKeydown(event);
  event.key = 'ArrowDown';
  foundation.handleKeydown(event);
  event.key = '';
  event.keyCode = 13; // Enter
  foundation.handleKeydown(event);
  event.keyCode = 32; // Space
  foundation.handleKeydown(event);
  event.keyCode = 38; // Up
  foundation.handleKeydown(event);
  event.keyCode = 40; // Down
  foundation.handleKeydown(event);
  td.verify(mockAdapter.openMenu(), {times: 0});
  td.verify(preventDefault(), {times: 0});
});

test('#layout calls notchOutline(true) if value is not an empty string', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.notchOutline = td.func();
  td.when(mockAdapter.getValue()).thenReturn(' ');
  foundation.layout();
  td.verify(foundation.notchOutline(true), {times: 1});
});

test('#layout calls notchOutline(false) if value is an empty string', () => {
  const {foundation} = setupTest();
  foundation.notchOutline = td.func();
  foundation.layout();
  td.verify(foundation.notchOutline(false), {times: 1});
});

test('#setLeadingIconAriaLabel sets the aria-label of the leading icon element', () => {
  const {foundation, leadingIcon} = setupTest();
  foundation.setLeadingIconAriaLabel('foo');
  td.verify(leadingIcon.setAriaLabel('foo'), {times: 1});
});

test('#setLeadingIconContent sets the content of the leading icon element', () => {
  const {foundation, leadingIcon} = setupTest();
  foundation.setLeadingIconContent('foo');
  td.verify(leadingIcon.setContent('foo'), {times: 1});
});

test('#setLeadingIconAriaLabel does nothing if the leading icon element is undefined', () => {
  const hasLeadingIcon = false;
  const {foundation, leadingIcon} = setupTest(hasLeadingIcon);
  assert.doesNotThrow(() => foundation.setLeadingIconAriaLabel('foo'));
  td.verify(leadingIcon.setAriaLabel('foo'), {times: 0});
});

test('#setLeadingIconContent does nothing if the leading icon element is undefined', () => {
  const hasLeadingIcon = false;
  const {foundation, leadingIcon} = setupTest(hasLeadingIcon);
  assert.doesNotThrow(() => foundation.setLeadingIconContent('foo'));
  td.verify(leadingIcon.setContent('foo'), {times: 0});
});

test('#setHelperTextContent sets the content of the helper text element', () => {
  const hasIcon = false;
  const hasHelperText = true;
  const {foundation, helperText} = setupTest(hasIcon, hasHelperText);
  foundation.setHelperTextContent('foo');
  td.verify(helperText.setContent('foo'));
});

test('#setHelperTextContent does not throw an error if there is no helperText element', () => {
  const hasIcon = false;
  const hasHelperText = false;
  const {foundation} = setupTest(hasIcon, hasHelperText);
  assert.doesNotThrow(() => foundation.setHelperTextContent('foo'));
});
