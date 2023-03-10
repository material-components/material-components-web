/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCChipSet} from '@material/chips/deprecated/chipset/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCChips', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-chip-set')) {
      MDCChipSet.attachTo(el);
    }
  });

  it('input', async () => {
    expect(await env.diffElement('input', '.test-input')).toHavePassed();
  });

  it('filter', async () => {
    expect(await env.diffElement('filter', '.test-filter')).toHavePassed();
  });

  it('choice', async () => {
    expect(await env.diffElement('choice', '.test-choice')).toHavePassed();
  });

  it('action', async () => {
    expect(await env.diffElement('action', '.test-action')).toHavePassed();
  });

  it('leading icon color', async () => {
    expect(
        await env.diffElement('leading_icon_color', '.test-leading-icon-color'))
        .toHavePassed();
  });

  it('trailing icon margin', async () => {
    expect(await env.diffElement(
               'trailing_icon_margin', '.test-trailing-icon-margin'))
        .toHavePassed();
  });

  it('leading icon size', async () => {
    expect(
        await env.diffElement('leading_icon_size', '.test-leading-icon-size'))
        .toHavePassed();
  });

  it('selected ink color', async () => {
    expect(
        await env.diffElement('selected_ink_color', '.test-selected-ink-color'))
        .toHavePassed();
  });

  it('leading icon margin', async () => {
    expect(await env.diffElement(
               'leading_icon_margin', '.test-leading-icon-margin'))
        .toHavePassed();
  });

  it('horizontal padding', async () => {
    expect(
        await env.diffElement('horizontal_padding', '.test-horizontal-padding'))
        .toHavePassed();
  });

  it('height', async () => {
    expect(await env.diffElement('height', '.test-height')).toHavePassed();
  });

  it('shape radius', async () => {
    expect(await env.diffElement('shape_radius', '.test-shape-radius'))
        .toHavePassed();
  });

  it('ink color', async () => {
    expect(await env.diffElement('ink_color', '.test-ink-color'))
        .toHavePassed();
  });

  it('fill color accessible', async () => {
    expect(await env.diffElement(
               'fill_color_accessible', '.test-fill-color-accessible'))
        .toHavePassed();
  });

  it('fill color', async () => {
    expect(await env.diffElement('fill_color', '.test-fill-color'))
        .toHavePassed();
  });

  it('outline', async () => {
    expect(await env.diffElement('outline', '.test-outline')).toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });

  it('chip set spacing', async () => {
    expect(await env.diffElement('chip_set_spacing', '.test-chip-set-spacing'))
        .toHavePassed();
  });

  it('trailing icon size', async () => {
    expect(
        await env.diffElement('trailing_icon_size', '.test-trailing-icon-size'))
        .toHavePassed();
  });

  it('trailing icon color', async () => {
    expect(await env.diffElement(
               'trailing_icon_color', '.test-trailing-icon-color'))
        .toHavePassed();
  });
});
