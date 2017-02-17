/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import {verifyDefaultAdapter, captureHandlers as baseCaptureHandlers} from '../helpers/foundation';
import MDCIconToggleFoundation from '../../../packages/mdc-icon-toggle/foundation';

const {strings, cssClasses} = MDCIconToggleFoundation;

suite('MDCIconToggleFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCIconToggleFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCIconToggleFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCIconToggleFoundation, [
    'addClass', 'removeClass', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'setText', 'getTabIndex', 'setTabIndex', 'getAttr', 'setAttr', 'rmAttr', 'notifyChange',
  ]);
});

const setupTest = () => setupFoundationTest(MDCIconToggleFoundation);

test('#constructor sets on to false', () => {
  const {foundation} = setupTest();
  assert.isNotOk(foundation.isOn());
});

test('#toggle flips on', () => {
  const {foundation} = setupTest();
  foundation.init();

  foundation.toggle();
  assert.isOk(foundation.isOn());
  foundation.toggle();
  assert.isNotOk(foundation.isOn());
});

test('#toggle accepts boolean argument denoting toggle state', () => {
  const {foundation} = setupTest();
  foundation.init();

  foundation.toggle(false);
  assert.isNotOk(foundation.isOn());
  foundation.toggle(true);
  assert.isOk(foundation.isOn());
});

test('#toggle sets "aria-pressed" to true when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'true'));
});

test('#toggle removes cssClass in "data-toggle-off" if specified when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  const cssClass = 'toggle-off-css-class';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF)).thenReturn(JSON.stringify({cssClass}));
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.removeClass(cssClass));
});

test('#toggle adds cssClass in "data-toggle-on" if specified when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  const cssClass = 'toggle-on-css-class';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON)).thenReturn(JSON.stringify({cssClass}));
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.addClass(cssClass));
});

test('#toggle sets text to content in "data-toggle-on" if specified when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  const content = 'toggle on content';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON)).thenReturn(JSON.stringify({content}));
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.setText(content));
});

test('#toggle sets aria-label to label in "data-toggle-on" if specified when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  const label = 'toggle on label';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON)).thenReturn(JSON.stringify({label}));
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.setAttr(strings.ARIA_LABEL, label));
});

test('#toggle sets "aria-pressed" to false when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'false'));
});

test('#toggle removes cssClass in "data-toggle-on" if specified when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  const cssClass = 'toggle-on-css-class';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON)).thenReturn(JSON.stringify({cssClass}));
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.removeClass(cssClass));
});

test('#toggle adds cssClass in "data-toggle-off" if specified when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  const cssClass = 'toggle-off-css-class';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF)).thenReturn(JSON.stringify({cssClass}));
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.addClass(cssClass));
});

test('#toggle sets text to content in "data-toggle-off" if specified when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  const content = 'toggle off content';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF)).thenReturn(JSON.stringify({content}));
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.setText(content));
});

test('#toggle sets aria-label to label in "data-toggle-off" if specified when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  const label = 'toggle off label';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF)).thenReturn(JSON.stringify({label}));
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.setAttr(strings.ARIA_LABEL, label));
});

test('#setDisabled updates the disabled state', () => {
  const {foundation} = setupTest();
  foundation.setDisabled(true);
  assert.isOk(foundation.isDisabled());
  foundation.setDisabled(false);
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled sets the tabindex to -1 when disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setTabIndex(-1));
});

test('#setDisabled sets "aria-disabled" to true when disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setAttr(strings.ARIA_DISABLED, 'true'));
});

test('#setDisabled adds "mdc-icon-toggle--disabled" class when disabled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(cssClasses.DISABLED));
});

test('#setDisabled restores the previously set tab index when enabled', () => {
  const {foundation, mockAdapter} = setupTest();
  const tabIndex = 5;
  td.when(mockAdapter.getTabIndex()).thenReturn(tabIndex);
  foundation.setDisabled(true);

  foundation.setDisabled(false);
  td.verify(mockAdapter.setTabIndex(tabIndex));
});

test('#setDisabled removes "aria-disabled" when enabled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.rmAttr(strings.ARIA_DISABLED));
});

test('#setDisabled removes "mdc-icon-toggle--disabled" class when enabled', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED));
});

test('#refreshToggleData syncs the foundation state with data-toggle-on, data-toggle-off', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON)).thenReturn(JSON.stringify({
    cssClass: 'first-class-on',
  }));
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF)).thenReturn(JSON.stringify({
    cssClass: 'first-class-off',
  }));
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.addClass('first-class-on'));
  td.verify(mockAdapter.removeClass('first-class-off'));

  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON)).thenReturn(JSON.stringify({
    cssClass: 'second-class-on',
  }));
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF)).thenReturn(JSON.stringify({
    cssClass: 'second-class-off',
  }));
  foundation.refreshToggleData();

  foundation.toggle(true);
  td.verify(mockAdapter.addClass('second-class-on'));
  td.verify(mockAdapter.removeClass('second-class-off'));
});

test('#destroy deregisters all interaction handlers', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;
  foundation.destroy();
  td.verify(mockAdapter.deregisterInteractionHandler('click', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('keydown', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('keyup', isA(Function)));
});

const captureHandlers = (adapter) => baseCaptureHandlers(adapter, 'registerInteractionHandler');

test('updates toggle state on click', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  foundation.init();

  handlers.click();
  assert.isOk(foundation.isOn());
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'true'));

  handlers.click();
  assert.isNotOk(foundation.isOn());
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'false'));
});

test('broadcasts change notification on click', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  foundation.init();

  handlers.click();
  td.verify(mockAdapter.notifyChange({isOn: true}));
  handlers.click();
  td.verify(mockAdapter.notifyChange({isOn: false}));
});

test('prevents default action on spacebar keydown', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  const evt = {preventDefault: td.func('evt.preventDefault'), key: 'Space'};
  foundation.init();

  handlers.keydown(evt);
  td.verify(evt.preventDefault());
});

test('prevents default action on spacebar keydown using keyCode', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  const evt = {preventDefault: td.func('evt.preventDefault'), keyCode: 32};
  foundation.init();

  handlers.keydown(evt);
  td.verify(evt.preventDefault());
});

test('flips isKeyboardActivated() to true on spacebar keydown', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  const evt = {preventDefault: td.func('evt.preventDefault'), key: 'Space'};
  foundation.init();

  handlers.keydown(evt);
  assert.isOk(foundation.isKeyboardActivated());
});

test('flips isKeyboardActivated() to true on spacebar keydown using keyCode', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  const evt = {preventDefault: td.func('evt.preventDefault'), keyCode: 32};
  foundation.init();

  handlers.keydown(evt);
  assert.isOk(foundation.isKeyboardActivated());
});

test('triggers toggle on spacebar keyup', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  foundation.init();

  handlers.keyup({key: 'Space'});
  assert.isOk(foundation.isOn());
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'true'));
  td.verify(mockAdapter.notifyChange({isOn: true}));
});

test('triggers toggle on spacebar keyup using keyCode', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  foundation.init();

  handlers.keyup({keyCode: 32});
  assert.isOk(foundation.isOn());
  td.verify(mockAdapter.setAttr(strings.ARIA_PRESSED, 'true'));
  td.verify(mockAdapter.notifyChange({isOn: true}));
});

test('flips isKeyboardActivated() back to false on spacebar keydown', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  const evt = {preventDefault: td.func('evt.preventDefault'), key: 'Space'};
  foundation.init();

  handlers.keydown(evt);
  assert.isOk(foundation.isKeyboardActivated(), 'isKeyboardActivated sanity check');

  handlers.keyup(evt);
  assert.isNotOk(foundation.isKeyboardActivated());
});

test('flips isKeyboardActivated() back to false on spacebar keydown using keyCode', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter);
  const evt = {preventDefault: td.func('evt.preventDefault'), keyCode: 32};
  foundation.init();

  handlers.keydown(evt);
  assert.isOk(foundation.isKeyboardActivated(), 'isKeyboardActivated sanity check');

  handlers.keyup(evt);
  assert.isNotOk(foundation.isKeyboardActivated());
});
