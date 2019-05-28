/**
 * @license
 * Copyright 2016 Google Inc.
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

import bel from 'bel';
import td from 'testdouble';
import {assert} from 'chai';
import mdcAutoInit from '../../../packages/mdc-auto-init/index';

class FakeComponent {
  static attachTo(node) {
    return new this(node);
  }

  constructor(node) {
    this.node = node;
  }
}

class InvalidComponent {
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

const setupInvalidTest = () => {
  mdcAutoInit.deregisterAll();
  mdcAutoInit.register('InvalidComponent', InvalidComponent);
  return createFixture();
};

suite('MDCAutoInit');

test('calls attachTo() on components registered for identifier on nodes w/ data-mdc-auto-init attr', () => {
  const root = setupTest();
  mdcAutoInit(root);

  assert.isOk(root.querySelector('.mdc-fake').FakeComponent instanceof FakeComponent);
});

test('throws when attachTo() is missing', () => {
  const root = setupInvalidTest();
  assert.throws(() => mdcAutoInit(root));
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

test('#returns the initialized components', () => {
  const root = setupTest();
  const components = mdcAutoInit(root);

  assert.equal(components.length, 1);
  assert.isOk(components[0] instanceof FakeComponent);
});

test('does not register any components if element has data-mdc-auto-init-state="initialized"', () => {
  const root = setupTest();
  root.querySelector('[data-mdc-auto-init]').setAttribute('data-mdc-auto-init-state', 'initialized');
  mdcAutoInit(root);

  assert.isFalse(root.querySelector('.mdc-fake').FakeComponent instanceof FakeComponent);
});

test('does not return any new components after calling autoInit a second time', () => {
  const root = setupTest();

  let components = mdcAutoInit(root);
  assert.equal(components.length, 1);
  components = mdcAutoInit(root);
  assert.equal(components.length, 0);
});
