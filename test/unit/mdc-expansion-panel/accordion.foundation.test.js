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
import {verifyDefaultAdapter, captureHandlers} from '../helpers/foundation';
import {MDCExpansionPanelAccordionFoundation, MDCExpansionPanelFoundation} from '../../../packages/mdc-expansion-panel';
import {cssClasses, strings} from '../../../packages/mdc-expansion-panel/accordion/constants';

const setupTest = () => setupFoundationTest(MDCExpansionPanelAccordionFoundation);

suite('MDCExpansionPanelAccordionFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCExpansionPanelAccordionFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCExpansionPanelAccordionFoundation.cssClasses, cssClasses);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCExpansionPanelAccordionFoundation, [
    'notifyChange',
    'getComponentInstanceFromEvent',
    'registerChildrenExpansionPanelInteractionListener',
    'deregisterChildrenExpansionPanelInteractionListener',
  ]);
});

test('there is no expanded child initially', () => {
  const {foundation} = setupTest();

  foundation.init();

  assert.isNotOk(foundation.expandedChild);
});

test('#init registers all necessary event handlers for the component', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();

  td.verify(mockAdapter.registerChildrenExpansionPanelInteractionListener(
    MDCExpansionPanelFoundation.strings.EXPAND_EVENT, isA(Function)));
});

test('#destroy calls event deregistrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterChildrenExpansionPanelInteractionListener(
    MDCExpansionPanelFoundation.strings.EXPAND_EVENT, isA(Function)));
});

test('expansionHandler calls collapse on the correct object', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerChildrenExpansionPanelInteractionListener');
  const child = td.object({collapse() {}});

  foundation.init();

  foundation.expandedChild_ = child;
  handlers[MDCExpansionPanelFoundation.strings.EXPAND_EVENT]();

  td.verify(child.collapse());
});

test('expansionHandler calls adapter#getComponentInstanceFromEvent with the correct argument', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerChildrenExpansionPanelInteractionListener');
  const child = td.object({collapse() {}});

  foundation.init();

  handlers[MDCExpansionPanelFoundation.strings.EXPAND_EVENT]({detail: child});

  td.verify(mockAdapter.getComponentInstanceFromEvent(td.matchers.contains({detail: child})));
});
