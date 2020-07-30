/**
 * @license
 * Copyright 2019 Google Inc.
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

import {MDCComponent} from '@material/base/component';
import {MDCTextFieldCharacterCounterAdapter} from './adapter';
import {MDCTextFieldCharacterCounterFoundation} from './foundation';

export type MDCTextFieldCharacterCounterFactory =
    (el: Element, foundation?: MDCTextFieldCharacterCounterFoundation) => MDCTextFieldCharacterCounter;

export class MDCTextFieldCharacterCounter extends MDCComponent<MDCTextFieldCharacterCounterFoundation> {
  static attachTo(root: Element): MDCTextFieldCharacterCounter {
    return new MDCTextFieldCharacterCounter(root);
  }

  // Provided for access by MDCTextField component
  get foundationForTextField(): MDCTextFieldCharacterCounterFoundation {
    return this.foundation;
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCTextFieldCharacterCounterAdapter = {
      setContent: (content) => {
        this.root.textContent = content;
      },
    };
    return new MDCTextFieldCharacterCounterFoundation(adapter);
  }
}
