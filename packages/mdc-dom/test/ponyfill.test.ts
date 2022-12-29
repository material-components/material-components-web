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

import {closest, estimateScrollWidth, matches} from '../ponyfill';

function getFixture(content: string) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = content;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

describe('MDCDom - ponyfill', () => {
  it('#closest returns result from native method if available', () => {
    const mockElement = jasmine.createSpyObj('mockElement', ['closest']);
    const selector = '.foo';
    mockElement.closest.withArgs(selector).and.returnValue(mockElement);

    expect(closest(mockElement, selector)).toBe(mockElement);
  });

  it('#closest returns the element when the selector matches the element',
     () => {
       const mockElement = jasmine.createSpyObj('mockElement', ['matches']);
       const selector = '.foo';
       mockElement.matches.withArgs(selector).and.returnValue(true);

       expect(closest(mockElement, selector)).toBe(mockElement);
     });

  it('#closest returns the parent element when the selector matches the parent element',
     () => {
       const mockParentMatches = jasmine.createSpy('mockParentElement.matches');
       const mockMatches = jasmine.createSpy('mockChildElement.matches');
       const mockParentElement = {
         matches: mockParentMatches,
       } as unknown as HTMLElement;
       const mockChildElement = {
         matches: mockMatches,
         parentElement: mockParentElement,
       } as unknown as HTMLElement;
       const selector = '.foo';
       mockMatches.withArgs(selector).and.returnValue(false);
       mockParentMatches.withArgs(selector).and.returnValue(true);

       expect(closest(mockChildElement, selector)).toBe(mockParentElement);
     });

  it('#closest returns null when there is no ancestor matching the selector',
     () => {
       const mockParentMatches = jasmine.createSpy('mockParentElement.matches');
       const mockMatches = jasmine.createSpy('mockChildElement.matches');
       const mockChildElement = {
         matches: mockMatches,
         parentElement: {
           matches: mockParentMatches,
         },
       } as unknown as HTMLElement;
       const selector = '.foo';
       mockMatches.withArgs(selector).and.returnValue(false);
       mockParentMatches.withArgs(selector).and.returnValue(false);

       expect(closest(mockChildElement, selector)).toBeNull();
     });

  it('#matches returns true when the selector matches the element', () => {
    const element = getFixture(`<div class="foo"></div>`);
    expect(matches(element, '.foo')).toBe(true);
  });

  it('#matches returns false when the selector does not match the element',
     () => {
       const element = getFixture(`<div class="foo"></div>`);
       expect(matches(element, '.bar')).toBe(false);
     });

  it('#matches supports vendor prefixes', () => {
    expect(matches({matches: () => true} as unknown as Element, '')).toBe(true);
    expect(
        matches({webkitMatchesSelector: () => true} as unknown as Element, ''))
        .toBe(true);
    expect(matches({msMatchesSelector: () => true} as unknown as Element, ''))
        .toBe(true);
  });

  it('#estimateScrollWidth returns the default width when the element is not hidden',
     () => {
       const root = getFixture(`<span>
    <span id="i0" style="width:10px;"></span>
  </span>`);
       const el = root.querySelector<HTMLSpanElement>('#i0')!;
       expect(estimateScrollWidth(el)).toBe(10);
     });

  it('#estimateScrollWidth returns the estimated width when the element is hidden',
     () => {
       const root = getFixture(`<span style="display:none;">
    <span id="i0" style="width:10px;"></span>
  </span>`);
       const el = root.querySelector<HTMLSpanElement>('#i0')!;
       expect(estimateScrollWidth(el)).toBe(10);
     });
});
