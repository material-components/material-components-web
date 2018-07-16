/**
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import MDCIconButtonToggleFoundation from '../../../packages/mdc-icon-button/foundation';

const {strings} = MDCIconButtonToggleFoundation;

suite('MDCIconButtonToggleFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCIconButtonToggleFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCIconButtonToggleFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCIconButtonToggleFoundation, [
    'addClass', 'removeClass', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'setText', 'getAttr', 'setAttr', 'notifyChange',
  ]);
});

const setupTest = () => setupFoundationTest(MDCIconButtonToggleFoundation);

test('#constructor sets on to false', () => {
  const {mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr(strings.ARIA_PRESSED)).thenReturn('false');
  const foundation = new MDCIconButtonToggleFoundation(mockAdapter);
  assert.isFalse(foundation.isOn());
});

test('#constructor sets on to true if the toggle is pressed', () => {
  const {mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr(strings.ARIA_PRESSED)).thenReturn('true');
  const foundation = new MDCIconButtonToggleFoundation(mockAdapter);
  assert.isTrue(foundation.isOn());
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

test('#toggle removes cssClass in "data-toggle-off-class" if specified when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  const cssClass = 'toggle-off-css-class';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF_CLASS)).thenReturn(cssClass);
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.removeClass(cssClass));
});

test('#toggle adds cssClass in "data-toggle-on-class" if specified when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  const cssClass = 'toggle-on-css-class';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON_CLASS)).thenReturn(cssClass);
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.addClass(cssClass));
});

test('#toggle sets text to content in "data-toggle-on-content" if specified when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  const content = 'toggle on content';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON_CONTENT)).thenReturn(content);
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.setText(content));
});

test('#toggle sets aria-label to label in "data-toggle-on" if specified when toggled on', () => {
  const {foundation, mockAdapter} = setupTest();
  const label = 'toggle on label';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON_LABEL)).thenReturn(label);
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

test('#toggle removes cssClass in "data-toggle-on-class" if specified when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  const cssClass = 'toggle-on-css-class';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON_CLASS)).thenReturn(cssClass);
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.removeClass(cssClass));
});

test('#toggle adds cssClass in "data-toggle-off-class" if specified when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  const cssClass = 'toggle-off-css-class';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF_CLASS)).thenReturn(cssClass);
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.addClass(cssClass));
});

test('#toggle sets text to content in "data-toggle-off-content" if specified when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  const content = 'toggle off content';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF_CONTENT)).thenReturn(content);
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.setText(content));
});

test('#toggle sets aria-label to label in "data-toggle-off-label" if specified when toggled off', () => {
  const {foundation, mockAdapter} = setupTest();
  const label = 'toggle off label';
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF_LABEL)).thenReturn(label);
  foundation.init();

  foundation.toggle(false);
  td.verify(mockAdapter.setAttr(strings.ARIA_LABEL, label));
});

test('#refreshToggleData syncs the foundation state with data-toggle-on, data-toggle-off', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON_CLASS)).thenReturn('first-class-on');
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF_CLASS)).thenReturn('first-class-off');
  foundation.init();

  foundation.toggle(true);
  td.verify(mockAdapter.addClass('first-class-on'));
  td.verify(mockAdapter.removeClass('first-class-off'));

  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_ON_CLASS)).thenReturn('second-class-on');
  td.when(mockAdapter.getAttr(strings.DATA_TOGGLE_OFF_CLASS)).thenReturn('second-class-off');
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
