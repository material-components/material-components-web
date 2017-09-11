/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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
import td from 'testdouble';
import {assert} from 'chai';
import mdcAutoInit from '../../../packages/mdc-auto-init';

class FakeComponent {
  static attachTo(node) {
    return new this(node);
  }

  constructor(node) {
    this.node = node;
  }
}

const createFixture = () => bel`
  <div id="root">
    <p data-mdc-auto-init="FakeComponent" class="mdc-fake">Fake Element</p>
  </div>
`;

const setupTest = () => {
  mdcAutoInit.deregisterAll();
  mdcAutoInit.register('FakeComponent', FakeComponent);
  return createFixture();
};

suite('MDCAutoInit');

test('calls attachTo() on components registered for identifier on nodes w/ data-mdc-auto-init attr', () => {
  const root = setupTest();
  mdcAutoInit(root);

  assert.isOk(root.querySelector('.mdc-fake').FakeComponent instanceof FakeComponent);
});

test('passes the node where "data-mdc-auto-init" was found to attachTo()', () => {
  const root = setupTest();
  mdcAutoInit(root);

  const fake = root.querySelector('.mdc-fake');
  assert.equal(fake.FakeComponent.node, fake);
});

test('throws when no constructor name is specified within "data-mdc-auto-init"', () => {
  const root = setupTest();
  root.querySelector('.mdc-fake').dataset.mdcAutoInit = '';

  assert.throws(() => mdcAutoInit(root));
});

test('throws when constructor is not registered', () => {
  const root = setupTest();
  root.querySelector('.mdc-fake').dataset.mdcAutoInit = 'MDCUnregisteredComponent';

  assert.throws(() => mdcAutoInit(root));
});

test('warns when autoInit called multiple times on a node', () => {
  const root = setupTest();
  const warn = td.func('warn');
  const {contains} = td.matchers;

  mdcAutoInit(root, warn);
  mdcAutoInit(root, warn);

  td.verify(warn(contains('(mdc-auto-init) Component already initialized')));
});

test('#register throws when Ctor is not a function', () => {
  assert.throws(() => mdcAutoInit.register('not-a-function', 'Not a function'));
});

test('#register warns when registered key is being overridden', () => {
  const warn = td.func('warn');
  const {contains} = td.matchers;

  mdcAutoInit.register('FakeComponent', () => ({overridden: true}), warn);

  td.verify(warn(contains('(mdc-auto-init) Overriding registration')));
});

test('#dispatches a MDCAutoInit:End event when all components are initialized', () => {
  const root = document.createElement('div');
  const handler = td.func('eventHandler');
  let evt = null;

  td.when(handler(td.matchers.isA(Object))).thenDo((evt_) => {
    evt = evt_;
  });

  const type = 'MDCAutoInit:End';

  document.addEventListener(type, handler);
  mdcAutoInit(root);

  assert.isOk(evt !== null);
  assert.equal(evt.type, type);
});

test('#dispatches a MDCAutoInit:End event when all components are initialized - custom events not supported', () => {
  const root = document.createElement('div');
  const handler = td.func('eventHandler');
  let evt = null;

  td.when(handler(td.matchers.isA(Object))).thenDo((evt_) => {
    evt = evt_;
  });

  const type = 'MDCAutoInit:End';

  document.addEventListener(type, handler);

  const {CustomEvent} = window;
  window.CustomEvent = undefined;
  try {
    mdcAutoInit(root);
  } finally {
    window.CustomEvent = CustomEvent;
  }

  assert.isOk(evt !== null);
  assert.equal(evt.type, type);
});
