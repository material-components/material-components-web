/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCCircularProgress} from '@material/circular-progress/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';


jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCCircularProgress', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-circular-progress')) {
      const circularProgress = MDCCircularProgress.attachTo(el);

      const progressValue =
          Number(el.getAttribute('data-test-circular-progress-value'));

      if (progressValue > 0) {
        circularProgress.progress = progressValue;
      }
    }
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('stroke color', async () => {
    expect(await env.diffElement('stroke_color', '.test-stroke-color'))
        .toHavePassed();
  });
});
