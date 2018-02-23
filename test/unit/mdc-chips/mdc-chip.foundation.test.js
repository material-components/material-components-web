/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {verifyDefaultAdapter, captureHandlers} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCChipFoundation from '../../../packages/mdc-chips/chip/foundation';

const {cssClasses} = MDCChipFoundation;

suite('MDCChipFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCChipFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCChipFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCChipFoundation, [
    'addClass', 'removeClass', 'hasClass',
    'registerTrailingIconInteractionHandler', 'deregisterTrailingIconInteractionHandler',
    'registerInteractionHandler', 'deregisterInteractionHandler', 'notifyInteraction',
    'notifyTrailingIconInteraction',
  ]);
});

const setupTest = () => setupFoundationTest(MDCChipFoundation);

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('pointerdown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTrailingIconInteractionHandler('mousedown', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('pointerdown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTrailingIconInteractionHandler('mousedown', td.matchers.isA(Function)));
});

test('#toggleActive adds mdc-chip--activated class if the class does not exist', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ACTIVATED)).thenReturn(false);

  foundation.toggleActive();
  td.verify(mockAdapter.addClass(cssClasses.ACTIVATED));
});

test('#toggleActive removes mdc-chip--activated class if the class exists', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ACTIVATED)).thenReturn(true);

  foundation.toggleActive();
  td.verify(mockAdapter.removeClass(cssClasses.ACTIVATED));
});

test('on click, emit custom event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const mockEvt = {
    type: 'click',
  };

  foundation.init();
  handlers.click(mockEvt);

  td.verify(mockAdapter.notifyInteraction());
});

test('on click in trailing icon, emit custom event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerTrailingIconInteractionHandler');
  const mockEvt = {
    type: 'click',
    stopPropagation: td.func('stopPropagation'),
  };

  foundation.init();
  handlers.click(mockEvt);

  td.verify(mockAdapter.notifyTrailingIconInteraction());
  td.verify(mockEvt.stopPropagation());
});
