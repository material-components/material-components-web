/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCRipple} from '@material/ripple/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCButton', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-button')) {
      MDCRipple.attachTo(el);
    }
  });

  afterEach(async () => {
    // Reset focus
    for (const el of each('.test-container .mdc-button')) {
      el.blur();
    }
    // This seems to be needed to remove ie11 flakiness.
    document.body.focus();
  });

  it('ink color', async () => {
    expect(await env.diffElement('ink_color', '.test-ink-color'))
        .toHavePassed();
  });

  it('stroke color', async () => {
    expect(await env.diffElement('stroke_color', '.test-stroke-color'))
        .toHavePassed();
  });

  it('stroke width', async () => {
    expect(await env.diffElement('stroke_width', '.test-stroke-width'))
        .toHavePassed();
  });

  it('container fill color', async () => {
    expect(await env.diffElement(
               'container_fill_color', '.test-container-fill-color'))
        .toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });

  it('filled accessible', async () => {
    expect(
        await env.diffElement('filled_accessible', '.test-filled-accessible'))
        .toHavePassed();
  });

  it('icon color', async () => {
    expect(await env.diffElement('icon_color', '.test-icon-color'))
        .toHavePassed();
  });

  it('shape radius', async () => {
    expect(await env.diffElement('shape_radius', '.test-shape-radius'))
        .toHavePassed();
  });

  it('baseline link with icons', async () => {
    expect(await env.diffElement(
               'baseline_link_with_icons', '.test-baseline-link-with-icons'))
        .toHavePassed();
  });

  it('baseline button without icons', async () => {
    expect(await env.diffElement(
               'baseline_button_without_icons',
               '.test-baseline-button-without-icons'))
        .toHavePassed();
  });

  it('baseline link without icons', async () => {
    expect(
        await env.diffElement(
            'baseline_link_without_icons', '.test-baseline-link-without-icons'))
        .toHavePassed();
  });

  it('baseline button with icons', async () => {
    expect(
        await env.diffElement(
            'baseline_button_with_icons', '.test-baseline-button-with-icons'))
        .toHavePassed();
  });

  it('baseline button with trailing icons', async () => {
    expect(await env.diffElement(
               'baseline_button_with_trailing_icons',
               '.test-baseline-button-with-trailing-icons'))
        .toHavePassed();
  });

  it('baseline button with high contrast mode mixin', async () => {
    expect(await env.diffElement(
               'baseline_button_with_high_contrast_shim',
               '.test-container-high-contrast-mode-shim'))
        .toHavePassed();
  });

  it('baseline button with high contrast mode mixin on focus', async () => {
    // Arrange
    const {button} = getElements('.test-container-high-contrast-mode-shim');

    // Act
    button.focus();

    // Assert
    expect(await env.diffElement(
               'baseline_button_with_high_contrast_shim_focused',
               '.test-container-high-contrast-mode-shim',
               {allowablePerChannelDifference: 2}))
        .toHavePassed();
  });

  it('baseline link with high contrast mode mixin', async () => {
    expect(await env.diffElement(
               'baseline_link_button_with_high_contrast_shim',
               '.test-container-high-contrast-mode-link-shim'))
        .toHavePassed();
  });

  it('baseline link with high contrast mode mixin on focus', async () => {
    // Arrange
    const {anchor} =
        getElements('.test-container-high-contrast-mode-link-shim');

    // Act
    anchor.focus();

    // Assert
    expect(await env.diffElement(
               'baseline_link_button_with_high_contrast_shim_focused',
               '.test-container-high-contrast-mode-link-shim'))
        .toHavePassed();
  });

  it('baseline button with focus ring mixin', async () => {
    expect(await env.diffElement(
               'baseline_button_with_focus_ring', '.test-container-focus-ring'))
        .toHavePassed();
  });

  it('baseline button with focus ring mixin on focus', async () => {
    // Arrange
    const {button} = getElements('.test-container-focus-ring');

    // Act
    button.focus();

    // Assert
    expect(await env.diffElement(
               'baseline_button_with_focus_ring_focused',
               '.test-container-focus-ring'))
        .toHavePassed();
  });

  it('baseline link with focus ring mixin', async () => {
    expect(await env.diffElement(
               'baseline_link_button_with_focus_ring',
               '.test-container-focus-ring-link'))
        .toHavePassed();
  });

  it('baseline link with focus ring mixin on focus', async () => {
    // Arrange
    const {anchor} = getElements('.test-container-focus-ring-link');

    // Act
    anchor.focus();

    // Assert
    expect(await env.diffElement(
               'baseline_link_button_with_focus_ring_focused',
               '.test-container-focus-ring-link',
               {allowablePerChannelDifference: 1}))
        .toHavePassed();
  });

  /**
   * Returns the HTMLButtonElement and the anchor element for the given
   * selector.
   */
  function getElements(selector: string) {
    const root = document.querySelector<HTMLElement>(selector)!;
    const button = root.querySelector<HTMLButtonElement>('.mdc-button')!;
    const anchor = root.querySelector<HTMLElement>('a')!;

    return {anchor, button};
  }
});
