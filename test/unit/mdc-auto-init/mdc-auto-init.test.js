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
import test from 'tape';
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

test('calls attachTo() on components registered for identifier on nodes w/ data-mdc-auto-init attr', (t) => {
  const root = setupTest();
  mdcAutoInit(root);

  t.true(root.querySelector('.mdc-fake').FakeComponent instanceof FakeComponent);
  t.end();
});

test('passes the node where "data-mdc-auto-init" was found to attachTo()', (t) => {
  const root = setupTest();
  mdcAutoInit(root);

  const fake = root.querySelector('.mdc-fake');
  t.equal(fake.FakeComponent.node, fake);
  t.end();
});

test('throws when no constructor name is specified within "data-mdc-auto-init"', (t) => {
  const root = setupTest();
  root.querySelector('.mdc-fake').dataset.mdcAutoInit = '';

  t.throws(() => mdcAutoInit(root));
  t.end();
});

test('throws when constructor is not registered', (t) => {
  const root = setupTest();
  root.querySelector('.mdc-fake').dataset.mdcAutoInit = 'MDCUnregisteredComponent';

  t.throws(() => mdcAutoInit(root));
  t.end();
});

test('warns when autoInit called multiple times on a node', (t) => {
  const root = setupTest();
  const warn = td.func('warn');
  const {contains} = td.matchers;

  mdcAutoInit(root, warn);
  mdcAutoInit(root, warn);

  t.doesNotThrow(() => td.verify(warn(contains('(mdc-auto-init) Component already initialized'))));
  t.end();
});

test('#register throws when Ctor is not a function', (t) => {
  t.throws(() => mdcAutoInit.register('not-a-function', 'Not a function'));
  t.end();
});

test('#register warns when registered key is being overridden', (t) => {
  const warn = td.func('warn');
  const {contains} = td.matchers;

  mdcAutoInit.register('FakeComponent', () => ({overridden: true}), warn);

  t.doesNotThrow(() => td.verify(warn(contains('(mdc-auto-init) Overriding registration'))));
  t.end();
});
