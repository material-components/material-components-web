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
import {MDCExpansionPanelFoundation} from '../../../packages/mdc-expansion-panel';
import {cssClasses, strings, numbers} from '../../../packages/mdc-expansion-panel/constants';

const setupTest = () => setupFoundationTest(MDCExpansionPanelFoundation);

const anything = td.matchers.anything;

suite('MDCExpansionPanelFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCExpansionPanelFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCExpansionPanelFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCExpansionPanelFoundation.numbers, numbers);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCExpansionPanelFoundation, [
    'blur',
    'hasClass',
    'addClass',
    'removeClass',
    'setAttribute',
    'setStyle',
    'getStyle',
    'getComputedHeight',
    'offsetHeight',
    'registerInteractionHandler',
    'deregisterInteractionHandler',
    'notifyChange',
    'notifyExpand',
    'notifyCollapse',
    'setExpansionIconInnerHTML',
    'shouldRespondToClickEvent',
  ]);
});

test('default starting state is collapsed', () => {
  const {foundation} = setupTest();

  foundation.init();

  assert.isNotOk(foundation.expanded);
});

test('if the panel is explicity set to start expanded, do not collapse', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.hasClass(cssClasses.EXPANDED)).thenReturn(true);
  foundation.init();

  td.verify(mockAdapter.addClass(cssClasses.COLLAPSED), {times: 0});
});

test('#init registers all necessary event handlers for the component', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();

  td.verify(mockAdapter.registerInteractionHandler('click', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('transitionend', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('keypress', isA(Function)));
});

test('#init sets the expansion icon content', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();

  td.verify(mockAdapter.setExpansionIconInnerHTML('expand_more'));
});

test('#destroy calls event deregistrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  foundation.destroy();

  td.verify(mockAdapter.deregisterInteractionHandler('click', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('transitionend', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('keypress', isA(Function)));
});

test('#expand modifies the correct classes', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');

  foundation.init();
  foundation.expand();

  td.verify(mockAdapter.removeClass(cssClasses.COLLAPSED));
  td.verify(mockAdapter.addClass(cssClasses.EXPANDING));

  handlers.transitionend();

  td.verify(mockAdapter.removeClass(cssClasses.EXPANDING));
  td.verify(mockAdapter.addClass(cssClasses.EXPANDED));
});

test('#collapse modifies the correct classes', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');

  foundation.init();
  foundation.collapse();

  td.verify(mockAdapter.removeClass(cssClasses.EXPANDED));
  td.verify(mockAdapter.addClass(cssClasses.COLLAPSING));

  handlers.transitionend();

  td.verify(mockAdapter.removeClass(cssClasses.COLLAPSING));
  td.verify(mockAdapter.addClass(cssClasses.COLLAPSED));
});

test('keypresshandler responds to the correct keys', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const toggleExpansion = td.replace(foundation, 'toggleExpansion');

  foundation.init();

  handlers.keypress({key: 'Enter'});

  td.verify(toggleExpansion(anything()));

  td.reset();
});

test('keypresshandler does not respond to the incorrect keys', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');

  foundation.init();

  const toggleExpansion = td.replace(foundation, 'toggleExpansion');

  handlers.keypress({key: 'Tab'});

  td.verify(toggleExpansion(anything()), {times: 0});

  td.reset();
});

test('handles expansion transitionend by setting height style to auto', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');

  foundation.init();
  foundation.expand();
  td.when(mockAdapter.hasClass(cssClasses.EXPANDED)).thenReturn(true);

  handlers.transitionend({propertyName: 'height'});

  td.verify(mockAdapter.setStyle('height', 'auto'));
});

test('#toggleExpansion calls collapse when panel is expanded', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.when(mockAdapter.hasClass(cssClasses.EXPANDED)).thenReturn(true);
  td.when(mockAdapter.shouldRespondToClickEvent(anything())).thenReturn(true);

  const collapse = td.replace(foundation, 'collapse');
  const expand = td.replace(foundation, 'expand');

  foundation.toggleExpansion();

  td.verify(collapse());
  td.verify(expand(), {times: 0});

  td.reset();
});

test('#toggleExpansion calls expand when panel is collapsed', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.when(mockAdapter.hasClass(cssClasses.EXPANDED)).thenReturn(false);
  td.when(mockAdapter.shouldRespondToClickEvent(anything())).thenReturn(true);

  const collapse = td.replace(foundation, 'collapse');
  const expand = td.replace(foundation, 'expand');

  foundation.toggleExpansion();

  td.verify(expand());
  td.verify(collapse(), {times: 0});

  td.reset();
});

test('#toggleExpansion does nothing if adapter says it should not respond', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  td.when(mockAdapter.shouldRespondToClickEvent(anything())).thenReturn(false);

  const collapse = td.replace(foundation, 'collapse');
  const expand = td.replace(foundation, 'expand');

  foundation.toggleExpansion();

  td.verify(expand(), {times: 0});
  td.verify(collapse(), {times: 0});
  td.verify(mockAdapter.notifyChange(), {times: 0});

  td.reset();
});
