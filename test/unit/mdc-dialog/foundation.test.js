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
// import td from 'testdouble';

// import {setupFoundationTest} from '../helpers/setup';
// import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {verifyDefaultAdapter} from '../helpers/foundation';

import MDCDialogFoundation from '../../../packages/mdc-dialog/foundation';

suite('MDCDialogFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCDialogFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCDialogFoundation, [
    'backgroundEl', 'dialogEl', 'hasClass', 'addClass', 'removeClass',
    'addScrollLockClass', 'removeScrollLockClass',
    'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerDialogInteractionHandler', 'deregisterDialogInteractionHandler',
    'registerDocumentKeydownHandler', 'deregisterDocumentKeydownHandler',
    'registerAcceptHandler', 'deregisterAcceptHandler',
    'registerCancelHandler', 'deregisterCancelHandler',
    'registerFocusTrappingHandler', 'deregisterFocusTrappingHandler',
    'getFocusableElements', 'saveElementTabState', 'restoreElementTabState',
    'makeElementUntabbable', 'setAttribute', 'acceptButton', 'cancelButton',
    'acceptAction', 'cancelAction',
  ]);
});

// function setupTest() {
//   return setupFoundationTest(MDCDialogFoundation);
// }

// test('#close deregisters all events registered within open()', () => {
//   const {foundation, mockAdapter} = setupTest();
//   const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
//   const dialogHandlers = captureHandlers(mockAdapter, 'registerDialogInteractionHandler');
//   const documentKeydownHandlers = captureHandlers(mockAdapter, 'registerDocumentKeydownHandler');
//   const acceptHandlers = captureHandlers(mockAdapter, 'registerAcceptHandler');
//   const cancelHandlers = captureHandlers(mockAdapter, 'registerCancelHandler');
//   const focusTrappingHandlers = captureHandlers(mockAdapter, 'registerFocusTrappingHandler');
//
// 	foundation.init();
// 	foundation.open();
//  foundation.close();
//
// 	Object.keys(handlers).forEach((type) => {
//     td.verify(mockAdapter.deregisterInteractionHandler(type, td.matchers.isA(Function)));
//   });
//   Object.keys(dialogHandlers).forEach((type) => {
//     td.verify(
//       mockAdapter.deregisterDialogInteractionHandler(type, td.matchers.isA(Function))
//     );
//   });
//   Object.keys(documentKeydownHandlers).forEach((type) => {
//     td.verify(
//       mockAdapter.deregisterDocumentKeydownHandler(type, td.matchers.isA(Function))
//     );
//   });
//   Object.keys(acceptHandlers).forEach((type) => {
//     td.verify(
//       mockAdapter.deregisterAcceptHandler(type, td.matchers.isA(Function))
//     );
//   });
//   Object.keys(cancelHandlers).forEach((type) => {
//     td.verify(
//       mockAdapter.deregisterCancelHandler(type, td.matchers.isA(Function))
//     );
//   });
//   Object.keys(focusTrappingHandlers).forEach((type) => {
//     td.verify(
//       mockAdapter.deregisterFocusTrappingHandler(type, td.matchers.isA(Function))
//     );
//   });
// });
