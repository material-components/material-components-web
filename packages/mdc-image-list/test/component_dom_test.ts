/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('mdc-image-list', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  it('standard shape radius', async () => {
    expect(await env.diffElement(
               'standard_shape_radius', '.test-standard-shape-radius'))
        .toHavePassed();
  });

  it('standard with text protection shape radius', async () => {
    expect(await env.diffElement(
               'standard_with_text_protection_shape_radius',
               '.test-standard-with-text-protection-shape-radius'))
        .toHavePassed();
  });

  it('standard', async () => {
    expect(await env.diffElement('standard', '.test-standard')).toHavePassed();
  });

  it('standard with text protection', async () => {
    expect(await env.diffElement(
               'standard_with_text_protection',
               '.test-standard-with-text-protection'))
        .toHavePassed();
  });
});
