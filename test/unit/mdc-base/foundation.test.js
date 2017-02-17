/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import {MDCFoundation} from '../../../packages/mdc-base';

class FakeFoundation extends MDCFoundation {
  get adapter() {
    return this.adapter_;
  }
}

suite('MDCFoundation');

test('cssClasses getter returns an empty object', () => {
  assert.deepEqual(MDCFoundation.cssClasses, {});
});

test('strings getter returns an empty object', () => {
  assert.deepEqual(MDCFoundation.strings, {});
});

test('numbers getter returns an empty object', () => {
  assert.deepEqual(MDCFoundation.numbers, {});
});

test('defaultAdapter getter returns an empty object', () => {
  assert.deepEqual(MDCFoundation.defaultAdapter, {});
});

test('takes an adapter object in its constructor, assigns it to "adapter_"', () => {
  const adapter = {adapter: true};
  const f = new FakeFoundation(adapter);
  assert.deepEqual(f.adapter, adapter);
});

test('assigns adapter to an empty object when none given', () => {
  const f = new FakeFoundation();
  assert.deepEqual(f.adapter, {});
});

test('provides an init() lifecycle method, which defaults to a no-op', () => {
  const f = new FakeFoundation();
  assert.doesNotThrow(() => f.init());
});

test('provides a destroy() lifecycle method, which defaults to a no-op', () => {
  const f = new FakeFoundation();
  assert.doesNotThrow(() => f.destroy());
});
