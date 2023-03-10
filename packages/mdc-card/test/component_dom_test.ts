/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCCard', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  it('media', async () => {
    expect(await env.diffElement('media', '.test-media')).toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('media aspect ratio', async () => {
    expect(
        await env.diffElement('media_aspect_ratio', '.test-media-aspect-ratio'))
        .toHavePassed();
  });

  it('color and shape', async () => {
    expect(await env.diffElement('color_and_shape', '.test-color-and-shape'))
        .toHavePassed();
  });
});
