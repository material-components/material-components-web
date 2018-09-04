/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
