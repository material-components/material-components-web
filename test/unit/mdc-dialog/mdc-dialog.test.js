/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import bel from 'bel';
// import domEvents from 'dom-events';
// import td from 'testdouble';

import {MDCDialog} from '../../../packages/mdc-dialog';

// class MockDialog {
//   constructor() {
//     // this.items = [
//     //   bel`<div id="item-1">Item 1</div>`,
//     //   bel`<div id="item-2">Item 2</div>`,
//     //   bel`<div id="item-3">Item 3</div>`,
//     //   bel`<div>Item 4 no id</div>`,
//     // ];
//     // this.listen = td.func('menu.listen');
//     // this.unlisten = td.func('menu.unlisten');
//     // this.show = td.func('menu.show');
//     // this.hide = td.func('menu.hide');
//     this.open = false;
//   }
// }

function getFixture() {
  return bel`<aside class="mdc-dialog"
              role="alertdialog"
              aria-hidden="true"
              aria-labelledby="mdc-dialog__first__label"
              aria-describedby="mdc-dialog__first__description">
              <div class="mdc-dialog__surface">
                <header class="mdc-dialog__header">
                  <h2 id="mdc-dialog__first__label" class="mdc-dialog__header__title">
                    Use Google's location service?
                  </h2>
                </header>
                <section id="mdc-dialog__first__description" class="mdc-dialog__body">
                  Let Google help apps determine location.
                </section>
                <footer class="mdc-dialog__footer">
                  <button type="button" 
                    class="mdc-button mdc-dialog__footer__button mdc-dialog--cancel">DECLINE</button>
                  <button type="button" 
                    class="mdc-button mdc-dialog__footer__button mdc-dialog--accept">ACCEPT</button>
                </footer>
              </div>
              <div class="mdc-dialog__backdrop"></div>
            </aside>`;
}

suite('MDCDialog');

test('attachTo returns a component instance', () => {
  assert.isOk(MDCDialog.attachTo(getFixture()) instanceof MDCDialog);
});

// function setupTest() {
//   const dialog = new MockDialog();
//   const fixture = getFixture();
//   const menuEl = fixture.querySelector('.mdc-dialog');
//   const component = new MDCDialog(fixture, /* foundation */ undefined, () => dialog);
//   return {dialog, dialogEl, fixture, component};
// }
