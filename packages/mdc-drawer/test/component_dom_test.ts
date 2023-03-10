/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCDrawer} from '@material/drawer/component';
import {cssClasses} from '@material/drawer/constants';
import {MDCList} from '@material/list/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCDrawer', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  function instantiateDrawerWithinSelector(selector: string) {
    const {DISMISSIBLE, MODAL} = cssClasses;
    const testContainer = document.querySelector<HTMLElement>(selector)!;
    const dismissibleDrawerSelector = `.${DISMISSIBLE}, .${MODAL}`;
    const dismissibleDrawerEl =
        testContainer.querySelector<HTMLElement>(dismissibleDrawerSelector);

    // Don't instantiate permanent drawers
    if (dismissibleDrawerEl) {
      const drawer = new MDCDrawer(dismissibleDrawerEl);
      const menuButtonEl =
          testContainer.querySelector('#test-drawer-menu-button');
      if (menuButtonEl) {
        menuButtonEl.addEventListener('click', () => {
          drawer.open = !drawer.open;
        });
      }
    } else {
      const listEl =
          testContainer.querySelector<HTMLElement>('.mdc-deprecated-list')!;
      const list = new MDCList(listEl);
      list.wrapFocus = true;
    }
  }

  it('width', async () => {
    const showOnlySelector = '.test-width';
    instantiateDrawerWithinSelector(showOnlySelector);
    expect(await env.diffElement('width', showOnlySelector)).toHavePassed();
  });

  it('fill color', async () => {
    const showOnlySelector = '.test-fill-color';
    instantiateDrawerWithinSelector(showOnlySelector);
    expect(await env.diffElement('fill_color', showOnlySelector))
        .toHavePassed();
  });

  it('fill color accessible', async () => {
    const showOnlySelector = '.test-fill-color-accessible';
    instantiateDrawerWithinSelector(showOnlySelector);
    expect(await env.diffElement('fill_color_accessible', showOnlySelector))
        .toHavePassed();
  });

  it('permanent', async () => {
    const showOnlySelector = '.test-permanent';
    instantiateDrawerWithinSelector(showOnlySelector);
    expect(await env.diffElement('permanent', showOnlySelector)).toHavePassed();
  });

  it('modal', async () => {
    const showOnlySelector = '.test-modal';
    instantiateDrawerWithinSelector(showOnlySelector);
    expect(await env.diffElement('modal', showOnlySelector)).toHavePassed();
  });

  it('dismissible', async () => {
    const showOnlySelector = '.test-dismissible';
    instantiateDrawerWithinSelector(showOnlySelector);
    expect(await env.diffElement('dismissible', showOnlySelector))
        .toHavePassed();
  });

  it('dismissible below top app bar', async () => {
    const showOnlySelector = '.test-dismissible-below-top-app-bar';
    instantiateDrawerWithinSelector(showOnlySelector);
    expect(await env.diffElement(
               'dismissible_below_top_app_bar', showOnlySelector))
        .toHavePassed();
  });
});
