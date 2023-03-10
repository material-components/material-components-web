/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCSwitch} from '@material/switch/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment, transformPseudoClasses} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCSwitch', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    transformPseudoClasses();
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-switch')) {
      // Easier access to component instance for debugging
      (el as any).component = MDCSwitch.attachTo(el as HTMLButtonElement);
    }

    // Wait for ripple layouts, which use requestAnimationFrame()
    await env.waitForStability();
  });

  it('states', async () => {
    expect(await env.diffElement('states', '.test-states', {
      rtl: true
    })).toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });
});
