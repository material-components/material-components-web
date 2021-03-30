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
import {isNavigationEvent, KEY, normalizeKey} from '../keyboard';

describe('normalizeKey', () => {
  setUpMdcTestEnvironment();

  const keyCodeTestTable = [
    {
      keyCode: 8,  // Backspace
      key: KEY.BACKSPACE,
    },
    {
      keyCode: 9,  // Tab
      key: KEY.TAB,
    },
    {
      keyCode: 13,  // Enter
      key: KEY.ENTER,
    },
    {
      keyCode: 32,  // Spacebar
      key: KEY.SPACEBAR,
    },
    {
      keyCode: 33,  // Page Up
      key: KEY.PAGE_UP,
    },
    {
      keyCode: 34,  // Page Down
      key: KEY.PAGE_DOWN,
    },
    {
      keyCode: 35,  // End
      key: KEY.END,
    },
    {
      keyCode: 36,  // Home
      key: KEY.HOME,
    },
    {
      keyCode: 37,  // Arrow Left
      key: KEY.ARROW_LEFT,
    },
    {
      keyCode: 38,  // Arrow Up
      key: KEY.ARROW_UP,
    },
    {
      keyCode: 39,  // Arrow Right
      key: KEY.ARROW_RIGHT,
    },
    {
      keyCode: 40,  // Arrow Down
      key: KEY.ARROW_DOWN,
    },
    {
      keyCode: 46,  // Delete
      key: KEY.DELETE,
    }
  ];

  for (const {key, keyCode} of keyCodeTestTable) {
    it(`returns "${key}" for keyCode "${keyCode}"`, () => {
      expect(normalizeKey({keyCode} as KeyboardEvent)).toEqual(key);
    });
  }

  // IE11 returns non-standard key values
  // See https://caniuse.com/#feat=keyboardevent-key
  const nonStandardKeyTestTable = [
    {
      keyCode: 32,      // Spacebar
      key: 'Spacebar',  // IE11's given key value
      want: KEY.SPACEBAR,
    },
    {
      keyCode: 37,  // Arrow Left
      key: 'Left',  // IE11's given key value
      want: KEY.ARROW_LEFT,
    },
    {
      keyCode: 38,  // Arrow Up
      key: 'Up',    // IE11's given key value
      want: KEY.ARROW_UP,
    },
    {
      keyCode: 39,   // Arrow Right
      key: 'Right',  // IE11's given key value
      want: KEY.ARROW_RIGHT,
    },
    {
      keyCode: 40,  // Arrow Down
      key: 'Down',  // IE11's given key value
      want: KEY.ARROW_DOWN,
    },
    {
      keyCode: 46,  // Delete
      key: 'Del',   // IE11's given key value
      want: KEY.DELETE,
    }
  ];

  for (const {key, keyCode, want} of nonStandardKeyTestTable) {
    it(`returns "${want}" for keyCode "${keyCode}"` +
           ` for non-standard key "${key}"`,
       () => {
         expect(normalizeKey({keyCode, key} as KeyboardEvent)).toEqual(want);
       });
  }

  const keyTestTable = [
    KEY.BACKSPACE,
    KEY.TAB,
    KEY.ENTER,
    KEY.SPACEBAR,
    KEY.PAGE_UP,
    KEY.PAGE_DOWN,
    KEY.END,
    KEY.HOME,
    KEY.ARROW_LEFT,
    KEY.ARROW_UP,
    KEY.ARROW_RIGHT,
    KEY.ARROW_DOWN,
    KEY.DELETE,
  ];

  for (const key of keyTestTable) {
    it(`returns "${key}" for key "${key}"`, () => {
      expect(normalizeKey({key} as KeyboardEvent)).toEqual(key);
    });
  }

  it(`returns "${KEY.UNKNOWN}" for unmapped keyCodes"`, () => {
    expect(normalizeKey({keyCode: 0} as KeyboardEvent)).toEqual(KEY.UNKNOWN);
  });
});

describe('isNavigationEvent', () => {
  setUpMdcTestEnvironment();

  const navigationKeyCodeTestTable = [
    33,  // Page Up
    34,  // Page Down
    35,  // End
    36,  // Home
    37,  // Arrow Left
    38,  // Arrow Up
    39,  // Arrow Right
    40,  // Arrow Down
  ];

  for (const keyCode of navigationKeyCodeTestTable) {
    it(`returns true for keyCode "${keyCode}"`, () => {
      expect(isNavigationEvent({keyCode} as KeyboardEvent)).toBe(true);
    });
  }

  const otherKeyCodeTestTable = [
    8,   // Backspace
    13,  // Enter
    32,  // Spacebar
    46,  // Delete
    0,
  ];

  for (const keyCode of otherKeyCodeTestTable) {
    it(`returns false for keyCode "${keyCode}"`, () => {
      expect(isNavigationEvent({keyCode} as KeyboardEvent)).toBe(false);
    });
  }
});
