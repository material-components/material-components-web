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
import bel from 'bel';

import * as utils from '../../../packages/mdc-drawer/util';

suite('MDCDrawer - util');

test('remapEvent returns the provided event name for non-mapped events', () => {
  assert.equal(utils.remapEvent('change'), 'change');
});

test('remapEvent returns the provided event name for mapped events, if browser supports touch events', () => {
  const mockWindow = {
    document: {
      ontouchstart: function() {},
    },
  };
  assert.equal(utils.remapEvent('touchstart', mockWindow), 'touchstart');
  assert.equal(utils.remapEvent('touchmove', mockWindow), 'touchmove');
  assert.equal(utils.remapEvent('touchend', mockWindow), 'touchend');
});

test('remapEvent returns the mapped event name for mapped events, if browser does not support touch events', () => {
  const mockWindow = {
    document: {},
  };
  assert.equal(utils.remapEvent('touchstart', mockWindow), 'pointerdown');
  assert.equal(utils.remapEvent('touchmove', mockWindow), 'pointermove');
  assert.equal(utils.remapEvent('touchend', mockWindow), 'pointerup');
});

test('remapEvent returns the original event name if browser does not support touch event name is not a ' +
     'known touch event', () => {
  const mockWindow = {
    document: {},
  };
  assert.equal(utils.remapEvent('notAPointerEvent', mockWindow), 'notAPointerEvent');
});

test('getTransformPropertyName returns "transform" for browsers that support it', () => {
  const mockWindow = {
    document: {
      createElement: function() {
        return {style: {transform: null}};
      },
    },
  };
  assert.equal(utils.getTransformPropertyName(mockWindow, true), 'transform');
});

test('getTransformPropertyName returns "-webkit-transform" for browsers that do not support "transform"', () => {
  const mockWindow = {
    document: {
      createElement: function() {
        return {style: {'-webkit-transform': null}};
      },
    },
  };
  assert.equal(utils.getTransformPropertyName(mockWindow, true), '-webkit-transform');
});

test('supportsCssCustomProperties returns true for browsers that support them', () => {
  const supports = td.function('supports');
  td.when(supports('(--color: red)')).thenReturn(true);
  const mockWindow = {
    CSS: {supports: supports},
  };
  assert.isOk(utils.supportsCssCustomProperties(mockWindow));
});

test('supportsCssCustomProperties returns false for browsers that do not support them', () => {
  const supports = td.function('supports');
  td.when(supports('(--color: red)')).thenReturn(false);
  const mockWindow = {
    CSS: {supports: supports},
  };
  assert.isNotOk(utils.supportsCssCustomProperties(mockWindow));
});

test('supportsCssCustomProperties returns false for browsers that do not support CSS.supports', () => {
  const mockWindow = {};
  assert.isNotOk(utils.supportsCssCustomProperties(mockWindow));
});

test('applyPassive returns an options object for browsers that support passive event listeners', () => {
  const mockWindow = {
    document: {
      addEventListener: function(name, method, options) {
        return options.passive;
      },
    },
  };
  assert.deepEqual(utils.applyPassive(mockWindow, true), {passive: true});
});

test('applyPassive returns false for browsers that do not support passive event listeners', () => {
  const mockWindow = {
    document: {
      addEventListener: function() {
        throw new Error();
      },
    },
  };
  assert.isNotOk(utils.applyPassive(mockWindow, true));
});

test('saveElementTabState saves the tab index of an element', () => {
  const el = bel`<div id="foo" tabindex="42"></div>`;
  utils.saveElementTabState(el);
  assert.equal(el.getAttribute('data-mdc-tabindex'), '42');
  assert.equal(el.getAttribute('data-mdc-tabindex-handled'), 'true');
});

test('saveElementTabState marks an element as handled, as long as it is tabbable', () => {
  const el = bel`<a id="foo" href="foo"></a>`;
  utils.saveElementTabState(el);
  assert.equal(el.getAttribute('data-mdc-tabindex'), null);
  assert.equal(el.getAttribute('data-mdc-tabindex-handled'), 'true');
});

test('restoreElementTabState does nothing to an element we have not already handled ', () => {
  const el = bel`<a id="foo" href="foo" data-mdc-tabindex="42"></a>`;
  utils.restoreElementTabState(el);
  assert.equal(el.getAttribute('tabindex'), null);
  assert.equal(el.getAttribute('data-mdc-tabindex'), '42');
});

test('restoreElementTabState restores the tab index of an element that was saved earlier', () => {
  const el = bel`<a id="foo" href="foo" data-mdc-tabindex="42" data-mdc-tabindex-handled="true"></a>`;
  utils.restoreElementTabState(el);
  assert.equal(el.getAttribute('tabindex'), '42');
  assert.equal(el.getAttribute('data-mdc-tabindex'), null);
  assert.equal(el.getAttribute('data-mdc-tabindex-handled'), null);
});

test('restoreElementTabState removes the temporary tabindex of an implicitly tabbable element', () => {
  const el = bel`<a id="foo" href="foo" data-mdc-tabindex-handled="true"></a>`;
  utils.restoreElementTabState(el);
  assert.equal(el.getAttribute('tabindex'), null);
  assert.equal(el.getAttribute('data-mdc-tabindex'), null);
  assert.equal(el.getAttribute('data-mdc-tabindex-handled'), null);
});
