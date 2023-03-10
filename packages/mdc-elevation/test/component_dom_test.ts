/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('mdc-elevation', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  it('mixins', async () => {
    expect(await env.diffElement('mixins', '.test-mixins')).toHavePassed();
  });

  it('baseline large', async () => {
    expect(await env.diffElement('baseline_large', '.test-baseline-large'))
        .toHavePassed();
  });

  it('baseline small', async () => {
    expect(await env.diffElement('baseline_small', '.test-baseline-small'))
        .toHavePassed();
  });
});
