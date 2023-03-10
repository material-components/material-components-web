/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCChipTrailingAction} from '@material/chips/deprecated/trailingaction/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCChipTrailingAction', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.mdc-deprecated-chip-trailing-action')) {
      MDCChipTrailingAction.attachTo(el);
    }
  });

  it('default', async () => {
    expect(await env.diffElement('default', '.test-default')).toHavePassed();
  });

  it('color', async () => {
    expect(await env.diffElement('color', '.test-color')).toHavePassed();
  });

  it('size', async () => {
    expect(await env.diffElement('size', '.test-size')).toHavePassed();
  });

  it('spacing', async () => {
    expect(await env.diffElement('spacing', '.test-spacing')).toHavePassed();
  });

  it('touchtarget', async () => {
    expect(await env.diffElement('touchtarget', '.test-touch-target'))
        .toHavePassed();
  });
});
