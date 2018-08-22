/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import td from 'testdouble';
import MDCModalDrawerFoundation from '../../../packages/mdc-drawer/modal/foundation';

suite('MDCModalDrawerFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCModalDrawerFoundation.defaultAdapter);
  const foundation = new MDCModalDrawerFoundation(mockAdapter);
  const MockFoundationCtor = td.constructor(MDCModalDrawerFoundation);
  const mockFoundation = new MockFoundationCtor();

  return {foundation, mockAdapter, mockFoundation};
};

test('#opened traps the focus when drawer finishes animating open', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.opened();
  td.verify(mockAdapter.trapFocus(), {times: 1});
});

test('#closed untraps the focus when drawer finishes animating close', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.closed();
  td.verify(mockAdapter.releaseFocus(), {times: 1});
});

test('#handleScrimClick closes the drawer', () => {
  const {foundation} = setupTest();
  foundation.handleScrimClick();
  td.verify(foundation.close(), {times: 1});
});
