/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

import {MDCMenu} from '../component';
import {DefaultFocusState} from '../constants';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCMenu', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const testEl of each('.test-container')) {
      const menuEl = testEl.querySelector<HTMLElement>('.mdc-menu')!;
      const menu = MDCMenu.attachTo(menuEl);

      const multipleSelectionGroupMenuEl = testEl.querySelector<HTMLElement>(
          '#test-multiple-selection-group-menu');
      if (multipleSelectionGroupMenuEl) {
        menu.setSelectedIndex(3);
        menu.setSelectedIndex(5);
      }

      const buttonEl = testEl.querySelector<HTMLElement>('.test-menu-button')!;
      if (buttonEl) {
        // Note that the below code is not necessary for screenshotting,
        // only for interactivity in local demos.
        buttonEl.addEventListener('click', () => {
          menu.setDefaultFocusState(DefaultFocusState.LIST_ROOT);
          menu.open = !menu.open;
        });

        buttonEl.addEventListener('keydown', (evt: KeyboardEvent) => {
          const arrowUp = evt.key === 'ArrowUp';
          const arrowDown = evt.key === 'ArrowDown';
          const isEnter = evt.key === 'Enter';
          const isSpace = evt.key === 'Space';

          if (isSpace || isEnter || arrowDown) {
            evt.preventDefault();
            menu.setDefaultFocusState(DefaultFocusState.FIRST_ITEM);
            menu.open = !menu.open;
          } else if (arrowUp) {
            evt.preventDefault();
            menu.setDefaultFocusState(DefaultFocusState.LAST_ITEM);
            menu.open = !menu.open;
          }
        });
      }
    }
  });

  it('menu selection group', async () => {
    expect(await env.diffElement(
               'menu_selection_group', '.test-menu-selection-group'))
        .toHavePassed();
  });

  it('multiple menu selection group', async () => {
    expect(await env.diffElement(
               'multiple_menu_selection_group',
               '.test-multiple-menu-selection-group'))
        .toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('menu selection group only', async () => {
    expect(await env.diffElement(
               'menu_selection_group_only', '.test-menu-selection-group-only'))
        .toHavePassed();
  });

  it('bottom anchored', async () => {
    expect(await env.diffElement('bottom_anchored', '.test-bottom-anchored'))
        .toHavePassed();
  });

  it('4025', async () => {
    expect(await env.diffElement('4025', '.test-4025')).toHavePassed();
  });

  it('min width', async () => {
    expect(await env.diffElement('min_width', '.test-min-width'))
        .toHavePassed();
  });
});
