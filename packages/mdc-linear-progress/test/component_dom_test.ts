/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCLinearProgress} from '@material/linear-progress/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCLinearProgress', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-linear-progress')) {
      const linearProgress = MDCLinearProgress.attachTo(el);

      const progressValue =
          Number(el.getAttribute('data-test-linear-progress-value'));
      const bufferValue =
          Number(el.getAttribute('data-test-linear-progress-buffer'));

      if (progressValue > 0) {
        linearProgress.progress = progressValue;
      }

      if (bufferValue > 0) {
        linearProgress.buffer = bufferValue;
      }
    }
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('bar color', async () => {
    expect(await env.diffElement('bar_color', '.test-bar-color'))
        .toHavePassed();
  });

  it('buffer color', async () => {
    expect(await env.diffElement('buffer_color', '.test-buffer-color'))
        .toHavePassed();
  });
});
