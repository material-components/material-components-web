/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {MDCChipSet} from 'google3/third_party/javascript/material_components_web/chips/chipset/component';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCChips', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-evolution-chip-set')) {
      MDCChipSet.attachTo(el);
    }
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test--baseline')).toHavePassed();
  });

  it('filter', async () => {
    expect(await env.diffElement('filter', '.test--filter')).toHavePassed();
  });

  it('input', async () => {
    expect(await env.diffElement('input', '.test--input')).toHavePassed();
  });
});
