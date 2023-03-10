/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCSwitch} from '@material/switch/deprecated/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCSwitch', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-switch')) {
      MDCSwitch.attachTo(el);
    }

    // Wait for ripple layouts, which use requestAnimationFrame()
    await env.waitForStability();
  });

  it('thumb color', async () => {
    expect(await env.diffElement('thumb_color', '.test-thumb-color'))
        .toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });

  it('track color', async () => {
    expect(await env.diffElement('track_color', '.test-track-color'))
        .toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('focus', async () => {
    expect(await env.diffElement('focus', '.test-focus')).toHavePassed();
  });
});
