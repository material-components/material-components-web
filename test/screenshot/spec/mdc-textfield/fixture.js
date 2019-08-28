/**
 * @license
 * Copyright 2018 Google Inc.
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

 import {cssClasses} from '@material/floating-label/constants';

window.mdc.testFixture.fontsLoaded.then(() => {
  [].forEach.call(document.querySelectorAll('.mdc-text-field:not([data-no-init="true"])'), (el) => {
    const textField = mdc.textField.MDCTextField.attachTo(el);

    if (el.getAttribute('data-native-input-validation') === 'false') {
      textField.useNativeValidation = false;
      textField.valid = false;
    }

    if (el.getAttribute('data-text-field-shake-leading') === 'true') {
      const floatingLabelEl = el.querySelector(cssClasses.ROOT);
      floatingLabelEl.classList.add(cssClasses.SHAKE);
      setTimeout(() => {
        floatingLabelEl.style.animationPlayState = 'paused';
      }, 164); // 164 (Stop at when label wiggles to leading / left.
    }
  });

  // Fixes the wide notched outline issue.
  [].forEach.call(document.querySelectorAll('.mdc-text-field__input[value=" "]'), (el) => {
    el.value = '';
  });

  window.mdc.testFixture.notifyDomReady();
});
