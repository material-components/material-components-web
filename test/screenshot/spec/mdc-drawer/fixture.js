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

const temporaryDrawerEl = document.querySelector('.mdc-drawer--temporary');
const persistentDrawerEl = document.querySelector('.mdc-drawer--persistent');

if (temporaryDrawerEl) {
  const MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
  const temporaryDrawer = new MDCTemporaryDrawer(temporaryDrawerEl);

  document.querySelector('#test-drawer-menu-button').addEventListener('click', () => {
    temporaryDrawer.open = !temporaryDrawer.open;
  });
}

if (persistentDrawerEl) {
  const MDCPersistentDrawer = mdc.drawer.MDCPersistentDrawer;
  const persistentDrawer = new MDCPersistentDrawer(persistentDrawerEl);

  document.querySelector('#test-drawer-menu-button').addEventListener('click', () => {
    persistentDrawer.open = !persistentDrawer.open;
  });
}
