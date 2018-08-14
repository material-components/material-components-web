/**
 * @license
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
import * as utils from '../../../packages/mdc-menu-surface/util';

suite('MDCMenuSurface - util');

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

test('getTransformPropertyName returns "webkitTransform" for browsers that do not support "transform"', () => {
  const mockWindow = {
    document: {
      createElement: function() {
        return {style: {webkitTransform: null}};
      },
    },
  };
  assert.equal(utils.getTransformPropertyName(mockWindow, true), 'webkitTransform');
});

test('getTransformPropertyName caches the property name if forceRefresh 2nd arg is not given', () => {
  const mockElement = {style: {transform: null}};
  const mockWindow = {
    document: {
      createElement: () => mockElement,
    },
  };
  assert.equal(utils.getTransformPropertyName(mockWindow, true), 'transform', 'sanity check');
  assert.equal(utils.getTransformPropertyName(mockWindow), 'transform', 'sanity check no force refresh');

  delete mockElement.style.transform;
  assert.equal(utils.getTransformPropertyName(mockWindow), 'transform');
  assert.equal(utils.getTransformPropertyName(mockWindow, true), 'webkitTransform');
});
