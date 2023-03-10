/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCIconToggleButton', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('baseline icon button toggle', async () => {
    expect(
        await env.diffElement(
            'baseline_icon_button_toggle', '.test-baseline-icon-button-toggle'))
        .toHavePassed();
  });

  it('ink color', async () => {
    expect(await env.diffElement('ink_color', '.test-ink-color'))
        .toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });

  it('icon size', async () => {
    expect(await env.diffElement('icon_size', '.test-icon-size'))
        .toHavePassed();
  });
});
