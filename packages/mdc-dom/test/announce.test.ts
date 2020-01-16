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
import {announce, AnnouncerPriority} from '../announce';

describe('announce', () => {
  setUpMdcTestEnvironment();

  it('creates an aria-live="polite" region by default', () => {
    announce('Foo');
    jasmine.clock().tick(1);
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion!.textContent).toEqual('Foo');
  });

  it('creates an aria-live="assertive" region if specified', () => {
    announce('Bar', AnnouncerPriority.ASSERTIVE);
    jasmine.clock().tick(1);
    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion!.textContent).toEqual('Bar');
  });

  it('sets live region content after a timeout', () => {
    announce('Baz');
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion!.textContent).toEqual('');
    jasmine.clock().tick(1);
    expect(liveRegion!.textContent).toEqual('Baz');
  });

  it('reuses same polite live region on successive calls', () => {
    announce('aaa');
    announce('bbb');
    announce('ccc');
    const liveRegions = document.querySelectorAll('[aria-live="polite"]');
    expect(liveRegions.length).toEqual(1);
  });

  it('reuses same assertive live region on successive calls', () => {
    announce('aaa', AnnouncerPriority.ASSERTIVE);
    announce('bbb', AnnouncerPriority.ASSERTIVE);
    announce('ccc', AnnouncerPriority.ASSERTIVE);
    const liveRegions = document.querySelectorAll('[aria-live="assertive"]');
    expect(liveRegions.length).toEqual(1);
  });

  it('sets the latest message during immediate successive', () => {
    announce('1');
    announce('2');
    announce('3');
    jasmine.clock().tick(1);
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion!.textContent).toEqual('3');
  });
});
