/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCSnackbar} from '@material/snackbar/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCSnackbar', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-snackbar')) {
      MDCSnackbar.attachTo(el);
    }
  });

  it('elevation', async () => {
    expect(await env.diffElement('elevation', '.test-elevation'))
        .toHavePassed();
  });

  it('viewport margin', async () => {
    expect(await env.diffElement('viewport_margin', '.test-viewport-margin'))
        .toHavePassed();
  });

  it('max width', async () => {
    expect(await env.diffElement('max_width', '.test-max-width'))
        .toHavePassed();
  });

  it('min width', async () => {
    expect(await env.diffElement('min_width', '.test-min-width'))
        .toHavePassed();
  });

  it('shape radius', async () => {
    expect(await env.diffElement('shape_radius', '.test-shape-radius'))
        .toHavePassed();
  });

  it('fill color', async () => {
    expect(await env.diffElement('fill_color', '.test-fill-color'))
        .toHavePassed();
  });

  it('label ink color', async () => {
    expect(await env.diffElement('label_ink_color', '.test-label-ink-color'))
        .toHavePassed();
  });

  it('stacked', async () => {
    expect(await env.diffElement('stacked', '.test-stacked')).toHavePassed();
  });

  it('baseline with action', async () => {
    expect(await env.diffElement(
               'baseline_with_action', '.test-baseline-with-action'))
        .toHavePassed();
  });

  it('baseline without action', async () => {
    expect(await env.diffElement(
               'baseline_without_action', '.test-baseline-without-action'))
        .toHavePassed();
  });

  it('leading', async () => {
    expect(await env.diffElement('leading', '.test-leading')).toHavePassed();
  });
});
