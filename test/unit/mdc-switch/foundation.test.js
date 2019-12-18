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

import {assert} from 'chai';
import td from 'testdouble';

import {MDCSwitchFoundation} from '../../../packages/mdc-switch/foundation';

suite('MDCSwitchFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCSwitchFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCSwitchFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  const {defaultAdapter} = MDCSwitchFoundation;
  const methods = Object.keys(defaultAdapter).filter((k) => typeof defaultAdapter[k] === 'function');

  assert.equal(methods.length, Object.keys(defaultAdapter).length, 'Every adapter key must be a function');
  assert.deepEqual(methods, [
    'addClass',
    'removeClass',
    'setNativeControlChecked',
    'setNativeControlDisabled',
    'setNativeControlAttr',
  ]);
  methods.forEach((m) => assert.doesNotThrow(defaultAdapter[m]));
});

function setupTest() {
  const mockAdapter = td.object(MDCSwitchFoundation.defaultAdapter);
  const foundation = new MDCSwitchFoundation(mockAdapter);
  return {foundation, mockAdapter};
}

test('#setChecked updates the checked state', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(true);
  td.verify(mockAdapter.setNativeControlChecked(true));

  foundation.setChecked(false);
  td.verify(mockAdapter.setNativeControlChecked(false));
});

test('#setChecked adds mdc-switch--checked to the switch element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(true);
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#setChecked removes mdc-switch--checked from the switch element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(false);
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#setChecked sets aria-checked to true when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(true);
  td.verify(mockAdapter.setNativeControlAttr(
    MDCSwitchFoundation.strings.ARIA_CHECKED_ATTR,
    MDCSwitchFoundation.strings.ARIA_CHECKED_CHECKED_VALUE));
});

test('#setChecked sets aria-checked to false when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setChecked(false);
  td.verify(mockAdapter.setNativeControlAttr(
    MDCSwitchFoundation.strings.ARIA_CHECKED_ATTR,
    MDCSwitchFoundation.strings.ARIA_CHECKED_UNCHECKED_VALUE));
});

test('#setDisabled updates the disabled state', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setNativeControlDisabled(true));

  foundation.setDisabled(false);
  td.verify(mockAdapter.setNativeControlDisabled(false));
});

test('#setDisabled adds mdc-switch--disabled to the switch element when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('#setDisabled removes mdc-switch--disabled from the switch element when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.DISABLED));
});

test('#handleChange adds mdc-switch--checked to the switch when it is a checked state', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleChange({target: {checked: true}});
  td.verify(mockAdapter.addClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#handleChange removes mdc-switch--checked from the switch when it is an unchecked state', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleChange({target: {checked: false}});
  td.verify(mockAdapter.removeClass(MDCSwitchFoundation.cssClasses.CHECKED));
});

test('#handleChange sets aria-checked to true when the swith is a checked state', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleChange({target: {checked: true}});
  td.verify(mockAdapter.setNativeControlAttr(
    MDCSwitchFoundation.strings.ARIA_CHECKED_ATTR,
    MDCSwitchFoundation.strings.ARIA_CHECKED_CHECKED_VALUE));
});

test('#handleChange sets aria-checked to false when the swith is a checked state', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.handleChange({target: {checked: false}});
  td.verify(mockAdapter.setNativeControlAttr(
    MDCSwitchFoundation.strings.ARIA_CHECKED_ATTR,
    MDCSwitchFoundation.strings.ARIA_CHECKED_UNCHECKED_VALUE));
});
