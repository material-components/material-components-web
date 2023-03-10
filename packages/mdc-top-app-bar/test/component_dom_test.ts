/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

import {MDCTopAppBar} from '../component';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCTopAppBar', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
    for (const el of each('.test-container .mdc-top-app-bar')) {
      MDCTopAppBar.attachTo(el);
    }
  });

  it('baseline with action items', async () => {
    expect(
        await env.diffElement(
            'baseline_with_action_items', '.test-baseline-with-action-items'))
        .toHavePassed();
  });

  it('baseline short with action items', async () => {
    expect(await env.diffElement(
               'baseline_short_with_action_items',
               '.test-baseline-short-with-action-items'))
        .toHavePassed();
  });

  it('baseline dense with action items', async () => {
    expect(await env.diffElement(
               'baseline_dense_with_action_items',
               '.test-baseline-dense-with-action-items'))
        .toHavePassed();
  });

  it('baseline short collapsed', async () => {
    expect(await env.diffElement(
               'baseline_short_collapsed', '.test-baseline-short-collapsed'))
        .toHavePassed();
  });

  it('baseline fixed', async () => {
    expect(await env.diffElement('baseline_fixed', '.test-baseline-fixed'))
        .toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('baseline dense prominent', async () => {
    expect(await env.diffElement(
               'baseline_dense_prominent', '.test-baseline-dense-prominent'))
        .toHavePassed();
  });

  it('baseline prominent with action items', async () => {
    expect(await env.diffElement(
               'baseline_prominent_with_action_items',
               '.test-baseline-prominent-with-action-items'))
        .toHavePassed();
  });

  it('baseline short collapsed with action items', async () => {
    expect(await env.diffElement(
               'baseline_short_collapsed_with_action_items',
               '.test-baseline-short-collapsed-with-action-items'))
        .toHavePassed();
  });

  it('baseline dense', async () => {
    expect(await env.diffElement('baseline_dense', '.test-baseline-dense'))
        .toHavePassed();
  });

  it('baseline fixed with action items', async () => {
    expect(await env.diffElement(
               'baseline_fixed_with_action_items',
               '.test-baseline-fixed-with-action-items'))
        .toHavePassed();
  });

  it('baseline short', async () => {
    expect(await env.diffElement('baseline_short', '.test-baseline-short'))
        .toHavePassed();
  });

  it('baseline prominent', async () => {
    expect(
        await env.diffElement('baseline_prominent', '.test-baseline-prominent'))
        .toHavePassed();
  });

  it('baseline dense prominent with action items', async () => {
    expect(await env.diffElement(
               'baseline_dense_prominent_with_action_items',
               '.test-baseline-dense-prominent-with-action-items'))
        .toHavePassed();
  });
});
