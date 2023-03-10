/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCRadio} from '@material/radio/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCRadio', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-radio')) {
      MDCRadio.attachTo(el);
    }
    await env.waitForStability();
  });

  it('mixins', async () => {
    expect(await env.diffElement('mixins', '.test-mixins')).toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('baseline touch target', async () => {
    expect(await env.diffElement(
               'baseline_touch_target', '.test-baseline-touch-target'))
        .toHavePassed();
  });
});
