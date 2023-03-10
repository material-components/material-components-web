/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCBanner} from '@material/banner/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCBanner', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.mdc-banner')) {
      const banner = new MDCBanner(el);
      banner.layout();
    }
  });

  it('baseline centered', async () => {
    expect(
        await env.diffElement('baseline-centered', '.test-baseline-centered'))
        .toHavePassed();
  });

  it('baseline one line', async () => {
    expect(
        await env.diffElement('baseline-one-line', '.test-baseline-one-line'))
        .toHavePassed();
  });

  it('baseline two line', async () => {
    expect(
        await env.diffElement('baseline-two-line', '.test-baseline-two-line'))
        .toHavePassed();
  });

  it('baseline three line', async () => {
    expect(await env.diffElement(
               'baseline-three-line', '.test-baseline-three-line'))
        .toHavePassed();
  });

  it('fill color', async () => {
    expect(await env.diffElement('fill-color', '.test-fill-color'))
        .toHavePassed();
  });

  it('text color', async () => {
    expect(await env.diffElement('text-color', '.test-text-color'))
        .toHavePassed();
  });

  it('divider color', async () => {
    expect(await env.diffElement('divider-color', '.test-divider-color'))
        .toHavePassed();
  });

  it('graphic color', async () => {
    expect(await env.diffElement('graphic-color', '.test-graphic-color'))
        .toHavePassed();
  });

  it('graphic background color', async () => {
    expect(await env.diffElement(
               'graphic-background-color', '.test-graphic-background-color'))
        .toHavePassed();
  });

  it('graphic shape radius', async () => {
    expect(await env.diffElement(
               'graphic-shape-radius', '.test-graphic-shape-radius'))
        .toHavePassed();
  });
  it('min width', async () => {
    expect(await env.diffElement('min-width', '.test-min-width'))
        .toHavePassed();
  });

  it('max width', async () => {
    expect(await env.diffElement('max-width', '.test-max-width'))
        .toHavePassed();
  });

  it('fixed width', async () => {
    expect(await env.diffElement('fixed-width', '.test-fixed-width'))
        .toHavePassed();
  });

  it('fixed', async () => {
    expect(await env.diffElement('fixed-push-content', '.test-fixed'))
        .toHavePassed();

    const viewport = document.querySelector('.test-viewport-fixed');
    if (viewport) {
      viewport.scrollTop = 40;
    }
    expect(await env.diffElement('fixed-over-content', '.test-fixed'))
        .toHavePassed();
  });

  it('layout stacked', async () => {
    expect(await env.diffElement('layout-stacked', '.test-layout-stacked'))
        .toHavePassed();
  });
});
