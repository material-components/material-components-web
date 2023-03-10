/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCTabBar} from '@material/tab-bar/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCTabBar in high contrast mode', () => {
  const env = new Environment(module);
  const FAKE_RIPPLE_CLASS = 'mdc-ripple-upgraded--background-focused';

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-tab-bar')) {
      MDCTabBar.attachTo(el);
      el.querySelector<HTMLElement>('.mdc-tab')!.classList.add(
          FAKE_RIPPLE_CLASS);
    }
  });

  afterAll(async () => {
    for (const el of each('.test-container .mdc-tab-bar')) {
      el.querySelector<HTMLElement>('.mdc-tab')!.classList.remove(
          FAKE_RIPPLE_CLASS);
    }
  });

  it('baseline focus ring', async () => {
    expect(await env.diffElement('hcm_baseline', '.test-baseline'))
        .toHavePassed();
  });

  it('density focus ring', async () => {
    expect(await env.diffElement('hcm_density', '.test-density'))
        .toHavePassed();
  });
});
