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

import bel from 'bel';
import {assert} from 'chai';
import td from 'testdouble';
import domEvents from 'dom-events';

import {MDCChip, MDCChipFoundation} from '../../../packages/mdc-chips/chip';

const getFixture = () => bel`
  <div class="mdc-chip">
    <div class="mdc-chip__text">Chip content</div>
  </div>
`;

suite('MDCChip');

test('attachTo returns an MDCChip instance', () => {
  assert.isOk(MDCChip.attachTo(getFixture()) instanceof MDCChip);
});

function setupTest() {
  const root = getFixture();
  const component = new MDCChip(root);
  return {root, component};
}

test('#adapter.registerInteractionHandler adds event listener for a given event to the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('click handler');
  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterInteractionHandler removes event listener for a given event from the root element', () => {
  const {root, component} = setupTest();
  const handler = td.func('click handler');

  root.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(root, 'click');

  td.verify(handler(td.matchers.anything()), {times: 0});
});

test('#adapter.notifyInteraction emits ' +
  `${MDCChipFoundation.strings.INTERACTION_EVENT}`, () => {
  const {component} = setupTest();
  const handler = td.func('interaction handler');

  component.listen(
    MDCChipFoundation.strings.INTERACTION_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyInteraction();

  td.verify(handler(td.matchers.anything()));
});
