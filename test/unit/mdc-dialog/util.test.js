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
import bel from 'bel';

import * as utils from '../../../packages/mdc-dialog/util';

suite('MDCDialog - util');

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
