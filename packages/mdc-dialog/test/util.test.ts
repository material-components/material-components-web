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

import {FocusTrap} from '../../mdc-dom/focus-trap';
import * as util from '../util';

describe('MDCDialog - util', () => {
  it('createFocusTrapInstance creates a properly configured focus trap instance with all args specified',
     () => {
       const surface = document.createElement('div');
       const yesBtn = document.createElement('button');
       const focusTrapFactory = jasmine.createSpy('focusTrapFactory');
       const properlyConfiguredFocusTrapInstance = {} as FocusTrap;
       focusTrapFactory
           .withArgs(surface, {
             initialFocusEl: yesBtn,
           })
           .and.returnValue(properlyConfiguredFocusTrapInstance);

       const instance =
           util.createFocusTrapInstance(surface, focusTrapFactory, yesBtn);
       expect(instance).toEqual(properlyConfiguredFocusTrapInstance);
     });

  it('isScrollable returns false when element is null', () => {
    expect(util.isScrollable(null)).toBe(false);
  });

  it('isScrollable returns false when element has no content', () => {
    const parent = document.createElement('div');

    // Element.scrollHeight only returns the correct value when the element is
    // attached to the DOM.
    document.body.appendChild(parent);
    try {
      expect(util.isScrollable(parent)).toBe(false);
    } finally {
      document.body.removeChild(parent);
    }
  });

  it('isScrollable returns false when element content does not overflow its bounding box',
     () => {
       const parent = getElement(`
         <div style="height: 20px; overflow: auto;">
           <div style="height: 10px;"></div>
         </div>`);

       // Element.scrollHeight only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.isScrollable(parent)).toBe(false);
       } finally {
         document.body.removeChild(parent);
       }
     });

  it('isScrollable returns true when element content overflows its bounding box',
     () => {
       const parent = getElement(`
         <div style="height: 20px; overflow: auto;">
           <div style="height: 30px;"></div>
         </div>`);

       // Element.scrollHeight only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.isScrollable(parent)).toBe(true);
       } finally {
         document.body.removeChild(parent);
       }
     });

  it('isScrollAtTop returns true when scrollable content has not been scrolled',
     () => {
       const parent = getElement(`
         <div style="height: 20px; overflow: auto;">
           <div style="height: 30px;"></div>
         </div>`);

       // Element.scrollHeight only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.isScrollable(parent)).toBe(true);
         expect(util.isScrollAtTop(parent)).toBe(true);
       } finally {
         document.body.removeChild(parent);
       }
     });

  it('isScrollAtTop returns false when scrollable content has been scrolled',
     () => {
       const parent = getElement(`
         <div style="height: 20px; overflow: auto;">
           <div style="height: 30px;"></div>
         </div>`);

       // Element.scrollHeight only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.isScrollable(parent)).toBe(true);
         parent.scrollTop = 10;
         expect(util.isScrollAtTop(parent)).toBe(false);
       } finally {
         document.body.removeChild(parent);
       }
     });

  it('isScrollAtBottom returns false when scrollable content is not scrolled to the bottom',
     () => {
       const parent = getElement(`
         <div style="height: 20px; overflow: auto;">
           <div style="height: 30px;"></div>
         </div>`);

       // Element.scrollHeight only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.isScrollable(parent)).toBe(true);
         expect(util.isScrollAtBottom(parent)).toBe(false);
       } finally {
         document.body.removeChild(parent);
       }
     });

  it('isScrollAtBottom returns true when scrollable content has been scrolled to the bottom',
     () => {
       const parent = getElement(`
         <div style="height: 20px; overflow: auto;">
           <div style="height: 30px;"></div>
         </div>`);

       // Element.scrollHeight only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.isScrollable(parent)).toBe(true);
         parent.scrollTop = 10;
         expect(util.isScrollAtBottom(parent)).toBe(true);
       } finally {
         document.body.removeChild(parent);
       }
     });

  it('areTopsMisaligned returns false when array is empty', () => {
    expect(util.areTopsMisaligned([])).toBe(false);
  });

  it('areTopsMisaligned returns false when array only contains one element',
     () => {
       const parent = getElement(`
         <div style="display: flex;
                     position: relative;
                     flex-direction: row;
                     flex-wrap: wrap;
                     align-items: center;
                     justify-content: flex-end;">
           <button>1</button>
         </div>`);
       const buttons =
           Array.from(parent.querySelectorAll('button')) as HTMLElement[];

       // HTMLElement.offsetTop only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.areTopsMisaligned(buttons)).toBe(false);
       } finally {
         document.body.removeChild(parent);
       }
     });

  it('areTopsMisaligned returns false when elements have same offsetTop',
     () => {
       const parent = getElement(`
         <div style="display: flex;
                     position: relative;
                     flex-direction: row;
                     flex-wrap: wrap;
                     align-items: center;
                     justify-content: flex-end;">
           <button>1</button>
           <button>2</button>
         </div>`);
       const buttons =
           Array.from(parent.querySelectorAll('button')) as HTMLElement[];

       // HTMLElement.offsetTop only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.areTopsMisaligned(buttons)).toBe(false);
       } finally {
         document.body.removeChild(parent);
       }
     });

  it('areTopsMisaligned returns true when elements have different "top" values',
     () => {
       const parent = getElement(`
         <div style="display: flex;
                     position: relative;
                     flex-direction: column;
                     flex-wrap: wrap;
                     align-items: center;
                     justify-content: flex-end;">
           <button>1</button>
           <button>2</button>
         </div>`);
       const buttons =
           Array.from(parent.querySelectorAll('button')) as HTMLElement[];

       // HTMLElement.offsetTop only returns the correct value when the element
       // is attached to the DOM.
       document.body.appendChild(parent);
       try {
         expect(util.areTopsMisaligned(buttons)).toBe(true);
       } finally {
         document.body.removeChild(parent);
       }
     });
});

function getElement(innerHTML: string) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = innerHTML;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}
