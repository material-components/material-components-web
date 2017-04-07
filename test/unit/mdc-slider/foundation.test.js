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

/* eslint object-curly-spacing: [error, always, { "objectsInObjects": false }], arrow-parens: [error, as-needed] */

import { assert } from 'chai';
import td from 'testdouble';

import { verifyDefaultAdapter, captureHandlers } from '../helpers/foundation';
import { setupFoundationTest } from '../helpers/setup';
import MDCSliderFoundation from '../../../packages/mdc-slider/continuous/foundation';

const { cssClasses } = MDCSliderFoundation;

suite('MDCSliderFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCSliderFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCSliderFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSliderFoundation, [
    'addClass',
    'removeClass',
    'hasClass',
    'addInputClass',
    'removeInputClass',
    'getNativeInput',
    'registerHandler',
    'deregisterHandler',
    'registerRootHandler',
    'deregisterRootHandler',
    'setAttr',
    'setLowerStyle',
    'setUpperStyle',
    'hasNecessaryDom',
    'notifyChange',
    'detectIsIE',
  ]);
});

function setupTest() {
  const { foundation, mockAdapter } = setupFoundationTest(MDCSliderFoundation);
  td.when(mockAdapter.hasClass('mdc-slider')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);

  return { foundation, mockAdapter };
}

test('#constructor sets disabled to false', () => {
  const { foundation } = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled flips disabled when a native input is given', () => {
  const { foundation, mockAdapter } = setupTest();
  const nativeInput = { disabled: false };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.setDisabled(true);
  assert.isOk(foundation.isDisabled());
});

test('#setDisabled has no effect when no native input is provided', () => {
  const { foundation } = setupTest();
  foundation.setDisabled(true);
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled set the disabled property on the native input when there is one', () => {
  const { foundation, mockAdapter } = setupTest();
  const nativeInput = { disabled: false };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.setDisabled(true);
  assert.isOk(nativeInput.disabled);
});

test('#setDisabled handles no native input being returned gracefully', () => {
  const { foundation, mockAdapter } = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setDisabled(true));
});

test('#init throws error when the root class is not present', () => {
  const mockAdapter = td.object(MDCSliderFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass('mdc-slider')).thenReturn(false);

  const foundation = new MDCSliderFoundation(mockAdapter);
  assert.throws(() => foundation.init());
});

test('#init throws error when the necessary DOM is not present', () => {
  const mockAdapter = td.object(MDCSliderFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass('mdc-slider')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(false);

  const foundation = new MDCSliderFoundation(mockAdapter);
  assert.throws(() => foundation.init());
});

test('#init detects browser', () => {
  const { foundation, mockAdapter } = setupTest();
  td.when(mockAdapter.detectIsIE()).thenReturn(456);
  foundation.init();
  assert.strictEqual(foundation.isIE_, 456);
});

test('#init adds mdc-slider--upgraded class', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.init();
  td.verify(mockAdapter.addClass(cssClasses.UPGRADED));
});

test('#destroy removes mdc-slider--upgraded class', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.removeClass(cssClasses.UPGRADED));
});

test('#destroy deregisters input handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('input', td.matchers.isA(Function)));
});

test('#destroy deregisters change handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('change', td.matchers.isA(Function)));
});

test('#destroy deregisters mouseup handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('mouseup', td.matchers.isA(Function)));
});

test('#destroy deregisters touchmove handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('touchmove', td.matchers.isA(Function)));
});

test('#destroy deregisters touchstart handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterHandler('touchstart', td.matchers.isA(Function)));
});

test('#destroy deregisters mousedown handler', () => {
  const { foundation, mockAdapter } = setupTest();
  foundation.destroy();
  td.verify(mockAdapter.deregisterRootHandler('mousedown', td.matchers.isA(Function)));
});

test('on input sets valuenow', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  foundation.init();

  td.when(mockAdapter.setAttr('aria-valuenow', td.matchers.anything())).thenReturn();
  handlers.input(evt);
  td.verify(mockAdapter.setAttr('aria-valuenow', td.matchers.anything()));
});

test('on change sets valuenow', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  foundation.init();

  td.when(mockAdapter.setAttr('aria-valuenow', td.matchers.anything())).thenReturn();
  handlers.change(evt);
  td.verify(mockAdapter.setAttr('aria-valuenow', td.matchers.anything()));
});

test('on change adapter adds LOWEST_VALUE for fraction 0', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  const nativeInput = {
    value: 0,
    min: 0,
    max: 100,
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);

  foundation.init();
  handlers.change(evt);
  td.verify(mockAdapter.addInputClass(cssClasses.LOWEST_VALUE));
});

test('on change adapter removes LOWEST_VALUE for fraction != 0', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerHandler');
  const evt = {
    stopPropagation: () => {},
    target: {},
  };

  const nativeInput = {
    value: 50,
    min: 0,
    max: 100,
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);

  foundation.init();
  handlers.change(evt);
  td.verify(mockAdapter.removeInputClass(cssClasses.LOWEST_VALUE));
});

test('on touchmove calls preventDefault', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerHandler');
  const evt = {
    preventDefault: td.func('evt.preventDefault'),
    target: {},
    touches: [{ clientX: 50 }],
  };

  const nativeInput = {
    max: 100,
    getBoundingClientRect: () => ({ width: 100, left: 0 }),
    dispatchEvent: () => undefined,
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();
  handlers.touchmove(evt);
  td.verify(evt.preventDefault());
});

test('on touchmove calls dispatchEvent', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerHandler');
  const evt = {
    preventDefault: td.func('evt.preventDefault'),
    target: {},
    touches: [{ clientX: 50 }],
  };

  const nativeInput = {
    max: 100,
    getBoundingClientRect: () => ({ width: 100, left: 0, top: 10 }),
    dispatchEvent: td.func('input.dispatchEvent'),
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();
  handlers.touchmove(evt);
  td.verify(nativeInput.dispatchEvent(td.matchers.anything()));
});

test('on touchstart calls preventDefault', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerHandler');
  const evt = {
    preventDefault: td.func('evt.preventDefault'),
    target: {},
    touches: [{ clientX: 50 }],
  };

  const nativeInput = {
    max: 100,
    getBoundingClientRect: () => ({ width: 100, left: 0 }),
    dispatchEvent: () => undefined,
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();
  handlers.touchstart(evt);
  td.verify(evt.preventDefault());
});

test('on mousedown calls preventDefault', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerRootHandler');
  const target = {};
  const evt = {
    preventDefault: td.func('evt.preventDefault'),
    target,
  };

  const nativeInput = {
    max: 100,
    parentElement: target,
    getBoundingClientRect: () => ({ width: 100, left: 0, top: 10 }),
    dispatchEvent: () => undefined,
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();
  handlers.mousedown(evt);
  td.verify(evt.preventDefault());
});

test('on mousedown calls dispatchEvent', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerRootHandler');
  const target = {};
  const evt = {
    preventDefault: td.func('evt.preventDefault'),
    target,
  };

  const nativeInput = {
    max: 100,
    parentElement: target,
    getBoundingClientRect: () => ({ width: 100, left: 0, top: 10 }),
    dispatchEvent: td.func('input.dispatchEvent'),
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();
  handlers.mousedown(evt);
  td.verify(nativeInput.dispatchEvent(td.matchers.anything()));
});

test('on mouseup calls target.blur()', () => {
  const { foundation, mockAdapter } = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerHandler');
  const evt = {
    preventDefault: td.func('evt.preventDefault'),
    target: { blur: td.func('evt.target.blur') },
  };

  foundation.init();
  handlers.mouseup(evt);
  td.verify(evt.target.blur());
});
