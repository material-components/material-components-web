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
import domEvents from 'dom-events';
import td from 'testdouble';

import {strings, cssClasses} from '../../../packages/mdc-expansion-panel/accordion/constants';
import {MDCExpansionPanelAccordion, MDCExpansionPanel, MDCExpansionPanelFoundation, util}
  from '../../../packages/mdc-expansion-panel';

const rootSelector = `.${cssClasses.ROOT}`;
const anything = td.matchers.anything;

function getFixture() {
  return bel`
    <div>
      <div class="mdc-expansion-panel-accordion">
        <div data-mdc-auto-init="MDCExpansionPanel" class="mdc-expansion-panel mdc-expansion-panel--collapsed">
          <div class="mdc-expansion-panel__header">
            <!-- Summary Content -->
            <i class="material-icons mdc-expansion-panel--summary mdc-expansion-panel__header__section">done_all</i>
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click
              mdc-expansion-panel--summary mdc-expansion-panel__header__section">Title</span>
            <!-- Details Content -->
            <i class="material-icons mdc-expansion-panel--details mdc-expansion-panel__header__section">home</i>
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click
              mdc-expansion-panel--details mdc-expansion-panel__header__section">Expanded Title</span>
            <!-- Static Content -->
            <i class="material-icons mdc-expansion-panel__expansion-icon"></i>
          </div>
          <div class="mdc-expansion-panel__body">
            <p class="mdc-expansion-panel__text mdc-expansion-panel--no-click">Body</p>
          </div>
          <div class="mdc-expansion-panel__footer">
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click">Footer</span>
            <div class="mdc-expansion-panel__footer__button-bar">
              <button class="mdc-button mdc-expansion-panel--no-click">cancel</button>
              <button class="mdc-button mdc-expansion-panel--no-click">accept</button>
            </div>
          </div>
        </div>

        <div data-mdc-auto-init="MDCExpansionPanel" class="mdc-expansion-panel mdc-expansion-panel--collapsed">
          <div class="mdc-expansion-panel__header">
            <!-- Summary Content -->
            <i class="material-icons mdc-expansion-panel--summary mdc-expansion-panel__header__section">done_all</i>
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click
              mdc-expansion-panel--summary mdc-expansion-panel__header__section">Title</span>
            <!-- Details Content -->
            <i class="material-icons mdc-expansion-panel--details mdc-expansion-panel__header__section">home</i>
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click
              mdc-expansion-panel--details mdc-expansion-panel__header__section">Expanded Title</span>
            <!-- Static Content -->
            <i class="material-icons mdc-expansion-panel__expansion-icon"></i>
          </div>
          <div class="mdc-expansion-panel__body">
            <p class="mdc-expansion-panel__text mdc-expansion-panel--no-click">Body</p>
          </div>
          <div class="mdc-expansion-panel__footer">
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click">Footer</span>
            <div class="mdc-expansion-panel__footer__button-bar">
              <button class="mdc-button mdc-expansion-panel--no-click">cancel</button>
              <button class="mdc-button mdc-expansion-panel--no-click">accept</button>
            </div>
          </div>
        </div>

        <div data-mdc-auto-init="MDCExpansionPanel" class="mdc-expansion-panel mdc-expansion-panel--collapsed">
          <div class="mdc-expansion-panel__header">
            <!-- Summary Content -->
            <i class="material-icons mdc-expansion-panel--summary mdc-expansion-panel__header__section">done_all</i>
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click
              mdc-expansion-panel--summary mdc-expansion-panel__header__section">Title</span>
            <!-- Details Content -->
            <i class="material-icons mdc-expansion-panel--details mdc-expansion-panel__header__section">home</i>
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click
              mdc-expansion-panel--details mdc-expansion-panel__header__section">Expanded Title</span>
            <!-- Static Content -->
            <i class="material-icons mdc-expansion-panel__expansion-icon"></i>
          </div>
          <div class="mdc-expansion-panel__body">
            <p class="mdc-expansion-panel__text mdc-expansion-panel--no-click">Body</p>
          </div>
          <div class="mdc-expansion-panel__footer">
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click">Footer</span>
            <div class="mdc-expansion-panel__footer__button-bar">
              <button class="mdc-button mdc-expansion-panel--no-click">cancel</button>
              <button class="mdc-button mdc-expansion-panel--no-click">accept</button>
            </div>
          </div>
        </div>

        <div data-mdc-auto-init="MDCExpansionPanel"class="mdc-expansion-panel mdc-expansion-panel--collapsed
          mdc-expansion-panel-accordion--excluded">
          <div class="mdc-expansion-panel__header">
            <!-- Summary Content -->
            <i class="material-icons mdc-expansion-panel--summary mdc-expansion-panel__header__section">done_all</i>
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click
              mdc-expansion-panel--summary mdc-expansion-panel__header__section">Title</span>
            <!-- Details Content -->
            <i class="material-icons mdc-expansion-panel--details mdc-expansion-panel__header__section">home</i>
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click
              mdc-expansion-panel--details mdc-expansion-panel__header__section">Expanded Title</span>
            <!-- Static Content -->
            <i class="material-icons mdc-expansion-panel__expansion-icon"></i>
            <span class=" mdc-expansion-panel__header__section mdc-expansion-panel__text
              mdc-expansion-panel--no-click">You can exclude a panel from the accordion</span>
          </div>
          <div class="mdc-expansion-panel__body">
            <p class="mdc-expansion-panel__text mdc-expansion-panel--no-click">Body</p>
          </div>
          <div class="mdc-expansion-panel__footer">
            <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click">Footer</span>
            <div class="mdc-expansion-panel__footer__button-bar">
              <button class="mdc-button mdc-expansion-panel--no-click">cancel</button>
              <button class="mdc-button mdc-expansion-panel--no-click">accept</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupTest() {
  const fixture = getFixture();
  const root = fixture.querySelector(rootSelector);
  const children = util.toArray(fixture.querySelectorAll(strings.CHILD_SELECTOR)).map((e) => {
    const comp = MDCExpansionPanel.attachTo(e);
    comp.initialize();
    return comp;
  });
  const excluded = children.filter((e) => e.root_.classList.contains(cssClasses.EXCLUDED));
  const included = children.filter((e) => excluded.indexOf(e) === -1);
  const component = new MDCExpansionPanelAccordion(root);

  return {root, component, children, included, excluded,
    includedEls: included.map((e) => e.root_),
    excludedEls: excluded.map((e) => e.root_),
  };
}

function expand(panelComponent) {
  panelComponent.expand();
  panelComponent.emit('transitionend', panelComponent);
}

suite('MDCExpansionPanelAccordion');

test('.attachTo returns a component instance', () => {
  assert.isOk(MDCExpansionPanelAccordion.attachTo(
    getFixture().querySelector(rootSelector)) instanceof MDCExpansionPanelAccordion);
});

test('#initialize stores all included children', () => {
  const {component, includedEls} = setupTest();

  component.initialize();

  assert.sameMembers(component.childrenExpansionPanels_, includedEls);
});

test('#destroy removes all included children', () => {
  const {component} = setupTest();

  component.initialize();
  component.destroy();

  assert.isEmpty(component.childrenExpansionPanels_);
});

test('expandedChild is the same as foundation', () => {
  const {component} = setupTest();

  assert.equal(component.expandedChild, component.foundation_.expandedChild);
});

test(`adapter#notifyChange emits ${strings.CHANGE_EVENT}`, () => {
  const {component} = setupTest();

  const handler = td.func('changeHandler');

  component.listen(strings.CHANGE_EVENT, handler);
  component.getDefaultFoundation().adapter_.notifyChange();

  td.verify(handler(anything()));
});

/**
 * this test is a bit odd, since it relies on the behavior of MDCExpansionPanel,
 * making it more of an integration test that a unit one.
 * Since its still testing the behavior of the adapter, it is left here.
 */
test('adapter#getComponentInstanceFromEvent returns the correct instance of MDCExpansionPanel', () => {
  const {children, component} = setupTest();
  const child = children[0];

  child.listen(MDCExpansionPanelFoundation.strings.EXPAND_EVENT, (event) => {
    assert.strictEqual(component.getDefaultFoundation()
      .adapter_.getComponentInstanceFromEvent(event), child);
  });

  child.getDefaultFoundation().adapter_.notifyExpand();
});

test('adapter#registerChildrenExpansionPanelInteractionListener ' +
  'adds an event listener on its included children elements', () => {
  const {component, includedEls} = setupTest();
  const handler = td.func('handler');

  component.initialize();

  component.getDefaultFoundation().adapter_.registerChildrenExpansionPanelInteractionListener(
    MDCExpansionPanelFoundation.strings.EXPAND_EVENT, handler);

  includedEls.forEach((el) => domEvents.emit(el, MDCExpansionPanelFoundation.strings.EXPAND_EVENT));

  td.verify(handler(anything()), {times: includedEls.length});
});

test('adapter#deregisterChildrenExpansionPanelInteractionListener ' +
  'removes an event listener from its included children elements', () => {
  const {component, includedEls} = setupTest();
  const handler = td.func('handler');

  component.initialize();

  includedEls.forEach((el) => el.addEventListener(MDCExpansionPanelFoundation.strings.EXPAND_EVENT, handler));
  component.getDefaultFoundation().adapter_.deregisterChildrenExpansionPanelInteractionListener(
    MDCExpansionPanelFoundation.strings.EXPAND_EVENT, handler);

  includedEls.forEach((el) => domEvents.emit(el, MDCExpansionPanelFoundation.strings.EXPAND_EVENT));

  td.verify(handler(anything()), {times: 0});
});

test('when child is expanded, it collapses the previously expanded child', () => {
  const {component, included} = setupTest();
  const first = included[0];
  const second = included[1];

  component.initialize();

  expand(first);
  assert.isOk(first.expanded);

  expand(second);
  assert.isOk(second.expanded);
  assert.isNotOk(first.expanded);
});
