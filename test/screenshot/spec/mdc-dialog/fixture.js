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

import {strings} from '../../../../packages/mdc-dialog/constants';

window.mdc.testFixture.fontsLoaded.then(() => {
  [].forEach.call(document.querySelectorAll('.mdc-dialog'), /** @param {!HTMLElement} dialogEl */ (dialogEl) => {
    /** @type {!MDCDialog} */
    const dialog = new mdc.dialog.MDCDialog(dialogEl);

    const eventNames = [
      strings.YES_EVENT, strings.NO_EVENT, strings.CANCEL_EVENT,
      strings.OPEN_START_EVENT, strings.OPEN_END_EVENT,
      strings.CLOSE_START_EVENT, strings.CLOSE_END_EVENT,
    ];

    eventNames.forEach((eventName) => {
      dialog.listen(eventName, (evt) => console.log(eventName, evt));
    });

    if (dialogEl.classList.contains('test-dialog--scroll-to-bottom')) {
      const bodyEl = dialogEl.querySelector('.mdc-dialog__content');
      if (bodyEl) {
        const setContentScrollPosition = () => {
          bodyEl.scrollTop = bodyEl.scrollHeight;
          if (bodyEl.scrollTop === 0) {
            requestAnimationFrame(setContentScrollPosition);
          }
        };
        setContentScrollPosition();
      }
    }

    dialog.show();
  });
});
