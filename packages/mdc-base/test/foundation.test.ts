/**
 * @license
 * Copyright 2020 Google Inc.
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

import {MDCFoundation} from '../../mdc-base/foundation';

class FakeFoundation extends MDCFoundation {
  get _adapter() {
    return this.adapter;
  }
}

describe('MDCFoundation', () => {
  it('cssClasses getter returns an empty object', () => {
    expect(MDCFoundation.cssClasses).toEqual({});
  });

  it('strings getter returns an empty object', () => {
    expect(MDCFoundation.strings).toEqual({});
  });

  it('numbers getter returns an empty object', () => {
    expect(MDCFoundation.numbers).toEqual({});
  });

  it('defaultAdapter getter returns an empty object', () => {
    expect(MDCFoundation.defaultAdapter).toEqual({});
  });

  it('takes an adapter object in its constructor, assigns it to "adapter"',
     () => {
       const adapter = {adapter: true};
       const f = new FakeFoundation(adapter);
       expect(f._adapter).toEqual(adapter);
     });

  it('assigns adapter to an empty object when none given', () => {
    const f = new FakeFoundation();
    expect(f._adapter).toEqual({});
  });

  it('provides an init() lifecycle method, which defaults to a no-op', () => {
    const f = new FakeFoundation();
    expect(() => f.init).not.toThrow();
  });

  it('provides a destroy() lifecycle method, which defaults to a no-op', () => {
    const f = new FakeFoundation();
    expect(() => f.destroy).not.toThrow();
  });
});
