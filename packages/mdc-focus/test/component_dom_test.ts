/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCFocusRing', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  it('default', async () => {
    expect(await env.diffElement('default', '.test-default')).toHavePassed();
  });

  it('focused', async () => {
    expect(await env.diffElement('focused', '.test-focused')).toHavePassed();
  });

  it('animation', async () => {
    expect(await env.diffElement('animation', '.test-animation'))
        .toHavePassed();
  });
});
