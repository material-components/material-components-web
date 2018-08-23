/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.mdc.testFixture.fontsLoaded.then(() => {
  [].forEach.call(document.querySelectorAll('.mdc-dialog'), /** @param {!HTMLElement} dialogEl */ (dialogEl) => {
    /** @type {!MDCDialog} */
    const dialog = new mdc.dialog.MDCDialog(dialogEl);
    dialog.show();

    if (dialogEl.classList.contains('test-dialog--scroll-to-bottom')) {
      const bodyEl = dialogEl.querySelector('.mdc-dialog__content');
      if (bodyEl) {
        bodyEl.scrollTop = bodyEl.scrollHeight;
      }
    }
  });
});
