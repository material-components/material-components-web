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

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCBottomLineFoundation from '../../../packages/mdc-bottom-line/foundation';

const {cssClasses} = MDCBottomLineFoundation;

suite('MDCBottomLineFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCBottomLineFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCBottomLineFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCBottomLineFoundation, [
    'addClass', 'removeClass', 'setAttr',
    'registerEventHandler', 'deregisterEventHandler',
    'notifyAnimationEnd',
  ]);
});

const setupTest = () => setupFoundationTest(MDCBottomLineFoundation);

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterEventHandler('transitionend', td.matchers.isA(Function)));
});

test(`activate adds ${MDCBottomLineFoundation.cssClasses.BOTTOM_LINE_ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.activate();
  td.verify(mockAdapter.addClass(cssClasses.BOTTOM_LINE_ACTIVE));
});

test(`deactivate removes ${MDCBottomLineFoundation.cssClasses.BOTTOM_LINE_ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.deactivate();
  td.verify(mockAdapter.removeClass(cssClasses.BOTTOM_LINE_ACTIVE));
});

test('setTransformOrigin sets style attribute', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    target: {
      getBoundingClientRect: () => {
        return {};
      },
    },
    clientX: 200,
    clientY: 200,
  };

  foundation.init();
  foundation.setTransformOrigin(mockEvt);

  td.verify(mockAdapter.setAttr('style', td.matchers.isA(String)));
});

test('on opacity transition end, emit custom event', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    propertyName: 'opacity',
  };
  let transitionEnd;

  td.when(mockAdapter.registerEventHandler('transitionend', td.matchers.isA(Function))).thenDo((evtType, handler) => {
    transitionEnd = handler;
  });

  foundation.init();
  transitionEnd(mockEvt);

  td.verify(mockAdapter.notifyAnimationEnd());
});
