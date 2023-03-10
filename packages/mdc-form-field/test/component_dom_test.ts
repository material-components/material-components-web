/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('mdc-form-field', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  it('baseline radio rtl', async () => {
    expect(
        await env.diffElement('baseline_radio_rtl', '.test-baseline-radio-rtl'))
        .toHavePassed();
  });

  it('baseline radio', async () => {
    expect(await env.diffElement('baseline_radio', '.test-baseline-radio'))
        .toHavePassed();
  });

  it('align-end radio', async () => {
    expect(await env.diffElement('align_end_radio', '.test-align-end-radio'))
        .toHavePassed();
  });

  it('space-between radio', async () => {
    expect(await env.diffElement(
               'space_between_radio', '.test-space-between-radio'))
        .toHavePassed();
  });

  it('nowrap radio', async () => {
    expect(await env.diffElement('nowrap_radio', '.test-nowrap-radio'))
        .toHavePassed();
  });
});
