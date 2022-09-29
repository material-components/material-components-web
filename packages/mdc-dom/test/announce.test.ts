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
import {announce, AnnouncerPriority, DATA_MDC_DOM_ANNOUNCE} from '../announce';

const LIVE_REGION_SELECTOR = `[${DATA_MDC_DOM_ANNOUNCE}="true"]`;

describe('announce', () => {
  setUpMdcTestEnvironment();

  afterEach(() => {
    const liveRegions = document.querySelectorAll(LIVE_REGION_SELECTOR);
    for (let i = 0; i < liveRegions.length; i++) {
      const liveRegion = liveRegions[i];
      if (!liveRegion.parentNode) continue;
      liveRegion.parentNode.removeChild(liveRegion);
    }
  });

  it('creates an aria-live="polite" region by default', () => {
    announce('Foo');
    jasmine.clock().tick(1);
    const liveRegion = document.querySelector(LIVE_REGION_SELECTOR);
    expect(liveRegion!.textContent).toEqual('Foo');
  });

  it('creates an aria-live="assertive" region if specified', () => {
    announce('Bar', {priority: AnnouncerPriority.ASSERTIVE});
    jasmine.clock().tick(1);
    const liveRegion = document.querySelector(LIVE_REGION_SELECTOR);
    expect(liveRegion!.textContent).toEqual('Bar');
  });

  it('uses the provided ownerDocument for announcements', () => {
    const ownerDocument = document.implementation.createHTMLDocument('Title');
    announce('custom ownerDocument', {ownerDocument});
    const globalDocumentLiveRegion =
        document.querySelector(LIVE_REGION_SELECTOR);
    expect(globalDocumentLiveRegion).toBeNull();
    const ownerDocumentLiveRegion =
        ownerDocument.querySelector(LIVE_REGION_SELECTOR);
    expect(ownerDocumentLiveRegion).toBeDefined();
  });

  it('sets live region content after a timeout', () => {
    announce('Baz');
    const liveRegion = document.querySelector(LIVE_REGION_SELECTOR);
    expect(liveRegion!.textContent).toEqual('');
    jasmine.clock().tick(1);
    expect(liveRegion!.textContent).toEqual('Baz');
  });

  it('reuses same live region on successive calls per document', () => {
    const secondDocument = document.implementation.createHTMLDocument('Title');
    announce('aaa');
    announce('aaa', {ownerDocument: secondDocument});
    announce('bbb');
    announce('bbb', {ownerDocument: secondDocument});
    announce('ccc');
    announce('ccc', {ownerDocument: secondDocument});

    const globalDocumentLiveRegions =
        document.querySelectorAll(LIVE_REGION_SELECTOR);
    expect(globalDocumentLiveRegions.length).toEqual(1);
    const secondDocumentLiveRegions =
        secondDocument.querySelectorAll(LIVE_REGION_SELECTOR);
    expect(secondDocumentLiveRegions.length).toEqual(1);
  });

  it('sets the latest message during immediate successive', () => {
    announce('1');
    announce('2');
    announce('3');
    jasmine.clock().tick(1);
    const liveRegion = document.querySelector(LIVE_REGION_SELECTOR);
    expect(liveRegion!.textContent).toEqual('3');
  });

  it('clears out the message on click', () => {
    announce('hello');
    jasmine.clock().tick(1);
    const liveRegion = document.querySelector(LIVE_REGION_SELECTOR);
    expect(liveRegion!.textContent).toEqual('hello');
    document.documentElement.click();
    expect(liveRegion!.textContent).toEqual('');
  });
});
