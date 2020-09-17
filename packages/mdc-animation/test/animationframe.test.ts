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

import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {AnimationFrame} from '../index';

describe('AnimationFrame', () => {
  setUpMdcTestEnvironment();

  it('#request adds an animation frame callback', () => {
    const af = new AnimationFrame();
    const cb = jasmine.createSpy('callback');
    af.request('x', cb);
    jasmine.clock().tick(1);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('#request with duplicate keys only executes the latest callback', () => {
    const af = new AnimationFrame();
    const cb1 = jasmine.createSpy('callback1');
    const cb2 = jasmine.createSpy('callback2');
    const cb3 = jasmine.createSpy('callback3');
    af.request('x', cb1);
    af.request('x', cb2);
    af.request('x', cb3);
    jasmine.clock().tick(1);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
    expect(cb3).toHaveBeenCalledTimes(1);
  });

  it('#cancel will cancel the keyed callback', () => {
    const af = new AnimationFrame();
    const cb = jasmine.createSpy('callback');
    af.request('x', cb);
    af.cancel('x');
    jasmine.clock().tick(1);
    expect(cb).not.toHaveBeenCalled();
  });

  it('#cancel will not cancel a mismatched key', () => {
    const af = new AnimationFrame();
    const cb = jasmine.createSpy('callback');
    af.request('x', cb);
    af.cancel('a');
    jasmine.clock().tick(1);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('#cancelAll cancels all keys', () => {
    const af = new AnimationFrame();
    const cb1 = jasmine.createSpy('callback1');
    const cb2 = jasmine.createSpy('callback2');
    const cb3 = jasmine.createSpy('callback3');
    af.request('x', cb1);
    af.request('y', cb2);
    af.request('z', cb3);
    af.cancelAll();
    jasmine.clock().tick(3);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
    expect(cb3).not.toHaveBeenCalled();
  });

  it('#getQueue will return the keys in the order they were entered', () => {
    const af = new AnimationFrame();
    const cb1 = jasmine.createSpy('callback1');
    const cb2 = jasmine.createSpy('callback2');
    const cb3 = jasmine.createSpy('callback3');
    af.request('x', cb1);
    af.request('y', cb2);
    af.request('z', cb3);
    expect(af.getQueue()).toEqual(['x', 'y', 'z']);
  });

  it('#getQueue will return not return keys that have finished', () => {
    const af = new AnimationFrame();
    const cb = jasmine.createSpy('callback');
    af.request('x', cb);
    jasmine.clock().tick(1);
    expect(af.getQueue()).toEqual([]);
  });
});
