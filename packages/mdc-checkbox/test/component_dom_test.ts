/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCCheckbox} from '@material/checkbox/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

describe('MDCCheckbox', () => {
  const env = new Environment(module);

  beforeAll(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('baseline', async () => {
    initComponent('.test-baseline');

    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('container colors', async () => {
    initComponent('.test-container-colors');

    expect(await env.diffElement('container_colors', '.test-container-colors'))
        .toHavePassed();
  });

  it('ink color', async () => {
    initComponent('.test-ink-color');

    expect(await env.diffElement('ink_color', '.test-ink-color'))
        .toHavePassed();
  });

  it('density', async () => {
    initComponent('.test-density');

    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });

  function initComponent(selector: string) {
    each(`${selector}  .mdc-checkbox`).forEach((el) => {
      MDCCheckbox.attachTo(el);
    });
  }
});
