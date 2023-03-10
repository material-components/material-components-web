/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('mdc-fab', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  it('shape radius', async () => {
    expect(await env.diffElement('shape_radius', '.test-shape-radius'))
        .toHavePassed();
  });

  it('extended shape radius', async () => {
    expect(await env.diffElement(
               'extended_shape_radius', '.test-extended-shape-radius'))
        .toHavePassed();
  });

  it('extended', async () => {
    expect(await env.diffElement('extended', '.test-extended')).toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('mini', async () => {
    expect(await env.diffElement('mini', '.test-mini')).toHavePassed();
  });
});
